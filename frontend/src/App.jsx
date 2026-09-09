import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingActionButtons from './components/FloatingActionButtons';
import LiveBookingToasts from './components/LiveBookingToasts';
import AdminLayout from './components/AdminLayout';

// Public Pages
import HomePage from './pages/HomePage';
import BookRidePage from './pages/BookRidePage';
import ServicesPage from './pages/ServicesPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactPage from './pages/ContactPage';
import BookingDetailsPage from './pages/BookingDetailsPage';

// Admin Pages
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminBookingsPage from './pages/AdminBookingsPage';
import AdminCarsPage from './pages/AdminCarsPage';
import AdminDriversPage from './pages/AdminDriversPage';
import AdminFareSettingsPage from './pages/AdminFareSettingsPage';
import AdminSystemLogsPage from './pages/AdminSystemLogsPage';
import AdminMessagesPage from './pages/AdminMessagesPage';

// Public Layout Wrapper with Navbar, Footer, Floating Buttons, and Live Booking Notifications
const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingActionButtons />
      <LiveBookingToasts />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/book-ride" element={<BookRidePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/booking/:code" element={<BookingDetailsPage />} />
          </Route>

          {/* Admin Auth Route */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="bookings" element={<AdminBookingsPage />} />
            <Route path="cars" element={<AdminCarsPage />} />
            <Route path="drivers" element={<AdminDriversPage />} />
            <Route path="fare-settings" element={<AdminFareSettingsPage />} />
            <Route path="system-logs" element={<AdminSystemLogsPage />} />
            <Route path="messages" element={<AdminMessagesPage />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
