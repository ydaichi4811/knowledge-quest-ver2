import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CompanionData,
  PlayerData,
  CompanionRarity,
  CompanionEvolutionType,
} from '../types';
import { BuddyCharacter } from './BuddyCharacter';
import {
  COMPANION_ATTRIBUTES,
  COMPANION_EVOLUTION_TYPES,
  COMPANION_PERSONALITIES,
  COMPANION_RARITIES,
  COMPANION_SPECIES,
  COMPANION_ACCESSORIES,
} from '../data/companionParts';
import {
  checkRarityUpgradeRequirements,
  executeRarityUpgrade,
} from '../services/companionService';
import {
  Sparkles,
  X,
  Edit2,
  Check,
  Award,
  Zap,
  TrendingUp,
  Shirt,
  Calendar,
  Heart,
  BookOpen,
  HelpCircle,
} from 'lucide-react';

interface CompanionProfileCardProps {
  player: PlayerData;
  onUpdatePlayer: (updatedPlayer: PlayerData) => void;
  onClose: () => void;
  onOpenZukan?: () => void;
}

export const CompanionProfileCard: React.FC<CompanionProfileCardProps> = ({
  player,
  onUpdatePlayer,
  onClose,
  onOpenZukan,
}) => {
  const comp = player.companion!;
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(comp.name || '知識の相棒');
  const [activeTab, setActiveTab] = useState<'profile' | 'traits' | 'logs' | 'accessories'>('profile');
  const [showRarityHelp, setShowRarityHelp] = useState(false);

  const speciesInfo = COMPANION_SPECIES[comp.speciesId] || COMPANION_SPECIES.mokoru;
  const attrInfo = COMPANION_ATTRIBUTES[comp.attribute] || COMPANION_ATTRIBUTES.forest;
  const rarityInfo = COMPANION_RARITIES[comp.currentRarity || 'N'] || COMPANION_RARITIES.N;
  const personalityInfo = COMPANION_PERSONALITIES[comp.personality] || COMPANION_PERSONALITIES.ganbariya;
  const evoTypeInfo = COMPANION_EVOLUTION_TYPES[comp.evolutionType || 'hirameki'] || COMPANION_EVOLUTION_TYPES.hirameki;

  const upgradeStatus = checkRarityUpgradeRequirements(player);

  const handleSaveName = () => {
    const trimmed = nameInput.trim().slice(0, 8);
    if (!trimmed) return;

    const updatedCompanion: CompanionData = {
      ...comp,
      name: trimmed,
    };

    onUpdatePlayer({
      ...player,
      companion: updatedCompanion,
    });
    setIsEditingName(false);
  };

  const handleExecuteUpgrade = () => {
    if (!upgradeStatus.canUpgrade) return;
    const updated = executeRarityUpgrade(player);
    onUpdatePlayer(updated);
  };

  const handleEquipAccessory = (accId: string | undefined) => {
    const updatedCompanion: CompanionData = {
      ...comp,
      equippedAccessoryId: accId,
      appearance: {
        ...comp.appearance,
        accessoryId: accId,
      },
    };

    onUpdatePlayer({
      ...player,
      companion: updatedCompanion,
    });
  };

  const traits = comp.progressTraits || {
    insightPoints: 0,
    effortPoints: 0,
    adventurePoints: 0,
    bondPoints: 0,
    couragePoints: 0,
  };

  const maxTraitVal = Math.max(
    10,
    traits.insightPoints,
    traits.effortPoints,
    traits.adventurePoints,
    traits.bondPoints,
    traits.couragePoints
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 15 }}
        className="bg-slate-900 border-2 border-amber-500/40 rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl text-slate-100 flex flex-col max-h-[90vh] overflow-hidden relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-4 pr-10">
          <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-amber-200">相棒プロフィールカード</h2>
            <p className="text-xs text-slate-400">個体識別No: {comp.generationSeed?.substring(0, 12)}...</p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Top Hero Banner Section */}
          <div className={`p-4 rounded-xl border ${attrInfo.bgGradient} relative overflow-hidden flex flex-col sm:flex-row items-center gap-4`}>
            {/* Rarity & Attribute Floating Badges */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border shadow-md ${rarityInfo.badgeColor}`}>
                {rarityInfo.label}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-900/80 border border-slate-700 text-slate-200">
                {attrInfo.icon} {attrInfo.name}
              </span>
            </div>

            {/* Avatar Component */}
            <div className="shrink-0 p-2 bg-slate-950/40 rounded-2xl border border-amber-500/20 shadow-inner">
              <BuddyCharacter
                companion={comp}
                size="lg"
                animationEnabled={true}
                showSparkles={true}
              />
            </div>

            {/* Individual Details Header */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                {isEditingName ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      maxLength={8}
                      className="bg-slate-950 border border-amber-400 text-amber-200 font-extrabold text-lg rounded px-2 py-0.5 w-32 focus:outline-none"
                    />
                    <button
                      onClick={handleSaveName}
                      className="p-1 bg-amber-500 text-slate-950 rounded hover:bg-amber-400 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-amber-200">{comp.name}</h3>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="text-slate-400 hover:text-amber-300 p-1 cursor-pointer"
                      title="名前を変更"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-slate-300">
                <span className="bg-slate-900/60 px-2 py-0.5 rounded border border-slate-700/80 font-bold">
                  {speciesInfo.name} ({speciesInfo.kanji})
                </span>
                <span className="bg-slate-900/60 px-2 py-0.5 rounded border border-slate-700/80 font-bold text-amber-300">
                  性格: {personalityInfo.name}
                </span>
                <span className="bg-slate-900/60 px-2 py-0.5 rounded border border-slate-700/80 font-bold text-emerald-300">
                  進化傾向: {evoTypeInfo.name} ({evoTypeInfo.icon})
                </span>
              </div>

              {/* Personality Message Quote */}
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs italic text-amber-100/90 leading-relaxed">
                「{personalityInfo.normalDialogues[0]}」
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center border-b border-slate-800 gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'profile'
                  ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>ステータス</span>
            </button>
            <button
              onClick={() => setActiveTab('traits')}
              className={`px-3 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'traits'
                  ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>学習特性 & レア度</span>
            </button>
            <button
              onClick={() => setActiveTab('accessories')}
              className={`px-3 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'accessories'
                  ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shirt className="w-3.5 h-3.5" />
              <span>装飾アイテム</span>
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-3 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'logs'
                  ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>成長記録</span>
            </button>
          </div>

          {/* TAB 1: PROFILE STATUS */}
          {activeTab === 'profile' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-center">
                  <div className="text-[10px] text-slate-400 font-bold mb-0.5">成長レベル</div>
                  <div className="text-lg font-black text-amber-300">Lv. {comp.level}</div>
                </div>
                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-center">
                  <div className="text-[10px] text-slate-400 font-bold mb-0.5">知識エネルギー</div>
                  <div className="text-lg font-black text-emerald-300">{comp.growthExp} EXP</div>
                </div>
                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-center">
                  <div className="text-[10px] text-slate-400 font-bold mb-0.5">きずな度</div>
                  <div className="text-lg font-black text-rose-300">♥ {comp.bond}</div>
                </div>
                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-center">
                  <div className="text-[10px] text-slate-400 font-bold mb-0.5">出会った日</div>
                  <div className="text-xs font-bold text-slate-200 mt-1">
                    {comp.obtainedAt ? new Date(comp.obtainedAt).toLocaleDateString('ja-JP') : '本日'}
                  </div>
                </div>
              </div>

              {/* Rarity Upgrade Action Banner */}
              <div className="p-3.5 bg-slate-950/80 border border-amber-500/30 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-amber-300 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    レア度ランクアップ条件 ({comp.currentRarity || 'N'} → {upgradeStatus.nextRarity || '最高'})
                  </span>
                  <button
                    onClick={() => setShowRarityHelp(!showRarityHelp)}
                    className="text-[10px] text-slate-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    <HelpCircle className="w-3 h-3" />
                    <span>条件とは？</span>
                  </button>
                </div>

                <div className="space-y-1">
                  {upgradeStatus.requirementsSummary.map((reqStr, idx) => (
                    <div key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                      <span className="text-amber-400 font-bold">・</span>
                      <span>{reqStr}</span>
                    </div>
                  ))}
                </div>

                {upgradeStatus.canUpgrade && (
                  <button
                    onClick={handleExecuteUpgrade}
                    className="btn-royal-gold w-full py-2.5 rounded-lg text-xs font-black flex items-center justify-center gap-2 mt-2 shadow-lg animate-gold-glow cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>進化条件達成！レア度【{upgradeStatus.nextRarity}】へ進化させる！</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PROGRESS TRAITS & EVOLUTION TYPE */}
          {activeTab === 'traits' && (
            <div className="space-y-3">
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <h4 className="font-bold text-xs text-amber-200 flex items-center justify-between">
                  <span>学習行動によって高まる「5つの成長資質」</span>
                  <span className="text-[10px] text-emerald-400">現在最も高い資質: {evoTypeInfo.name}</span>
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  初回正解や基礎復習、単元クリアなどの学習スタイルによって各資質が高まり、相棒の進化傾向が決まります。
                </p>

                <div className="space-y-2 pt-2">
                  {/* Hirameki */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-yellow-300 flex items-center gap-1">
                        💡 ひらめき資質（初回正解）
                      </span>
                      <span>{traits.insightPoints} pt</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-yellow-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (traits.insightPoints / maxTraitVal) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Doryoku */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-blue-300 flex items-center gap-1">
                        📖 努力資質（基礎復習）
                      </span>
                      <span>{traits.effortPoints} pt</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (traits.effortPoints / maxTraitVal) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Bouken */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-emerald-300 flex items-center gap-1">
                        🧭 冒険資質（新単元クリア）
                      </span>
                      <span>{traits.adventurePoints} pt</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (traits.adventurePoints / maxTraitVal) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Kizuna */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-rose-300 flex items-center gap-1">
                        💖 きずな資質（お世話・会話）
                      </span>
                      <span>{traits.bondPoints} pt</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-rose-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (traits.bondPoints / maxTraitVal) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Yuuki */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-amber-300 flex items-center gap-1">
                        🛡️ 勇気資質（苦手問題の解き直し）
                      </span>
                      <span>{traits.couragePoints} pt</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (traits.couragePoints / maxTraitVal) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ACCESSORIES */}
          {activeTab === 'accessories' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                学習の成果やクエスト達成で手に入れた装飾アイテムを相棒に装備できます。
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  onClick={() => handleEquipAccessory(undefined)}
                  className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                    !comp.equippedAccessoryId
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xl mb-1">❌</div>
                  <div className="font-bold text-xs">なし</div>
                </button>

                {Object.values(COMPANION_ACCESSORIES).map((acc) => {
                  const isUnlocked = (comp.unlockedAccessories || ['adv_hat']).includes(acc.id);
                  const isEquipped = comp.equippedAccessoryId === acc.id;

                  return (
                    <button
                      key={acc.id}
                      disabled={!isUnlocked}
                      onClick={() => isUnlocked && handleEquipAccessory(acc.id)}
                      className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                        isEquipped
                          ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md'
                          : isUnlocked
                          ? 'bg-slate-950/60 border-slate-800 text-slate-200 hover:border-slate-700'
                          : 'bg-slate-950/20 border-slate-900 opacity-40 cursor-not-allowed'
                      }`}
                    >
                      <div className="text-xl mb-1">{acc.icon}</div>
                      <div className="font-bold text-xs">{acc.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{isUnlocked ? (isEquipped ? '装備中' : '所持') : '未解放'}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: GROWTH LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-2">
              {(comp.growthLogs || []).map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-start gap-3"
                >
                  <div className="text-2xl p-1 bg-slate-900 rounded-lg">{log.icon || '📜'}</div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-amber-300">{log.title}</span>
                      <span className="text-[10px] text-slate-500">{log.date}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-tight">{log.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between mt-auto">
          {onOpenZukan ? (
            <button
              onClick={onOpenZukan}
              className="btn-royal-emerald px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>相棒図鑑を開く</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold cursor-pointer"
          >
            閉じる
          </button>
        </div>
      </motion.div>
    </div>
  );
};
