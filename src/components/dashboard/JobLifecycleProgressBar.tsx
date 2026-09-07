
import { UploadCloud, Scissors, CheckCircle, Check } from 'lucide-react';
import type { Database } from '../../types/database.types';

interface Props {
  completionPercentage: number;
}

const STAGES = [
  { id: 'uploaded', label: 'Video Uploaded', icon: UploadCloud },
  { id: 'editing', label: 'Editing In Progress', icon: Scissors },
  { id: 'completed', label: 'Video Done', icon: CheckCircle },
];

export default function JobLifecycleProgressBar({ completionPercentage }: Props) {
  // Determine logical stage based on percentage
  let currentStageIndex = 0;
  if (completionPercentage >= 50 && completionPercentage < 100) {
    currentStageIndex = 1;
  } else if (completionPercentage === 100) {
    currentStageIndex = 2;
  }

  return (
    <div className="w-full py-6 px-10">
      <div className="relative flex justify-between items-center max-w-2xl mx-auto">
        {/* Background Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 rounded-full" />
        
        {/* Active Line */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-red rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${completionPercentage}%` }}
        />

        {STAGES.map((stage, index) => {
          const isActive = index <= currentStageIndex;
          const isCurrent = index === currentStageIndex;
          const isPast = index < currentStageIndex;
          const Icon = stage.icon;

          return (
            <div key={stage.id} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                  isActive 
                    ? 'bg-brand-red border-red-100 text-white shadow-lg shadow-red-500/30' 
                    : 'bg-white border-gray-200 text-gray-400'
                } ${isCurrent ? 'scale-110' : 'scale-100'}`}
              >
                {isPast ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center w-32">
                <span className={`text-xs font-bold ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>
                  {stage.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
