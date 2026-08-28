import { useEffect, useState } from 'react';

const STEPS = [
  { id: 'scene-01-hero',    label: 'IDEA' },
  { id: 'scene-02-chaos',   label: 'CHAOS' },
  { id: 'scene-03-script',  label: 'SCRIPT' },
];

export default function CreatorsProgressNav() {
  const [active, setActive] = useState('scene-01-hero');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    STEPS.forEach(step => {
      const el = document.getElementById(step.id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActive(step.id);
          }
        },
        { rootMargin: '-35% 0px -35% 0px', threshold: 0 }
      );

      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <nav
      className="c-progress-nav"
      aria-label="Story progress"
      role="navigation"
    >
      <div className="c-progress-nav-label" aria-hidden="true">
        THE JOURNEY
      </div>
      {STEPS.map(step => (
        <a
          key={step.id}
          href={`#${step.id}`}
          className={`c-progress-item${active === step.id ? ' active' : ''}`}
          aria-current={active === step.id ? 'location' : undefined}
        >
          <div className={`c-progress-dot${active === step.id ? ' active' : ''}`} />
          <span className="c-progress-step">{step.label}</span>
        </a>
      ))}
    </nav>
  );
}
