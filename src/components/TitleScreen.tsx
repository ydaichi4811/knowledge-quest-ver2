import React, { useState } from 'react';
import { PlayerData } from '../types';

interface TitleScreenProps {
  saveData: PlayerData | null;
  onStartNew: () => void;
  onContinue: () => void;
  onOpenResetModal: () => void;
}

const BACKGROUND = '/assets/title/app-background.png';
const LOGO = '/assets/title/title-logo-final.png';
const START_BUTTON = '/assets/title/title-start-final.png';

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
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        draggable={false}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/5 via-transparent to-slate-950/25" />

      <div className="mx-auto flex min-h-[100svh] w-full max-w-[1500px] flex-col items-center justify-between px-4 py-[clamp(1rem,4vh,3rem)] sm:px-8">
        <img
          src={LOGO}
          alt="Knowledge Quest ナレッジクエスト"
          className="h-auto max-h-[48svh] w-[min(88vw,820px)] object-contain drop-shadow-[0_10px_14px_rgba(15,23,42,0.35)]"
          draggable={false}
        />

        <button
          type="button"
          onClick={handleStart}
          disabled={isStarting}
          aria-label="ゲームをスタート"
          className="mb-[clamp(0rem,2vh,1.5rem)] w-[min(62vw,410px)] cursor-pointer border-0 bg-transparent p-0 transition-transform duration-150 hover:scale-[1.04] active:scale-[0.97] disabled:cursor-wait disabled:opacity-75 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/90"
        >
          <img
            src={START_BUTTON}
            alt="スタート"
            className="h-auto w-full object-contain drop-shadow-[0_10px_12px_rgba(15,23,42,0.4)]"
            draggable={false}
          />
        </button>
      </div>
    </main>
  );
};

