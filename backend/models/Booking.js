const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  booking_id: { type: String, required: true, unique: true },
  user_id: { type: Number, default: null },
  patient_name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  pickup_address: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, default: '' },
  destination: { type: String, default: '' },
  ambulance_type: { type: String, required: true },
  emergency_type: { type: String, required: true },
  patient_age: { type: String, default: '' },
  notes: { type: String, default: '' },
  payment_method: { type: String, default: 'cash' },
  status: { type: String, default: 'pending' },
  eta: { type: String, required: true },
  fare: { type: Number, required: true },
  paramedic_name: { type: String, default: 'Ravi Kumar' },
  paramedic_phone: { type: String, default: '+91 98765 43210' },
  provider_lat: { type: Number, default: null },
  provider_lng: { type: Number, default: null },
  patient_lat: { type: Number, default: null },
  patient_lng: { type: Number, default: null },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
