# TaxiGo — Commercial Taxi Booking System

A modern, responsive, and animated commercial taxi-booking website and operations management system built with **React (Vite + Tailwind CSS)**, **FastAPI**, **SQLAlchemy**, and **MySQL** (with automated SQLite zero-config fallback).

---

## 🌟 Key Features

1. **5 Public React Pages**:
   - **Home (`/`)**: Hero booking CTA, pickup/drop preview, popular cars showcase with live rates, why choose us, 3-step guide, testimonials, and 24/7 call/WhatsApp triggers.
   - **Book Ride (`/book-ride`)**: 4-step reservation wizard with OpenStreetMap/Nominatim live autocomplete search, interactive Leaflet route map, dynamic car cards, server-calculated distance & fares, dummy UPI/QR payment, and instant booking confirmation.
   - **Services (`/services`)**: Comprehensive catalog for 8 core commercial services (Airport transfer, Local taxi, Outstation, One-Way drops, Round-trip, Corporate, Wedding/Events, and 24×7 cabs).
   - **About Us (`/about`)**: Company background, mission, verified chauffeur screening standards, vehicle maintenance criteria, and customer satisfaction metrics.
   - **Contact (`/contact`)**: Inbound inquiry form, 24/7 Helpline (`+91 62672 28958`), WhatsApp button, regional service hub map and details.
2. **Booking & Automatic Distance Flow**:
   - Nominatim address geocoding & OSRM (Open Source Routing Machine) road distance matrix calculation with Haversine fallback.
   - Dynamic database-driven tariff formula: `Total Fare = Base Fare + (Distance × Per KM Rate)`, subject to `Minimum Fare`.
   - Backend recalculates and enforces fares on booking submission (never trusts client-supplied rates).
   - Unique commercial booking ID generator (e.g., `RG20260909125`).
3. **Receipt & Dummy Payment**:
   - Dummy UPI/QR modal with copyable UPI ID (`6267228958@upi`), QR code scan, and transaction ID verification.
   - Downloadable & printable commercial PDF invoice receipt with company stamp, route breakdown, and assigned chauffeur info.
4. **Dedicated Admin Operations Portal (`/admin/*`)**:
   - Secure login (`/admin/login`) with JWT token authentication and password hashing.
   - **Dashboard**: Live counters for bookings, revenue, active fleet, available chauffeurs, and unresolved error count.
   - **Bookings Management**: Filter by status, assign active chauffeurs to confirmed bookings, and delete/manage reservations.
   - **Car Fleet & Rate Management**: Live CRUD for cars, specifications, and tariff rates (changing rates immediately alters future calculations).
   - **Driver Fleet**: Register and manage background-verified chauffeurs, status (Available/On Trip/Off Duty), and ratings.
   - **System Logs & Problem Tracker (MANDATORY REQUIREMENT)**: Database-backed system logs with `X-Correlation-ID`, severity filters, module filtering, admin resolution notes, and log archiving.
   - **Customer Inquiries**: Inbound message management with read/unread toggle.

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Backend Setup & Startup
```bash
cd backend

# (Optional) Setup virtual environment
# python -m venv venv
# source venv/bin/activate # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn sqlalchemy pymysql pydantic pydantic-settings pyjwt passlib bcrypt python-multipart httpx python-dotenv email-validator

# Run automated tests
python test_e2e_flow.py

# Start the FastAPI server (Runs on port 8000)
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Frontend Setup & Startup
```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server (Runs on port 5173)
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 🔑 Default Admin Credentials

- **Admin Login Route**: `http://localhost:5173/admin/login`
- **Username**: `admin`
- **Password**: `admin123`

---

## ⚙️ Environment Variables (Optional)

Create a `.env` file in the `backend/` directory if you want to connect to MySQL:
```env
# Optional MySQL Configuration (Defaults to SQLite if omitted)
DATABASE_URL=mysql+pymysql://root:yourpassword@localhost:3306/taxigo_db

SECRET_KEY=your-super-secret-jwt-key
PRIMARY_CONTACT_PHONE=6267228958
DEFAULT_UPI_ID=6267228958@upi
```

---

## 🧪 Verification & Testing

To run the automated backend test suite:
```bash
cd backend
python test_e2e_flow.py
```
Test results verify all 14 stages: Database seeder, Dynamic Fare Formula, OSRM Road Distance, Booking Creation, Driver Assignment, Tariff Tuning, and the System Error Logging pipeline.
