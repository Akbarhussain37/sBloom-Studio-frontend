import Reveal from './Reveal';

export default function Vibe() {
  const features = [
    {
      title: "Flawless Acoustics",
      desc: "Professional sound-dampening panels and isolated construction mean zero echo and pristine audio capture on every take.",
      img: "/assets/images/level1.png" // Studio desk/gear
    },
    {
      title: "Dust-Free Environment",
      desc: "Advanced HVAC filtration protects your expensive lenses and sensors. Change lenses without fear of environmental contamination.",
      img: "/assets/images/level2.png" // High tech clean/white environment
    },
    {
      title: "Gigabit Fiber Network",
      desc: "Offload massive 4K raw files in minutes, not hours. Dedicated, unthrottled high-speed connectivity wired directly into the bays.",
      img: "/assets/images/level3.png" // Server racks/cables
    },
    {
      title: "Overhead Rigging",
      desc: "Stop tripping over C-stands. Our ceilings are equipped with professional pipe grids for mounting key lights perfectly out of frame.",
      img: "/assets/images/hero.png" // Studio lighting
    }
  ];

  return (
    <section className="bg-[#05040F] py-32 relative overflow-hidden" id="infrastructure">
      {/* Decorative background accent */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <Reveal>
          <div className="mb-16 md:mb-24 flex flex-col items-start">

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-white leading-[1.1] tracking-tight mb-6">
              Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-[#F02865]">Infrastructure</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-400 font-light max-w-2xl leading-relaxed">
              We built a controlled environment so you can focus entirely on creation. Every technical requirement has been engineered into the physical space.
            </p>
          </div>
        </Reveal>

        {/* Premium 4-Column Image Grid */}
        <Reveal delay={100}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group h-[450px] md:h-[500px] flex flex-col bg-white rounded-3xl overflow-hidden cursor-pointer shadow-xl transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:-translate-y-2"
              >
                {/* Image Area - takes remaining space, shrinks when text expands */}
                <div className="relative w-full flex-1 overflow-hidden transition-all duration-500">
                  <div className="absolute inset-0 bg-navy/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                  <img 
                    src={feature.img} 
                    alt={feature.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  />
                </div>
                
                {/* Content Area - White background, expands on hover */}
                <div className="bg-white p-6 md:p-8 flex flex-col transition-all duration-500 relative z-20">
                  <h3 className="text-xl md:text-2xl font-heading font-bold text-navy line-clamp-2">
                    {feature.title}
                  </h3>
                  
                  {/* Hidden content that slides up */}
                  <div className="overflow-hidden max-h-0 opacity-0 group-hover:max-h-[250px] group-hover:opacity-100 transition-all duration-500 ease-in-out mt-0 group-hover:mt-4">
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                      {feature.desc}
                    </p>
                    <div className="flex justify-end">
                      {/* Interactive Button matching brand colors */}
                      <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center transition-all duration-300 hover:bg-[#c9184c] group-hover:scale-110 shadow-md">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </Reveal>

      </div>
    </section>
  );
}
