import { useLocation } from "react-router-dom";
import SocialFlipButton from "./SocialFlipButton";

export default function Footer() {
  const location = useLocation();
  const isContactPage = location.pathname === '/contact';

  return (
    <footer className="bg-[#05040F] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#130F2A] via-[#05040F] to-[#05040F] pt-12 pb-6 overflow-hidden relative border-t border-white/5">

      {/* Subtle red glow at the top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-brand-red to-transparent opacity-50 shadow-[0_0_20px_rgba(222,27,84,0.5)]"></div>

      <div className="max-w-[1000px] mx-auto px-6 md:px-12 flex flex-col items-center text-center relative z-10">

        {/* Brand & Mission */}
        <div className="mb-6">
          <div className="font-heading font-bold text-2xl tracking-wide text-white mb-6">
            <span className="text-brand-red">s</span>Bloom Studio
          </div>
          <p className="text-gray-400 text-xs md:text-sm leading-relaxed max-w-xl mx-auto font-light">
            Vizag's premier dedicated space for high-end video editing, professional podcasts, and end-to-end digital storytelling.
          </p>
        </div>

        {/* Horizontal Navigation */}
        {/* Horizontal Navigation */}
        {!isContactPage && (
          <nav className="mb-6 w-full border-y border-white/5 py-4">
            <ul className="flex flex-wrap justify-center gap-6 md:gap-10">
              {location.pathname === '/kids-zone' ? (
                <>
                  <li>
                    <a href="/kids-zone#hero" className="text-white text-xs md:text-sm font-medium uppercase tracking-[0.15em] hover:text-brand-red transition-colors relative group">
                      Home
                      <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-brand-red group-hover:w-full transition-all duration-300"></span>
                    </a>
                  </li>
                  <li>
                    <a href="/kids-zone#superpowers" className="text-white text-xs md:text-sm font-medium uppercase tracking-[0.15em] hover:text-brand-red transition-colors relative group">
                      Superpowers
                      <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-brand-red group-hover:w-full transition-all duration-300"></span>
                    </a>
                  </li>
                  <li>
                    <a href="/kids-zone#journey" className="text-white text-xs md:text-sm font-medium uppercase tracking-[0.15em] hover:text-brand-red transition-colors relative group">
                      Creator's Journey
                      <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-brand-red group-hover:w-full transition-all duration-300"></span>
                    </a>
                  </li>
                  <li>
                    <a href="/kids-zone#pricing" className="text-white text-xs md:text-sm font-medium uppercase tracking-[0.15em] hover:text-brand-red transition-colors relative group">
                      Pricing
                      <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-brand-red group-hover:w-full transition-all duration-300"></span>
                    </a>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <a href="/#hero" className="text-white text-xs md:text-sm font-medium uppercase tracking-[0.15em] hover:text-brand-red transition-colors relative group">
                      Home
                      <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-brand-red group-hover:w-full transition-all duration-300"></span>
                    </a>
                  </li>
                  <li>
                    <a href="/#roadmap" className="text-white text-xs md:text-sm font-medium uppercase tracking-[0.15em] hover:text-brand-red transition-colors relative group">
                      Rollout Roadmap
                      <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-brand-red group-hover:w-full transition-all duration-300"></span>
                    </a>
                  </li>
                  <li>
                    <a href="/#marketing" className="text-white text-xs md:text-sm font-medium uppercase tracking-[0.15em] hover:text-brand-red transition-colors relative group">
                      BTS Campaign
                      <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-brand-red group-hover:w-full transition-all duration-300"></span>
                    </a>
                  </li>
                  <li>
                    <a href="/#book" className="text-white text-xs md:text-sm font-medium uppercase tracking-[0.15em] hover:text-brand-red transition-colors relative group">
                      Book a Slot
                      <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-brand-red group-hover:w-full transition-all duration-300"></span>
                    </a>
                  </li>
                </>
              )}
            </ul>
          </nav>
        )}

        {/* Contact Info (Minimalist Horizontal) */}
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-gray-400 text-xs mb-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-red"></span>
            Visakhapatnam, AP, India
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-red"></span>
            <a href="mailto:hello@sbloom.studio" className="hover:text-brand-red transition-colors">hello@sbloom.studio</a>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-red"></span>
            Mon - Sat, 9 AM - 6 PM
          </div>
        </div>

        {/* Social Icons */}
        <div className="mb-8 w-full flex justify-center z-20 relative">
          <SocialFlipButton />
        </div>

        {/* Legal */}
        <div className="w-full flex flex-col md:flex-row justify-center md:justify-between items-center gap-2 pt-4 border-t border-white/5">
          <p className="text-white/30 text-[10px] tracking-wide uppercase">
            &copy; {new Date().getFullYear()} sBloom Studio. All rights reserved.
          </p>
          <div className="flex gap-4">
            {/* Legal links will go here when ready */}
          </div>
        </div>

      </div>
    </footer>
  );
}
