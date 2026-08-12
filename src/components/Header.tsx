import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiUser, FiMenu, FiX } from 'react-icons/fi';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isKidsZone = location.pathname === '/kids-zone';
  const isContactPage = location.pathname === '/contact';
  const isLightHeader = isKidsZone || isContactPage;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const textColor = isLightHeader ? 'text-slate-900' : 'text-white';
  const underlineColor = isKidsZone ? 'bg-[#FF5E00]' : 'bg-brand-red';

  const NavLink = ({ to, children, className = "" }: { to: string, children: React.ReactNode, className?: string }) => {
    const isActive = location.pathname === to;
    const hoverColor = isKidsZone ? 'hover:text-[#FF5E00]' : 'hover:text-brand-red';
    const baseColor = isLightHeader 
      ? `text-slate-600 ${hoverColor}` 
      : 'text-white/80 hover:text-brand-red';
    const activeColor = isKidsZone ? 'text-[#FF5E00] font-bold' : 'text-brand-red font-bold';

    return (
      <Link to={to} className={`relative group flex items-center gap-1.5 ${isActive ? activeColor : baseColor} transition-colors ${className}`}>
        {children}
        <span className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-[2px] transition-all duration-300 ${underlineColor} ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
      </Link>
    );
  };
  
  // Choose the glass background based on the theme
  const scrolledBg = isLightHeader 
    ? 'bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm' 
    : 'dark-glass shadow-lg';

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? `${scrolledBg} py-4` : 'bg-transparent py-6'}`}>
      <div className="w-full px-6 md:px-12 lg:px-16 flex justify-between items-center">
        <Link to="/" className={`font-heading font-bold text-2xl tracking-wide ${textColor} hover:opacity-80 transition-opacity`}>
          <span className="text-brand-red">s</span>Bloom Studio
        </Link>
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm xl:text-base font-medium">
          <NavLink to="/">Creators</NavLink>
          <NavLink to="/kids-zone">Young Creators</NavLink>
          <span className="cursor-not-allowed opacity-50 ml-4 font-bold flex items-center">Healthcare</span>
          <NavLink to="/login" className="ml-4">
            <FiUser className="text-lg" />
            Login
          </NavLink>
          <Link to="/contact" className={`${location.pathname === '/contact' ? (isKidsZone ? 'bg-slate-100 border-[#FF5E00] text-[#FF5E00]' : 'bg-slate-100 border-brand-red text-brand-red') : (isLightHeader ? 'bg-white border-[#E2E8F0] text-[#1E293B] hover:bg-slate-50' : 'bg-white/10 border-white/20 text-white hover:bg-white/20')} border font-semibold py-2 px-6 rounded-full transition-all whitespace-nowrap`}>
            Contact Us
          </Link>
          <a href="/#marketing" className={`${isKidsZone ? 'bg-gradient-to-r from-[#FF5E00] to-[#FFD500] hover:scale-105 shadow-md' : 'bg-brand-red hover:bg-[#F02865] shadow-[0_0_15px_rgba(222,27,84,0.3)] hover:shadow-[0_0_20px_rgba(222,27,84,0.4)]'} text-white font-semibold py-2 px-6 rounded-lg transition-all whitespace-nowrap`}>
            Book Slot
          </a>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className={`lg:hidden text-2xl ${textColor} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red rounded-md p-1`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <div 
        className={`lg:hidden fixed inset-0 top-[72px] bg-slate-900/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center gap-8 text-white text-xl font-bold transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 visible translate-x-0' : 'opacity-0 invisible translate-x-full'
        }`}
      >
        <Link to="/" className="hover:text-brand-red transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Creators</Link>
        <Link to="/kids-zone" className="hover:text-brand-red transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Young Creators</Link>
        <span className="opacity-50 cursor-not-allowed">Healthcare</span>
        <Link to="/login" className="flex items-center gap-2 hover:text-brand-red transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
          <FiUser /> Login
        </Link>
        <Link to="/contact" className="border border-white/20 px-8 py-3 rounded-full hover:bg-white/10 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
          Contact Us
        </Link>
        <a href="/#marketing" className="bg-brand-red hover:bg-[#F02865] px-8 py-3 rounded-lg shadow-lg shadow-brand-red/30 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
          Book Slot
        </a>
      </div>
    </header>
  );
}
