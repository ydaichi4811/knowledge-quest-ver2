import React, { useState } from 'react';
import { PlayerData, PrivacySetting } from '../types';
import { savePlayerDataWithCloud } from '../services/saveSyncService';
import { getInitialCompanionSettings } from '../services/companionService';
import { CloudSaveStatus } from './CloudSaveStatus';
import { Settings, Volume2, RotateCcw, ShieldAlert, Check, Sparkles, BookOpen } from 'lucide-react';
import { FuriganaText } from './FuriganaText';

interface SettingsScreenViewProps {
  player: PlayerData;
  onToggleMode: (mode: 'adventure' | 'raising') => void;
  onResetGame: () => void;
  onOpenTeacherDashboard: () => void;
  onUpdatePrivacySetting?: (setting: PrivacySetting) => void;
  onPlayerUpdate?: (updatedPlayer: PlayerData) => void;
}

export const SettingsScreenView: React.FC<SettingsScreenViewProps> = ({
  player,
  onToggleMode,
  onResetGame,
  onOpenTeacherDashboard,
  onUpdatePrivacySetting,
  onPlayerUpdate,
}) => {
  const [soundBg, setSoundBg] = useState(true);
  const [soundSe, setSoundSe] = useState(true);

  return (
    <div className="w-full max-w-3xl mx-auto p-4 space-y-6 my-auto relative z-10">
      <div className="royal-panel p-6 space-y-6">
        <div className="flex items-center justify-between border-b-2 border-amber-500/40 pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-amber-400" />
            <h2 className="font-cinzel text-xl sm:text-2xl font-black text-amber-300">
              ゲーム設定＆セーブデータ
            </h2>
          </div>
        </div>

        {/* Cloud Save Sync Status Panel */}
        <CloudSaveStatus player={player} onPlayerUpdated={onPlayerUpdate} />

        {/* Furigana Display Settings */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-sky-500/40 space-y-3">
          <h3 className="text-sm font-bold text-sky-300 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-sky-400" />
            <FuriganaText text="ふりがな（漢字の読みかた表示）" />
          </h3>
          <p className="text-xs text-slate-300">
            <FuriganaText text="画面に出てくる漢字の上にふりがなを表示します。" />
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <button
              onClick={() => {
                const updatedPlayer: PlayerData = { ...player, furiganaMode: 'all' };
                savePlayerDataWithCloud(updatedPlayer);
                if (onPlayerUpdate) onPlayerUpdate(updatedPlayer);
              }}
              className={`p-3 rounded-xl border font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                player.furiganaMode === 'all'
                  ? 'btn-royal-gold text-slate-950'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <FuriganaText text="すべての漢字に表示" />
              <span className="text-[10px] font-normal opacity-80">全漢字ルビ付き</span>
            </button>

            <button
              onClick={() => {
                const updatedPlayer: PlayerData = { ...player, furiganaMode: 'difficult' };
                savePlayerDataWithCloud(updatedPlayer);
                if (onPlayerUpdate) onPlayerUpdate(updatedPlayer);
              }}
              className={`p-3 rounded-xl border font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                (player.furiganaMode || 'difficult') === 'difficult'
                  ? 'btn-royal-gold text-slate-950'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <FuriganaText text="難しい漢字だけ表示" />
              <span className="text-[10px] font-normal opacity-80">おすすめ（初期設定）</span>
            </button>

            <button
              onClick={() => {
                const updatedPlayer: PlayerData = { ...player, furiganaMode: 'off' };
                savePlayerDataWithCloud(updatedPlayer);
                if (onPlayerUpdate) onPlayerUpdate(updatedPlayer);
              }}
              className={`p-3 rounded-xl border font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                player.furiganaMode === 'off'
                  ? 'btn-royal-gold text-slate-950'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <FuriganaText text="表示しない" />
              <span className="text-[10px] font-normal opacity-80">ルビなし</span>
            </button>
          </div>
        </div>


        {/* Privacy & Class Safety Settings */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-amber-500/30 space-y-3">
          <h3 className="text-sm font-bold text-amber-300">
            🔒 ランキングの公開範囲（プライバシー設計）
          </h3>
          <p className="text-xs text-slate-300">
            本名や個人情報は公開されません。ランキング画面での名前の共有範囲を設定します。
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => onUpdatePrivacySetting?.('class')}
              className={`p-2.5 rounded-xl border font-bold flex flex-col items-center gap-1 ${
                (player.privacySetting || 'class') === 'class'
                  ? 'btn-royal-gold text-slate-950'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              <span>🏫 学級内公開</span>
              <span className="text-[10px] font-normal">クラス内のみ</span>
            </button>

            <button
              onClick={() => onUpdatePrivacySetting?.('private')}
              className={`p-2.5 rounded-xl border font-bold flex flex-col items-center gap-1 ${
                player.privacySetting === 'private'
                  ? 'btn-royal-gold text-slate-950'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              <span>🔒 自分のみ</span>
              <span className="text-[10px] font-normal">個人非公開</span>
            </button>

            <button
              onClick={() => onUpdatePrivacySetting?.('teacher_only')}
              className={`p-2.5 rounded-xl border font-bold flex flex-col items-center gap-1 ${
                player.privacySetting === 'teacher_only'
                  ? 'btn-royal-gold text-slate-950'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              <span>👨‍🏫 先生のみ</span>
              <span className="text-[10px] font-normal">指導用のみ</span>
            </button>
          </div>
        </div>

        {/* Teacher Dashboard Portal Entry */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-indigo-500/40 space-y-2 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-indigo-300">
              🔑 先生用学習状況画面 (準備版)
            </h3>
            <p className="text-xs text-slate-300">
              児童の進捗状況・苦手項目・ナレッジツリー復習ログを分析できます。
            </p>
          </div>
          <button
            onClick={onOpenTeacherDashboard}
            className="btn-royal-emerald px-4 py-2.5 rounded-xl text-xs font-black shrink-0"
          >
            画面を開く 🔑
          </button>
        </div>

        {/* Companion Settings */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-emerald-500/40 space-y-3">
          <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            知識の相棒演出設定
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <button
              onClick={() => {
                const settings = player.companionSettings || getInitialCompanionSettings();
                const updatedPlayer: PlayerData = {
                  ...player,
                  companionSettings: {
                    ...settings,
                    partnerAnimationEnabled: !settings.partnerAnimationEnabled,
                  },
                };
                savePlayerDataWithCloud(updatedPlayer);
                if (onPlayerUpdate) onPlayerUpdate(updatedPlayer);
              }}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                (player.companionSettings?.partnerAnimationEnabled ?? true)
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <span>動的アニメーション</span>
              <span>{(player.companionSettings?.partnerAnimationEnabled ?? true) ? 'ON ✨' : 'OFF'}</span>
            </button>

            <button
              onClick={() => {
                const settings = player.companionSettings || getInitialCompanionSettings();
                const updatedPlayer: PlayerData = {
                  ...player,
                  companionSettings: {
                    ...settings,
                    partnerDialogueEnabled: !settings.partnerDialogueEnabled,
                  },
                };
                savePlayerDataWithCloud(updatedPlayer);
                if (onPlayerUpdate) onPlayerUpdate(updatedPlayer);
              }}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                (player.companionSettings?.partnerDialogueEnabled ?? true)
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <span>会話吹き出し</span>
              <span>{(player.companionSettings?.partnerDialogueEnabled ?? true) ? 'ON 💬' : 'OFF'}</span>
            </button>

            <button
              onClick={() => {
                const settings = player.companionSettings || getInitialCompanionSettings();
                const updatedPlayer: PlayerData = {
                  ...player,
                  companionSettings: {
                    ...settings,
                    shortenGrowthAnimation: !settings.shortenGrowthAnimation,
                  },
                };
                savePlayerDataWithCloud(updatedPlayer);
                if (onPlayerUpdate) onPlayerUpdate(updatedPlayer);
              }}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                player.companionSettings?.shortenGrowthAnimation
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <span>成長演出の短縮</span>
              <span>{player.companionSettings?.shortenGrowthAnimation ? '短縮ON' : '通常'}</span>
            </button>
          </div>
        </div>

        {/* Stage Battle Settings */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-amber-500/40 space-y-3">
          <h3 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
            ⚔️ ステージ戦闘演出設定
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <button
              onClick={() => {
                const currentBattle = player.battleSettings || {
                  battleAnimationEnabled: true,
                  showSkillNames: true,
                  shortenBossAnimation: false,
                };
                const updatedPlayer: PlayerData = {
                  ...player,
                  battleSettings: {
                    ...currentBattle,
                    battleAnimationEnabled: !currentBattle.battleAnimationEnabled,
                  },
                };
                savePlayerDataWithCloud(updatedPlayer);
                if (onPlayerUpdate) onPlayerUpdate(updatedPlayer);
              }}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                (player.battleSettings?.battleAnimationEnabled ?? true)
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <span>戦闘演出</span>
              <span>{(player.battleSettings?.battleAnimationEnabled ?? true) ? 'ON ⚔️' : 'OFF'}</span>
            </button>

            <button
              onClick={() => {
                const currentBattle = player.battleSettings || {
                  battleAnimationEnabled: true,
                  showSkillNames: true,
                  shortenBossAnimation: false,
                };
                const updatedPlayer: PlayerData = {
                  ...player,
                  battleSettings: {
                    ...currentBattle,
                    showSkillNames: !currentBattle.showSkillNames,
                  },
                };
                savePlayerDataWithCloud(updatedPlayer);
                if (onPlayerUpdate) onPlayerUpdate(updatedPlayer);
              }}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                (player.battleSettings?.showSkillNames ?? true)
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <span>技名表示</span>
              <span>{(player.battleSettings?.showSkillNames ?? true) ? 'ON 📜' : 'OFF'}</span>
            </button>

            <button
              onClick={() => {
                const currentBattle = player.battleSettings || {
                  battleAnimationEnabled: true,
                  showSkillNames: true,
                  shortenBossAnimation: false,
                };
                const updatedPlayer: PlayerData = {
                  ...player,
                  battleSettings: {
                    ...currentBattle,
                    shortenBossAnimation: !currentBattle.shortenBossAnimation,
                  },
                };
                savePlayerDataWithCloud(updatedPlayer);
                if (onPlayerUpdate) onPlayerUpdate(updatedPlayer);
              }}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                player.battleSettings?.shortenBossAnimation
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <span>ボス演出短縮</span>
              <span>{player.battleSettings?.shortenBossAnimation ? '短縮ON' : '通常'}</span>
            </button>
          </div>
        </div>
        <div className="bg-slate-950/80 p-4 rounded-xl border border-amber-500/30 space-y-3">
          <h3 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-amber-400" />
            サウンド設定
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <button
              onClick={() => setSoundBg(!soundBg)}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                soundBg ? 'bg-amber-500/20 border-amber-400 text-amber-200' : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <span>🏰 BGM (背景音楽)</span>
              <span>{soundBg ? 'ON 🔊' : 'OFF 🔇'}</span>
            </button>

            <button
              onClick={() => setSoundSe(!soundSe)}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                soundSe ? 'bg-amber-500/20 border-amber-400 text-amber-200' : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <span>⚔️ SE (効果音)</span>
              <span>{soundSe ? 'ON 🔊' : 'OFF 🔇'}</span>
            </button>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-amber-500/30 space-y-3">
          <h3 className="text-sm font-bold text-amber-300">
            🎮 プレイモードの選択
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <button
              onClick={() => onToggleMode('adventure')}
              className={`p-3 rounded-xl border font-bold flex items-center justify-center gap-2 ${
                player.mode === 'adventure'
                  ? 'btn-royal-gold text-slate-950'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              <span>🗡️ 冒険モード（クイズ戦闘中心）</span>
              {player.mode === 'adventure' && <Check className="w-4 h-4" />}
            </button>

            <button
              onClick={() => onToggleMode('raising')}
              className={`p-3 rounded-xl border font-bold flex items-center justify-center gap-2 ${
                player.mode === 'raising'
                  ? 'btn-royal-emerald text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              <span>🐾 育成モード（お世話中心）</span>
              {player.mode === 'raising' && <Check className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Reset Game Data */}
        <div className="bg-rose-950/40 p-4 rounded-xl border border-rose-500/40 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>データリセット</span>
          </div>
          <p className="text-[11px] text-slate-300">
            プレイヤー名、レベル、相棒の成長などのデータを消去して、はじめから遊ぶことができます。
          </p>
          <button
            onClick={onResetGame}
            className="w-full btn-book-red py-2.5 text-xs font-extrabold flex items-center justify-center gap-1.5 mt-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>セーブデータをリセットして最初から遊ぶ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
