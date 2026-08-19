import { useEffect, useRef } from 'react';
import { FiX, FiCheck } from 'react-icons/fi';
import type { HealthcareTemplate } from '../../data/healthcareTemplates';

interface Props {
  template: HealthcareTemplate | null;
  onClose: () => void;
}

export default function HealthcareTemplateDrawer({ template, onClose }: Props) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (template) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [template, onClose]);

  if (!template) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div 
        ref={drawerRef}
        className="relative w-full max-w-2xl bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col transform transition-transform duration-300 ease-out translate-x-0"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 md:p-8 border-b border-slate-100 bg-white border-b border-slate-100">
          <div className="pr-8">
            <span className="inline-block px-3 py-1 bg-white text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider mb-4 border border-slate-200 shadow-sm">
              {template.category}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-navy-dark font-heading leading-tight mb-2">
              {template.name}
            </h2>
            <p className="text-slate-500 font-light text-sm">
              {template.purpose}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-navy-dark transition-colors"
            aria-label="Close drawer"
          >
            <FiX className="text-2xl" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-10 custom-scrollbar">
          
          {/* Script Structure */}
          <section>
            <h3 className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Script Structure
            </h3>
            <div className="space-y-4">
              {template.scriptStructure.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-200 hover:shadow-sm transition-all">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-bold flex items-center justify-center flex-shrink-0 text-sm border border-blue-100">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-slate-600 text-sm font-light leading-relaxed">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recording Guidelines */}
          <section>
            <h3 className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Recording Guide
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {template.recordingGuidance.map((guide, idx) => (
                <li key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-200 text-sm text-slate-600 font-light shadow-sm">
                  <FiCheck className="text-blue-600 mt-0.5 flex-shrink-0" />
                  {guide}
                </li>
              ))}
            </ul>
          </section>

          {/* Deliverables */}
          <section>
            <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-600 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Deliverables
            </h3>
            <ul className="space-y-3">
              {template.deliverables.map((deliverable, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-slate-600 font-light">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  {deliverable}
                </li>
              ))}
            </ul>
          </section>

        </div>
        
        {/* Footer */}
        <div className="p-6 md:p-8 border-t border-slate-100 bg-white border-b border-slate-100">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-navy-dark hover:bg-navy-dark/90 text-white font-bold rounded-xl shadow-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
