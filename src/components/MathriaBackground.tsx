import React from 'react';

const SHARED_BACKGROUND = `${import.meta.env.BASE_URL}assets/title/app-background-v2.webp?v=20260827-2`;

export const MathriaBackground: React.FC = () => (
  <div
    className="fixed inset-0 z-0 select-none overflow-hidden pointer-events-none"
    aria-hidden="true"
  >
    <img
      src={SHARED_BACKGROUND}
      alt=""
      className="h-full w-full object-cover object-center"
      draggable={false}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-sky-950/10 via-slate-950/15 to-slate-950/55" />
  </div>
);
