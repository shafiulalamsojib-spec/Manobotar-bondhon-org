import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';
import { supabase } from '../services/supabase';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1️⃣ Supabase Auth Login
      const { data, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError || !data.user) {
        setError('ভুল ইমেইল বা পাসওয়ার্ড');
        return;
      }

      // 2️⃣ Profile fetch from DB
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profile) {
        setError('প্রোফাইল পাওয়া যায়নি');
        return;
      }

      // 3️⃣ Approval check
      if (!profile.approved) {
        setError('আপনার একাউন্ট এখনো Admin দ্বারা approve করা হয়নি');
        return;
      }

      // 4️⃣ Final user object (IMPORTANT PART)
      const userData: User = {
        id: profile.id,
        name: profile.name, // ✅ FIXED (Supabase column)
        email: profile.email,
        role: profile.role === 'admin' ? 'Admin' : 'Member',
        approved: profile.approved,
        status: 'Approved',
        monthly_amount: profile.monthly_amount || 0,
        joining_date: profile.created_at,
        token: data.session?.access_token || '',
        permissions:
          profile.role === 'admin'
            ? {
                viewFund: true,
                postActivities: true,
                postNotices: true,
                manageMembers: true,
              }
            : {},
      };

      onLogin(userData);
    } catch (err) {
      setError('লগইন ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-24 flex justify-center items-center">
      <div className="max-w-md w-full bg-white rounded-[50px] shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-[#064e3b] p-12 text-white text-center">
          <h2 className="text-3xl font-black">সদস্য লগইন</h2>
          <p className="text-emerald-100/60 font-bold uppercase tracking-widest text-[10px] mt-2">
            Member Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-12 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold border border-red-100">
              {error}
            </div>
          )}

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ইমেইল"
            className="w-full px-6 py-4 rounded-2xl border font-bold"
          />

          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="পাসওয়ার্ড"
            className="w-full px-6 py-4 rounded-2xl border font-bold"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black disabled:opacity-50"
          >
            {loading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
          </button>

          <div className="text-center">
            <Link to="/register" className="text-emerald-700 font-bold">
              নতুন সদস্য? আবেদন করুন
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
