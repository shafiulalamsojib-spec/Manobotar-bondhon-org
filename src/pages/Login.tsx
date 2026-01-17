
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
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
      // Simulate API latency
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check for hardcoded Admin access
      if (email === 'shafiulalamsojib@gmail.com' && password === '@Sojib210073@') {
        const adminUser: User = {
          id: 'admin-1',
          name: 'শফিউল আলম সজীব',
          email,
          role: 'Admin',
          approved: true,
          status: 'Approved',
          monthly_amount: 0,
          joining_date: '2025-01-01',
          token: 'admin-token',
          permissions: { viewFund: true, postActivities: true, postNotices: true, manageMembers: true }
        };
        onLogin(adminUser);
        return;
      }

      // Check Member access from localStorage
      const storedUsers = localStorage.getItem('mock_users');
      const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
      const foundUser = users.find(u => u.email === email);

      if (foundUser) {
        // Verify password matches stored password
        if (foundUser.password !== password) {
          setError('ভুল পাসওয়ার্ড। অনুগ্রহ করে আবার চেষ্টা করুন।');
          return;
        }

        if (foundUser.status !== 'Approved') {
          setError(`আপনার আবেদনটি এখনো ${foundUser.status === 'Pending' ? 'পেন্ডিং' : 'বাতিল'} অবস্থায় আছে।`);
        } else {
          onLogin(foundUser);
        }
      } else {
        setError('এই ইমেইল দিয়ে কোন সদস্য খুঁজে পাওয়া যায়নি।');
      }
    } catch (err) {
      setError('লগইন ব্যর্থ হয়েছে। সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-24 flex justify-center items-center">
      <div className="max-w-md w-full bg-white rounded-[50px] shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-[#064e3b] p-12 text-white text-center">
          <h2 className="text-3xl font-black">সদস্য লগইন</h2>
          <p className="text-emerald-100/60 font-bold uppercase tracking-widest text-[10px] mt-2">Member Portal</p>
        </div>
        <form onSubmit={handleSubmit} className="p-12 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold leading-relaxed border border-red-100">
              {error}
            </div>
          )}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ইমেইল এড্রেস</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="w-full bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
              placeholder="mail@example.com" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">পাসওয়ার্ড</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
              placeholder="••••••••" 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black shadow-xl shadow-emerald-100 transition-all hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
          </button>
          
          <div className="text-center pt-6 border-t border-slate-100">
            <p className="text-slate-500 font-bold text-sm">
              এখনো সদস্য নন? <Link to="/register" className="text-emerald-700 font-black hover:underline">আবেদন করুন</Link>
            </p>
            <div className="mt-4">
              <Link to="/admin-login" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-600 transition-colors">
                অ্যাডমিন লগইন
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
