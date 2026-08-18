import React from 'react';
import { FuriganaMode, ReadingItem } from '../types';
import { useFurigana } from '../context/FuriganaContext';
import { parseTextToFuriganaSegments } from '../utils/furiganaDictionary';

export interface FuriganaTextProps {
  text: string;
  readings?: ReadingItem[];
  mode?: FuriganaMode;
  excludeWords?: string[];
  className?: string;
  as?: React.ElementType;
}

export const FuriganaText: React.FC<FuriganaTextProps> = ({
  text,
  readings,
  mode: modeOverride,
  excludeWords: customExclude,
  className = '',
  as: Component = 'span',
}) => {
  const { mode: contextMode, excludeNames: contextExclude } = useFurigana();
  const activeMode = modeOverride || contextMode || 'difficult';

  if (!text) return null;

  if (activeMode === 'off') {
    return <Component className={className}>{text}</Component>;
  }

  const excludeWords = [...(contextExclude || []), ...(customExclude || [])];
  const segments = parseTextToFuriganaSegments(text, activeMode, readings, excludeWords);

  return (
    <Component className={`furigana-text ${className}`}>
      {segments.map((segment, idx) => {
        if (segment.reading) {
          return (
            <ruby key={idx}>
              {segment.text}
              <rp>(</rp>
              <rt>{segment.reading}</rt>
              <rp>)</rp>
            </ruby>
          );
        }
        return <React.Fragment key={idx}>{segment.text}</React.Fragment>;
      })}
    </Component>
  );
};
