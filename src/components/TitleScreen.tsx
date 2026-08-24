import React, { useState } from 'react';
import { PlayerData } from '../types';

interface TitleScreenProps {
  saveData: PlayerData | null;
  onStartNew: () => void;
  onContinue: () => void;
  onOpenResetModal: () => void;
}

const BACKGROUND = `${import.meta.env.BASE_URL}assets/title/app-background.png`;
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
        <div className="mt-[clamp(0.5rem,4vh,3rem)] w-[min(92vw,900px)] text-center drop-shadow-[0_12px_18px_rgba(15,23,42,0.45)]">
          <div className="rounded-[2rem] border-[3px] border-amber-200 bg-gradient-to-b from-[#143e80]/95 via-[#082c68]/95 to-[#061d48]/95 px-4 py-5 shadow-[inset_0_0_0_4px_#b67a18,inset_0_0_28px_rgba(87,170,255,0.55),0_0_0_3px_#6d4308] sm:px-10 sm:py-8">
            <div aria-hidden="true" className="mx-auto mb-2 h-3 w-3 rotate-45 border border-amber-100 bg-sky-400 shadow-[0_0_14px_#7dd3fc] sm:h-4 sm:w-4" />
            <h1 className="font-cinzel text-[clamp(2.25rem,8vw,6.3rem)] font-black leading-[0.9] tracking-[-0.05em] text-amber-100 [text-shadow:0_3px_0_#8b5a12,0_6px_0_#3b2105,0_9px_18px_rgba(0,0,0,0.65)]">
              Knowledge Quest
            </h1>
            <div className="mx-auto my-3 h-[2px] w-4/5 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
            <p className="text-[clamp(1rem,3.2vw,2rem)] font-black tracking-[0.18em] text-white [text-shadow:0_2px_2px_#0f2b59]">
              ナレッジクエスト
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleStart}
          disabled={isStarting}
          aria-label="ゲームをスタート"
          className="mb-[clamp(0rem,2vh,1.5rem)] w-[min(72vw,410px)] cursor-pointer rounded-2xl border-[3px] border-amber-200 bg-gradient-to-b from-[#1977dc] via-[#0752ad] to-[#063877] px-8 py-4 text-[clamp(1.5rem,5vw,2.6rem)] font-black tracking-[0.14em] text-white shadow-[inset_0_0_0_3px_#b67a18,inset_0_5px_9px_rgba(255,255,255,0.28),0_9px_0_#4c2d05,0_15px_22px_rgba(15,23,42,0.5)] transition-transform duration-150 [text-shadow:0_3px_2px_#092d64] hover:scale-[1.04] hover:brightness-110 active:translate-y-1 active:scale-[0.98] active:shadow-[inset_0_0_0_3px_#b67a18,0_5px_0_#4c2d05] disabled:cursor-wait disabled:opacity-75 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/90"
        >
          {isStarting ? '読み込み中…' : saveData ? 'つづきから' : 'スタート'}
        </button>
      </div>
    </main>
  );
};

