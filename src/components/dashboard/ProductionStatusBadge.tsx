import { FiEdit2, FiCheckCircle, FiClock, FiAlertCircle, FiUpload, FiPlay } from 'react-icons/fi';


type ProductionStatus = 'DRAFT' | 'UPLOADED' | 'SUBMITTED' | 'IN_REVIEW' | 'EDITING' | 'READY_FOR_REVIEW' | 'CHANGES_REQUESTED' | 'COMPLETED';

interface BadgeProps {
  status: ProductionStatus;
  className?: string;
}

export default function ProductionStatusBadge({ status, className = '' }: BadgeProps) {
  const config = {
    DRAFT: {
      color: 'bg-slate-100 text-slate-600 border-slate-200',
      icon: <FiEdit2 />,
      label: 'Draft'
    },
    UPLOADED: {
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: <FiUpload />,
      label: 'Uploaded'
    },
    SUBMITTED: {
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      icon: <FiPlay />,
      label: 'Submitted'
    },
    IN_REVIEW: {
      color: 'bg-orange-100 text-orange-700 border-orange-200',
      icon: <FiClock />,
      label: 'In Review'
    },
    EDITING: {
      color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      icon: <FiEdit2 />,
      label: 'Editing'
    },
    READY_FOR_REVIEW: {
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      icon: <FiAlertCircle />,
      label: 'Ready for Review'
    },
    CHANGES_REQUESTED: {
      color: 'bg-red-100 text-red-700 border-red-200',
      icon: <FiAlertCircle />,
      label: 'Changes Requested'
    },
    COMPLETED: {
      color: 'bg-green-100 text-green-700 border-green-200',
      icon: <FiCheckCircle />,
      label: 'Completed'
    }
  };

  const currentConfig = config[status] || config.DRAFT;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${currentConfig.color} ${className}`}>
      {currentConfig.icon}
      {currentConfig.label}
    </div>
  );
}
