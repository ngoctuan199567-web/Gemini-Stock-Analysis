import React from 'react';

interface AnalysisCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ title, icon, children, className = "" }) => {
  return (
    <div className={`bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm ${className}`}>
      <div className="flex items-center gap-2 mb-4 text-slate-300 border-b border-slate-700 pb-2">
        {icon}
        <h3 className="font-semibold text-sm uppercase tracking-wider">{title}</h3>
      </div>
      <div className="text-slate-300">
        {children}
      </div>
    </div>
  );
};

export default AnalysisCard;