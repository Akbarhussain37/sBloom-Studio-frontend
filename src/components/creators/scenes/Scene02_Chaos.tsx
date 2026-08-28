import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import SceneLabel from '../shared/SceneLabel';

const CHAOS_FRAGMENTS = [
  { id: 'c1', label: 'V_TRACK_01', sx: -80, sy: -60, rotate: 0, comp: 'track_video' },
  { id: 'c2', label: 'A_TRACK_MAIN', sx: 40, sy: -50, rotate: 0, comp: 'track_audio' },
  { id: 'c3', label: 'FX_NODE_01', sx: -60, sy: 40, rotate: 0, comp: 'node' },
  { id: 'c4', label: 'RENDER_QUEUE', sx: 50, sy: 45, rotate: 0, comp: 'queue' },
  { id: 'c5', label: 'SYS_LOG_ERR', sx: -20, sy: -90, rotate: 0, comp: 'log' },
  { id: 'c6', label: 'DATA_STREAM', sx: 80, sy: -20, rotate: 0, comp: 'stream' },
  { id: 'c7', label: 'LUT_PROFILE', sx: 10, sy: 70, rotate: 0, comp: 'lut' },
];

const SPREAD_X = [20, -30, -25, 35, -15, 40, 10];
const SPREAD_Y = [-15, -20, 25, 30, -35, -10, 25];

function ChaosFragContent({ comp }: { comp: string }) {
  switch (comp) {
    case 'track_video':
      return (
        <div style={{ width: 140, height: 28, background: 'rgba(0,240,255,0.05)', border: '1px solid var(--c-accent)', display: 'flex', gap: 2, padding: 2 }}>
          <div style={{ flex: 1, background: 'rgba(0,240,255,0.2)' }} />
          <div style={{ width: 20, background: 'var(--c-accent)' }} />
          <div style={{ flex: 2, background: 'rgba(0,240,255,0.2)' }} />
        </div>
      );
    case 'track_audio':
      return (
        <div style={{ width: 120, height: 24, background: 'rgba(255,0,60,0.05)', border: '1px solid var(--c-magenta)', display: 'flex', alignItems: 'center', padding: '0 4px', gap: 2 }}>
          {[8, 14, 6, 18, 10, 12, 6, 16].map((h, i) => (
            <div key={i} style={{ width: 3, height: h, background: 'var(--c-magenta)', opacity: 0.6 }} />
          ))}
        </div>
      );
    case 'node':
      return (
        <div style={{ width: 60, height: 60, border: '1px solid var(--c-cyan)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,255,255,0.02)', boxShadow: 'var(--glow-accent)' }}>
          <div style={{ width: 30, height: 30, border: '1px dashed var(--c-cyan)', borderRadius: '50%', animation: 'c-spin-slow 4s linear infinite' }} />
        </div>
      );
    case 'queue':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 4, width: 90 }}>
          {['rgba(0,240,255,0.4)', 'rgba(0,240,255,0.2)', 'rgba(0,240,255,0.1)'].map((c, i) => (
            <div key={i} style={{ height: 6, background: c }} />
          ))}
        </div>
      );
    case 'log':
      return (
        <div style={{ width: 150, padding: 6, borderLeft: '2px solid var(--c-magenta)', background: 'rgba(255,0,60,0.05)' }}>
          <div className="c-mono" style={{ fontSize: '0.55rem', color: 'var(--c-magenta)' }}>WARN: ASYNC_OVERLOAD</div>
          <div style={{ height: 2, background: 'var(--c-magenta)', width: '40%', marginTop: 4 }} />
        </div>
      );
    case 'stream':
      return (
        <div style={{ width: 100, height: 40, borderBottom: '1px dashed var(--c-accent)', position: 'relative' }}>
          <div style={{ position: 'absolute', bottom: -2, right: 0, width: 4, height: 4, background: 'var(--c-accent)', boxShadow: 'var(--glow-accent)' }} />
        </div>
      );
    case 'lut':
      return (
        <div style={{ width: 44, height: 44, background: 'linear-gradient(45deg, var(--c-accent), var(--c-magenta))', opacity: 0.2, filter: 'blur(4px)' }} />
      );
    default:
      return null;
  }
}

function ScrollChaos({ scrollYProgress }: { scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'] }) {
  const x0 = useTransform(scrollYProgress, [0, 0.5, 0.85, 1], [0, SPREAD_X[0], SPREAD_X[0] * 2, 0]);
  const y0 = useTransform(scrollYProgress, [0, 0.5, 0.85, 1], [0, SPREAD_Y[0], SPREAD_Y[0] * 2, 30]);
  const o0 = useTransform(scrollYProgress, [0, 0.06, 0.8, 1], [0, 1, 1, 0]);

  const x1 = useTransform(scrollYProgress, [0, 0.5, 0.85, 1], [0, SPREAD_X[1], SPREAD_X[1] * 2, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.5, 0.85, 1], [0, SPREAD_Y[1], SPREAD_Y[1] * 2, 30]);
  const o1 = useTransform(scrollYProgress, [0, 0.06, 0.8, 1], [0, 1, 1, 0]);

  const x2 = useTransform(scrollYProgress, [0, 0.5, 0.85, 1], [0, SPREAD_X[2], SPREAD_X[2] * 2, 0]);
  const y2 = useTransform(scrollYProgress, [0, 0.5, 0.85, 1], [0, SPREAD_Y[2], SPREAD_Y[2] * 2, 30]);
  const o2 = useTransform(scrollYProgress, [0, 0.06, 0.8, 1], [0, 1, 1, 0]);

  const x3 = useTransform(scrollYProgress, [0, 0.5, 0.85, 1], [0, SPREAD_X[3], SPREAD_X[3] * 2, 0]);
  const y3 = useTransform(scrollYProgress, [0, 0.5, 0.85, 1], [0, SPREAD_Y[3], SPREAD_Y[3] * 2, 30]);
  const o3 = useTransform(scrollYProgress, [0, 0.06, 0.8, 1], [0, 1, 1, 0]);

  const x4 = useTransform(scrollYProgress, [0, 0.5, 0.85, 1], [0, SPREAD_X[4], SPREAD_X[4] * 2, 0]);
  const y4 = useTransform(scrollYProgress, [0, 0.5, 0.85, 1], [0, SPREAD_Y[4], SPREAD_Y[4] * 2, 30]);
  const o4 = useTransform(scrollYProgress, [0, 0.06, 0.8, 1], [0, 1, 1, 0]);

  const x5 = useTransform(scrollYProgress, [0, 0.5, 0.85, 1], [0, SPREAD_X[5], SPREAD_X[5] * 2, 0]);
  const y5 = useTransform(scrollYProgress, [0, 0.5, 0.85, 1], [0, SPREAD_Y[5], SPREAD_Y[5] * 2, 30]);
  const o5 = useTransform(scrollYProgress, [0, 0.06, 0.8, 1], [0, 1, 1, 0]);

  const x6 = useTransform(scrollYProgress, [0, 0.5, 0.85, 1], [0, SPREAD_X[6], SPREAD_X[6] * 2, 0]);
  const y6 = useTransform(scrollYProgress, [0, 0.5, 0.85, 1], [0, SPREAD_Y[6], SPREAD_Y[6] * 2, 30]);
  const o6 = useTransform(scrollYProgress, [0, 0.06, 0.8, 1], [0, 1, 1, 0]);

  const headlineOpacity = useTransform(scrollYProgress, [0.25, 0.4, 0.78, 0.92], [0, 1, 1, 0]);
  const headlineY = useTransform(scrollYProgress, [0.25, 0.4], [20, 0]);
  const labelOpacity = useTransform(scrollYProgress, [0.35, 0.5, 0.8, 0.92], [0, 1, 1, 0]);

  const transforms = [
    { x: x0, y: y0, o: o0 },
    { x: x1, y: y1, o: o1 },
    { x: x2, y: y2, o: o2 },
    { x: x3, y: y3, o: o3 },
    { x: x4, y: y4, o: o4 },
    { x: x5, y: y5, o: o5 },
    { x: x6, y: y6, o: o6 },
  ];

  return (
    <div className="c-chaos-canvas" aria-hidden="true">
      {CHAOS_FRAGMENTS.map((frag, index) => {
        const t = transforms[index];
        return (
          <motion.div
            key={frag.id}
            className="c-fragment"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              x: t.x,
              y: t.y,
              opacity: t.o,
              marginLeft: frag.sx,
              marginTop: frag.sy,
            }}
            aria-hidden="true"
          >
            <ChaosFragContent comp={frag.comp} />
            <motion.span
              className="c-chaos-tag"
              style={{ position: 'absolute', display: 'block', top: -20, left: 0, opacity: labelOpacity }}
            >
              {frag.label}
            </motion.span>
          </motion.div>
        );
      })}

      <motion.div
        className="c-chaos-headline"
        style={{ opacity: headlineOpacity, y: headlineY }}
      >
        <p className="c-label" style={{ marginBottom: '0.75rem' }}>TIMELINE INJECTION</p>
        <h2 className="c-h2">
          RAW DATA PROCESSING.
        </h2>
        <p className="c-body" style={{ marginTop: '1rem' }}>
          Assets compile. Variables map. Rendering initialized.
        </p>
      </motion.div>
    </div>
  );
}

export default function Scene02_Chaos() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  if (shouldReduceMotion) {
    return (
      <section
        className="c-chaos"
        id="scene-02-chaos"
        data-scene="chaos"
        style={{ padding: '6rem 0' }}
      >
        <div className="c-scene-inner">
          <SceneLabel number="02" label="TIMELINE" />
          <h2 className="c-h2" style={{ marginBottom: '2rem' }}>RAW DATA PROCESSING.</h2>
          <p className="c-body" style={{ marginBottom: '2.5rem' }}>Assets compile. Variables map.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-start' }}>
            {CHAOS_FRAGMENTS.map(f => (
              <div key={f.id} style={{ position: 'relative' }}>
                <ChaosFragContent comp={f.comp} />
                <div className="c-chaos-tag" style={{ position: 'relative', display: 'block', marginTop: 6 }}>
                  {f.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="c-chaos" id="scene-02-chaos" data-scene="chaos">
      <div ref={containerRef} style={{ height: '220vh' }}>
        <div className="c-chaos-sticky">
          <ScrollChaos scrollYProgress={scrollYProgress} />
        </div>
      </div>
    </section>
  );
}
