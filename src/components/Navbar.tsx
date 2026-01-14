
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../types';
import { ORG_DETAILS } from '../constants';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lang, setLang] = useState<'BN' | 'EN'>('BN');
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const menuItems = [
    { name: lang === 'BN' ? 'হোম' : 'Home', path: '/', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg> },
    { name: lang === 'BN' ? 'সংগঠনের তহবিল' : 'Org Fund', path: '/fund', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> },
    { name: lang === 'BN' ? 'কমিটি' : 'Committee', path: '/committee', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg> },
    { name: lang === 'BN' ? 'সাম্প্রতিক কার্যক্রম' : 'Activities', path: '/activities', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg> },
  ];

  return (
    <>
      <div className="bg-emerald-900 text-white py-1.5 px-4">
        <div className="container mx-auto flex justify-end items-center gap-4 text-[10px] font-black tracking-widest uppercase">
          <button 
            onClick={() => setLang('BN')} 
            className={`transition-colors ${lang === 'BN' ? 'text-emerald-400' : 'text-emerald-100/50 hover:text-white'}`}
          >
            Bangla
          </button>
          <div className="w-px h-3 bg-emerald-800"></div>
          <button 
            onClick={() => setLang('EN')} 
            className={`transition-colors ${lang === 'EN' ? 'text-emerald-400' : 'text-emerald-100/50 hover:text-white'}`}
          >
            English
          </button>
        </div>
      </div>

      <nav className="bg-white text-gray-800 shadow-sm sticky top-0 z-50 py-3 border-b border-gray-100">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleMenu}
              className="p-2 hover:bg-emerald-50 rounded-xl transition-colors text-emerald-800"
              aria-label="Toggle Menu"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>

            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
                ম
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-emerald-900 leading-none">
                  {lang === 'BN' ? ORG_DETAILS.nameBn : ORG_DETAILS.nameEn}
                </span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {menuItems.map(item => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition ${isActive(item.path) ? 'bg-emerald-50 text-emerald-700' : 'hover:text-emerald-600'}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {!user ? (
              <>
                <Link to="/login" className="hidden sm:block text-gray-600 hover:text-emerald-600 text-sm font-bold px-3">
                  {lang === 'BN' ? 'লগইন' : 'Login'}
                </Link>
                <Link to="/login" className="bg-emerald-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-200">
                  {lang === 'BN' ? 'সদস্য লগইন' : 'Member Login'}
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  to={user.role === 'Admin' ? '/admin/dashboard' : '/member/dashboard'} 
                  className="bg-emerald-600 hover:bg-emerald-700 px-4 py-1.5 rounded-lg text-white text-sm font-bold transition shadow-md"
                >
                  {lang === 'BN' ? 'ড্যাশবোর্ড' : 'Dashboard'}
                </Link>
                <button 
                  onClick={onLogout}
                  className="text-gray-500 hover:text-red-600 text-sm font-bold hidden sm:block"
                >
                  {lang === 'BN' ? 'লগআউট' : 'Logout'}
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div 
        className={`fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleMenu}
      >
        <div 
          className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl transition-transform duration-300 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full">
            <div className="p-6 bg-[#064e3b] text-white">
              <div className="flex justify-between items-center mb-6">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center font-black text-white backdrop-blur-md">
                  ম
                </div>
                <button 
                  onClick={toggleMenu}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <h2 className="text-xl font-black">{lang === 'BN' ? ORG_DETAILS.nameBn : ORG_DETAILS.nameEn}</h2>
            </div>

            <div className="flex-grow py-8 px-4 space-y-2 overflow-y-auto">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">
                {lang === 'BN' ? 'প্রধান নেভিগেশন' : 'Main Navigation'}
              </p>
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={toggleMenu}
                  className={`flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all ${isActive(item.path) ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <span className={isActive(item.path) ? 'text-emerald-600' : 'text-slate-400'}>{item.icon}</span>
                  {item.name}
                </Link>
              ))}

              <div className="pt-6 mt-6 border-t border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">
                  {lang === 'BN' ? 'অ্যাকাউন্ট' : 'Account'}
                </p>
                {!user ? (
                  <div className="grid grid-cols-1 gap-2">
                    <Link
                      to="/login"
                      onClick={toggleMenu}
                      className="flex items-center gap-4 px-4 py-4 rounded-2xl font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-all"
                    >
                      <span className="text-emerald-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg></span>
                      {lang === 'BN' ? 'সদস্য লগইন' : 'Member Login'}
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    <Link
                      to={user.role === 'Admin' ? '/admin/dashboard' : '/member/dashboard'}
                      onClick={toggleMenu}
                      className="flex items-center gap-4 px-4 py-4 rounded-2xl font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-all"
                    >
                      <span className="text-emerald-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"></path></svg></span>
                      {lang === 'BN' ? 'ড্যাশবোর্ড' : 'Dashboard'}
                    </Link>
                    <button
                      onClick={() => { onLogout(); toggleMenu(); }}
                      className="flex items-center gap-4 px-4 py-4 rounded-2xl font-bold text-red-600 hover:bg-red-50 transition-all text-left"
                    >
                      <span className="text-red-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg></span>
                      {lang === 'BN' ? 'লগআউট' : 'Logout'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <p className="text-[10px] text-slate-400 font-bold text-center">© ২০২৬ {lang === 'BN' ? ORG_DETAILS.nameBn : ORG_DETAILS.nameEn}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
