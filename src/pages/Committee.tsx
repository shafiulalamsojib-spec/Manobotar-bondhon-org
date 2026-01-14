
import React from 'react';

const Committee: React.FC = () => {
  const committeeMembers = [
    { name: "শাফিউল আলম সজীব", position: "প্রতিষ্ঠাতা ও সভাপতি", type: "leader" },
    { name: "সামিউল আলীম সিফাত", position: "সাধারণ সম্পাদক", type: "secretary" },
    { name: "শাহরিয়ার সরদার", position: "সাংগঠনিক সম্পাদক", type: "secretary" },
    { name: "সাদিকুল ইসলাম", position: "সদস্য সচিব", type: "secretary" },
    { name: "পল্লব কুমার", position: "অর্থ সম্পাদক", type: "finance" },
    { name: "নাজমুল হাসান", position: "প্রচার সম্পাদক", type: "other" },
    { name: "আব্দুর রহমান মোন্নাত", position: "সমাজ কল্যাণ সম্পাদক", type: "other" },
  ];

  const advisors = [
    { name: "শাকিল রহমান", position: "উপদেষ্টা" },
    { name: "আসিফ মিয়া", position: "উপদেষ্টা" },
    { name: "ইয়াসির আরাফাত শান্ত", position: "উপদেষ্টা" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-emerald-900 text-white py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-400 rounded-full filter blur-3xl"></div>
        </div>
        <div className="container mx-auto relative z-10">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">কার্যকরী কমিটি</h1>
          <div className="w-20 h-1.5 bg-emerald-500 mx-auto rounded-full mb-6"></div>
          <p className="text-emerald-100 text-lg font-bold opacity-80 uppercase tracking-widest">Executive Committee • Manobotar Bondhon</p>
        </div>
      </section>

      {/* Main Committee Grid */}
      <section className="py-24 container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {committeeMembers.map((member, index) => (
            <div 
              key={index} 
              className={`group bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 text-center transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${index === 0 ? 'md:col-span-2 lg:col-span-3 xl:col-span-4 max-w-2xl mx-auto w-full' : ''}`}
            >
              <div className={`w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner ${index === 0 ? 'bg-emerald-100 text-emerald-700 w-32 h-32' : 'bg-slate-50 text-slate-400'}`}>
                <svg className={index === 0 ? "w-16 h-16" : "w-12 h-12"} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                </svg>
              </div>
              <h3 className={`font-black text-slate-800 mb-1 ${index === 0 ? 'text-3xl' : 'text-xl'}`}>{member.name}</h3>
              <p className={`font-bold uppercase tracking-widest ${index === 0 ? 'text-emerald-600 text-sm' : 'text-emerald-500 text-[10px]'}`}>{member.position}</p>
              
              {index === 0 && (
                <div className="mt-6 flex justify-center gap-4 opacity-50">
                  <div className="w-10 h-1 bg-emerald-100 rounded-full"></div>
                  <div className="w-10 h-1 bg-emerald-600 rounded-full"></div>
                  <div className="w-10 h-1 bg-emerald-100 rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Advisor Section */}
      <section className="py-24 bg-emerald-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">সম্মানিত উপদেষ্টা মন্ডলী</h2>
            <div className="w-16 h-1 bg-emerald-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {advisors.map((advisor, index) => (
              <div key={index} className="bg-white p-10 rounded-[45px] shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow duration-300">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-1.084A5 5 0 0010 11z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <h4 className="text-xl font-black text-slate-800 mb-1">{advisor.name}</h4>
                <p className="text-xs font-black text-emerald-500 uppercase tracking-widest">{advisor.position}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="py-20 container mx-auto px-4 text-center">
        <p className="text-slate-400 font-bold italic text-sm">
          "কমিটির সকল সিদ্ধান্ত সংগঠনের সংবিধান অনুযায়ী এবং মানবতার কল্যাণে গৃহীত হয়।"
        </p>
      </section>
    </div>
  );
};

export default Committee;
