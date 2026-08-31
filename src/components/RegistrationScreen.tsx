import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GameMode, AvatarOption, PartnerType, ClassroomId } from '../types';
import { PARTNERS_EVOLUTION_DATA } from '../data/partners';
import { User, Swords, Heart, Check, ArrowRight, ArrowLeft, ShieldAlert } from 'lucide-react';

interface RegistrationScreenProps {
  onRegister: (
    name: string,
    mode: GameMode,
    avatar: AvatarOption,
    partnerType: PartnerType,
    eggType: string,
    classroomId: ClassroomId,
    studentNumber: number
  ) => Promise<{ success: boolean; error?: string }>;
  onBackToTitle: () => void;
}

export const RegistrationScreen: React.FC<RegistrationScreenProps> = ({
  onRegister,
  onBackToTitle,
}) => {
  const [playerName, setPlayerName] = useState('');
  const [selectedMode, setSelectedMode] = useState<GameMode>('adventure');
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarOption>('hero');
  const [selectedPartner, setSelectedPartner] = useState<PartnerType>('fox');
  const [selectedEgg, setSelectedEgg] = useState<string>('egg_fluffy');
  const [classroomId, setClassroomId] = useState<ClassroomId>('class_1');
  const [studentNumber, setStudentNumber] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const eggChoices = [
    { type: 'egg_fluffy', name: 'ふわふわ', icon: '☁️', desc: 'モコル種' },
    { type: 'egg_leaf', name: '葉っぱ', icon: '🌱', desc: 'リフィン種' },
    { type: 'egg_light', name: 'ひかり', icon: '✨', desc: 'ルミア種' },
    { type: 'egg_dragon', name: 'うろこ', icon: '🐲', desc: 'クルド種' },
    { type: 'egg_drop', name: 'しずく', icon: '💧', desc: 'ポルカ種' },
  ];

  const avatarOptions: { id: AvatarOption; name: string; icon: string; desc: string }[] = [
    { id: 'hero', name: '勇者', icon: '⚔️', desc: 'バランスの取れた王国の冒険者' },
    { id: 'mage', name: '魔導士', icon: '🧙‍♂️', desc: '数理の古代魔法を操る賢者' },
    { id: 'knight', name: '騎士', icon: '🛡️', desc: '高い防御力で仲間を守る盾' },
    { id: 'scholar', name: '学者', icon: '📜', desc: '幾何学の真理を追究する研究者' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    const trimmed = playerName.trim();
    if (!trimmed) {
      setErrorMsg('プレイヤー名を入力してください。');
      return;
    }
    if (trimmed.length > 10) {
      setErrorMsg('プレイヤー名は10文字以内で入力してください。');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);
    const result = await onRegister(
      trimmed,
      selectedMode,
      selectedAvatar,
      selectedPartner,
      selectedEgg,
      classroomId,
      studentNumber
    );
    if (!result.success) {
      setErrorMsg(result.error || '登録できませんでした。先生に確認してください。');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-2rem)] flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl game-card p-6 sm:p-8 space-y-6 my-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-500/30 pb-4">
          <button
            onClick={onBackToTitle}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-amber-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>タイトルへ戻る</span>
          </button>
          <div className="text-center">
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-amber-300">
              プレイヤー登録
            </h2>
            <p className="text-xs text-emerald-400 font-semibold">
              冒険の準備を整えよう！
            </p>
          </div>
          <div className="w-16" /> {/* Spacer */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl border border-emerald-400/40 bg-emerald-950/60 p-3 text-xs font-bold leading-relaxed text-emerald-100">
            🏫 先生から指定された「組・出席番号」を選び、ゲーム内で使うニックネームを入力してください。
          </div>
          {/* Step 1: Player Name Input */}
          <div className="space-y-2">
            <label className="flex items-center justify-between text-sm font-bold text-amber-200">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-amber-400" />
                1. プレイヤー名 <span className="text-rose-400">*</span>
              </span>
              <span className="text-xs text-slate-400 font-normal">
                {playerName.length} / 10文字
              </span>
            </label>

            <div className="relative">
              <input
                type="text"
                maxLength={10}
                value={playerName}
                onChange={(e) => {
                  setPlayerName(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="なまえを入力（例: タロウ）"
                className="w-full bg-slate-900/90 border-2 border-amber-500/40 rounded-xl px-4 py-3 text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-all font-bold"
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-400 flex items-center gap-1 font-semibold">
                <ShieldAlert className="w-3.5 h-3.5" />
                {errorMsg}
              </p>
            )}
          </div>

          {/* Step 2: Classroom Seat */}
          <div className="space-y-3 rounded-2xl border-2 border-sky-400/40 bg-sky-950/50 p-4">
            <div>
              <h3 className="text-sm font-black text-sky-200">2. クラスと出席番号</h3>
              <p className="mt-1 text-xs font-semibold text-slate-300">
                先生から指定された組と番号を選んでください。同じ番号は重複登録できません。
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2" role="group" aria-label="クラスを選ぶ">
              {([
                { id: 'class_1', label: '1組' },
                { id: 'class_2', label: '2組' },
                { id: 'class_3', label: '3組' },
              ] as { id: ClassroomId; label: string }[]).map((classroom) => (
                <button
                  key={classroom.id}
                  type="button"
                  onClick={() => setClassroomId(classroom.id)}
                  aria-pressed={classroomId === classroom.id}
                  className={`rounded-xl border-2 px-3 py-3 text-sm font-black transition-all ${
                    classroomId === classroom.id
                      ? 'border-amber-300 bg-blue-600 text-white shadow-lg'
                      : 'border-slate-600 bg-slate-900 text-slate-200 hover:border-sky-400'
                  }`}
                >
                  {classroom.label}
                </button>
              ))}
            </div>
            <label className="block text-xs font-bold text-sky-100">
              出席番号
              <select
                value={studentNumber}
                onChange={(e) => setStudentNumber(Number(e.target.value))}
                className="mt-2 w-full rounded-xl border-2 border-sky-400/40 bg-slate-900 px-4 py-3 text-base font-black text-white focus:border-amber-300 focus:outline-none"
              >
                {Array.from({ length: 40 }, (_, index) => index + 1).map((number) => (
                  <option key={number} value={number}>{number}番</option>
                ))}
              </select>
            </label>
            <div className="rounded-xl bg-slate-950/60 px-3 py-2 text-center text-sm font-black text-amber-200">
              登録先：{classroomId === 'class_1' ? '1組' : classroomId === 'class_2' ? '2組' : '3組'} {studentNumber}番
            </div>
          </div>

          {/* Step 3: Game Mode Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-amber-200">
              3. 遊び方を選ぶ
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Adventure Mode */}
              <div
                onClick={() => setSelectedMode('adventure')}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex gap-3 ${
                  selectedMode === 'adventure'
                    ? 'bg-blue-900/70 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                    : 'bg-slate-900/50 border-slate-700 hover:border-slate-500'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-blue-600/30 border border-blue-400/50 flex items-center justify-center shrink-0">
                  <Swords className="w-6 h-6 text-blue-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2 font-bold text-slate-100 text-sm">
                    <span>冒険モード</span>
                    {selectedMode === 'adventure' && (
                      <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded font-extrabold">
                        選択中
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-tight">
                    マスリア王国の魔物と算数バトル！全地方のクエスト攻略を目指す。
                  </p>
                </div>
              </div>

              {/* Raising Mode */}
              <div
                onClick={() => setSelectedMode('raising')}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex gap-3 ${
                  selectedMode === 'raising'
                    ? 'bg-emerald-900/70 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.25)]'
                    : 'bg-slate-900/50 border-slate-700 hover:border-slate-500'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-600/30 border border-emerald-400/50 flex items-center justify-center shrink-0">
                  <Heart className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2 font-bold text-slate-100 text-sm">
                    <span>育成モード</span>
                    {selectedMode === 'raising' && (
                      <span className="text-[10px] bg-emerald-400 text-slate-950 px-1.5 py-0.5 rounded font-extrabold">
                        選択中
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-tight">
                    算数クイズでごはんや訓練ポイントを獲得！相棒を最強の姿へ進化させよう。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Avatar Class Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-amber-200">
              4. 主人公の見た目を選ぶ
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {avatarOptions.map((av) => (
                <div
                  key={av.id}
                  onClick={() => setSelectedAvatar(av.id)}
                  className={`cursor-pointer p-3 rounded-xl border-2 transition-all text-center ${
                    selectedAvatar === av.id
                      ? 'bg-amber-500/20 border-amber-400 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="text-2xl mb-1">{av.icon}</div>
                  <div className="font-bold text-xs text-slate-100">{av.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{av.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 4: Initial Partner Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-amber-200">
              5. バトルで一緒に戦う相棒を選ぶ
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PARTNERS_EVOLUTION_DATA.map((p) => {
                const stage1 = p.stages[0];
                const isSelected = selectedPartner === p.type;
                return (
                  <div
                    key={p.type}
                    onClick={() => setSelectedPartner(p.type)}
                    className={`cursor-pointer p-3.5 rounded-xl border-2 transition-all relative ${
                      isSelected
                        ? 'bg-slate-800 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-3xl">{stage1.icon}</div>
                      <div>
                        <div className="font-bold text-sm text-slate-100">{p.baseName}</div>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-700 text-amber-300 font-bold">
                          属性: {p.element}
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-tight">
                      {p.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 5: Knowledge Companion Egg Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-amber-200">
              6. 学習で育てるペットのタマゴを選ぶ <span className="text-xs text-emerald-400 font-normal">（成長後の姿はお楽しみ！）</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {eggChoices.map((egg) => {
                const isSelected = selectedEgg === egg.type;
                return (
                  <div
                    key={egg.type}
                    onClick={() => setSelectedEgg(egg.type)}
                    className={`cursor-pointer p-3 rounded-xl border-2 transition-all text-center relative ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.3)]'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 opacity-80'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-400 text-slate-950 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                    <div className="text-2xl mb-1">{egg.icon}</div>
                    <div className="font-bold text-xs text-slate-100">{egg.name}</div>
                    <div className="text-[10px] text-amber-300 font-medium mt-0.5">{egg.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gold disabled:cursor-wait disabled:opacity-60 w-full py-4 rounded-xl text-base font-extrabold flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <span>{isSubmitting ? 'クラスを確認しています…' : 'この設定でマスリア王国へ旅立つ！'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
