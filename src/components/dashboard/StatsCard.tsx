import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  delay?: number;
}

export default function StatsCard({ title, value, icon, trend, delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white rounded-[1.5rem] p-6 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col justify-between"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-xl bg-[#F7F9FC] text-brand-red">
          {icon}
        </div>
        {trend && (
          <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${trend.isPositive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
            {trend.value}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-3xl font-extrabold text-slate-900 mb-1">{value}</h3>
        <p className="text-sm font-semibold text-slate-500">{title}</p>
      </div>
    </motion.div>
  );
}
