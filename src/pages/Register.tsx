import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bloodGroup: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('পাসওয়ার্ড মিলছে না');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      // ✅ 1. Supabase Auth Sign Up
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            blood_group: formData.bloodGroup,
          },
        },
      });

      if (error || !data.user) {
        setErrorMsg(error?.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে');
        return;
      }

      // ✅ profiles row auto-create হবে trigger দিয়ে
      // approved = false (default)

      setSuccess(true);

      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      setErrorMsg('আবেদন সফল হয়নি, আবার চেষ্টা করুন');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-12 text-center border border-gray-100">
          <h2 className="text-3xl font-black text-slate-800 mb-4">
            আবেদন সফল হয়েছে ✅
          </h2>
          <p className="text-slate-500 font-bold mb-10">
            Admin approve করলে আপনি লগইন করতে পারবেন।
          </p>
          <Link
            to="/login"
            className="block w-full bg-emerald-700 text-white font-black py-5 rounded-2xl"
          >
            লগইন পেজে যান
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <div className="max-w-2xl w-full bg-white rounded-[50px] shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-emerald-900 p-12 text-white text-center">
          <h2 className="text-4xl font-black mb-3">সদস্য হতে আবেদন</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-12 space-y-6">
          {errorMsg && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl font-bold text-xs">
              {errorMsg}
            </div>
          )}

          <input name="name" placeholder="পূর্ণ নাম" required onChange={handleChange} className="input" />
          <input name="email" type="email" placeholder="ইমেইল" required onChange={handleChange} className="input" />
          <input name="phone" placeholder="মোবাইল" required onChange={handleChange} className="input" />
          <input name="address" placeholder="ঠিকানা" required onChange={handleChange} className="input" />

          <select name="bloodGroup" required onChange={handleChange} className="input">
            <option value="">রক্তের গ্রুপ</option>
            <option>A+</option><option>A-</option>
            <option>B+</option><option>B-</option>
            <option>AB+</option><option>AB-</option>
            <option>O+</option><option>O-</option>
          </select>

          <input name="password" type="password" placeholder="পাসওয়ার্ড" required onChange={handleChange} className="input" />
          <input name="confirmPassword" type="password" placeholder="পাসওয়ার্ড পুনরায়" required onChange={handleChange} className="input" />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl disabled:opacity-50"
          >
            {loading ? 'আবেদন পাঠানো হচ্ছে...' : 'আবেদন করুন'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
