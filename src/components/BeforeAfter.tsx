import { useState } from 'react';
import Reveal from './Reveal';

export default function BeforeAfter() {
  const [sliderValue, setSliderValue] = useState(50);

  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      num: "01",
      title: "Cinematic Color Grading",
      desc: "We fix lighting inconsistencies, balance skin tones, and apply premium color grades that match your brand's aesthetic. High-end color science ensures your videos look expensive, cinematic, and deeply engaging on any screen.",
      img: "/assets/images/benefit_color.png"
    },
    {
      num: "02",
      title: "Attention-Driven Editing",
      desc: "We ruthlessly cut dead air, optimize pacing, and strategically layer B-roll to maximize viewer retention. Our editing philosophy is built around modern social media psychology—keeping eyes glued from the hook to the final call to action.",
      img: "/assets/images/benefit_edit.png"
    },
    {
      num: "03",
      title: "Studio-Grade Audio",
      desc: "Bad audio kills good video instantly. We surgically clean up background noise, perfectly balance vocal levels, and add subtle, immersive sound design that gives your content authority and polish.",
      img: "/assets/images/benefit_audio.png"
    }
  ];

  return (
    <section className="bg-white relative overflow-hidden py-20" id="difference">
      
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <Reveal>
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold text-navy leading-[1.1] tracking-tight mb-6">
              From Raw Potential to <br className="hidden md:block" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-[#F02865]">Premium Asset</span>
            </h2>
            <p className="text-base md:text-lg text-gray-500 leading-relaxed font-light max-w-2xl mx-auto">
              Don't let flat lighting or echoey audio ruin a great message. We take your raw footage and apply industry-standard post-production to ensure your brand looks, sounds, and feels authoritative.
            </p>
          </div>
        </Reveal>

        {/* Minimalist Interactive Accordion */}
        <Reveal delay={100}>
          <div className="w-full flex flex-col mb-32 border-t border-gray-200">
            {features.map((feature, index) => {
              const isActive = activeFeature === index;
              return (
                <div 
                  key={index}
                  className="border-b border-gray-200 group cursor-pointer bg-white transition-colors hover:bg-gray-50/30"
                  onMouseEnter={() => setActiveFeature(index)}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="py-8 md:py-12 px-4 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-6 md:gap-12">
                      <span className={`text-xl md:text-2xl font-bold font-heading tracking-widest transition-colors duration-500 ${isActive ? 'text-brand-red' : 'text-gray-300'}`}>
                        {feature.num}
                      </span>
                      <h3 className={`text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight transition-colors duration-500 ${isActive ? 'text-navy' : 'text-gray-300'}`}>
                        {feature.title}
                      </h3>
                    </div>
                    <div className={`hidden md:block transition-transform duration-500 ${isActive ? '-rotate-180' : 'rotate-0'}`}>
                      <svg className={`w-10 h-10 transition-colors duration-500 ${isActive ? 'text-brand-red' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  <div 
                    className={`overflow-hidden transition-all duration-700 ease-in-out ${isActive ? 'max-h-[800px] opacity-100 pb-12' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="flex flex-col md:flex-row gap-12 items-center px-4 md:px-8 pt-4">
                      <div className="w-full md:w-5/12">
                        <div className="w-16 h-1 bg-brand-red mb-8"></div>
                        <p className="text-xl text-gray-500 leading-relaxed font-light">
                          {feature.desc}
                        </p>
                      </div>
                      <div className="w-full md:w-7/12 h-[300px] md:h-[400px] relative overflow-hidden bg-gray-100">
                        <img 
                          src={feature.img} 
                          alt={feature.title} 
                          className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${isActive ? 'scale-100 grayscale-0' : 'scale-105 grayscale-[50%]'}`} 
                        />
                        {/* No gradient overlays, no borders, just raw editorial imagery */}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* Comparison Slider */}
        <Reveal delay={200}>
          <div className="relative w-full h-[50vh] md:h-[75vh] min-h-[400px] rounded-[3rem] overflow-hidden shadow-2xl border border-gray-200/50">
            {/* Raw Image */}
            <div className="absolute inset-0 w-full h-full">
              <img src="/assets/images/polished.png" alt="Raw unedited footage" className="w-full h-full object-cover object-center filter grayscale-[40%] contrast-80 brightness-110 sepia-[20%]" />
              <div className="absolute top-8 left-8">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white text-xs rounded-full font-bold backdrop-blur-xl border border-white/20 tracking-wider uppercase shadow-xl">
                  <span className="w-2 h-2 rounded-full bg-gray-400"></span> Raw Footage
                </span>
              </div>
            </div>
            
            {/* Polished Image */}
            <div className="absolute top-0 left-0 h-full border-r border-brand-red/50 shadow-[5px_0_25px_rgba(222,27,84,0.3)] overflow-hidden" style={{ width: `${sliderValue}%` }}>
              <img src="/assets/images/polished.png" alt="Polished color graded footage" className="absolute top-0 left-0 w-[100vw] max-w-[1400px] h-full object-cover object-left" />
              <div className="absolute top-8 right-8" style={{ transform: `translateX(calc(100vw * (100 - ${sliderValue}) / 100))` }}>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-brand-red/90 text-white text-xs rounded-full font-bold backdrop-blur-xl border border-brand-red tracking-wider uppercase shadow-[0_0_20px_rgba(222,27,84,0.5)]">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span> Polished Asset
                </span>
              </div>
            </div>
            
            {/* Minimalist Slider Handle */}
            <div className="absolute top-0 bottom-0 w-[2px] bg-white pointer-events-none z-20 shadow-[0_0_10px_rgba(0,0,0,0.5)]" style={{ left: `calc(${sliderValue}% - 1px)` }}>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-1 bg-white/20 backdrop-blur-md border border-white/40 rounded-full px-2 py-6 shadow-2xl">
                 <div className="w-[1px] h-6 bg-white/80"></div>
                 <div className="w-[1px] h-6 bg-white/80"></div>
               </div>
            </div>
            
            <input 
              type="range" 
              min="0" max="100" 
              value={sliderValue} 
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize comparison-slider-input z-30" 
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
