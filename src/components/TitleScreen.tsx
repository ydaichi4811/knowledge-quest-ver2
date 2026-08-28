import React, { useState } from 'react';
import { PlayerData } from '../types';

interface TitleScreenProps {
  saveData: PlayerData | null;
  onStartNew: () => void;
  onContinue: () => void;
  onOpenResetModal: () => void;
}

// Public assets keep stable filenames on GitHub Pages. Bump this version when
// replacing them so browsers do not reuse an older, broken transparent image.
const TITLE_ASSET_VERSION = '20260827-2';
const BACKGROUND = `${import.meta.env.BASE_URL}assets/title/app-background-v2.webp?v=${TITLE_ASSET_VERSION}`;
const TITLE_LOGO = `${import.meta.env.BASE_URL}assets/title/title-logo-v2.webp?v=${TITLE_ASSET_VERSION}`;
const START_BUTTON = `${import.meta.env.BASE_URL}assets/title/title-start-v2.webp?v=${TITLE_ASSET_VERSION}`;
export const TitleScreen: React.FC<TitleScreenProps> = ({
  saveData,
  onStartNew,
  onContinue,
}) => {
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = () => {
    if (isStarting) return;
    setIsStarting(true);
    if (saveData) onContinue();
    else onStartNew();
  };

  return (
    <main
      className="relative isolate min-h-[100svh] w-full overflow-hidden"
      aria-label="Knowledge Quest タイトル画面"
    >
      <img
        src={BACKGROUND}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 z-0 h-full w-full object-cover object-center"
        draggable={false}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/5 via-transparent to-slate-950/25" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1500px] flex-col items-center justify-between px-4 py-[clamp(1rem,4vh,3rem)] sm:px-8">
        <img
          src={TITLE_LOGO}
          alt="Knowledge Quest ナレッジクエスト"
          className="mt-[clamp(0.25rem,2vh,1.5rem)] h-auto max-h-[55svh] w-[min(94vw,1000px)] select-none object-contain drop-shadow-[0_14px_18px_rgba(15,23,42,0.5)]"
          draggable={false}
        />

        <button
          type="button"
          onClick={handleStart}
          disabled={isStarting}
          aria-label="ゲームをスタート"
          className="group relative mb-[clamp(0rem,2vh,1.5rem)] max-h-[30svh] w-[min(78vw,500px)] cursor-pointer border-0 bg-transparent p-0 transition-transform duration-150 hover:scale-[1.04] hover:brightness-110 active:translate-y-1 active:scale-[0.98] disabled:cursor-wait disabled:opacity-80 focus-visible:rounded-3xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/90"
        >
          <img src={START_BUTTON} alt="" aria-hidden="true" className="h-auto max-h-[30svh] w-full select-none object-contain drop-shadow-[0_12px_10px_rgba(15,23,42,0.5)]" draggable={false} />
        </button>
      </div>
    </main>
  );
};
