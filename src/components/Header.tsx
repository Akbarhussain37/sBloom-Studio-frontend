import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isKidsZone = location.pathname === '/kids-zone';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const textColor = isKidsZone ? 'text-slate-900' : 'text-white';
  const navLinkColor = isKidsZone ? 'text-slate-700 hover:text-[#FF5E00]' : 'text-white/80 hover:text-brand-red';
  
  // Choose the glass background based on the theme
  const scrolledBg = isKidsZone 
    ? 'bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm' 
    : 'dark-glass shadow-lg';

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? `${scrolledBg} py-4` : 'bg-transparent py-6'}`}>
      <div className="w-full px-6 md:px-12 lg:px-16 flex justify-between items-center">
        <Link to="/" className={`font-heading font-bold text-2xl tracking-wide ${textColor} hover:opacity-80 transition-opacity`}>
          <span className="text-brand-red">s</span>Bloom Studio
        </Link>
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm xl:text-base">
          <Link to="/" className={`${navLinkColor} font-medium transition-colors`}>Creators</Link>
          <Link to="/kids-zone" className={`${navLinkColor} font-medium transition-colors`}>Kids Zone</Link>
          <a href="/#book" className={`${isKidsZone ? 'bg-gradient-to-r from-[#FF5E00] to-[#FFD500] hover:scale-105 shadow-md' : 'bg-brand-red hover:bg-[#F02865] shadow-[0_0_15px_rgba(222,27,84,0.3)] hover:shadow-[0_0_20px_rgba(222,27,84,0.4)]'} text-white font-semibold py-2 px-6 rounded-lg transition-all whitespace-nowrap`}>
            Book Slot
          </a>
        </nav>
      </div>
    </header>
  );
}
