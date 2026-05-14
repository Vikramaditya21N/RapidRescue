# 🚑 Rapid Rescue

**Rapid Rescue** is a modern, full-stack online ambulance booking and live-tracking platform built as a final-year academic project. It provides a seamless, Uber-like experience for patients to request emergency medical transport, and a robust admin dashboard for providers to dispatch units and track them in real-time.

---

## ✨ Key Features

- **Role-Based Access Control:** Separate JWT-secured authentication flows for Patients and Ambulance Providers.
- **Real-Time GPS Tracking:** Bi-directional live location tracking using the HTML5 Geolocation API, polling architecture, and Leaflet Maps.
- **Automated Email Alerts:** Integrated with Nodemailer to instantly email patients their booking confirmation and ETA upon dispatch.
- **Dynamic Pricing Engine:** Calculates base fare + per-kilometer distance based on ambulance type (Basic, Advanced, Neonatal, Mortuary).
- **Payment Gateway Integration:** Mock Razorpay checkout flow for "Pay Online" functionality.
- **Provider Dashboard:** Live MongoDB metrics for active dispatches and pending requests.

---

## 🛠️ Technology Stack

**Frontend:**
- HTML5, Vanilla CSS, Vanilla JavaScript
- Leaflet.js (for map rendering & GPS tracking)
- Razorpay Checkout API (Test Mode)

**Backend:**
- Node.js & Express.js
- MongoDB (via Mongoose schemas)
- JWT (JSON Web Tokens) & bcrypt (Security/Auth)
- Nodemailer (Automated Emails)

---

## 🚀 How to Run Locally

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed
- A running MongoDB Atlas cluster (or local MongoDB instance)

### 2. Backend Setup
1. Open your terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder and add your environment variables:
   ```env
   PORT=4000
   JWT_SECRET=your_super_secret_key
   MONGO_URI=your_mongodb_connection_string
   ```
4. Start the server:
   ```bash
   node server.js
   ```

### 3. Frontend Setup
The frontend is built with vanilla HTML/CSS/JS. To avoid CORS issues, do not open the files directly via `file:///`. Instead, run them through a local development server:
1. You can use the **Live Server** extension in VS Code.
2. Right-click on `index.html` and select "Open with Live Server" (usually runs on port 5500).

---

## 📱 System Architecture Flow
1. **Patient** logs in, selects an ambulance type, and submits their exact GPS coordinates.
2. The **Backend** calculates estimated distance and pricing, and stores the booking in MongoDB with a `pending` status.
3. The **Provider** logs into the Admin Dashboard, reviews pending requests, and clicks "Accept".
4. The Backend triggers **Nodemailer** to send a live tracking link to the patient.
5. The Provider clicks "Drive," pushing their phone's live GPS coordinates to the server via the Geolocation API.
6. The Patient's tracking map (`track.html`) polls the backend to dynamically move the ambulance marker toward their location.

---

*Built for academic presentation purposes.*
