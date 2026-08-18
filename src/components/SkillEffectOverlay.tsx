import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HeroSkillDef, CompanionSkillDef, SpecialCoopSkillDef } from '../data/stageData';

interface SkillEffectOverlayProps {
  skill: HeroSkillDef | CompanionSkillDef | SpecialCoopSkillDef | null;
  performerType: 'hero' | 'companion' | 'special_coop';
  showSkillName?: boolean;
  onAnimationComplete?: () => void;
}

export const SkillEffectOverlay: React.FC<SkillEffectOverlayProps> = ({
  skill,
  performerType,
  showSkillName = true,
}) => {
  if (!skill) return null;

  const isSpecialCoop = performerType === 'special_coop';

  return (
    <AnimatePresence>
      <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
        {/* Special Coop Background Light Burst */}
        {isSpecialCoop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.8, 0], scale: [0.8, 1.8, 2.2] }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute inset-0 bg-gradient-to-r from-amber-500/30 via-fuchsia-500/40 to-cyan-500/30 rounded-full blur-2xl"
          />
        )}

        {/* Slash / Flash Graphic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.2, rotate: -20 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.3, 1.2, 1, 0.8], rotate: [-20, 0, 10] }}
          transition={{ duration: 1.2, times: [0, 0.2, 0.8, 1] }}
          className="relative flex flex-col items-center justify-center"
        >
          {/* Visual Effect Elements */}
          {!isSpecialCoop && (
            <div className="relative">
              <div className="text-7xl sm:text-8xl filter drop-shadow-[0_0_20px_rgba(251,191,36,0.8)] animate-bounce">
                {skill.icon}
              </div>
              <div className="absolute -inset-4 bg-amber-400/20 blur-xl rounded-full" />
            </div>
          )}

          {isSpecialCoop && (
            <div className="flex items-center gap-4 text-7xl sm:text-8xl drop-shadow-[0_0_25px_rgba(236,72,153,0.9)]">
              <span>🗡️</span>
              <span className="text-5xl text-amber-300 font-black">×</span>
              <span>🌟</span>
            </div>
          )}

          {/* Skill Name Banner */}
          {showSkillName && (
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className={`mt-4 px-6 py-2.5 rounded-2xl border shadow-2xl backdrop-blur-md text-center ${
                isSpecialCoop
                  ? 'bg-gradient-to-r from-amber-600 via-fuchsia-600 to-indigo-600 border-amber-300 text-white'
                  : performerType === 'hero'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-300 text-white'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-300 text-white'
              }`}
            >
              <div className="text-[10px] sm:text-xs font-bold tracking-widest text-amber-200 uppercase">
                {isSpecialCoop
                  ? '超協力必殺技発動！'
                  : performerType === 'hero'
                  ? '主人公の技！'
                  : '相棒の技！'}
              </div>
              <div className="text-xl sm:text-3xl font-black tracking-wider text-amber-100 flex items-center justify-center gap-2">
                <span>{skill.icon}</span>
                <span>{skill.name}</span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
