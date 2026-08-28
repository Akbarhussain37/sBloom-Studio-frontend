
import { UploadCloud, Scissors, CheckCircle, Check } from 'lucide-react';
import type { Database } from '../../types/database.types';

type ProductionStatus = Database['public']['Enums']['production_status'];

interface Props {
  status: ProductionStatus;
}

const STAGES = [
  { id: 'uploaded', label: 'Video Uploaded', icon: UploadCloud },
  { id: 'editing', label: 'Editing In Progress', icon: Scissors },
  { id: 'completed', label: 'Video Done', icon: CheckCircle },
];

export default function JobLifecycleProgressBar({ status }: Props) {
  // Map the DB enum to our 3 logical stages
  const getStageIndex = (status: ProductionStatus) => {
    switch (status) {
      case 'DRAFT':
      case 'UPLOADED':
      case 'SUBMITTED':
      case 'IN_REVIEW':
        return 0; // Stage 1
      case 'EDITING':
      case 'READY_FOR_REVIEW':
      case 'CHANGES_REQUESTED':
        return 1; // Stage 2
      case 'COMPLETED':
        return 2; // Stage 3
      default:
        return 0;
    }
  };

  const currentStageIndex = getStageIndex(status);

  return (
    <div className="w-full py-6">
      <div className="relative flex justify-between items-center max-w-3xl mx-auto">
        {/* Background Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full" />
        
        {/* Active Line */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-red rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${(currentStageIndex / (STAGES.length - 1)) * 100}%` }}
        />

        {STAGES.map((stage, index) => {
          const isActive = index <= currentStageIndex;
          const isCurrent = index === currentStageIndex;
          const isPast = index < currentStageIndex;
          const Icon = stage.icon;

          return (
            <div key={stage.id} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
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
              <div className="absolute top-14 text-center w-32 -ml-10">
                <span className={`text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
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
