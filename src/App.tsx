import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BookingProvider } from './contexts/BookingContext';
import Layout from './components/layout/Layout';
import Homepage from './pages/Homepage';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Booking from './pages/Booking';
import Gallery from './pages/Gallery';
import Dashboard from './pages/Dashboard';
import MusteriPanel from './pages/MusteriPanel';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <div className="scroll-container will-change-scroll">
            <Layout>
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/hizmetler" element={<Services />} />
                <Route path="/hizmetler/:serviceId" element={<ServiceDetail />} />
                <Route path="/rezervasyon" element={<Booking />} />
                <Route path="/galeri" element={<Gallery />} />
                <Route path="/panel/*" element={<Dashboard />} />
                <Route path="/hesabim" element={<MusteriPanel />} />
                <Route path="/hakkimizda" element={<About />} />
                <Route path="/iletisim" element={<Contact />} />
                <Route path="/giris" element={<Login />} />
                <Route path="/kayit" element={<Register />} />
              </Routes>
            </Layout>
          </div>
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;
