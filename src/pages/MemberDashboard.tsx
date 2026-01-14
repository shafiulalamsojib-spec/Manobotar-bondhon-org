
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { User, Donation, Notice, Activity, FundTransaction, UserMessage } from '../types';

interface MemberDashboardProps {
  user: User;
}

const MemberDashboard: React.FC<MemberDashboardProps> = ({ user }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'donations' | 'notices' | 'activities' | 'profile' | 'messages'>('overview');
  
  const [currentUser, setCurrentUser] = useState<User>(user);
  const [myDonations, setMyDonations] = useState<Donation[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [orgStats, setOrgStats] = useState({
    totalFund: 0,
    totalMembers: 0,
    totalActivities: 0
  });
  const [myStats, setMyStats] = useState({
    totalPaid: 0,
    totalDue: 0,
    monthlyAmount: user.monthly_amount || 500,
    manualDue: 0
  });

  const [showStatus, setShowStatus] = useState<string | null>(null);

  const loadMemberData = () => {
    const storedUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
    const upToDateUser = storedUsers.find((u: User) => u.id === user.id) || user;
    setCurrentUser(upToDateUser);

    const storedDonations = JSON.parse(localStorage.getItem('mock_donations') || '[]');
    const myFiltered = storedDonations.filter((d: Donation) => d.user_id === user.id);
    setMyDonations(myFiltered);

    const myApprovedTotal = myFiltered
      .filter((d: Donation) => d.status === 'Approved')
      .reduce((acc: number, curr: Donation) => acc + Number(curr.amount), 0);
    
    // Monthly calculation (fallback)
    const joinDate = new Date(upToDateUser.created_at || new Date().toISOString());
    const now = new Date();
    const monthsDiff = (now.getFullYear() - joinDate.getFullYear()) * 12 + (now.getMonth() - joinDate.getMonth()) + 1;
    const expectedTotal = monthsDiff * (upToDateUser.monthly_amount || 500);
    
    // Priority for manual overrides
    const finalTotalPaid = upToDateUser.manual_total_paid !== undefined ? upToDateUser.manual_total_paid : myApprovedTotal;
    const finalTotalDue = upToDateUser.manual_due !== undefined ? upToDateUser.manual_due : Math.max(0, expectedTotal - myApprovedTotal);

    setMyStats({
      totalPaid: finalTotalPaid,
      totalDue: Math.max(0, finalTotalDue), // Ensure due never negative
      monthlyAmount: upToDateUser.monthly_amount || 500,
      manualDue: finalTotalDue
    });

    const storedLedger = JSON.parse(localStorage.getItem('fund_ledger') || '[]');
    const ledgerIncome = storedLedger.filter((t: any) => t.type === 'Income').reduce((a: any, b: any) => a + Number(b.amount), 0);
    const approvedDonationIncome = storedDonations.filter((d: any) => d.status === 'Approved').reduce((a: any, b: any) => a + Number(b.amount), 0);
    const ledgerExpense = storedLedger.filter((t: any) => t.type === 'Expense').reduce((a: any, b: any) => a + Number(b.amount), 0);

    const storedActivities = JSON.parse(localStorage.getItem('mock_activities') || '[]');

    setOrgStats({
      totalFund: (ledgerIncome + approvedDonationIncome) - ledgerExpense,
      totalMembers: storedUsers.filter((u: User) => u.status === 'Approved').length,
      totalActivities: storedActivities.length
    });

    setNotices(JSON.parse(localStorage.getItem('mock_notices') || '[]'));
    setActivities(storedActivities);
  };

  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    if (paymentStatus) {
      setShowStatus(paymentStatus);
      const timer = setTimeout(() => setShowStatus(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  useEffect(() => {
    loadMemberData();
    const interval = setInterval(loadMemberData, 3000);
    return () => clearInterval(interval);
  }, [user.id]);

  const handlePayDue = () => {
    // If due is 0, prefill with monthly amount anyway for next cycle or leave editable
    const amountToPay = myStats.totalDue > 0 ? myStats.totalDue : myStats.monthlyAmount;
    navigate('/payment-methods', { state: { prefillAmount: amountToPay } });
  };

  if (currentUser.status !== 'Approved') {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <div className="max-w-2xl w-full bg-white rounded-[50px] shadow-2xl p-12 text-center border border-gray-100">
          <div className="w-24 h-24 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-4">আবেদন পর্যালোচনায় আছে</h2>
          <p className="text-slate-500 font-bold mb-10 leading-relaxed max-w-md mx-auto">অনুমোদন পাওয়ার পর ড্যাশবোর্ড সুবিধা পাওয়া যাবে।</p>
          <button onClick={() => navigate('/')} className="text-emerald-700 font-black flex items-center gap-2 mx-auto"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>হোম পেজে যান</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {showStatus && (
        <div className="fixed bottom-8 right-8 z-50 bg-white p-6 rounded-[30px] shadow-2xl border border-emerald-100 animate-in slide-in-from-right-10 duration-500 flex items-center gap-4">
           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${showStatus === 'success' ? 'bg-emerald-600' : 'bg-red-600'} text-white`}>{showStatus === 'success' ? '✓' : '✕'}</div>
           <div><p className="font-black text-slate-800">{showStatus === 'success' ? 'পেমেন্ট সফল হয়েছে!' : 'পেমেন্ট ব্যর্থ হয়েছে'}</p></div>
        </div>
      )}

      <div className="flex flex-col xl:flex-row gap-10">
        <aside className="xl:w-80 shrink-0 space-y-8">
           <div className="bg-emerald-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                 <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center font-black text-2xl mb-6">{currentUser.name.charAt(0)}</div>
                 <h2 className="text-2xl font-black mb-1">{currentUser.name}</h2>
                 <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">{currentUser.position || 'সদস্য'} • ID-{currentUser.id.split('-')[1] || '001'}</p>
              </div>
           </div>

           <nav className="space-y-2">
              {[
                { id: 'overview', label: 'ওভারভিউ', icon: '📊' },
                { id: 'donations', label: 'পেমেন্ট ও ইতিহাস', icon: '💰' },
                { id: 'notices', label: 'নোটিশ বোর্ড', icon: '📢' },
                { id: 'activities', label: 'কার্যক্রম', icon: '📝' },
                { id: 'messages', label: 'অ্যাডমিন মেসেজ', icon: '✉️' },
                { id: 'profile', label: 'প্রোফাইল', icon: '👤' },
              ].map(item => (
                <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === item.id ? 'bg-white text-emerald-800 shadow-xl' : 'text-slate-400 hover:bg-white hover:text-slate-800'}`}>
                  <span className="text-xl">{item.icon}</span>{item.label}{item.id === 'messages' && (currentUser.messages || []).length > 0 && (<span className="ml-auto w-5 h-5 bg-rose-500 text-white text-[10px] flex items-center justify-center rounded-full">{(currentUser.messages || []).length}</span>)}
                </button>
              ))}
           </nav>

           <div className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100"><span className="text-[10px] font-black uppercase text-slate-400">তহবিল</span><div className="text-3xl font-black text-emerald-800 mt-2">৳{orgStats.totalFund.toLocaleString()}</div></div>
        </aside>

        <main className="flex-grow">
          {activeTab === 'overview' && (
            <div className="space-y-10 animate-in fade-in duration-500">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-8 rounded-[45px] shadow-xl border border-gray-100 text-center flex flex-col justify-between items-center">
                     <div>
                       <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">মাসিক চাঁদা</span>
                       <div className="text-3xl font-black text-slate-800">৳{myStats.monthlyAmount}</div>
                     </div>
                     <button onClick={() => navigate('/payment-methods', { state: { prefillAmount: myStats.monthlyAmount } })} className="mt-4 w-full bg-emerald-50 text-emerald-700 py-2.5 rounded-xl font-black text-xs hover:bg-emerald-100 transition-all uppercase">চাঁদা পরিশোধ</button>
                  </div>
                  <div className="bg-emerald-50 p-8 rounded-[45px] shadow-xl border border-emerald-100 text-center flex flex-col justify-center items-center">
                     <span className="text-[10px] font-black uppercase text-emerald-700 tracking-widest mb-2 block">মোট পরিশোধ</span>
                     <div className="text-3xl font-black text-emerald-800">৳{myStats.totalPaid}</div>
                  </div>
                  <div className="bg-rose-50 p-8 rounded-[45px] shadow-xl border border-rose-100 text-center flex flex-col justify-between items-center">
                     <div>
                       <span className="text-[10px] font-black uppercase text-rose-700 tracking-widest mb-2 block">বর্তমান বকেয়া</span>
                       <div className="text-3xl font-black text-rose-800">৳{myStats.totalDue}</div>
                     </div>
                     <button onClick={handlePayDue} className="mt-4 w-full bg-rose-600 text-white py-2.5 rounded-xl font-black text-xs hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all uppercase">বকেয়া পরিশোধ করুন</button>
                  </div>
               </div>

               <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-grow bg-white p-10 rounded-[45px] shadow-xl border border-gray-100"><h3 className="text-xl font-black text-slate-800 mb-6">সাম্প্রতিক নোটিশ</h3><div className="space-y-4">{notices.slice(0, 2).map(n => (<div key={n.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 font-bold text-slate-700">{n.title}</div>))}</div></div>
                  <div className="md:w-80 bg-slate-900 p-10 rounded-[45px] shadow-2xl text-white text-center"><h3 className="text-xl font-black mb-6">পেমেন্ট করুন</h3><Link to="/payment-methods" className="w-full bg-emerald-600 hover:bg-emerald-700 p-6 rounded-3xl flex flex-col items-center gap-3 transition-all"><span className="text-3xl">💸</span><span className="font-black text-sm uppercase">এখানে ক্লিক করুন</span></Link></div>
               </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-10 animate-in fade-in duration-500">
               <h2 className="text-3xl font-black text-slate-800">অ্যাডমিন মেসেজ</h2>
               <div className="space-y-6">{(currentUser.messages || []).length === 0 ? (<p className="text-slate-400 font-bold text-center py-20 bg-white rounded-3xl">কোন নতুন মেসেজ নেই।</p>) : ([...(currentUser.messages || [])].reverse().map(m => (<div key={m.id} className="bg-white p-8 rounded-[45px] shadow-xl border-l-8 border-l-emerald-600 border border-gray-100"><p className="text-lg font-bold text-slate-700 mb-4">{m.text}</p><div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400"><span>প্রেরক: {m.sender}</span><span>{m.date}</span></div></div>)))}</div>
            </div>
          )}

          {activeTab === 'donations' && (
            <div className="space-y-10">
              <h2 className="text-3xl font-black text-slate-800">পেমেন্ট ইতিহাস</h2>
              <div className="bg-white rounded-[45px] shadow-xl border border-gray-100 overflow-hidden">
                <table className="w-full text-left font-bold">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400">তারিখ</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400">বিস্তারিত</th>
                      <th className="px-10 py-6 text-right text-[10px] font-black uppercase text-slate-400">পরিমাণ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {myDonations.map(d => (
                      <tr key={d.id}>
                        <td className="px-10 py-8 text-sm text-slate-500">{d.created_at}</td>
                        <td className="px-10 py-8"><div className="text-slate-800 uppercase text-xs">{d.trx_id}</div><div className="text-[10px] font-black text-emerald-600 uppercase mt-1">{d.method} • {d.status}</div></td>
                        <td className="px-10 py-8 text-right font-black text-emerald-800 text-xl">৳{d.amount}</td>
                      </tr>
                    ))}
                    {myDonations.length === 0 && (
                      <tr><td colSpan={3} className="px-10 py-20 text-center text-slate-400 font-bold">কোন পেমেন্ট রেকর্ড নেই</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'notices' && (
            <div className="space-y-10 animate-in fade-in duration-500">
               <h2 className="text-3xl font-black text-slate-800">নোটিশ বোর্ড</h2>
               <div className="space-y-6">
                 {notices.length === 0 ? (
                   <p className="text-slate-400 font-bold text-center py-20 bg-white rounded-3xl">কোন নোটিশ নেই।</p>
                 ) : (
                   notices.map(n => (
                     <div key={n.id} className="bg-white p-10 rounded-[45px] shadow-xl border border-gray-100">
                       <div className="flex justify-between items-start mb-4">
                         <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${n.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                           {n.priority} Priority
                         </span>
                         <span className="text-[10px] font-black text-slate-400">{n.date}</span>
                       </div>
                       <h3 className="text-2xl font-black text-slate-800 mb-4">{n.title}</h3>
                       <p className="text-slate-600 font-bold leading-relaxed whitespace-pre-line">{n.content}</p>
                     </div>
                   ))
                 )}
               </div>
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="space-y-10 animate-in fade-in duration-500">
               <h2 className="text-3xl font-black text-slate-800">সংগঠনের কার্যক্রম</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {activities.length === 0 ? (
                   <div className="col-span-full text-slate-400 font-bold text-center py-20 bg-white rounded-3xl">কোন কার্যক্রম রেকর্ড নেই।</div>
                 ) : (
                   activities.map(act => (
                     <div key={act.id} className="bg-white rounded-[45px] overflow-hidden shadow-xl border border-gray-100 group">
                       {act.image && <img src={act.image} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" alt={act.title} />}
                       <div className="p-8">
                         <div className="flex justify-between items-center mb-4">
                           <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{act.date}</span>
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{act.location}</span>
                         </div>
                         <h3 className="text-xl font-black text-slate-800 mb-2">{act.title}</h3>
                         <p className="text-slate-500 font-bold text-sm line-clamp-3">{act.description}</p>
                       </div>
                     </div>
                   ))
                 )}
               </div>
            </div>
          )}

          {activeTab === 'profile' && (<div className="space-y-10"><h2 className="text-3xl font-black text-slate-800">আমার প্রোফাইল</h2><div className="bg-white p-12 rounded-[45px] shadow-xl border border-gray-100"><div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10"><div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">পূর্ণ নাম</label><div className="bg-slate-50 px-8 py-4 rounded-3xl font-black text-slate-800 text-lg">{currentUser.name}</div></div><div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">রোল ও পদবি</label><div className="bg-emerald-50 px-8 py-4 rounded-3xl font-black text-emerald-800 text-lg uppercase">{currentUser.position || 'সদস্য'}</div></div><div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ইমেইল</label><div className="bg-slate-50 px-8 py-4 rounded-3xl font-black text-slate-800 text-lg">{currentUser.email}</div></div><div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">মোবাইল</label><div className="bg-slate-50 px-8 py-4 rounded-3xl font-black text-slate-800 text-lg">{currentUser.phone || 'যুক্ত করা হয়নি'}</div></div></div></div></div>)}
        </main>
      </div>
    </div>
  );
};

export default MemberDashboard;
