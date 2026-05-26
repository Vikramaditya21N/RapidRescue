# Rapid Rescue

**Rapid Rescue** is a full-stack online ambulance booking and live-tracking platform. It provides a seamless experience for patients to request emergency medical transport, and an admin dashboard for providers to dispatch units and track them in real-time.

---

## Features

- **Role-Based Authentication:** Separate JWT-secured login flows for Patients and Ambulance Providers, with OTP verification via Twilio.
- **Real-Time GPS Tracking:** Live location tracking using the HTML5 Geolocation API, polling architecture, and Leaflet Maps.
- **Automated Email Alerts:** Nodemailer integration to email patients their booking confirmation and ETA upon dispatch.
- **Dynamic Pricing Engine:** Calculates base fare + per-kilometer distance based on ambulance type (Basic, Advanced, Neonatal, Mortuary).
- **Online Payment Support:** Razorpay checkout integration for "Pay Online" functionality.
- **Provider Dashboard:** Live MongoDB metrics for active dispatches and pending requests, with real-time location sharing.

---

## Technology Stack

**Frontend:**
- HTML5, Vanilla CSS, Vanilla JavaScript
- Leaflet.js (map rendering & GPS tracking)
- Razorpay Checkout API

**Backend:**
- Node.js & Express.js
- MongoDB (via Mongoose)
- JWT & bcrypt (Authentication & Security)
- Twilio Verify (OTP-based login & registration)
- Nodemailer (Email notifications)

---

## How to Run Locally

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed
- A MongoDB Atlas cluster (or local MongoDB instance)
- Twilio account with a Verify Service SID

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your credentials in .env
node server.js
```

### 3. Frontend Setup
Open the frontend using a local development server to avoid CORS issues.
- Use the **Live Server** extension in VS Code
- Right-click `index.html` → "Open with Live Server" (runs on port 5500)

---

## System Flow

1. **Patient** registers/logs in via OTP, selects ambulance type, and submits their GPS location.
2. **Backend** calculates pricing, generates a Booking ID, and saves the booking with `pending` status.
3. **Provider** logs into the Admin Dashboard, reviews pending requests, and clicks **Accept**.
4. Backend sends a dispatch confirmation email with a live tracking link to the patient.
5. Provider clicks **Drive** — their phone's GPS coordinates stream to the server.
6. Patient's tracking page polls the backend every 3 seconds to update the ambulance marker on the map.
