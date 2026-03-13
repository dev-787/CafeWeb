import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { MenuSection } from './components/MenuSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ReserveSection } from './components/ReserveSection';
import { Footer } from './components/Footer';
import { FullMenuPage } from './pages/FullMenuPage';

// Admin imports
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminMenu } from './pages/admin/AdminMenu';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

function HomePage() {
  return (
    <div className="min-h-screen bg-[#1C4D19]">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <MenuSection />
      <TestimonialsSection />
      <ReserveSection />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<FullMenuPage />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute>
              <AdminOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/menu"
          element={
            <ProtectedRoute>
              <AdminMenu />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}