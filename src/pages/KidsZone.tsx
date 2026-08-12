import Reveal from '../components/Reveal';

export default function KidsZone() {
  return (
    <main className="bg-slate-50 min-h-screen pt-24 pb-32">
      {/* Hero Section */}
      <section id="hero" className="relative pt-24 pb-12 px-6 md:px-12 max-w-[1400px] mx-auto overflow-hidden">
        {/* Vibrant Neon Glowing Backgrounds */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-[#FF5E00]/20 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-[10%] right-[15%] w-[400px] h-[400px] bg-[#00A3FF]/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[600px] h-[300px] bg-[#FFD500]/20 rounded-full blur-[150px]" />
        </div>

        {/* Floating Social Media UI Elements */}
        <div className="absolute inset-0 z-10 pointer-events-none hidden md:block">
          {/* Floating Heart */}
          <div className="absolute top-[15%] left-[3%] animate-bounce bg-white border-4 border-slate-900 p-4 rounded-2xl shadow-[6px_6px_0px_#1e293b] rotate-[-6deg]" style={{ animationDuration: '6s' }}>
            <svg className="w-8 h-8 text-[#DE1B54]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <div className="text-slate-900 text-sm font-black mt-2 text-center">14.2K</div>
          </div>
          
          {/* Floating Play Button */}
          <div className="absolute top-[25%] right-[3%] animate-bounce bg-white border-4 border-slate-900 p-4 rounded-2xl shadow-[6px_6px_0px_#1e293b] rotate-[8deg]" style={{ animationDuration: '5s', animationDelay: '0.5s' }}>
            <svg className="w-8 h-8 text-[#00A3FF]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            <div className="text-slate-900 text-sm font-black mt-2 text-center">1.2M</div>
          </div>

          {/* Floating Comment */}
          <div className="absolute bottom-[15%] left-[8%] animate-bounce bg-white border-4 border-slate-900 p-4 rounded-2xl shadow-[6px_6px_0px_#1e293b] rotate-[-4deg]" style={{ animationDuration: '7s', animationDelay: '1s' }}>
            <svg className="w-8 h-8 text-[#FF5E00]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/>
            </svg>
            <div className="text-slate-900 text-sm font-black mt-2 text-center">4,092</div>
          </div>
        </div>

        <div className="relative z-20 flex flex-col items-center text-center mt-10">


          <Reveal delay={100}>
            <h1 className="text-4xl md:text-6xl lg:text-[5rem] font-heading font-black text-slate-900 leading-[1.1] tracking-tight mb-6" style={{ textShadow: '6px 6px 0px #FFD500' }}>
              FROM RAW FOOTAGE <br className="hidden md:block" />
              <span className="text-[#FF5E00]" style={{ textShadow: '6px 6px 0px #1e293b' }}>TO MASTERPIECE</span>
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-base md:text-xl text-slate-700 leading-relaxed font-bold max-w-xl mx-auto mb-10 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border-4 border-transparent">
              You provide the raw talent. We deliver a <span className="text-[#00A3FF] font-black underline decoration-4 underline-offset-4">highly polished</span>, professional video.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <button 
              className="group relative inline-flex items-center justify-center gap-4 px-12 py-6 bg-[#FF5E00] text-white text-xl font-black rounded-full overflow-hidden transition-all duration-300 border-4 border-slate-900 shadow-[8px_8px_0px_#1e293b] hover:shadow-[4px_4px_0px_#1e293b] hover:translate-y-1 hover:translate-x-1"
            >
              <div className="absolute inset-0 bg-[#DE1B54] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10 uppercase tracking-wide">See How It Works</span>
              <svg className="w-8 h-8 relative z-10 group-hover:translate-y-[-4px] transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </button>
          </Reveal>
        </div>
      </section>

      {/* How it Works Section (Magic Machine Flow) */}
      <section className="py-24 px-6 md:px-12 max-w-[1400px] mx-auto relative z-10 overflow-hidden">
        <Reveal>
          <div className="text-center mb-24 relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#FFD500] rounded-3xl rotate-12 mb-6 shadow-[0_0_40px_rgba(255,213,0,0.4)]">
              <span className="text-4xl">🚀</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-heading font-black text-slate-900 mb-6 tracking-tight">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5E00] to-[#00A3FF]">Magic</span> Machine
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 font-medium max-w-2xl mx-auto">
              How we turn your awesome videos into absolute masterpieces!
            </p>
          </div>
        </Reveal>

        <div className="relative max-w-5xl mx-auto mt-16">
          {/* The Magic Pipeline (Desktop) */}
          <div className="hidden md:block absolute top-20 left-[10%] right-[10%] h-12 bg-gradient-to-r from-[#FFD500] via-[#FF5E00] to-[#00A3FF] rounded-full opacity-20 blur-md z-0 animate-pulse" />
          <div className="hidden md:block absolute top-20 left-[10%] right-[10%] h-8 bg-gradient-to-r from-[#FFD500] via-[#FF5E00] to-[#00A3FF] rounded-full z-0 border-4 border-white shadow-inner" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {[
              {
                step: "Step 1",
                emoji: "📱",
                title: "Record It!",
                desc: "Just grab a phone and hit record. Have fun and be yourself!",
                color: "from-[#FFD500] to-[#FFB700]",
                shadow: "shadow-[#FFD500]/40"
              },
              {
                step: "Step 2",
                emoji: "✨",
                title: "Send It!",
                desc: "Send the video through our super-fast magical portal.",
                color: "from-[#FF5E00] to-[#E55400]",
                shadow: "shadow-[#FF5E00]/40"
              },
              {
                step: "Step 3",
                emoji: "⭐",
                title: "Share It!",
                desc: "Boom! Your video looks like a movie. Ready to go viral!",
                color: "from-[#00A3FF] to-[#0082CC]",
                shadow: "shadow-[#00A3FF]/40"
              }
            ].map((item, i) => (
              <Reveal key={i} delay={i * 200}>
                <div className="flex flex-col items-center text-center group">
                  {/* The Bubble Node */}
                  <div className={`relative w-40 h-40 rounded-[2.5rem] bg-gradient-to-br ${item.color} p-2 shadow-2xl ${item.shadow} group-hover:-translate-y-4 transition-all duration-500 rotate-[-4deg] group-hover:rotate-0`}>
                    <div className="w-full h-full bg-white rounded-[2rem] flex flex-col items-center justify-center border-4 border-transparent overflow-hidden relative">
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-10`} />
                      <span className="text-6xl group-hover:scale-125 transition-transform duration-500 ease-out drop-shadow-md">{item.emoji}</span>
                    </div>
                    {/* Badge */}
                    <div className="absolute -top-4 -right-4 px-4 py-2 bg-slate-900 text-white font-black rounded-xl text-sm rotate-12 shadow-xl border-2 border-white">
                      {item.step}
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-100 shadow-xl w-full">
                    <h3 className="text-2xl font-heading font-black text-slate-900 mb-3">{item.title}</h3>
                    <p className="text-slate-600 font-medium text-lg leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The Value Section (Storytelling Flow) */}
      <section id="journey" className="py-24 px-6 md:px-12 max-w-[1200px] mx-auto">
        <Reveal>
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-6">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5E00] to-[#00A3FF]">Creator's Journey</span>
            </h2>
            <p className="text-xl text-slate-600 font-light max-w-2xl mx-auto">
              We take the raw talent and passion of your child, and give them the professional polish they deserve.
            </p>
          </div>
        </Reveal>

        <div className="flex flex-col gap-24">
          {/* Row 1: The Raw Setup */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 aspect-[4/3] group">
                <img src="/assets/images/kid_creator.png" alt="Raw Recording Setup" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm text-slate-800 font-bold text-sm">Step 1: Record</div>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="lg:pl-8">
                <h3 className="text-3xl font-heading font-bold text-slate-900 mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-[#00A3FF]/10 flex items-center justify-center text-[#00A3FF]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  </span>
                  The Raw Passion
                </h3>
                <p className="text-lg text-slate-600 font-light mb-6 leading-relaxed">
                  It all starts in their bedroom, living room, or out in the world. They have the talent, the enthusiasm, and the raw footage. But without professional editing, it often gets lost in the noise of social media algorithms.
                </p>
                <div className="px-6 py-4 bg-slate-100 rounded-xl border border-slate-200">
                  <p className="text-slate-800 font-medium text-sm">You provide the raw footage. We do the rest.</p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Row 2: Professional Polish */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <Reveal>
                <div className="lg:pr-8">
                  <h3 className="text-3xl font-heading font-bold text-slate-900 mb-4 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-[#FF5E00]/10 flex items-center justify-center text-[#FF5E00]">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    </span>
                    The Pro Polish
                  </h3>
                  <p className="text-lg text-slate-600 font-light mb-6 leading-relaxed">
                    Our team of expert editors takes that raw footage and transforms it. We add cinematic color grading, remove background noise, enhance the audio, and layer in dynamic, attention-holding graphics.
                  </p>
                  <ul className="space-y-4 text-slate-800 font-medium">
                    <li className="flex items-center gap-3"><span className="text-[#FF5E00] font-bold">✔</span> Cinematic Color Grading</li>
                    <li className="flex items-center gap-3"><span className="text-[#FF5E00] font-bold">✔</span> Professional Audio Mastery</li>
                    <li className="flex items-center gap-3"><span className="text-[#FF5E00] font-bold">✔</span> Dynamic Motion Graphics</li>
                  </ul>
                </div>
              </Reveal>
            </div>
            <div className="order-1 lg:order-2">
              <Reveal delay={100}>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 aspect-[4/3] group">
                  <img src="/assets/images/kid_polished.png" alt="Polished Video Result" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                  <div className="absolute top-6 right-6 px-4 py-2 bg-gradient-to-r from-[#FF5E00] to-[#FFD500] rounded-full shadow-md text-white font-bold text-sm">Step 2: Polish</div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Row 3: The Result */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 aspect-[4/3] group">
                <img src="/assets/images/kid_engagement.png" alt="High Engagement and Confidence" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute top-6 left-6 px-4 py-2 bg-[#00A3FF] rounded-full shadow-md text-white font-bold text-sm">Step 3: Growth</div>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="lg:pl-8">
                <h3 className="text-3xl font-heading font-bold text-slate-900 mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-[#FFD500]/20 flex items-center justify-center text-[#FFD500]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </span>
                  The Ultimate Advantage
                </h3>
                <p className="text-lg text-slate-600 font-light mb-6 leading-relaxed">
                  What happens when a child sees themselves presented like a top-tier professional? Their confidence skyrockets. Their content performs better in algorithms, driving higher engagement, and they build a premium digital footprint.
                </p>
                <div className="flex gap-4">
                  <div className="p-4 bg-white shadow-sm border border-slate-200 rounded-xl flex-1 text-center hover:border-[#00A3FF] transition-colors">
                    <div className="text-3xl font-bold text-[#00A3FF] mb-1">10x</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide font-bold">Confidence</div>
                  </div>
                  <div className="p-4 bg-white shadow-sm border border-slate-200 rounded-xl flex-1 text-center hover:border-[#FF5E00] transition-colors">
                    <div className="text-3xl font-bold text-[#FF5E00] mb-1">Boost</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide font-bold">Engagement</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* The Video Superpowers Section */}
      <section id="superpowers" className="py-24 px-6 md:px-12 max-w-[1400px] mx-auto relative z-10 overflow-hidden">
        {/* Playful Background Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-[#FFD500] rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#00A3FF] rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <Reveal>
            <div className="text-center mb-20">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full border-4 border-[#00A3FF] shadow-[8px_8px_0px_#00A3FF] mb-6 animate-bounce">
                <span className="text-5xl">🦸‍♂️</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-heading font-black text-slate-900 mb-6 uppercase tracking-tight">
                Our Video <span className="text-[#FF5E00]">Superpowers</span>
              </h2>
              <p className="text-xl md:text-2xl text-slate-600 font-bold max-w-2xl mx-auto">
                We use special magic tools to make every video look completely AWESOME!
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {/* Superpower 1 */}
            <Reveal className="h-full">
              <div className="bg-[#00A3FF] rounded-[2.5rem] p-3 h-full transform hover:-translate-y-4 transition-transform duration-300">
                <div className="bg-white rounded-[2rem] p-10 h-full border-4 border-slate-900 shadow-[8px_8px_0px_#1e293b] relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#00A3FF]/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="text-7xl mb-6 drop-shadow-md group-hover:scale-125 transition-transform duration-300 ease-out">🌈</div>
                    <div className="px-4 py-2 bg-slate-900 text-white font-black uppercase tracking-wider rounded-xl mb-4 rotate-[-3deg] shadow-md border-2 border-slate-900">
                      Super Color Vision
                    </div>
                    <p className="text-slate-600 font-bold text-lg leading-snug">
                      We make the colors super bright and popping, so the video looks like a real movie!
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Superpower 2 */}
            <Reveal delay={100} className="h-full">
              <div className="bg-[#FFD500] rounded-[2.5rem] p-3 h-full transform hover:-translate-y-4 transition-transform duration-300 mt-0 md:mt-12">
                <div className="bg-white rounded-[2rem] p-10 h-full border-4 border-slate-900 shadow-[8px_8px_0px_#1e293b] relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FFD500]/20 rounded-full group-hover:scale-150 transition-transform duration-500" />
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="text-7xl mb-6 drop-shadow-md group-hover:scale-125 transition-transform duration-300 ease-out">🎧</div>
                    <div className="px-4 py-2 bg-slate-900 text-white font-black uppercase tracking-wider rounded-xl mb-4 rotate-[3deg] shadow-md border-2 border-slate-900">
                      Magic Audio
                    </div>
                    <p className="text-slate-600 font-bold text-lg leading-snug">
                      We clean up the sound and add epic music and sound effects like WHOOSH and BANG!
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Superpower 3 */}
            <Reveal delay={200} className="h-full">
              <div className="bg-[#FF5E00] rounded-[2.5rem] p-3 h-full transform hover:-translate-y-4 transition-transform duration-300">
                <div className="bg-white rounded-[2rem] p-10 h-full border-4 border-slate-900 shadow-[8px_8px_0px_#1e293b] relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FF5E00]/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="text-7xl mb-6 drop-shadow-md group-hover:scale-125 transition-transform duration-300 ease-out">💬</div>
                    <div className="px-4 py-2 bg-slate-900 text-white font-black uppercase tracking-wider rounded-xl mb-4 rotate-[-3deg] shadow-md border-2 border-slate-900">
                      Popping Words
                    </div>
                    <p className="text-slate-600 font-bold text-lg leading-snug">
                      We add massive, colorful animated words so everyone can follow along with the fun!
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>


      {/* The Offer & Commitment Section (SaaS Split Redesign) */}
      <section id="pricing" className="py-24 px-6 md:px-12 max-w-[1200px] mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 mb-6 shadow-sm text-[#FF5E00] font-bold text-sm">
              <span className="w-2 h-2 rounded-full bg-[#FF5E00] animate-pulse" /> Zero Risk Trial
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-6">
              Let The Quality <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5E00] to-[#FFD500]">Sell Itself.</span>
            </h2>
            <p className="text-xl text-slate-600 font-light max-w-2xl mx-auto">
              We believe in our work. No hidden fees. No long-term contracts. If you don't love the result, you walk away for free.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Left Card: Free Trial */}
          <Reveal>
            <div className="relative bg-white rounded-3xl p-10 border border-slate-200 shadow-xl hover:shadow-2xl transition-shadow h-full flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 font-heading mb-2">Free Trial</h3>
                <p className="text-slate-500 mb-8">Test the waters completely risk-free.</p>
                <div className="flex items-end gap-2 mb-8">
                  <span className="text-5xl font-bold text-slate-900 font-heading">₹0</span>
                  <span className="text-slate-500 font-medium pb-1">/ first 2 videos</span>
                </div>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3 text-slate-700 font-medium">
                    <div className="w-6 h-6 rounded-full bg-[#00A3FF]/10 flex items-center justify-center text-[#00A3FF] text-sm">✔</div>
                    2 highly polished videos
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 font-medium">
                    <div className="w-6 h-6 rounded-full bg-[#00A3FF]/10 flex items-center justify-center text-[#00A3FF] text-sm">✔</div>
                    Delivered within 48 hours
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 font-medium">
                    <div className="w-6 h-6 rounded-full bg-[#00A3FF]/10 flex items-center justify-center text-[#00A3FF] text-sm">✔</div>
                    No credit card required
                  </li>
                </ul>
              </div>
              <a href="#book" className="block w-full text-center py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-xl transition-colors border border-slate-300">
                Start Free Trial
              </a>
            </div>
          </Reveal>

          {/* Right Card: Starter Pack */}
          <Reveal delay={100}>
            <div className="relative bg-slate-900 rounded-3xl p-10 overflow-hidden shadow-2xl border border-slate-700 transform md:scale-105 h-full flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#FF5E00] to-[#FFD500] opacity-20 blur-[40px] pointer-events-none" />
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF5E00] to-[#FFD500]" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-bold text-white font-heading">Starter Pack</h3>
                  <div className="px-3 py-1 bg-gradient-to-r from-[#FF5E00] to-[#FFD500] rounded-full text-white text-xs font-bold uppercase tracking-wider shadow-md">Popular</div>
                </div>
                <p className="text-slate-400 mb-8">Everything you need to launch.</p>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-5xl font-bold text-white font-heading">₹1,000</span>
                  <span className="text-slate-400 font-medium pb-1">/ 5 videos</span>
                </div>
                <p className="text-[#FFD500] text-sm font-medium mb-8">*Introductory pricing. Subject to increase.</p>
                
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3 text-white font-medium">
                    <div className="w-6 h-6 rounded-full bg-[#FF5E00]/20 flex items-center justify-center text-[#FF5E00] text-sm">✔</div>
                    5 highly polished videos
                  </li>
                  <li className="flex items-center gap-3 text-white font-medium">
                    <div className="w-6 h-6 rounded-full bg-[#FF5E00]/20 flex items-center justify-center text-[#FF5E00] text-sm">✔</div>
                    Priority editing & support
                  </li>
                  <li className="flex items-center gap-3 text-white font-medium">
                    <div className="w-6 h-6 rounded-full bg-[#FF5E00]/20 flex items-center justify-center text-[#FF5E00] text-sm">✔</div>
                    No contracts. Cancel anytime.
                  </li>
                </ul>
              </div>
              <a href="#book" className="relative z-10 block w-full text-center py-4 bg-gradient-to-r from-[#FF5E00] to-[#FFD500] hover:scale-[1.02] transition-transform text-white font-bold rounded-xl shadow-[0_0_20px_rgba(255,94,0,0.3)]">
                Claim Starter Pack
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
