
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

interface AdminLoginProps {
  onLogin: (user: User) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      if (email === 'shafiulalamsojib@gmail.com' && password === '@Sojib210073@') {
        const mockAdmin: User = {
          id: 'admin-sojib',
          name: 'শফিউল আলম সজীব',
          email,
          role: 'Admin',
          approved: true,
          status: 'Approved',
          monthly_amount: 0,
          joining_date: '2025-01-01',
          token: 'production-jwt-token-sojib',
          permissions: { viewFund: true, postActivities: true, postNotices: true, manageMembers: true }
        };
        onLogin(mockAdmin);
      } else {
        setError('অ্যাক্সেস ডিনাইড! ইমেইল বা পাসওয়ার্ড সঠিক নয়।');
      }
    } catch (err) {
      setError('লগইন ব্যর্থ হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center">
      <div className="max-w-md w-full bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-800">
        <div className="bg-red-700 p-8 text-white text-center">
          <h2 className="text-2xl font-black uppercase tracking-widest">অ্যাডমিন প্যানেল</h2>
          <p className="text-red-100 text-[10px] mt-2 font-bold uppercase opacity-80">SECURE ACCESS</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && <div className="p-4 bg-red-900/40 text-red-200 rounded-xl text-xs font-bold">{error}</div>}
          <div><label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">অ্যাডমিন ইমেইল</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-800/50 px-4 py-3.5 rounded-xl border border-slate-700 text-white focus:ring-2 focus:ring-red-500 outline-none" required /></div>
          <div><label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">পাসওয়ার্ড</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-800/50 px-4 py-3.5 rounded-xl border border-slate-700 text-white focus:ring-2 focus:ring-red-500 outline-none" required /></div>
          <button type="submit" disabled={loading} className="w-full bg-red-700 hover:bg-red-600 text-white font-black py-4 rounded-xl transition-all shadow-xl disabled:opacity-50">{loading ? 'যাচাই করা হচ্ছে...' : 'লগইন করুন'}</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
