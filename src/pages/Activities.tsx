
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity } from '../types';

const Activities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const storedActivities = localStorage.getItem('mock_activities');
    if (storedActivities) {
      setActivities(JSON.parse(storedActivities));
    } else {
      // Default placeholder data if empty
      const defaultActs: Activity[] = [
        {
          id: '1',
          title: "বৃক্ষ রোপণ",
          description: "প্রকৃতি রক্ষায় আমাদের নিয়মিত বৃক্ষরোপণ কর্মসূচি। পরিবেশের ভারসাম্য রক্ষায় আমরা প্রতি বছর বিপুল সংখ্যক চারাগাছ রোপণ করে থাকি।",
          image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop",
          date: "২০ ফেব্রুয়ারি ২০২৫",
          location: "গাইবান্ধা সরকারি কলেজ"
        },
        {
          id: '2',
          title: "কম্বল বিতরণ",
          description: "শীতার্ত মানুষের মাঝে উষ্ণতা পৌঁছে দিতে আমাদের এই ক্ষুদ্র প্রচেষ্টা। উত্তরবঙ্গের হাড়কাঁপানো শীতে অসহায় মানুষের পাশে থাকাই আমাদের লক্ষ্য।",
          image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1000&auto=format&fit=crop",
          date: "১৫ জানুয়ারি ২০২৫",
          location: "তালুক জামিরা, পলাশবাড়ী"
        }
      ];
      setActivities(defaultActs);
      localStorage.setItem('mock_activities', JSON.stringify(defaultActs));
    }
  }, []);

  return (
    <div className="min-h-screen bg-white pb-24">
      <section className="bg-emerald-900 text-white py-24 px-4 text-center relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">সাম্প্রতিক কার্যক্রম ও গ্যালারি</h1>
          <div className="w-24 h-2 bg-emerald-500 mx-auto rounded-full mb-8"></div>
          <p className="text-emerald-100 text-lg md:text-xl font-bold opacity-80 max-w-2xl mx-auto leading-relaxed">
            সংগঠনের প্রতিটি পদক্ষেপ আমাদের দায়িত্ববোধের পরিচয়। মানবতার সেবায় আমাদের কিছু মুহূর্ত এখানে তুলে ধরা হলো।
          </p>
        </div>
      </section>

      <section className="py-24 container mx-auto px-4">
        {activities.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-slate-300 mb-4">
              <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <p className="text-slate-400 font-black text-xl">বর্তমানে কোন কার্যক্রম প্রদর্শনের জন্য নেই</p>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-24">
            {activities.map((act, index) => (
              <div key={act.id} className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center group animate-in fade-in slide-in-from-bottom-8 duration-700`}>
                <div className="w-full md:w-1/2 relative">
                  <div className="absolute -inset-4 bg-emerald-50 rounded-[50px] -rotate-2 group-hover:rotate-0 transition-transform duration-500"></div>
                  <div className="relative h-96 w-full rounded-[45px] overflow-hidden shadow-2xl">
                    <img src={act.image || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000"} alt={act.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  </div>
                </div>
                <div className="w-full md:w-1/2 space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{act.date}</span>
                    <span className="text-slate-300 font-bold text-xs uppercase tracking-widest">{act.location}</span>
                  </div>
                  <h3 className="text-3xl font-black text-slate-800 tracking-tight group-hover:text-emerald-700 transition-colors">{act.title}</h3>
                  <p className="text-slate-500 font-bold text-lg leading-relaxed">{act.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="py-24 bg-slate-900 text-white text-center">
        <div className="container mx-auto px-4">
           <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl font-black tracking-tight">আপনিও আমাদের পাশে দাঁড়াতে পারেন</h2>
              <p className="text-slate-400 font-bold text-lg leading-relaxed">আপনার একটু সময় বা সামান্য শ্রম একজন মানুষের জীবন বদলে দিতে পারে। আমাদের এই পথচলায় আপনিও সঙ্গী হোন।</p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                 <Link to="/register" className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-full font-black text-lg transition-all shadow-xl shadow-emerald-950/40">সদস্য হতে আবেদন করুন</Link>
                 <Link to="/login" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-10 py-4 rounded-full font-black text-lg transition-all">সদস্য লগইন</Link>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Activities;
