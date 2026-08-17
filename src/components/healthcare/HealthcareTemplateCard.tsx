import { FiPlayCircle, FiClock, FiArrowRight } from 'react-icons/fi';
import type { HealthcareTemplate } from '../../data/healthcareTemplates';

interface Props {
  template: HealthcareTemplate;
  onClick: () => void;
  isFeatured?: boolean;
}

export default function HealthcareTemplateCard({ template, onClick, isFeatured = false }: Props) {
  
  if (isFeatured) {
    return (
      <div 
        onClick={onClick}
        className="group relative rounded-[2rem] overflow-hidden cursor-pointer h-full min-h-[400px] border border-slate-200 bg-slate-900 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:shadow-blue-900/20 hover:-translate-y-1 transition-all duration-500"
      >
        {/* Full Bleed Image */}
        <div className="absolute inset-0">
          <img 
            src="/assets/images/healthcare_template_thumb.png" 
            alt={template.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out opacity-90"
          />
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C]/90 via-[#0A0F1C]/40 to-transparent z-10" />
        </div>
        
        {/* Play Button Overlay - Center */}
        <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-2xl transform group-hover:scale-110 transition-transform duration-500">
            <FiPlayCircle className="text-4xl text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-6 left-6 z-20 flex gap-3">
          <span className="px-4 py-1.5 bg-blue-600 border border-blue-500 rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-lg">
            Featured
          </span>
          <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-lg">
            {template.category}
          </span>
        </div>

        {/* Bottom Content Area */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 z-20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-md text-xs font-medium text-slate-200">
              <FiClock className="text-blue-400" /> {template.duration}
            </div>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-white font-heading mb-3 drop-shadow-md">
            {template.name}
          </h3>
          <p className="text-base md:text-lg text-slate-300 font-light max-w-2xl line-clamp-2 drop-shadow-sm mb-6">
            {template.purpose}
          </p>
          
          <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
            Preview Format <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className="group relative rounded-[1.5rem] overflow-hidden cursor-pointer bg-white border border-slate-200 hover:border-blue-400 transition-all duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-xl hover:-translate-y-1 flex flex-col h-full"
    >
      {/* Thumbnail Area */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 flex-shrink-0">
        <img 
          src="/assets/images/healthcare_template_thumb.png" 
          alt={template.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-navy-dark/10 transition-all duration-300">
          <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
            <FiPlayCircle className="text-2xl text-blue-600" />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 z-20">
          <span className="px-3 py-1 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-full text-[10px] font-bold text-navy-dark uppercase tracking-wider shadow-sm">
            {template.category}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex-1 flex flex-col z-20 relative bg-white">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-3">
          <FiClock className="text-blue-500" /> {template.duration}
        </div>
        <h3 className="text-xl font-bold text-navy-dark font-heading mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
          {template.name}
        </h3>
        <p className="text-sm text-slate-500 font-light line-clamp-2 leading-relaxed">
          {template.purpose}
        </p>
      </div>
    </div>
  );
}
