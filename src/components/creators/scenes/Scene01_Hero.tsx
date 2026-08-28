import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowDown, FiArrowRight } from 'react-icons/fi';

const HEADLINE = 'Your idea deserves more than your notes app.';

const FRAGMENTS = [
  { id: 'f1', top: '-10%', right: '-20%', component: 'hexagon' },
  { id: 'f2', bottom: '-15%', left: '-15%', component: 'triangle' },
  { id: 'f3', top: '-5%', left: '-25%', component: 'circle' },
  { id: 'f4', bottom: '-5%', right: '-30%', component: 'lines' },
];

function GeometricRenderer({ component }: { component: string }) {
  switch (component) {
    case 'hexagon':
      return (
        <svg width="60" height="68" viewBox="0 0 60 68" fill="none" className="c-frag-geo">
          <path d="M30 2L58 18V50L30 66L2 50V18L30 2Z" stroke="var(--c-accent)" strokeWidth="1.5" strokeOpacity="0.6" fill="rgba(0, 240, 255, 0.05)" />
        </svg>
      );
    case 'triangle':
      return (
        <svg width="50" height="44" viewBox="0 0 50 44" fill="none" className="c-frag-geo" style={{ animationDelay: '1s' }}>
          <path d="M25 2L48 42H2L25 2Z" stroke="var(--c-magenta)" strokeWidth="1.5" strokeOpacity="0.6" fill="rgba(255, 0, 60, 0.05)" />
        </svg>
      );
    case 'circle':
      return (
        <svg width="70" height="70" viewBox="0 0 70 70" fill="none" className="c-frag-geo" style={{ animationDelay: '2s' }}>
          <circle cx="35" cy="35" r="33" stroke="var(--c-cyan)" strokeWidth="1" strokeDasharray="4 8" strokeOpacity="0.8" />
          <circle cx="35" cy="35" r="25" stroke="var(--c-cyan)" strokeWidth="0.5" strokeOpacity="0.4" />
        </svg>
      );
    case 'lines':
      return (
        <svg width="80" height="40" viewBox="0 0 80 40" fill="none" className="c-frag-geo" style={{ animationDelay: '1.5s' }}>
          <path d="M0 10H30L40 30H80" stroke="var(--c-accent)" strokeWidth="1.5" strokeOpacity="0.7" />
          <path d="M10 20H25L35 40H70" stroke="var(--c-magenta)" strokeWidth="1" strokeOpacity="0.4" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Scene01_Hero() {
  const [ready, setReady] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: shouldReduceMotion ? 0 : 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 40, filter: 'blur(10px)' },
    show:   { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <section
      className="c-hero"
      id="scene-01-hero"
      data-scene="idea"
      aria-label="The idea — where it all starts"
    >
      <div className="c-hero-bg" aria-hidden="true" />
      <div className="c-hero-grid" aria-hidden="true" />

      <div className="c-hero-layout">
        
        {/* ---- Left: Video HUD + Fragments ---- */}
        <div className="c-hero-idea-zone">
          {ready && !shouldReduceMotion && FRAGMENTS.map((f, i) => (
            <motion.div
              key={f.id}
              className="c-fragment"
              style={{ top: f.top, bottom: f.bottom, left: f.left, right: f.right } as React.CSSProperties}
              aria-hidden="true"
              initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.5 + i * 0.15, ease: 'easeOut' }}
            >
              <GeometricRenderer component={f.component} />
            </motion.div>
          ))}

          <motion.div
            className="c-hud-video-wrapper"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="c-hud-overlay" />
            <video 
              className="c-hud-video"
              src="/creator-hero.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
          </motion.div>
        </div>

        {/* ---- Right: Headline + CTA ---- */}
        <motion.div
          className="c-hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants} className="c-hero-eyebrow">
            SYSTEM.INIT // CREATORS
          </motion.div>

          <motion.h1 variants={itemVariants} className="c-h1">
            {HEADLINE}
          </motion.h1>

          <motion.p variants={itemVariants} className="c-body" style={{ maxWidth: 440 }}>
            Bring the idea. We compile it into reality.<br/>
            High-performance content execution starts here.
          </motion.p>

          <motion.div variants={itemVariants} className="c-cta-row">
            <Link to="/contact" className="c-btn-primary">
              INITIALIZE PROJECT <FiArrowRight aria-hidden="true" />
            </Link>
            <a href="#scene-02-chaos" className="c-btn-secondary">
              VIEW PROTOCOL
            </a>
          </motion.div>

          <motion.div variants={itemVariants} className="c-scroll-cue" aria-hidden="true">
            <span>SCROLL DOWN</span>
            <FiArrowDown className="c-scroll-arrow" />
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
