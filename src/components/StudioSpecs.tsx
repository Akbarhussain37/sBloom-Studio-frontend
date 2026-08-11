import Reveal from './Reveal';

export default function Vibe() {
  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden bg-navy-dark text-center">
      {/* Parallax Background */}
      <div 
        className="absolute inset-0 z-0 bg-[url('/assets/images/hero.png')] bg-cover bg-center bg-fixed opacity-30"
      ></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-[800px] mx-auto px-4">
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">The sBloom Studio Experience</h2>
          <p className="text-xl md:text-2xl text-white/90 font-light mb-4 leading-relaxed">
            High-speed Wi-Fi. Specialty Coffee. Acoustically Treated. Dust-Free Environment.
          </p>
          <p className="text-brand-red font-medium text-lg uppercase tracking-widest">
            A premium space that feels as good as your content looks.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
