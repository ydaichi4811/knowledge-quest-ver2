import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { PlayerData, CompanionExpression } from '../types';
import { BuddyCharacter } from './BuddyCharacter';
import { careCompanion, setCompanionNameAndHatch } from '../services/companionService';
import { savePlayerData } from '../services/gameStorage';
import { updateDailyMissionProgress } from '../services/dailyMissionService';
import { ROOM_THEMES } from '../services/itemAndRoomService';
import { CompanionGrowthRecordModal } from './CompanionGrowthRecordModal';
import { CompanionProfileCard } from './CompanionProfileCard';
import { CompanionZukanView } from './CompanionZukanView';
import { CompanionInventoryModal } from './CompanionInventoryModal';
import { CompanionRoomDecorationModal } from './CompanionRoomDecorationModal';
import {
  Heart,
  Sparkles,
  X,
  Edit3,
  Award,
  Utensils,
  Smile,
  Zap,
  MessageSquare,
  Home,
  Check,
  BookOpen,
  UserCheck,
  Package,
  Palette,
} from 'lucide-react';

interface CompanionRoomModalProps {
  player: PlayerData;
  onClose: () => void;
  onPlayerUpdate: (updatedPlayer: PlayerData) => void;
}

export const CompanionRoomModal: React.FC<CompanionRoomModalProps> = ({
  player,
  onClose,
  onPlayerUpdate,
}) => {
  const comp = player.companion!;
  const [expression, setExpression] = useState<CompanionExpression>('normal');
  const [statusMessage, setStatusMessage] = useState<string>(
    comp.stage === 'egg'
      ? 'タマゴの中で知識の光が心地よさそうに揺れているよ。'
      : `「${player.nickname || player.name}、今日も一緒にお勉強がんばろう！」`
  );
  const [isEditingName, setIsEditingName] = useState(false);
  const [inputName, setInputName] = useState(comp.name);
  const [showGrowthRecordModal, setShowGrowthRecordModal] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [showZukanView, setShowZukanView] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showDecorationModal, setShowDecorationModal] = useState(false);

  const roomData = player.companionRoom;
  const roomThemeDef = ROOM_THEMES[roomData?.roomThemeId || 'hajimari'] || ROOM_THEMES.hajimari;

  const handleCareAction = (
    actionType: 'polish' | 'talk_egg' | 'pet' | 'feed' | 'play' | 'talk'
  ) => {
    const careRes = careCompanion(player, actionType);

    let updatedPlayer = careRes.updatedPlayer;
    if (careRes.rewardClaimed) {
      if (actionType === 'talk' || actionType === 'talk_egg') {
        updatedPlayer = updateDailyMissionProgress(updatedPlayer, 'talk_companion_1', 1);
      }
      if (actionType === 'play' || actionType === 'pet' || actionType === 'polish') {
        updatedPlayer = updateDailyMissionProgress(updatedPlayer, 'play_companion_1', 1);
      }
    }

    savePlayerData(updatedPlayer);
    onPlayerUpdate(updatedPlayer);

    setStatusMessage(careRes.message);
    setExpression(careRes.reactionExpression);

    if (careRes.rewardClaimed) {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.6 },
      });
    }

    // Reset expression back to normal after 3s
    setTimeout(() => {
      setExpression('normal');
    }, 3000);
  };

  const handleSaveName = () => {
    const cleaned = inputName.trim().substring(0, 8) || comp.name;
    const updatedComp = {
      ...comp,
      name: cleaned,
    };
    const updatedPlayer: PlayerData = {
      ...player,
      companion: updatedComp,
    };

    savePlayerData(updatedPlayer);
    onPlayerUpdate(updatedPlayer);
    setIsEditingName(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl game-card p-5 sm:p-7 relative border-2 border-emerald-400/80 shadow-2xl my-auto space-y-5"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-800 transition-all cursor-pointer z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-emerald-300 font-cinzel">
                相棒の部屋 ～PARTNER ROOM～
              </h3>
              <p className="text-[11px] text-slate-300">
                お世話・もちもの使用・模様替え・図鑑閲覧ができます
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setShowInventoryModal(true)}
              className="flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/50 px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Package className="w-3.5 h-3.5 text-amber-400" />
              <span>もちもの 🎒</span>
            </button>

            <button
              onClick={() => setShowDecorationModal(true)}
              className="flex items-center gap-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/50 px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5 text-emerald-400" />
              <span>模様替え 🎨</span>
            </button>

            <button
              onClick={() => setShowProfileCard(true)}
              className="flex items-center gap-1 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-400/50 px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>カード</span>
            </button>

            <button
              onClick={() => setShowZukanView(true)}
              className="flex items-center gap-1 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-400/50 px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-teal-400" />
              <span>図鑑 📚</span>
            </button>

            <button
              onClick={() => setShowGrowthRecordModal(true)}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>記録 📜</span>
            </button>
          </div>
        </div>

        {/* Room Main Stage Container with Dynamic Theme Background */}
        <div className={`bg-gradient-to-b ${roomThemeDef.bgClass} p-5 rounded-3xl border-2 border-emerald-500/40 relative space-y-4 shadow-inner overflow-hidden transition-all duration-500`}>
          {/* Top Info Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            {/* Name & Rename */}
            <div className="flex items-center gap-2">
              {isEditingName ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    maxLength={8}
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    className="bg-slate-900 border border-amber-400 rounded-lg px-2 py-1 text-xs font-bold text-amber-200"
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-1 bg-amber-500 text-slate-950 rounded-lg font-bold text-xs"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-base text-amber-200">
                    {comp.name}
                  </span>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-slate-400 hover:text-amber-300 p-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <span className="text-[10px] font-black text-slate-950 bg-emerald-400 px-2 py-0.5 rounded-full">
                {comp.stage === 'egg' ? 'タマゴ' : comp.stage === 'hatched' ? '誕生' : '幼体'}
              </span>
            </div>

            {/* Level & Food */}
            <div className="flex items-center gap-3 text-xs font-bold text-slate-200">
              <span className="text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                Lv.{comp.level}
              </span>
              <button
                onClick={() => setShowInventoryModal(true)}
                className="text-amber-300 bg-amber-950 hover:bg-amber-900 px-2.5 py-1 rounded-lg border border-amber-500/30 flex items-center gap-1 cursor-pointer"
              >
                <Package className="w-3.5 h-3.5 text-amber-400" />
                <span>もちものを見る</span>
              </button>
            </div>
          </div>

          {/* Speech Bubble & Avatar Stage */}
          <div className="flex flex-col items-center justify-center py-4 space-y-4">
            {/* Speech Bubble */}
            <div className="relative bg-amber-950/90 border-2 border-amber-400/80 px-4 py-2.5 rounded-2xl max-w-md text-center text-xs font-bold text-amber-200 shadow-lg">
              <p>{statusMessage}</p>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-amber-400/80" />
            </div>

            {/* Avatar Display */}
            <div className="p-4 bg-slate-950/60 rounded-full border border-emerald-400/30 shadow-2xl relative">
              <BuddyCharacter
                player={player}
                companion={comp}
                stage={comp.stage}
                expression={expression}
                size="xl"
                animationEnabled={player.companionSettings?.partnerAnimationEnabled ?? true}
                onClick={() => handleCareAction(comp.stage === 'egg' ? 'polish' : 'pet')}
              />
            </div>
          </div>

          {/* Gauges Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/90 p-3.5 rounded-2xl border border-slate-800 text-xs">
            {/* Knowledge Energy Growth Bar */}
            <div className="space-y-1">
              <div className="flex justify-between font-bold text-slate-300">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Zap className="w-3.5 h-3.5" />
                  知識エネルギー
                </span>
                <span className="text-amber-300 font-mono">
                  {comp.growthExp} EXP
                </span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full border border-slate-700 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (comp.growthExp / (comp.stage === 'egg' ? 50 : 150)) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Bond Bar */}
            <div className="space-y-1">
              <div className="flex justify-between font-bold text-slate-300">
                <span className="flex items-center gap-1 text-rose-400">
                  <Heart className="w-3.5 h-3.5" />
                  きずなポイント
                </span>
                <span className="text-rose-300 font-mono">{comp.bond} P</span>
              </div>
              <div className="w-full h-3 bg-slate-900 rounded-full border border-slate-700 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-pink-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, (comp.bond / 100) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Care Action Buttons Section (お世話) */}
        <div className="space-y-2">
          <div className="text-xs font-black text-amber-300 flex items-center justify-between font-cinzel">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>今日のお世話・触れ合い</span>
            </span>
            <button
              onClick={() => setShowInventoryModal(true)}
              className="text-[11px] text-amber-400 hover:underline cursor-pointer"
            >
              アイテムを使う 🎒
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {comp.stage === 'egg' ? (
              <>
                <button
                  onClick={() => handleCareAction('polish')}
                  className="btn-royal-gold p-3 rounded-xl text-xs font-black flex flex-col items-center justify-center gap-1 shadow-md cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>タマゴをみがく</span>
                </button>
                <button
                  onClick={() => handleCareAction('talk_egg')}
                  className="btn-royal-emerald p-3 rounded-xl text-xs font-black flex flex-col items-center justify-center gap-1 shadow-md cursor-pointer"
                >
                  <MessageSquare className="w-5 h-5 text-emerald-300" />
                  <span>声をかける</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleCareAction('pet')}
                  className="btn-royal-gold p-3 rounded-xl text-xs font-black flex flex-col items-center justify-center gap-1 shadow-md cursor-pointer"
                >
                  <Smile className="w-5 h-5 text-amber-300" />
                  <span>なでる (1日1回)</span>
                </button>
                <button
                  onClick={() => handleCareAction('feed')}
                  className="bg-amber-900/80 hover:bg-amber-800 text-amber-200 border border-amber-500/50 p-3 rounded-xl text-xs font-black flex flex-col items-center justify-center gap-1 shadow-md cursor-pointer"
                >
                  <Utensils className="w-5 h-5 text-amber-400" />
                  <span>ごはん ({player.foodItemsCount || 0})</span>
                </button>
                <button
                  onClick={() => handleCareAction('play')}
                  className="btn-royal-emerald p-3 rounded-xl text-xs font-black flex flex-col items-center justify-center gap-1 shadow-md cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 text-emerald-300" />
                  <span>遊ぶ (1日1回)</span>
                </button>
                <button
                  onClick={() => handleCareAction('talk')}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 p-3 rounded-xl text-xs font-black flex flex-col items-center justify-center gap-1 shadow-md cursor-pointer"
                >
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                  <span>話しかける</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Growth Record Sub Modal Trigger */}
        {showGrowthRecordModal && (
          <CompanionGrowthRecordModal
            player={player}
            onClose={() => setShowGrowthRecordModal(false)}
          />
        )}

        {/* Profile Card Sub Modal */}
        {showProfileCard && (
          <CompanionProfileCard
            player={player}
            onUpdatePlayer={(updated) => {
              savePlayerData(updated);
              onPlayerUpdate(updated);
            }}
            onClose={() => setShowProfileCard(false)}
            onOpenZukan={() => {
              setShowProfileCard(false);
              setShowZukanView(true);
            }}
          />
        )}

        {/* Zukan Sub Modal */}
        {showZukanView && (
          <CompanionZukanView
            player={player}
            onClose={() => setShowZukanView(false)}
          />
        )}

        {/* Inventory Sub Modal */}
        {showInventoryModal && (
          <CompanionInventoryModal
            player={player}
            onUpdatePlayer={onPlayerUpdate}
            onClose={() => setShowInventoryModal(false)}
          />
        )}

        {/* Room Decoration Sub Modal */}
        {showDecorationModal && (
          <CompanionRoomDecorationModal
            player={player}
            onUpdatePlayer={onPlayerUpdate}
            onClose={() => setShowDecorationModal(false)}
          />
        )}
      </motion.div>
    </div>
  );
};

