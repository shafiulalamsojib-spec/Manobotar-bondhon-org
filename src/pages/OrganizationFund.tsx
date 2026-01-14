
import React, { useState, useEffect } from 'react';
import { User, FundTransaction, Donation } from '../types';

interface OrganizationFundProps {
  user: User | null;
}

const OrganizationFund: React.FC<OrganizationFundProps> = ({ user }) => {
  const [transactions, setTransactions] = useState<FundTransaction[]>([]);
  const [stats, setStats] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0
  });

  const loadFundData = () => {
    // 1. Load Manual Ledger (with default founder donation if empty)
    let storedLedgerStr = localStorage.getItem('fund_ledger');
    let mockLedger: FundTransaction[];
    if (!storedLedgerStr) {
      mockLedger = [{ id: '1', type: 'Income', category: 'প্রতিষ্ঠাতা অনুদান', amount: 45000, description: 'সংগঠন শুরুর অনুদান', date: '২০২৫-০১-০১' }];
      localStorage.setItem('fund_ledger', JSON.stringify(mockLedger));
    } else {
      mockLedger = JSON.parse(storedLedgerStr);
    }
    
    // 2. Load Approved Member Donations
    const storedDonations = localStorage.getItem('mock_donations');
    const allDonations: Donation[] = storedDonations ? JSON.parse(storedDonations) : [];
    const approvedDonations = allDonations.filter(d => d.status === 'Approved');
    
    const donationIncomeTransactions: FundTransaction[] = approvedDonations.map(d => ({
      id: `don-${d.id}`,
      type: 'Income',
      category: 'সদস্য চাঁদা',
      amount: d.amount,
      description: `${d.user_name || 'সদস্য'} এর চাঁদা (${d.method})`,
      date: d.created_at,
      reference_id: d.id
    }));

    // Combine & Sort for Ledger View
    const combined = [...mockLedger, ...donationIncomeTransactions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // UNIFIED CALCULATION
    const ledgerIncome = mockLedger.filter(t => t.type === 'Income').reduce((acc, curr) => acc + Number(curr.amount), 0);
    const approvedDonationIncome = approvedDonations.reduce((acc, curr) => acc + Number(curr.amount), 0);
    const totalIncome = ledgerIncome + approvedDonationIncome;
    
    // Expenses only come from manual ledger in this logic
    const totalExpense = mockLedger.filter(t => t.type === 'Expense').reduce((acc, curr) => acc + Number(curr.amount), 0);
    
    setTransactions(combined);
    setStats({
      totalIncome: totalIncome,
      totalExpense: totalExpense,
      totalBalance: totalIncome - totalExpense
    });
  };

  useEffect(() => {
    loadFundData();
    const interval = setInterval(loadFundData, 2000);
    return () => clearInterval(interval);
  }, []);

  const hasAccessToLedger = user !== null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <section className="bg-emerald-900 text-white py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-400 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-400 rounded-full filter blur-3xl"></div>
        </div>
        <div className="container mx-auto relative z-10">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">সংগঠনের তহবিল</h1>
          <div className="w-24 h-2 bg-emerald-500 mx-auto rounded-full mb-8"></div>
          <p className="text-emerald-100 text-lg md:text-xl font-bold opacity-80 max-w-2xl mx-auto leading-relaxed">
            স্বচ্ছতা আমাদের মূলমন্ত্র। সংগঠনের প্রতিটি অর্থের হিসাব এখানে প্রকাশ করা হয়।
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-10 rounded-[45px] shadow-2xl border border-emerald-100 flex flex-col items-center text-center">
             <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             </div>
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">মোট বর্তমান তহবিল</span>
             <h2 className="text-4xl font-black text-emerald-800 tracking-tighter">৳{stats.totalBalance.toLocaleString()}</h2>
          </div>
          <div className="bg-white p-10 rounded-[45px] shadow-2xl border border-gray-100 flex flex-col items-center text-center">
             <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 11l5-5m0 0l5 5m-5-5v12"></path></svg>
             </div>
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">মোট আয় (Income)</span>
             <h2 className="text-4xl font-black text-slate-800 tracking-tighter">৳{stats.totalIncome.toLocaleString()}</h2>
          </div>
          <div className="bg-white p-10 rounded-[45px] shadow-2xl border border-gray-100 flex flex-col items-center text-center">
             <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 13l-5 5m0 0l-5-5m5-5v12"></path></svg>
             </div>
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">মোট ব্যয় (Expense)</span>
             <h2 className="text-4xl font-black text-slate-800 tracking-tighter">৳{stats.totalExpense.toLocaleString()}</h2>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        {!hasAccessToLedger ? (
          <div className="bg-white p-20 rounded-[60px] shadow-xl border border-gray-100 text-center max-w-4xl mx-auto">
             <div className="w-24 h-24 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
             </div>
             <h3 className="text-3xl font-black text-slate-800 mb-4">বিস্তারিত তথ্য সংরক্ষিত</h3>
             <p className="text-slate-500 font-bold mb-10 text-lg">তহবিলের বিস্তারিত আদান-প্রদানের ইতিহাস দেখার জন্য আপনাকে একজন অনুমোদিত সদস্য হিসেবে লগইন করতে হবে।</p>
             <a href="/#/login" className="inline-block bg-emerald-600 text-white px-12 py-5 rounded-3xl font-black text-xl shadow-xl shadow-emerald-200 transition-all hover:bg-emerald-700">সদস্য লগইন করুন</a>
          </div>
        ) : (
          <div className="bg-white rounded-[50px] shadow-xl border border-gray-100 overflow-hidden animate-in fade-in duration-700">
             <div className="p-10 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-2xl font-black text-slate-800">বিস্তারিত লেনদেন ইতিহাস</h3>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-slate-50">
                      <tr>
                         <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">তারিখ</th>
                         <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">বিবরণ ও ক্যাটাগরি</th>
                         <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">টাইপ</th>
                         <th className="px-10 py-6 text-right text-[10px] font-black uppercase text-slate-400 tracking-widest">পরিমাণ</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100 font-bold">
                      {transactions.length === 0 ? (
                        <tr><td colSpan={4} className="p-20 text-center text-slate-400">কোন লেনদেনের তথ্য নেই</td></tr>
                      ) : transactions.map(t => (
                        <tr key={t.id} className="hover:bg-slate-50/30 transition-colors">
                           <td className="px-10 py-8 text-slate-500 text-sm">{t.date}</td>
                           <td className="px-10 py-8">
                              <div className="font-black text-slate-800">{t.description}</div>
                              <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">{t.category}</div>
                           </td>
                           <td className="px-10 py-8">
                              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm border ${
                                t.type === 'Income' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-rose-100 text-rose-700 border-rose-200'
                              }`}>
                                 {t.type === 'Income' ? 'জমা (Income)' : 'খরচ (Expense)'}
                              </span>
                           </td>
                           <td className={`px-10 py-8 text-right font-black text-2xl ${t.type === 'Income' ? 'text-emerald-700' : 'text-rose-700'}`}>
                              {t.type === 'Income' ? '+' : '-'} ৳{t.amount.toLocaleString()}
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationFund;
