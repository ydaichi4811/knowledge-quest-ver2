import React from 'react';
import { Plus } from 'lucide-react';

export interface EnergyGaugeProps {
  current?: number;
  max?: number;
  onAddEnergy?: () => void;
  className?: string;
}

export const EnergyGauge: React.FC<EnergyGaugeProps> = ({
  current = 84,
  max = 100,
  onAddEnergy,
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((current / max) * 100)));

  return (
    <div className={`border border-[#c2b08d] bg-[#ebdcc0] px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-sm shrink-0 select-none ${className}`}>
      <span className="text-sm leading-none shrink-0 text-amber-600">⚡</span>
      <div className="w-14 sm:w-16 bg-[#c5b492] h-2.5 rounded-full overflow-hidden relative border border-[#aa9978] shrink-0">
        <div
          className="bg-gradient-to-r from-blue-500 to-sky-400 h-full rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="font-black text-xs text-[#3a2817] font-mono tracking-tight shrink-0">
        {current}/{max}
      </span>
      <button
        type="button"
        onClick={onAddEnergy}
        title="エネルギーを回復"
        className="w-5 h-5 bg-[#d8c7a6] hover:bg-[#caa368] active:bg-[#b89155] rounded-lg border border-[#9d8964] flex items-center justify-center text-[#3a2817] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 shrink-0 transition-colors"
      >
        <Plus className="w-3 h-3 stroke-[3]" />
      </button>
    </div>
  );
};
