const express = require('express');
const Booking = require('../models/Booking');
const requireAuthentication = require('../middleware/auth');
const { sendDispatchEmail } = require('../utils/mailer');

const router = express.Router();

const AMBULANCE_FARE_PRICES = { 
  basic: 800, 
  advanced: 1500, 
  neonatal: 2000, 
  mortuary: 1200 
};

function generateBookingId() {
  const randomSixDigitNumber = Math.floor(100000 + Math.random() * 900000);
  return `RR-${randomSixDigitNumber}`;
}

function generateEstimatedTimeOfArrival() {
  const minMinutes = Math.floor(4 + Math.random() * 6);
  const maxMinutes = minMinutes + 2;
  return `${minMinutes}-${maxMinutes} minutes`;
}

// [POST] Create a new ambulance booking (Triggered by Patient from booking.html)
router.post('/', async (request, response) => {
  try {
    const bookingDetails = request.body;
    
    const requiredFields = [
      bookingDetails.patient_name, 
      bookingDetails.phone, 
      bookingDetails.pickup_address, 
      bookingDetails.city, 
      bookingDetails.ambulance_type, 
      bookingDetails.emergency_type
    ];

    const hasMissingFields = requiredFields.some(field => !field);
    
    if (hasMissingFields) {
      return response.status(400).json({ error: 'Missing required booking fields.' });
    }

    const bookingId = generateBookingId();
    const estimatedTimeOfArrival = generateEstimatedTimeOfArrival();
    const calculatedFare = AMBULANCE_FARE_PRICES[bookingDetails.ambulance_type] || 800;

    const newBooking = new Booking({
      booking_id: bookingId, 
      user_id: bookingDetails.user_id || null,
      patient_name: bookingDetails.patient_name, 
      phone: bookingDetails.phone, 
      email: bookingDetails.email || '',
      pickup_address: bookingDetails.pickup_address, 
      city: bookingDetails.city,
      pincode: bookingDetails.pincode || '', 
      destination: bookingDetails.destination || '',
      ambulance_type: bookingDetails.ambulance_type, 
      emergency_type: bookingDetails.emergency_type,
      patient_age: bookingDetails.patient_age || '', 
      notes: bookingDetails.notes || '',
      payment_method: bookingDetails.payment_method || 'cash',
      status: 'pending', 
      eta: estimatedTimeOfArrival, 
      fare: calculatedFare,
      patient_lat: bookingDetails.patient_lat || null,
      patient_lng: bookingDetails.patient_lng || null,
      paramedic_name: 'Ravi Kumar', 
      paramedic_phone: '+91 98765 43210'
    });

    await newBooking.save();

    response.status(201).json({
      message: 'Ambulance dispatched successfully!',
      booking_id: newBooking.booking_id, 
      eta: newBooking.eta, 
      fare: newBooking.fare,
      paramedic_name: newBooking.paramedic_name,
      paramedic_phone: newBooking.paramedic_phone,
      status: newBooking.status
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error while creating booking.' });
  }
});

// [GET] Fetch a specific booking by ID (Used by track.html for Live Tracking)
router.get('/:booking_id', async (request, response) => {
  try {
    const bookingId = request.params.booking_id;
    const booking = await Booking.findOne({ booking_id: bookingId.toUpperCase() });
    
    if (!booking) {
      return response.status(404).json({ error: 'Booking not found. Check your Booking ID.' });
    }
    
    response.json({ booking: booking });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error while fetching booking.' });
  }
});

// [GET] Fetch all bookings (Used by Admin Dashboard to list pending/active rides)
router.get('/', requireAuthentication, async (request, response) => {
  try {
    const allBookings = await Booking.find().sort({ created_at: -1 });
    
    response.json({ 
      count: allBookings.length, 
      bookings: allBookings 
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error while fetching bookings.' });
  }
});

// [PATCH] Update the status of a booking (Admin Dashboard: Accept -> Dispatched -> Completed)
router.patch('/:booking_id/status', requireAuthentication, async (request, response) => {
  try {
    const bookingId = request.params.booking_id;
    const newStatus = request.body.status;
    
    const allowedStatuses = ['pending', 'dispatched', 'en_route', 'arrived', 'completed', 'cancelled'];
    const isInvalidStatus = !allowedStatuses.includes(newStatus);
    
    if (isInvalidStatus) {
      return response.status(400).json({ error: 'Invalid status value.' });
    }

    const updatedBooking = await Booking.findOneAndUpdate(
      { booking_id: bookingId.toUpperCase() },
      { status: newStatus },
      { new: true }
    );
    
    if (!updatedBooking) {
      return response.status(404).json({ error: 'Booking not found.' });
    }
    
    // Trigger Email if dispatched
    if (newStatus === 'dispatched' && updatedBooking.email) {
      sendDispatchEmail(updatedBooking.email, updatedBooking.patient_name, updatedBooking.booking_id, updatedBooking.eta);
    }
    
    response.json({ 
      message: 'Status updated successfully.', 
      status: newStatus 
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error while updating status.' });
  }
});

router.patch('/:booking_id/location', requireAuthentication, async (request, response) => {
  try {
    const bookingId = request.params.booking_id;
    const { lat, lng } = request.body;
    
    if (lat === undefined || lng === undefined) {
      return response.status(400).json({ error: 'Latitude and longitude required.' });
    }

    const updatedBooking = await Booking.findOneAndUpdate(
      { booking_id: bookingId.toUpperCase() },
      { provider_lat: lat, provider_lng: lng },
      { new: true }
    );
    
    if (!updatedBooking) {
      return response.status(404).json({ error: 'Booking not found.' });
    }
    
    response.json({ message: 'Location updated successfully.' });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Server error while updating location.' });
  }
});

module.exports = router;
