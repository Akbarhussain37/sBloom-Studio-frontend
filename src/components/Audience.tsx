import { useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from './Reveal';

export default function Audience() {
  const [activeCard, setActiveCard] = useState(0);

  const audiences = [
    {
      id: "01",
      title: "Local Businesses",
      desc: "Turn standard promotional content into premium, cinematic video assets that build instant trust with your local audience and significantly drive conversions.",
      img: "/assets/images/audience_business.png",
      buttonText: "Learn more"
    },
    {
      id: "02",
      title: "Creators",
      desc: "Step into a fully optimized studio environment equipped with industry-standard audio and lighting. Elevate your podcast or channel instantly.",
      img: "/assets/images/audience_creator.png",
      buttonText: "Learn more"
    },
    {
      id: "03",
      title: "Premium Agencies",
      desc: "Use our space as a premium physical trust marker to bring your clients. We act as your invisible, elite production arm.",
      img: "/assets/images/audience_agency.png",
      buttonText: "Learn more"
    },
    {
      id: "04",
      title: "Young Creators",
      desc: "Young Creators: We provide parents with the tools to amplify their child's potential. Upload raw footage, get a highly polished video quickly.",
      img: "/assets/images/hero.png",
      buttonText: "Explore Young Creators",
      link: "/kids-zone"
    }
  ];

  return (
    <section className="bg-[#05040F] py-32 relative overflow-hidden" id="audience">
      
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        <Reveal>
          <div className="max-w-3xl mb-16 md:mb-24">
            <h2 className="text-5xl md:text-7xl lg:text-[5.5rem] font-heading font-extrabold text-white leading-[1.05] tracking-tight mb-8">
              Who Is This <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-[#F02865]">Space For?</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-400 leading-relaxed font-light border-l-4 border-brand-primary pl-6 md:pl-8">
              Designed specifically to elevate local brands, independent creators, young talents, and premium agencies.
            </p>
          </div>
        </Reveal>

        {/* 4-Column Interactive Grid */}
        <Reveal delay={100}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {audiences.map((aud, index) => {
              const isActive = activeCard === index;
              return (
                <button 
                  key={index}
                  onMouseEnter={() => setActiveCard(index)}
                  onClick={() => setActiveCard(index)}
                  className={`flex flex-col h-[500px] md:h-[600px] w-full text-left bg-[#0E0B1F] border border-white/5 rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary hover:border-white/10 ${isActive ? 'shadow-[0_0_40px_rgba(240,40,101,0.1)]' : ''}`}
                >
                  {/* Top Content */}
                  <div className="p-8 md:p-10 flex flex-col z-10 relative bg-[#0E0B1F]">
                    <h3 className="text-2xl md:text-3xl font-heading font-medium text-white mb-2">
                      {aud.title}
                    </h3>
                    
                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isActive ? 'max-h-[300px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}>
                      <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6">
                        {aud.desc}
                      </p>
                      {aud.link ? (
                        <Link to={aud.link} className="inline-flex items-center gap-3 px-6 py-2.5 bg-gradient-to-r from-[#005E85] to-[#0089C4] text-white text-sm font-semibold rounded-full shadow-lg transition-transform hover:scale-105">
                          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                          {aud.buttonText}
                        </Link>
                      ) : (
                        <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-gradient-to-r from-[#005E85] to-[#0089C4] text-white text-sm font-semibold rounded-full shadow-lg transition-transform hover:scale-105 pointer-events-none">
                          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                          {aud.buttonText}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Image */}
                  <div className="relative flex-1 w-full mt-auto">
                    {/* Dark gradient to seamlessly blend the image into the card background */}
                    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0E0B1F] to-transparent z-10 pointer-events-none"></div>
                    
                    <img 
                      src={aud.img} 
                      alt={aud.title} 
                      loading="lazy"
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${isActive ? 'opacity-90 scale-100 object-top' : 'opacity-50 scale-105 object-center grayscale-[30%]'}`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </Reveal>

      </div>
    </section>
  );
}
