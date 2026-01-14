
import React from 'react';
import { Link } from 'react-router-dom';
import { ORG_DETAILS } from '../constants';

const Home: React.FC = () => {
  // Simplified Activities for Home as requested
  const recentActivities = [
    {
      title: "বৃক্ষ রোপণ",
      desc: "", // Removed detailed description
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop",
      date: "২০ ফেব্রুয়ারি ২০২৫"
    },
    {
      title: "কম্বল বিতরণ",
      desc: "", // Removed detailed description
      image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1000&auto=format&fit=crop",
      date: "১৫ জানুয়ারি ২০২৫"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-[#064e3b] text-white pt-24 pb-40 px-4 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-400 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-400 rounded-full filter blur-3xl"></div>
        </div>

        <div className="container mx-auto relative z-10 text-center flex flex-col items-center">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-emerald-400 mb-2 tracking-widest">
              {ORG_DETAILS.slogan}
            </h2>
            <div className="w-24 h-1 bg-emerald-700 mx-auto rounded-full"></div>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-10 tracking-tighter leading-tight drop-shadow-2xl">
            {ORG_DETAILS.nameBn}
          </h1>
          
          <div className="bg-emerald-950/40 backdrop-blur-md border border-emerald-800/50 px-6 py-2 rounded-full flex items-center gap-2 mb-12 text-sm text-emerald-200">
            <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span>{ORG_DETAILS.headOffice} • স্থাপিত: ২০২৫</span>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <Link to="/activities" className="bg-[#10b981] hover:bg-[#059669] text-white px-10 py-4 rounded-full text-lg font-black transition flex items-center gap-2 shadow-xl shadow-emerald-950/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              সাম্প্রতিক কার্যক্রম
            </Link>
            <Link to="/login" className="bg-white text-emerald-900 hover:bg-gray-100 px-10 py-4 rounded-full text-lg font-black transition flex items-center gap-2 shadow-xl shadow-emerald-950/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              সদস্য লগইন
            </Link>
          </div>

          <Link to="/register" className="text-emerald-300 font-bold hover:text-white transition flex items-center gap-1 text-sm underline-offset-4 decoration-emerald-700 underline">
            নতুন সদস্য পদপ্রার্থী হিসেবে যুক্ত হোন 
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </Link>
        </div>
      </section>

      {/* Vision & Stats Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block bg-emerald-50 text-emerald-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
            আমাদের দর্শন
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-6">সুন্দর আগামীর জন্য ঐক্যবদ্ধ প্রচেষ্টা</h2>
          <div className="w-20 h-1.5 bg-emerald-500 mx-auto rounded-full mb-16"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left max-w-6xl mx-auto">
            <div className="bg-gray-50/50 p-8 rounded-[40px] border border-gray-100 group hover:bg-white hover:shadow-2xl transition-all duration-500">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg></div>
              <h3 className="text-xl font-black text-slate-800 mb-2">পরিবেশ রক্ষা</h3>
              <p className="text-slate-500 font-bold text-sm leading-relaxed">প্রকৃতি রক্ষায় বৃক্ষরোপণ ও সচেতনতা।</p>
            </div>
            <div className="bg-gray-50/50 p-8 rounded-[40px] border border-gray-100 group hover:bg-white hover:shadow-2xl transition-all duration-500">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg></div>
              <h3 className="text-xl font-black text-slate-800 mb-2">শিক্ষা সহায়তা</h3>
              <p className="text-slate-500 font-bold text-sm leading-relaxed">দরিদ্র শিক্ষার্থীদের উপকরণ সহায়তা।</p>
            </div>
            <div className="bg-gray-50/50 p-8 rounded-[40px] border border-gray-100 group hover:bg-white hover:shadow-2xl transition-all duration-500">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg></div>
              <h3 className="text-xl font-black text-slate-800 mb-2">স্বাস্থ্য সেবা</h3>
              <p className="text-slate-500 font-bold text-sm leading-relaxed">রক্তদান ও ফ্রি স্বাস্থ্য ক্যাম্প।</p>
            </div>
            <div className="bg-gray-50/50 p-8 rounded-[40px] border border-gray-100 group hover:bg-white hover:shadow-2xl transition-all duration-500">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg></div>
              <h3 className="text-xl font-black text-slate-800 mb-2">সামাজিক উন্নয়ন</h3>
              <p className="text-slate-500 font-bold text-sm leading-relaxed">অবহেলিত মানুষের জীবনমান উন্নয়ন।</p>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-24 bg-gray-50/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-16">
            <div className="text-left">
              <div className="inline-block bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                আমাদের কাজ
              </div>
              <h2 className="text-4xl font-black text-slate-800">সাম্প্রতিক কার্যক্রম</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {recentActivities.map((act, idx) => (
              <div key={idx} className="bg-white rounded-[40px] overflow-hidden shadow-xl border border-gray-100 group hover:-translate-y-2 transition-all duration-500">
                <div className="h-64 overflow-hidden relative">
                  <img src={act.image} alt={act.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-emerald-800 uppercase tracking-widest">
                    {act.date}
                  </div>
                </div>
                <div className="p-8 text-center">
                  <h3 className="text-2xl font-black text-slate-800 group-hover:text-emerald-700 transition-colors">{act.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA Section (Updated) */}
      <section className="py-32 bg-emerald-50 relative overflow-hidden">
        {/* Subtle Background Icon */}
        <div className="absolute -bottom-20 -right-20 opacity-5 pointer-events-none">
          <svg className="w-96 h-96 text-emerald-900" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path></svg>
        </div>

        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto bg-white p-12 md:p-20 rounded-[60px] shadow-2xl shadow-emerald-900/10 border border-emerald-100 relative z-10">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-inner">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-8 leading-tight">আমাদের সংগঠনের সাথে যুক্ত হতে চান?</h2>
            <p className="text-slate-500 font-bold text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              মানবতার বন্ধনে যোগ দিয়ে সমাজের পিছিয়ে পড়া মানুষের জন্য কাজ শুরু করুন আজই।
            </p>
            
            <div className="flex flex-col items-center gap-6">
              {/* Removed 'Member Login' button as requested */}
              <Link to="/register" className="inline-block bg-[#064e3b] text-white px-14 py-5 rounded-[25px] text-xl font-black hover:bg-emerald-900 transition-all shadow-xl shadow-emerald-900/20 active:scale-95 flex items-center gap-3 group">
                <span>সদস্য হিসেবে যুক্ত হোন</span>
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </Link>
              
              <div className="mt-4">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Registration Now • Member Application</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
