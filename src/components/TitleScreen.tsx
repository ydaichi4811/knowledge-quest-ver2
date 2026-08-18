import React, { useEffect, useState } from 'react';
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
const TITLE_LOGO = '/assets/title/KQ_title-logo_transparent_v01.png';
const START_BUTTON = '/assets/title/KQ_title-start-button_transparent_v01.png';

interface ChromaKeyImageProps {
  src: string;
  alt: string;
  className: string;
}

const ChromaKeyImage: React.FC<ChromaKeyImageProps> = ({
  src,
  alt,
  className,
}) => {
  const [processedSrc, setProcessedSrc] = useState<string>();

  useEffect(() => {
    let active = true;
    const source = new Image();

    source.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = source.naturalWidth;
      canvas.height = source.naturalHeight;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) return;

      context.drawImage(source, 0, 0);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let minX = canvas.width;
      let minY = canvas.height;
      let maxX = -1;
      let maxY = -1;

      for (let y = 0; y < canvas.height; y += 1) {
        for (let x = 0; x < canvas.width; x += 1) {
          const index = (y * canvas.width + x) * 4;
          const red = pixels[index];
          const green = pixels[index + 1];
          const blue = pixels[index + 2];
          const isMagenta = red > 185 && blue > 155 && green < 135;

          if (isMagenta) {
            pixels[index + 3] = 0;
          } else {
            // The source PNGs contain valid RGB artwork but damaged alpha data.
            // Restore all non-key pixels to full opacity before calculating bounds.
            pixels[index + 3] = 255;
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        }
      }

      context.putImageData(imageData, 0, 0);
      if (maxX < minX || maxY < minY) return;

      const padding = 8;
      const cropX = Math.max(0, minX - padding);
      const cropY = Math.max(0, minY - padding);
      const cropWidth = Math.min(canvas.width - cropX, maxX - minX + 1 + padding * 2);
      const cropHeight = Math.min(canvas.height - cropY, maxY - minY + 1 + padding * 2);
      const cropped = document.createElement('canvas');
      cropped.width = cropWidth;
      cropped.height = cropHeight;
      cropped
        .getContext('2d')
        ?.drawImage(canvas, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

      if (active) setProcessedSrc(cropped.toDataURL('image/png'));
    };

    source.src = src;
    return () => {
      active = false;
    };
  }, [src]);

  if (!processedSrc) return null;
  return <img src={processedSrc} alt={alt} className={className} draggable={false} />;
};

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
        <ChromaKeyImage
          src={TITLE_LOGO}
          alt="Knowledge Quest ナレッジクエスト"
          className="mt-[clamp(0rem,1vh,1rem)] h-auto w-[min(86vw,880px)] select-none object-contain drop-shadow-[0_8px_12px_rgba(15,23,42,0.28)] lg:w-[55%]"
        />

        <div className="flex-1" />

        <button
          type="button"
          onClick={handleStart}
          disabled={isStarting}
          aria-label="ゲームをスタート"
          className="group mb-[clamp(0.5rem,3vh,2rem)] w-[min(72vw,480px)] cursor-pointer rounded-[999px] border-0 bg-transparent p-0 transition-transform duration-150 hover:scale-[1.035] active:scale-[0.97] disabled:cursor-wait disabled:opacity-80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-blue-700 lg:w-[30%]"
        >
          <ChromaKeyImage
            src={START_BUTTON}
            alt="スタート"
            className="h-auto w-full select-none object-contain drop-shadow-[0_9px_10px_rgba(15,23,42,0.35)]"
          />
        </button>
      </div>
    </main>
  );
};

