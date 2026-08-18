import React, { useState } from 'react';
import { PlayerData } from '../types';

interface TitleScreenProps {
  saveData: PlayerData | null;
  onStartNew: () => void;
  onContinue: () => void;
  onOpenResetModal: () => void;
}

// Keep the URL ASCII-only so AI Studio does not corrupt the Japanese asset path.
const TITLE_BACKGROUND =
  '/assets/title/%E9%9D%92%E7%A9%BA%E3%81%AB%E6%98%A0%E3%81%88%E3%82%8B%E4%B8%98%E3%81%AE%E3%83%95%E3%82%A1%E3%83%B3%E3%82%BF%E3%82%B8%E3%83%BC%E5%9F%8E%E4%B8%8B%E7%94%BA.png';
const TITLE_LOGO = '/assets/title/KQ_title-logo-transparent-v02.png';
const START_BUTTON = '/assets/title/KQ_title-start-button-transparent-v02.png';

export const TitleScreen: React.FC<TitleScreenProps> = ({
  saveData,
  onStartNew,
  onContinue,
}) => {
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = () => {
    if (isStarting) return;
    setIsStarting(true);

    if (saveData) {
      onContinue();
      return;
    }
    onStartNew();
  };

  return (
    <main
      className="relative min-h-[100svh] w-full overflow-hidden bg-sky-200"
      aria-label="Knowledge Quest タイトル画面"
    >
      <img
        src={TITLE_BACKGROUND}
        alt="青空の下に広がるマスリア王国の城下町"
        className="absolute inset-0 h-full w-full object-cover object-center"
        draggable={false}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-slate-950/10" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1600px] flex-col items-center px-4 py-[clamp(1rem,3vh,2.5rem)] sm:px-8">
        <img
          src={TITLE_LOGO}
          alt="Knowledge Quest ナレッジクエスト"
          className="mt-[clamp(0rem,1vh,1rem)] h-auto w-[min(86vw,880px)] select-none object-contain drop-shadow-[0_8px_12px_rgba(15,23,42,0.28)] lg:w-[55%]"
          draggable={false}
        />

        <div className="flex-1" />

        <button
          type="button"
          onClick={handleStart}
          disabled={isStarting}
          aria-label="ゲームをスタート"
          className="group mb-[clamp(0.5rem,3vh,2rem)] w-[min(72vw,480px)] cursor-pointer rounded-[999px] border-0 bg-transparent p-0 transition-transform duration-150 hover:scale-[1.035] active:scale-[0.97] disabled:cursor-wait disabled:opacity-80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-blue-700 lg:w-[30%]"
        >
          <img
            src={START_BUTTON}
            alt="スタート"
            className="h-auto w-full select-none object-contain drop-shadow-[0_9px_10px_rgba(15,23,42,0.35)]"
            draggable={false}
          />
        </button>
      </div>
    </main>
  );
};

