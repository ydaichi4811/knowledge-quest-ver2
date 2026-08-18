import React from 'react';

export const MathriaBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Sky Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-900 via-indigo-950 to-slate-950" />

      {/* Sun / Light Rays Moving Slowly */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] pointer-events-none">
        {/* Sun Core Orb */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-amber-400/20 blur-3xl" />
        
        {/* Rotating Sun Beam Flare Overlay */}
        <div className="absolute inset-0 animate-sun-ray flex items-center justify-center">
          <div className="w-[600px] h-[600px] rounded-full border-[12px] border-dashed border-amber-300/10" />
          <div className="absolute w-[450px] h-[450px] rounded-full border-[6px] border-dashed border-emerald-300/10" />
        </div>
      </div>

      {/* Moving Drifting Clouds (Multi-layer) */}
      <div className="absolute top-6 left-0 w-44 opacity-30 animate-cloud-1 text-slate-100 text-7xl">
        ☁️
      </div>
      <div className="absolute top-24 left-0 w-56 opacity-20 animate-cloud-2 text-slate-100 text-9xl">
        ☁️
      </div>
      <div className="absolute top-16 left-0 w-36 opacity-25 animate-cloud-1 text-sky-200 text-6xl delay-300">
        ☁️
      </div>

      {/* Distant Castle Silhouettes (マスリア城) */}
      <div className="absolute bottom-32 inset-x-0 flex justify-center opacity-40">
        <svg viewBox="0 0 1000 300" className="w-full max-w-6xl h-52 text-indigo-950 fill-current">
          <path d="M0,300 L0,220 L80,180 L180,250 L280,120 L350,160 L450,50 L470,20 L480,50 L520,20 L530,50 L550,50 L650,160 L750,110 L850,220 L1000,180 L1000,300 Z" />
          <polygon points="500,0 490,30 510,30" className="text-amber-400 fill-current opacity-90" />
        </svg>
      </div>

      {/* Rolling Emerald Green Plains with Swaying Grass Blades */}
      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-emerald-950 via-emerald-900/90 to-transparent">
        {/* Rolling Hills SVG */}
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-28 text-emerald-900/80 fill-current">
          <path d="M0,60 Q300,10 600,60 T1200,40 L1200,120 L0,120 Z" />
        </svg>

        {/* Swaying Grass Vector Overlays */}
        <div className="absolute bottom-0 inset-x-0 flex justify-between px-6 opacity-60">
          <svg className="w-24 h-16 text-emerald-600 fill-current animate-grass-sway-1" viewBox="0 0 100 100">
            <path d="M10,100 Q20,30 30,10 Q35,50 40,100 Q55,40 65,15 Q70,60 80,100 Z" />
          </svg>
          <svg className="w-32 h-20 text-emerald-500 fill-current animate-grass-sway-2" viewBox="0 0 100 100">
            <path d="M5,100 Q15,20 25,5 Q35,45 45,100 Q60,30 70,10 Q75,55 90,100 Z" />
          </svg>
          <svg className="w-28 h-16 text-emerald-600 fill-current animate-grass-sway-1" viewBox="0 0 100 100">
            <path d="M10,100 Q25,35 35,15 Q40,55 50,100 Q65,25 75,5 Q80,50 95,100 Z" />
          </svg>
        </div>
      </div>

      {/* Magic Rune Particle Circles */}
      <div className="absolute top-10 right-10 w-72 h-72 border border-amber-400/20 rounded-full border-dashed animate-[spin_90s_linear_infinite]" />
    </div>
  );
};

