
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bloodGroup: '',
    password: '',
    confirmPassword: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('পাসওয়ার্ড মিলছে না');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const storedUsers = localStorage.getItem('mock_users');
      const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

      if (users.find(u => u.email === formData.email)) {
        setErrorMsg('এই ইমেইলটি ইতিপূর্বে ব্যবহৃত হয়েছে');
        setStatus('error');
        return;
      }

      const newUser: User = {
        id: 'user-' + Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        bloodGroup: formData.bloodGroup,
        password: formData.password, // FIX: Store password in user object
        role: 'Member',
        approved: false,
        status: 'Pending',
        monthly_amount: 500,
        joining_date: new Date().toLocaleDateString('bn-BD'),
        created_at: new Date().toISOString(),
        permissions: {
          viewFund: true,
          postActivities: false,
          postNotices: false,
          manageMembers: false
        }
      };

      localStorage.setItem('mock_users', JSON.stringify([...users, newUser]));
      setStatus('success');
    } catch (err) {
      setErrorMsg('আবেদন সফল হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-12 text-center border border-gray-100">
          <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-4">আবেদন সফল হয়েছে!</h2>
          <p className="text-slate-500 font-bold mb-10 leading-relaxed">আপনার আবেদনটি এডমিন অনুমোদনের জন্য প্রেরণ করা হয়েছে। অনুমোদনের পর আপনি লগইন করতে পারবেন।</p>
          <Link to="/login" className="block w-full bg-[#064e3b] text-white font-black py-5 rounded-2xl hover:bg-emerald-900 transition-all shadow-xl shadow-emerald-900/20">
            লগইন পেজে যান
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <div className="max-w-2xl w-full bg-white rounded-[50px] shadow-2xl shadow-emerald-900/5 overflow-hidden border border-gray-100">
        <div className="bg-[#064e3b] p-12 text-white text-center relative">
          <h2 className="text-4xl font-black mb-3">সদস্য হতে আবেদন</h2>
          <div className="w-16 h-1 bg-emerald-500 mx-auto rounded-full mb-4"></div>
          <p className="text-emerald-100 font-bold opacity-80 uppercase tracking-widest text-xs">Join Manobotar Bondhon</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-12 space-y-6">
          {errorMsg && <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold">{errorMsg}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">পূর্ণ নাম</label>
              <input name="name" type="text" required value={formData.name} onChange={handleChange} className="w-full bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all font-bold" />
            </div>
            <div className="space-y-2"><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ইমেইল</label><input name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 font-bold" /></div>
            <div className="space-y-2"><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">মোবাইল</label><input name="phone" type="tel" required value={formData.phone} onChange={handleChange} className="w-full bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 font-bold" /></div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">রক্তের গ্রুপ</label>
              <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 font-bold">
                <option value="">নির্বাচন করুন</option>
                <option value="A+">A+</option><option value="A-">A-</option><option value="B+">B+</option><option value="B-">B-</option>
                <option value="AB+">AB+</option><option value="AB-">AB-</option><option value="O+">O+</option><option value="O-">O-</option>
              </select>
            </div>
            <div className="md:col-span-2 space-y-2"><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">বর্তমান ঠিকানা</label><input name="address" type="text" required value={formData.address} onChange={handleChange} className="w-full bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 font-bold" /></div>
            <div className="space-y-2"><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">পাসওয়ার্ড</label><input name="password" type="password" required value={formData.password} onChange={handleChange} className="w-full bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 font-bold" /></div>
            <div className="space-y-2"><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">পাসওয়ার্ড পুনরায়</label><input name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} className="w-full bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 font-bold" /></div>
          </div>

          <button type="submit" disabled={status === 'loading'} className="w-full bg-[#10b981] text-white font-black py-5 rounded-2xl transition-all shadow-xl text-lg disabled:opacity-50">
            {status === 'loading' ? 'আবেদন পাঠানো হচ্ছে...' : 'সদস্য হতে আবেদন করুন'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
