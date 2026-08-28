import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SceneLabel from '../shared/SceneLabel';

export default function Scene03_Script() {
  const sectionRef = useRef<HTMLElement>(null);
  const docRef    = useRef<HTMLDivElement>(null);
  const inView    = useInView(docRef, { once: true, margin: '-15% 0px' });
  const shouldReduceMotion = useReducedMotion();

  const animated = inView || shouldReduceMotion;

  return (
    <section
      className="c-script"
      id="scene-03-script"
      data-scene="script"
      ref={sectionRef}
      aria-label="The script — shaping the idea into a clear story"
    >
      <div className="c-section-divider" style={{ marginBottom: '6rem' }} />

      <div className="c-script-layout">

        {/* ---- Left: Label + Headline + Bullets ---- */}
        <div className="c-script-left">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={animated ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <SceneLabel number="03" label="OUTPUT COMPILATION" />

            <h2 className="c-h2" style={{ margin: '1.5rem 0' }}>
              Finalize structure.<br />Execute delivery.
            </h2>

            <p className="c-body" style={{ maxWidth: 400 }}>
              The raw chaos is organized. The timeline is locked. 
              Your idea is now a fully rendered asset ready for deployment.
            </p>

            <ul className="c-script-bullets">
              <li>High-fidelity rendering</li>
              <li>Dynamic vector scaling</li>
              <li>Seamless deployment pipeline</li>
            </ul>

            <div style={{ marginTop: '2.5rem' }}>
              <Link to="/contact" className="c-btn-secondary" style={{ fontSize: '0.82rem', padding: '0.7rem 1.5rem' }}>
                INITIALIZE PROJECT
              </Link>
            </div>
          </motion.div>
        </div>

        {/* ---- Right: The Terminal Document ---- */}
        <div className="c-script-right" ref={docRef}>
          <motion.div
            className="c-script-doc"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96, rotateX: 10, y: 40 }}
            animate={animated ? { opacity: 1, scale: 1, rotateX: 0, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformPerspective: 1200 }}
          >
            <div className="c-script-doc-header">
              <div style={{ display: 'flex', gap: '6px' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--c-magenta)' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--c-accent)' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--c-cyan)' }} />
              </div>
              <div className="c-mono" style={{ fontSize: '0.65rem', color: 'var(--c-accent)' }}>
                MAIN_SYS_TERMINAL // READY
              </div>
            </div>

            <div className="c-script-doc-body">
              {/* Block 1 */}
              <motion.div
                className="c-script-block"
                initial={shouldReduceMotion ? false : { opacity: 0, x: -10 }}
                animate={animated ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="c-script-block-label">EXEC: INIT_SEQUENCE</div>
                <div className="c-script-line" />
                <div className="c-script-line" style={{ width: '85%' }} />
                <div className="c-script-line short" />
              </motion.div>

              {/* Block 2 */}
              <motion.div
                className="c-script-block"
                initial={shouldReduceMotion ? false : { opacity: 0, x: -10 }}
                animate={animated ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.45 }}
              >
                <div className="c-script-block-label" style={{ color: 'var(--c-magenta)', textShadow: 'var(--glow-magenta)' }}>RUN: RENDER_LOOP</div>
                <div className="c-script-line" style={{ width: '92%' }} />
                <div className="c-script-line short" />
              </motion.div>

              {/* Block 3 */}
              <motion.div
                className="c-script-block"
                initial={shouldReduceMotion ? false : { opacity: 0, x: -10 }}
                animate={animated ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="c-script-block-label" style={{ color: 'var(--c-cyan)' }}>OUT: ASSET_EXPORT</div>
                <div className="c-script-line" style={{ width: '100%' }} />
                <div className="c-script-line" style={{ width: '60%' }} />
                <div className="c-script-line" style={{ width: '40%' }} />
              </motion.div>
            </div>
          </motion.div>
        </div>

      </div>

      <div className="c-section-divider" style={{ marginTop: '6rem' }} />
    </section>
  );
}
