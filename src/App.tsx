import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { User } from './types';

import Navbar from './components/Navbar';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MemberDashboard from './pages/MemberDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import Committee from './pages/Committee';
import Activities from './pages/Activities';
import PaymentMethods from './pages/PaymentMethods';
import OrganizationFund from './pages/OrganizationFund';

// ✅ NEW: Supabase test page
import SupabaseTest from './pages/SupabaseTest';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));

    if (userData.role === 'Admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/member/dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="flex-grow">
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/committee" element={<Committee />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/fund" element={<OrganizationFund user={user} />} />
          <Route path="/admin-login" element={<AdminLogin onLogin={handleLogin} />} />

          {/* ✅ Supabase connection test */}
          <Route path="/supabase-test" element={<SupabaseTest />} />

          {/* Member routes */}
          <Route
            path="/member/dashboard/*"
            element={
              user && user.role === 'Member'
                ? <MemberDashboard user={user} />
                : <Navigate to="/login" />
            }
          />

          <Route
            path="/payment-methods"
            element={
              user && user.role === 'Member'
                ? <PaymentMethods user={user} />
                : <Navigate to="/login" />
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin/dashboard/*"
            element={
              user && user.role === 'Admin'
                ? <AdminDashboard user={user} />
                : <Navigate to="/admin-login" />
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <footer className="bg-emerald-900 text-white py-12 mt-12 border-t border-emerald-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-center md:text-left max-w-4xl mx-auto">
            <div>
              <h4 className="text-xl font-black mb-4">মানবতার বন্ধন</h4>
              <p className="text-emerald-300 text-sm leading-relaxed font-bold">
                প্রকৃতি ও মানুষের কল্যাণে আমরা সর্বদা সজাগ। আপনার একটি ক্ষুদ্র সহযোগিতা আমাদের অনুপ্রেরণা।
              </p>
            </div>
            <div>
              <h4 className="text-xl font-black mb-4">যোগাযোগ</h4>
              <p className="text-emerald-300 text-sm font-bold">
                তালুক জামিরা, পলাশবাড়ী, গাইবান্ধা
              </p>
              <p className="text-emerald-300 text-sm mt-1 font-bold">
                ইমেইল: manobotarbondhon2025@gmail.com
              </p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-emerald-800 text-center">
            <p className="text-emerald-400 text-sm font-bold">
              © ২০২৬ মানবতার বন্ধন সামাজিক সংগঠন। সর্বস্বত্ব সংরক্ষিত।
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
