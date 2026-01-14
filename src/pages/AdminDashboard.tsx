
import React, { useState, useEffect } from 'react';
import { User, Donation, FundTransaction, Notice, Activity, UserMessage } from '../types';

interface AdminDashboardProps {
  user: User;
}

const POSITIONS = [
  "সদস্য", "সভাপতি", "সহ-সভাপতি", "সাধারণ সম্পাদক", "সহ-সাধারণ সম্পাদক", "সাংগঠনিক সম্পাদক", "সহ-সাংগঠনিক সম্পাদক",
  "অর্থ সম্পাদক", "দপ্তর সম্পাদক", "প্রচার সম্পাদক", "সমাজ কল্যাণ সম্পাদক", "ক্রীড়া ও সাংস্কৃতিক সম্পাদক",
  "ধর্ম বিষয়ক সম্পাদক", "নির্বাহী সদস্য", "উপদেষ্টা", "অন্যান্য"
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [activeMenu, setActiveMenu] = useState<'overview' | 'members' | 'donations' | 'fund' | 'notices' | 'activities'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [ledger, setLedger] = useState<FundTransaction[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [reviewingUser, setReviewingUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const [stats, setStats] = useState({
    totalFund: 0, pendingUsers: 0, pendingDonations: 0, totalMembers: 0
  });

  // State for forms (Edit/Add)
  const [newTx, setNewTx] = useState({ id: '', type: 'Income' as 'Income' | 'Expense', category: '', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
  const [newNotice, setNewNotice] = useState({ id: '', title: '', content: '', priority: 'Normal' as 'Normal' | 'High' });
  const [newActivity, setNewActivity] = useState<Activity>({ id: '', title: '', description: '', image: '', date: new Date().toISOString().split('T')[0], location: '' });

  const loadAllData = () => {
    const storedUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
    const storedDonations = JSON.parse(localStorage.getItem('mock_donations') || '[]');
    const storedLedger = JSON.parse(localStorage.getItem('fund_ledger') || '[]');
    const storedNotices = JSON.parse(localStorage.getItem('mock_notices') || '[]');
    const storedActivities = JSON.parse(localStorage.getItem('mock_activities') || '[]');

    setUsers(storedUsers);
    setDonations(storedDonations);
    setLedger(storedLedger);
    setNotices(storedNotices);
    setActivities(storedActivities);

    const approvedDonationSum = storedDonations
      .filter((d: Donation) => d.status === 'Approved')
      .reduce((acc: number, curr: Donation) => acc + Number(curr.amount), 0);
    
    const ledgerIncome = storedLedger
      .filter((t: FundTransaction) => t.type === 'Income')
      .reduce((acc: number, curr: FundTransaction) => acc + Number(curr.amount), 0);
    
    const ledgerExpense = storedLedger
      .filter((t: FundTransaction) => t.type === 'Expense')
      .reduce((acc: number, curr: FundTransaction) => acc + Number(curr.amount), 0);

    setStats({
      totalFund: (approvedDonationSum + ledgerIncome) - ledgerExpense,
      pendingUsers: storedUsers.filter((u: User) => u.status === 'Pending').length,
      pendingDonations: storedDonations.filter((d: Donation) => d.status === 'Pending').length,
      totalMembers: storedUsers.filter((u: User) => u.status === 'Approved').length
    });
  };

  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadAllData, 3000);
    return () => clearInterval(interval);
  }, []);

  const saveAndRefresh = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
    loadAllData();
  };

  // --- MEMBER ACTIONS ---
  const handleMemberStatusUpdate = (decision: 'Approved' | 'Rejected') => {
    if (!reviewingUser) return;
    const currentUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
    const updated = currentUsers.map((u: User) => u.id === reviewingUser.id ? { ...u, ...reviewingUser, status: decision, approved: decision === 'Approved' } : u);
    saveAndRefresh('mock_users', updated);
    setReviewingUser(null);
  };

  const handleUpdateMemberInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingUser) return;
    const currentUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
    const updated = currentUsers.map((u: User) => u.id === reviewingUser.id ? reviewingUser : u);
    saveAndRefresh('mock_users', updated);
    setReviewingUser(null);
    alert('সদস্যের তথ্য আপডেট করা হয়েছে।');
  };

  const deleteUser = (id: string) => {
    if (window.confirm('এই সদস্যকে ডিলিট করতে চান?')) {
      const currentUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
      const updated = currentUsers.filter((u: User) => String(u.id) !== String(id));
      saveAndRefresh('mock_users', updated);
    }
  };

  const sendMessage = () => {
    if (!reviewingUser || !newMessage.trim()) return;
    const msg: UserMessage = { id: Date.now().toString(), text: newMessage, date: new Date().toLocaleString('bn-BD'), sender: 'Admin' };
    const updatedUser = { ...reviewingUser, messages: [...(reviewingUser.messages || []), msg] };
    const currentUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
    const updatedUsers = currentUsers.map((u: User) => u.id === reviewingUser.id ? updatedUser : u);
    saveAndRefresh('mock_users', updatedUsers);
    setNewMessage('');
    setReviewingUser(updatedUser);
  };

  // --- DONATION ACTIONS ---
  const handleDonationVerify = (id: string, status: 'Approved' | 'Rejected') => {
    const currentDonations = JSON.parse(localStorage.getItem('mock_donations') || '[]');
    const updatedDonations = currentDonations.map((d: Donation) => d.id === id ? { ...d, status } : d);
    saveAndRefresh('mock_donations', updatedDonations);
  };

  const deleteDonation = (id: string) => {
    if (window.confirm('পেমেন্ট রেকর্ডটি ডিলিট করতে চান?')) {
      const currentDonations = JSON.parse(localStorage.getItem('mock_donations') || '[]');
      const updated = currentDonations.filter((d: Donation) => String(d.id) !== String(id));
      saveAndRefresh('mock_donations', updated);
    }
  };

  // --- FUND ACTIONS ---
  const handleFundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentLedger = JSON.parse(localStorage.getItem('fund_ledger') || '[]');
    const txData: FundTransaction = { id: newTx.id || 'tx-' + Date.now(), type: newTx.type, category: newTx.category, amount: Number(newTx.amount), description: newTx.description, date: newTx.date };
    let updatedLedger = newTx.id ? currentLedger.map((t: FundTransaction) => t.id === newTx.id ? txData : t) : [txData, ...currentLedger];
    saveAndRefresh('fund_ledger', updatedLedger);
    setNewTx({ id: '', type: 'Income', category: '', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
  };

  const deleteTx = (id: string) => {
    if (window.confirm('লেনদেনটি ডিলিট করতে চান?')) {
      const currentLedger = JSON.parse(localStorage.getItem('fund_ledger') || '[]');
      const updated = currentLedger.filter((t: FundTransaction) => String(t.id) !== String(id));
      saveAndRefresh('fund_ledger', updated);
    }
  };

  const editTx = (tx: FundTransaction) => {
    setNewTx({ ...tx, amount: tx.amount.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- NOTICE ACTIONS ---
  const handleNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentNotices = JSON.parse(localStorage.getItem('mock_notices') || '[]');
    const noticeData: Notice = { id: newNotice.id || 'n-' + Date.now(), title: newNotice.title, content: newNotice.content, priority: newNotice.priority, date: new Date().toLocaleDateString('bn-BD') };
    let updated = newNotice.id ? currentNotices.map((n: Notice) => n.id === newNotice.id ? noticeData : n) : [noticeData, ...currentNotices];
    saveAndRefresh('mock_notices', updated);
    setNewNotice({ id: '', title: '', content: '', priority: 'Normal' });
  };

  const deleteNotice = (id: string) => {
    if (window.confirm('নোটিশটি ডিলিট করতে চান?')) {
      const currentNotices = JSON.parse(localStorage.getItem('mock_notices') || '[]');
      const updated = currentNotices.filter((n: Notice) => String(n.id) !== String(id));
      saveAndRefresh('mock_notices', updated);
    }
  };

  const editNotice = (n: Notice) => {
    setNewNotice(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- ACTIVITY ACTIONS ---
  const handleActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentActivities = JSON.parse(localStorage.getItem('mock_activities') || '[]');
    const actData: Activity = { id: newActivity.id || 'act-' + Date.now(), ...newActivity };
    let updated = newActivity.id ? currentActivities.map((a: Activity) => a.id === newActivity.id ? actData : a) : [actData, ...currentActivities];
    saveAndRefresh('mock_activities', updated);
    setNewActivity({ id: '', title: '', description: '', image: '', date: new Date().toISOString().split('T')[0], location: '' });
    alert('কার্যক্রম সফলভাবে পাবলিশ/আপডেট হয়েছে।');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewActivity({ ...newActivity, image: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const deleteActivity = (id: string) => {
    if (window.confirm('কার্যক্রমটি ডিলিট করতে চান?')) {
      const currentActivities = JSON.parse(localStorage.getItem('mock_activities') || '[]');
      const updated = currentActivities.filter((a: Activity) => String(a.id) !== String(id));
      saveAndRefresh('mock_activities', updated);
    }
  };

  const editActivity = (act: Activity) => {
    setNewActivity(act);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.phone?.includes(searchQuery));

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Member Edit Modal */}
      {reviewingUser && (
        <div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row h-auto max-h-[90vh]">
            <div className="md:w-3/5 p-8 overflow-y-auto border-r border-slate-100">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black text-emerald-900 uppercase tracking-widest">সদস্য প্রোফাইল ও এডিট</h3>
                  <button onClick={() => setReviewingUser(null)} className="text-slate-300 hover:text-red-500 transition-colors">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
               </div>
               
               <form onSubmit={handleUpdateMemberInfo} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><label className="text-[10px] font-black uppercase text-slate-400">নাম</label><input type="text" value={reviewingUser.name} onChange={e => setReviewingUser({...reviewingUser, name: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl font-bold" /></div>
                      <div><label className="text-[10px] font-black uppercase text-slate-400">পাসওয়ার্ড</label><input type="text" value={reviewingUser.password || ''} onChange={e => setReviewingUser({...reviewingUser, password: e.target.value})} className="w-full bg-rose-50 border p-3 rounded-xl font-black text-rose-800" /></div>
                      <div><label className="text-[10px] font-black uppercase text-slate-400">পদবি</label>
                        <select value={reviewingUser.position || 'সদস্য'} onChange={e => setReviewingUser({...reviewingUser, position: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl font-bold">
                          {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                      <div><label className="text-[10px] font-black uppercase text-slate-400">ফোন</label><input type="text" value={reviewingUser.phone || ''} onChange={e => setReviewingUser({...reviewingUser, phone: e.target.value})} className="w-full bg-slate-50 border p-3 rounded-xl font-bold" /></div>
                      <div><label className="text-[10px] font-black uppercase text-slate-400">মাসিক চাঁদা</label><input type="number" value={reviewingUser.monthly_amount} onChange={e => setReviewingUser({...reviewingUser, monthly_amount: Number(e.target.value)})} className="w-full bg-white border-emerald-200 border p-3 rounded-xl font-black text-emerald-800" /></div>
                  </div>
                  <div className="flex gap-4">
                    {reviewingUser.status === 'Pending' ? (
                      <>
                        <button type="button" onClick={() => handleMemberStatusUpdate('Approved')} className="flex-grow bg-emerald-600 text-white py-3 rounded-xl font-black">অনুমোদন</button>
                        <button type="button" onClick={() => handleMemberStatusUpdate('Rejected')} className="flex-grow bg-rose-600 text-white py-3 rounded-xl font-black">বাতিল</button>
                      </>
                    ) : (
                      <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-black">আপডেট সেভ করুন</button>
                    )}
                  </div>
               </form>
            </div>
            <div className="md:w-2/5 bg-slate-50 p-8 flex flex-col">
               <h3 className="text-lg font-black text-slate-800 mb-6">অ্যাডমিন মেসেজ</h3>
               <div className="flex-grow overflow-y-auto space-y-3 mb-4">
                  {(reviewingUser.messages || []).map(m => (
                    <div key={m.id} className="bg-white p-3 rounded-xl shadow-sm border text-xs">
                      <p className="font-bold text-slate-700">{m.text}</p>
                      <div className="mt-2 text-[8px] text-slate-400 text-right uppercase font-black">{m.date}</div>
                    </div>
                  ))}
               </div>
               <div className="flex gap-2">
                  <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="মেসেজ লিখুন..." className="flex-grow p-3 rounded-xl border font-bold text-xs" />
                  <button onClick={sendMessage} className="bg-emerald-600 text-white px-4 py-3 rounded-xl font-black text-xs">পাঠান</button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="lg:w-72 bg-[#064e3b] text-white p-6 lg:sticky lg:top-0 lg:h-screen flex flex-col">
        <div className="mb-10 text-center">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center font-black text-2xl mx-auto mb-4 border border-white/20">ম</div>
          <h2 className="text-xl font-black tracking-tighter">অ্যাডমিন প্যানেল</h2>
        </div>
        <nav className="space-y-2 flex-grow">
          {[
            { id: 'overview', label: 'ওভারভিউ', icon: '📊' },
            { id: 'members', label: 'সদস্য ব্যবস্থাপনা', icon: '👥' },
            { id: 'donations', label: 'পেমেন্ট যাচাই', icon: '💰' },
            { id: 'fund', label: 'তহবিল ও লেনদেন', icon: '🏛️' },
            { id: 'notices', label: 'নোটিশ বোর্ড', icon: '📢' },
            { id: 'activities', label: 'কার্যক্রম', icon: '📝' }
          ].map(m => (
            <button key={m.id} onClick={() => setActiveMenu(m.id as any)} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold transition-all ${activeMenu === m.id ? 'bg-white text-emerald-900 shadow-xl' : 'text-emerald-100/60 hover:bg-white/5 hover:text-white'}`}>
              <span>{m.icon}</span> {m.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 overflow-y-auto">
        {activeMenu === 'overview' && (
          <div className="space-y-10 animate-in fade-in">
            <h1 className="text-3xl font-black text-slate-800">ওভারভিউ স্ট্যাটস</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-emerald-800 p-8 rounded-[35px] text-white shadow-xl relative overflow-hidden">
                <span className="text-[10px] font-black uppercase opacity-60">মোট বর্তমান তহবিল</span>
                <div className="text-3xl font-black mt-2">৳{stats.totalFund.toLocaleString()}</div>
              </div>
              <div className="bg-white p-8 rounded-[35px] shadow-sm border border-gray-100">
                <span className="text-[10px] font-black uppercase text-slate-400">পেন্ডিং আবেদন</span>
                <div className="text-3xl font-black text-amber-500 mt-2">{stats.pendingUsers}</div>
              </div>
              <div className="bg-white p-8 rounded-[35px] shadow-sm border border-gray-100">
                <span className="text-[10px] font-black uppercase text-slate-400">পেন্ডিং পেমেন্ট</span>
                <div className="text-3xl font-black text-blue-500 mt-2">{stats.pendingDonations}</div>
              </div>
              <div className="bg-white p-8 rounded-[35px] shadow-sm border border-gray-100">
                <span className="text-[10px] font-black uppercase text-slate-400">মোট সদস্য</span>
                <div className="text-3xl font-black text-slate-800 mt-2">{stats.totalMembers}</div>
              </div>
            </div>
          </div>
        )}

        {activeMenu === 'members' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-800">সদস্য ব্যবস্থাপনা</h2>
              <input type="text" placeholder="নাম বা ফোন দিয়ে খুঁজুন..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-white border px-4 py-2.5 rounded-xl font-bold text-sm w-64 shadow-sm outline-none" />
            </div>
            <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b">
                  <tr><th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">সদস্য</th><th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">অবস্থা</th><th className="px-6 py-4 text-right text-[10px] font-black uppercase text-slate-400">অ্যাকশন</th></tr>
                </thead>
                <tbody className="divide-y font-bold">
                  {filteredUsers.map(u => (
                    <tr key={u.id}>
                      <td className="px-6 py-4">
                        <div className="text-slate-800">{u.name}</div>
                        <div className="text-[10px] text-slate-400 uppercase">{u.position || 'সদস্য'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[9px] uppercase font-black ${u.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{u.status}</span>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <button type="button" onClick={() => setReviewingUser({...u})} className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase">এডিট</button>
                        <button type="button" onClick={() => deleteUser(u.id)} className="bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase">ডিলিট</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeMenu === 'donations' && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-2xl font-black text-slate-800">পেমেন্ট যাচাই</h2>
            <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
              <table className="w-full text-left font-bold text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr><th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">সদস্য</th><th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">পরিমাণ</th><th className="px-6 py-4 text-right text-[10px] font-black uppercase text-slate-400">অ্যাকশন</th></tr>
                </thead>
                <tbody className="divide-y">
                  {donations.map(d => (
                    <tr key={d.id}>
                      <td className="px-6 py-4"><div className="text-slate-800">{d.user_name}</div><div className="text-[9px] text-slate-400 uppercase">{d.trx_id}</div></td>
                      <td className="px-6 py-4 font-black">৳{d.amount}</td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        {d.screenshot && <button type="button" onClick={() => setSelectedScreenshot(d.screenshot!)} className="bg-slate-100 px-2 py-1 rounded text-[9px] font-black uppercase">প্রুফ</button>}
                        {d.status === 'Pending' ? (
                          <>
                            <button type="button" onClick={() => handleDonationVerify(d.id, 'Approved')} className="bg-emerald-600 text-white px-3 py-1 rounded text-[9px] font-black">Verify</button>
                            <button type="button" onClick={() => handleDonationVerify(d.id, 'Rejected')} className="bg-rose-600 text-white px-3 py-1 rounded text-[9px] font-black">Cancel</button>
                          </>
                        ) : <span className="text-[9px] uppercase font-black text-slate-400">{d.status}</span>}
                        <button type="button" onClick={() => deleteDonation(d.id)} className="text-rose-600 p-1 hover:bg-rose-50 rounded-lg transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeMenu === 'fund' && (
          <div className="space-y-8 animate-in fade-in">
            <h2 className="text-2xl font-black text-slate-800">{newTx.id ? 'লেনদেন এডিট করুন' : 'তহবিল ও লেনদেন হিসাব'}</h2>
            <div className="bg-white p-8 rounded-3xl border shadow-sm">
              <form onSubmit={handleFundSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select value={newTx.type} onChange={e => setNewTx({...newTx, type: e.target.value as any})} className="p-3 bg-slate-50 border rounded-xl font-bold"><option value="Income">আয় (Income)</option><option value="Expense">ব্যয় (Expense)</option></select>
                <input type="text" placeholder="ক্যাটাগরি" required value={newTx.category} onChange={e => setNewTx({...newTx, category: e.target.value})} className="p-3 bg-slate-50 border rounded-xl font-bold" />
                <input type="number" placeholder="পরিমাণ" required value={newTx.amount} onChange={e => setNewTx({...newTx, amount: e.target.value})} className="p-3 bg-slate-50 border rounded-xl font-bold" />
                <input type="text" placeholder="বিবরণ" required value={newTx.description} onChange={e => setNewTx({...newTx, description: e.target.value})} className="md:col-span-2 p-3 bg-slate-50 border rounded-xl font-bold" />
                <div className="flex gap-2">
                  <button type="submit" className="flex-grow bg-emerald-600 text-white p-3 rounded-xl font-black">{newTx.id ? 'আপডেট সেভ' : 'যুক্ত করুন'}</button>
                  {newTx.id && <button type="button" onClick={() => setNewTx({ id: '', type: 'Income', category: '', amount: '', description: '', date: new Date().toISOString().split('T')[0] })} className="bg-slate-200 px-4 rounded-xl font-black">✕</button>}
                </div>
              </form>
            </div>
            <div className="bg-white rounded-3xl border overflow-hidden">
              <table className="w-full text-left font-bold text-sm">
                <thead className="bg-slate-50"><tr><th className="px-6 py-4">বিবরণ</th><th className="px-6 py-4">টাইপ</th><th className="px-6 py-4 text-right">পরিমাণ</th><th className="px-6 py-4 text-right">অ্যাকশন</th></tr></thead>
                <tbody className="divide-y">
                  {ledger.map(t => (
                    <tr key={t.id}>
                      <td className="px-6 py-4"><div>{t.description}</div><div className="text-[10px] text-slate-400 font-black uppercase">{t.category} • {t.date}</div></td>
                      <td className="px-6 py-4"><span className={`px-2 py-0.5 rounded text-[9px] uppercase font-black ${t.type === 'Income' ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}>{t.type}</span></td>
                      <td className={`px-6 py-4 text-right font-black ${t.type === 'Income' ? 'text-emerald-700' : 'text-rose-700'}`}>৳{t.amount}</td>
                      <td className="px-6 py-4 text-right flex justify-end gap-3">
                        <button type="button" onClick={() => editTx(t)} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-lg transition-colors">✎</button>
                        <button type="button" onClick={() => deleteTx(t.id)} className="text-rose-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeMenu === 'notices' && (
          <div className="space-y-8 animate-in fade-in">
            <h2 className="text-2xl font-black text-slate-800">{newNotice.id ? 'নোটিশ এডিট করুন' : 'নোটিশ বোর্ড ব্যবস্থাপনা'}</h2>
            <form onSubmit={handleNoticeSubmit} className="bg-white p-8 rounded-3xl border shadow-sm space-y-4">
              <input type="text" placeholder="নোটিশ টাইটেল" required value={newNotice.title} onChange={e => setNewNotice({...newNotice, title: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl font-bold" />
              <textarea placeholder="নোটিশ বিষয়বস্তু..." required value={newNotice.content} onChange={e => setNewNotice({...newNotice, content: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl font-bold h-32"></textarea>
              <div className="flex gap-4">
                <select value={newNotice.priority} onChange={e => setNewNotice({...newNotice, priority: e.target.value as any})} className="p-3 bg-slate-50 border rounded-xl font-bold"><option value="Normal">সাধারন (Normal)</option><option value="High">জরুরি (High)</option></select>
                <div className="flex-grow flex gap-2">
                  <button type="submit" className="flex-grow bg-slate-900 text-white p-3 rounded-xl font-black">{newNotice.id ? 'আপডেট করুন' : 'পাবলিশ করুন'}</button>
                  {newNotice.id && <button type="button" onClick={() => setNewNotice({ id: '', title: '', content: '', priority: 'Normal' })} className="bg-slate-200 px-6 rounded-xl font-black">বাতিল</button>}
                </div>
              </div>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notices.map(n => (
                <div key={n.id} className="bg-white p-6 rounded-3xl border shadow-sm relative group">
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" onClick={() => editNotice(n)} className="bg-white p-1.5 rounded border shadow text-blue-600 hover:bg-blue-50">✎</button>
                    <button type="button" onClick={() => deleteNotice(n.id)} className="bg-white p-1.5 rounded border shadow text-red-600 hover:bg-red-50">✕</button>
                  </div>
                  <div className={`text-[8px] font-black uppercase mb-2 ${n.priority === 'High' ? 'text-red-600' : 'text-emerald-600'}`}>{n.priority} Priority • {n.date}</div>
                  <h3 className="font-black text-slate-800 mb-2">{n.title}</h3>
                  <p className="text-xs text-slate-500 font-bold line-clamp-3">{n.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeMenu === 'activities' && (
          <div className="space-y-8 animate-in fade-in">
            <h2 className="text-2xl font-black text-slate-800">{newActivity.id ? 'কার্যক্রম এডিট করুন' : 'কার্যক্রম ব্যবস্থাপনা'}</h2>
            <form onSubmit={handleActivitySubmit} className="bg-white p-8 rounded-3xl border shadow-sm space-y-4">
              <input type="text" placeholder="কার্যক্রমের শিরোনাম" required value={newActivity.title} onChange={e => setNewActivity({...newActivity, title: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl font-bold" />
              <textarea placeholder="বিস্তারিত..." required value={newActivity.description} onChange={e => setNewActivity({...newActivity, description: e.target.value})} className="w-full p-3 bg-slate-50 border rounded-xl font-bold h-24"></textarea>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><input type="text" placeholder="অবস্থান" value={newActivity.location} onChange={e => setNewActivity({...newActivity, location: e.target.value})} className="p-3 bg-slate-50 border rounded-xl font-bold" /><input type="date" value={newActivity.date} onChange={e => setNewActivity({...newActivity, date: e.target.value})} className="p-3 bg-slate-50 border rounded-xl font-bold" /></div>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer bg-slate-50 border p-4 rounded-xl flex-grow text-center font-black text-xs uppercase text-slate-500">ছবি আপলোড করুন<input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" /></label>
                {newActivity.image && <img src={newActivity.image} className="w-20 h-16 object-cover rounded-xl border" />}
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-grow bg-emerald-600 text-white p-4 rounded-xl font-black">{newActivity.id ? 'আপডেট সেভ করুন' : 'নতুন পোস্ট করুন'}</button>
                {newActivity.id && <button type="button" onClick={() => setNewActivity({ id: '', title: '', description: '', image: '', date: new Date().toISOString().split('T')[0], location: '' })} className="bg-slate-200 px-8 rounded-xl font-black">বাতিল</button>}
              </div>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activities.map(act => (
                <div key={act.id} className="bg-white p-4 rounded-3xl border shadow-sm group relative">
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" onClick={() => editActivity(act)} className="bg-white p-1.5 rounded border shadow text-blue-600 hover:bg-blue-50">✎</button>
                    <button type="button" onClick={() => deleteActivity(act.id)} className="bg-white p-1.5 rounded border shadow text-red-600 hover:bg-red-50">✕</button>
                  </div>
                  {act.image && <img src={act.image} className="w-full h-32 object-cover rounded-2xl mb-3 shadow-sm" />}
                  <div className="text-[8px] font-black text-emerald-600 uppercase mb-1">{act.date}</div>
                  <h4 className="font-black text-slate-800 text-sm">{act.title}</h4>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {selectedScreenshot && (
        <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4" onClick={() => setSelectedScreenshot(null)}><img src={selectedScreenshot} className="max-w-full max-h-full rounded-2xl shadow-2xl border-4 border-white/20" alt="Proof" /></div>
      )}
    </div>
  );
};

export default AdminDashboard;
