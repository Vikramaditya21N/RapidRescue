# 🚑 Rapid Rescue — Ambulance Booking System

India's fastest ambulance booking platform (frontend prototype).  
Built with plain HTML, CSS, and JavaScript — no frameworks needed.

---

## 📁 Project Structure

```
ambulance/
│
├── index.html          ← Homepage (landing page)
├── booking.html        ← Book an ambulance (3-step form)
├── track.html          ← Live GPS tracking map
├── about.html          ← About us page
├── contact.html        ← Contact form
├── login.html          ← User login
├── register.html       ← User registration
│
├── css/
│   ├── style.css       ← Main design system (colors, navbar, buttons, etc.)
│   └── booking.css     ← Styles specific to the booking form
│
├── js/
│   ├── main.js         ← Shared JS (navbar, animations, toast notifications)
│   └── booking.js      ← Booking form logic (steps, GPS, dispatch)
│
└── README.md           ← This file
```

---

## 🚀 How to Run Locally (with GPS support)

> ⚠️ GPS / Geolocation does NOT work if you open files directly.  
> You MUST run a local server.

### Option 1 — Python (easiest)
```bash
cd ambulance
python -m http.server 5500
```
Then open: **http://localhost:5500**

### Option 2 — VS Code
Install the **Live Server** extension → Right-click `index.html` → **Open with Live Server**

---

## 📄 Pages Overview

| Page | URL | Description |
|------|-----|-------------|
| Home | `/index.html` | Landing page with hero, types, testimonials |
| Book | `/booking.html` | 3-step ambulance booking form |
| Track | `/track.html` | Live map with simulated ambulance movement |
| About | `/about.html` | Company story, team, values |
| Contact | `/contact.html` | Contact form |
| Login | `/login.html` | User login |
| Register | `/register.html` | New user registration |

---

## ⚙️ Features

- 🌙 Dark theme with glassmorphism design
- 📍 GPS location detection for pickup
- 🗺️ Real interactive map (Leaflet.js + OpenStreetMap)
- 🚑 Simulated ambulance movement with live ETA countdown
- 📋 3-step booking form with validation
- 💳 Payment method selection (UPI / Cash / Insurance)
- 🔔 Toast notifications
- 📱 Fully responsive (mobile-friendly)

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Page structure |
| CSS3 (Vanilla) | Styling & animations |
| JavaScript (Vanilla) | UI logic & interactivity |
| Leaflet.js | Interactive map |
| OpenStreetMap | Free map tiles |
| Font Awesome | Icons |
| Google Fonts | Typography (Inter + Outfit) |

---

## 📌 Note

This is a **frontend prototype**. Bookings are simulated — no real ambulance is dispatched.  
To go fully live, a backend (Node.js + database) and a driver mobile app are needed.

---

© 2025 Rapid Rescue Technologies Pvt. Ltd.
