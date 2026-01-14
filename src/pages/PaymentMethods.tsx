
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Donation } from '../types';
import { ORG_DETAILS } from '../constants';

interface PaymentMethodsProps {
  user: User;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { prefillAmount?: number };
  
  const [amount, setAmount] = useState(state?.prefillAmount?.toString() || user.monthly_amount?.toString() || '500');
  const [trxId, setTrxId] = useState('');
  const [method, setMethod] = useState<'Bkash' | 'Nagad' | 'Rocket'>('Bkash');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (state?.prefillAmount !== undefined) {
      setAmount(state.prefillAmount.toString());
    }
  }, [state]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ORG_DETAILS.officialNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setScreenshot(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const newDonation: Donation = {
        id: 'user-don-' + Date.now(),
        user_id: user.id,
        user_name: user.name,
        amount: Number(amount),
        method,
        trx_id: trxId,
        screenshot: screenshot || undefined,
        status: 'Pending',
        type: 'Subscription',
        created_at: new Date().toLocaleDateString('bn-BD'),
      };

      const existingStr = localStorage.getItem('mock_donations');
      const existing = existingStr ? JSON.parse(existingStr) : [];
      localStorage.setItem('mock_donations', JSON.stringify([newDonation, ...existing]));

      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate('/member/dashboard?payment=success');
    } catch (err) {
      setLoading(false);
      navigate('/member/dashboard?payment=fail');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-emerald-800 font-bold hover:text-emerald-600 transition-colors group">
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>ফিরে যান
        </button>
      </div>

      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center">
          <h1 className="text-4xl font-black text-slate-800 mb-2 tracking-tight">পেমেন্ট মেথড</h1>
          <p className="text-slate-500 font-bold">নিচের তথ্যগুলো যথাযথভাবে পূরণ করুন</p>
        </div>

        <div className="bg-emerald-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="text-xl font-black text-emerald-400 mb-6 flex items-center gap-2">
               নির্দেশনা
            </h4>
            <p className="text-emerald-100 font-bold text-sm mb-6">নিচের নম্বরে "Send Money" করে ট্রানজেকশন আইডি দিন।</p>
            <div className="flex flex-col sm:flex-row items-center gap-6">
               <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/20">
                  <span className="font-black text-3xl text-white tracking-[0.2em]">{ORG_DETAILS.officialNumber}</span>
                  <button onClick={copyToClipboard} className={`p-2 rounded-xl transition-all ${copied ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white/20 text-white hover:bg-white/30'}`}>
                    {copied ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                    )}
                  </button>
               </div>
               <div className="text-xs font-black uppercase text-emerald-300 tracking-widest text-center sm:text-left">বিকাশ / নগদ / রকেট<br/>পার্সোনাল নম্বর</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[45px] shadow-2xl border border-gray-100 p-12">
          <h3 className="text-2xl font-black text-slate-800 mb-8">অনুদান বিবরণ</h3>
          <form onSubmit={handleSubmitDonation} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">পরিমাণ (৳)</label>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 font-black text-xl outline-none focus:ring-2 focus:ring-emerald-500" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">পদ্ধতি</label>
                <select value={method} onChange={e => setMethod(e.target.value as any)} className="w-full bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 font-bold outline-none focus:ring-2 focus:ring-emerald-500 appearance-none">
                  <option value="Bkash">বিকাশ (Bkash)</option><option value="Nagad">নগদ (Nagad)</option><option value="Rocket">রকেট (Rocket)</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ট্রানজেকশন আইডি (TrxID)</label>
                <input type="text" required value={trxId} onChange={e => setTrxId(e.target.value)} className="w-full bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 font-bold uppercase outline-none focus:ring-2 focus:ring-emerald-500" placeholder="BK12345ABC" />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">পেমেন্ট প্রুফ / স্ক্রিনশট</label>
                <div className="mt-2">
                   <label className="cursor-pointer bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center transition-all group">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">ফাইল নির্বাচন করুন</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" required />
                   </label>
                   {screenshot && (<div className="mt-4 relative w-full aspect-video rounded-3xl overflow-hidden shadow-lg border border-slate-100 group"><img src={screenshot} alt="Preview" className="w-full h-full object-cover" /><button type="button" onClick={() => setScreenshot(null)} className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">✕</button></div>)}
                </div>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-emerald-200 transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-70">{loading ? 'জমা হচ্ছে...' : 'পেমেন্ট সাবমিট করুন'}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
