import React, { createContext, useContext } from 'react';
import { FuriganaMode } from '../types';

interface FuriganaContextType {
  mode: FuriganaMode;
  setMode?: (mode: FuriganaMode) => void;
  excludeNames?: string[];
}

const FuriganaContext = createContext<FuriganaContextType>({
  mode: 'difficult',
});

export const FuriganaProvider: React.FC<{
  mode: FuriganaMode;
  setMode?: (mode: FuriganaMode) => void;
  excludeNames?: string[];
  children: React.ReactNode;
}> = ({ mode = 'difficult', setMode, excludeNames = [], children }) => {
  return (
    <FuriganaContext.Provider value={{ mode, setMode, excludeNames }}>
      {children}
    </FuriganaContext.Provider>
  );
};

export const useFurigana = () => useContext(FuriganaContext);
