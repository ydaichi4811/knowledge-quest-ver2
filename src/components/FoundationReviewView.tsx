import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlayerData, ReviewStatus, UnitMasteryStatus, ReviewCandidateItem } from '../types';
import { ALL_LEARNING_QUESTIONS } from '../data/questionsData';
import {
  calculateUnitMasteryStatus,
  selectReviewQuestions,
  getReviewQuestPreviewInfo,
  getSafeQuestionData,
} from '../services/reviewService';
import {
  BookOpen,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Crown,
  Flame,
  Award,
  Zap,
  HelpCircle,
  Clock,
  ChevronRight,
  ShieldCheck,
  BookMarked,
  Layers,
  ListFilter,
  History,
  Target,
} from 'lucide-react';

interface FoundationReviewViewProps {
  player: PlayerData;
  onStartQuestion: (unitId: string) => void;
  onStartReviewQuest?: (unitId?: string) => void;
}

export const FoundationReviewView: React.FC<FoundationReviewViewProps> = ({
  player,
  onStartQuestion,
  onStartReviewQuest,
}) => {
  const [activeTab, setActiveTab] = useState<'units' | 'items' | 'history'>('units');
  const [statusFilter, setStatusFilter] = useState<'all' | ReviewStatus>('all');
  const [previewQuestUnitId, setPreviewQuestUnitId] = useState<string | null | undefined>(null);

  // 全単元 ID リストの抽出
  const allUnitIds = Array.from(new Set(ALL_LEARNING_QUESTIONS.map((q) => q.unitId)));

  // 復習候補アイテム
  const reviewItems = player.reviewItems || {};
  const reviewItemList: ReviewCandidateItem[] = Object.values(reviewItems) as ReviewCandidateItem[];

  // ステータスフィルター適用後のアイテム
  const filteredReviewItems = reviewItemList.filter((item) => {
    if (statusFilter === 'all') return true;
    return item.status === statusFilter;
  });

  // 解答履歴ログ
  const answerHistory = player.answerHistory || [];

  // プレビューダイアログ情報
  const previewInfo = previewQuestUnitId !== null
    ? getReviewQuestPreviewInfo(player, previewQuestUnitId || undefined)
    : null;

  return (
    <div className="w-full max-w-5xl mx-auto p-3 sm:p-5 space-y-5 my-auto relative z-10 text-slate-100">
      <div className="royal-panel p-4 sm:p-6 space-y-5 bg-slate-950/95 border-2 border-amber-500/50 rounded-3xl shadow-2xl">
        {/* --- 1. TITLE HEADER & QUICK LAUNCH BANNER --- */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-amber-500/30 pb-4 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-amber-400" />
              <h2 className="font-cinzel text-xl sm:text-2xl font-black text-amber-300">
                学び直し＆復習の冒険
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-1 font-medium">
              つまずいた問題をバディと一緒に何度でも学び直そう！復習でもしっかり報酬がもらえるよ！
            </p>
          </div>

          {/* Quick Mixed Review Quest Button */}
          <button
            onClick={() => setPreviewQuestUnitId(undefined)}
            className="w-full sm:w-auto btn-royal-gold px-5 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:scale-102 cursor-pointer transition-all"
          >
            <Zap className="w-5 h-5 text-amber-950 fill-amber-300 animate-pulse" />
            <span>⚔️ おすすめ復習クエストを遊ぶ！</span>
          </button>
        </div>

        {/* --- 2. STATS SUMMARY STRIP --- */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          <div className="bg-slate-900/90 p-3 rounded-2xl border border-amber-500/30 flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-300 rounded-xl">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold">復習候補数</div>
              <div className="text-base sm:text-lg font-black text-amber-300">
                {reviewItemList.filter((i) => i.status !== 'mastered').length} <span className="text-xs">問</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-2xl border border-emerald-500/30 flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-xl">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold">マスター達成</div>
              <div className="text-base sm:text-lg font-black text-emerald-300">
                {reviewItemList.filter((i) => i.status === 'mastered').length} <span className="text-xs">問</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-2xl border border-sky-500/30 flex items-center gap-3">
            <div className="p-2 bg-sky-500/20 text-sky-300 rounded-xl">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold">総回答回数</div>
              <div className="text-base sm:text-lg font-black text-sky-300">
                {player.totalAnswered || 0} <span className="text-xs">回</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-2xl border border-purple-500/30 flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 text-purple-300 rounded-xl">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold">連続正解</div>
              <div className="text-base sm:text-lg font-black text-purple-300">
                {player.currentStreak || 0} <span className="text-xs">連続</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- 3. NAVIGATION TABS --- */}
        <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('units')}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'units'
                ? 'bg-amber-500/20 text-amber-300 border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>単元別学習状況 ({allUnitIds.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('items')}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'items'
                ? 'bg-amber-500/20 text-amber-300 border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ListFilter className="w-4 h-4" />
            <span>問題別復習リスト ({reviewItemList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-amber-500/20 text-amber-300 border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>解答履歴ログ ({answerHistory.length})</span>
          </button>
        </div>

        {/* --- 4. TAB CONTENTS --- */}
        {activeTab === 'units' && (
          <div className="space-y-4">
            <h3 className="text-xs font-black text-amber-300 flex items-center justify-between">
              <span>🌱 単元ごとの理解度とマスター判定</span>
              <span className="text-[10px] text-slate-400">※前向きな表現で学習をサポートします</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {allUnitIds.map((unitId) => {
                const mastery = calculateUnitMasteryStatus(player, unitId);
                const sampleQ = ALL_LEARNING_QUESTIONS.find((q) => q.unitId === unitId);
                const unitName = sampleQ?.unitName || unitId;

                return (
                  <div
                    key={unitId}
                    className="p-4 bg-slate-900/90 rounded-2xl border border-slate-700/80 space-y-3 hover:border-amber-400/60 transition-all flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm sm:text-base text-slate-100">
                            {unitName}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{mastery.description}</p>
                      </div>

                      {/* Positive Mastery Badge */}
                      <span
                        className={`text-xs font-black px-2.5 py-1 rounded-lg border ${mastery.badgeBg} ${mastery.badgeTextColor}`}
                      >
                        {mastery.label}
                      </span>
                    </div>

                    {/* Progress Bar & Stats */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-300 font-bold">
                        <span>マスター到達度</span>
                        <span>
                          {mastery.masteredCount} / {mastery.totalQuestions} 問
                        </span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              mastery.totalQuestions > 0
                                ? (mastery.masteredCount / mastery.totalQuestions) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => setPreviewQuestUnitId(unitId)}
                        className="flex-1 btn-royal-gold py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-950" />
                        <span>復習クエストを開始 ⚔️</span>
                      </button>

                      <button
                        onClick={() => onStartQuestion(unitId)}
                        className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-600 cursor-pointer"
                      >
                        通常問題へ ➔
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'items' && (
          <div className="space-y-4">
            {/* Status Filter Chips with Counts (要件11〜15, 18) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-400 font-bold text-[10px] shrink-0">状態絞り込み:</span>
              {[
                { id: 'all', label: `すべて (${reviewItemList.length})` },
                { id: 'unreviewed', label: `未復習 🔴 (${reviewItemList.filter((i) => i.status === 'unreviewed').length})` },
                { id: 'practicing', label: `練習中 🌱 (${reviewItemList.filter((i) => i.status === 'practicing').length})` },
                { id: 'almost', label: `あと少し ✨ (${reviewItemList.filter((i) => i.status === 'almost').length})` },
                { id: 'completed', label: `クリア 🔷 (${reviewItemList.filter((i) => i.status === 'completed').length})` },
                { id: 'mastered', label: `マスター 🌟 (${reviewItemList.filter((i) => i.status === 'mastered').length})` },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id as any)}
                  className={`px-3 py-1 rounded-full border text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                    statusFilter === f.id
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                      : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {filteredReviewItems.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <p className="text-sm font-bold text-slate-300">
                  該当する復習問題はありません！
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2.5">
                {filteredReviewItems.map((item) => {
                  const question = getSafeQuestionData(item.questionId);

                  const statusBadgeMap: Record<string, { label: string; style: string }> = {
                    unreviewed: { label: '未復習 🔴', style: 'bg-rose-500/20 text-rose-300 border-rose-400' },
                    practicing: { label: '練習中 🌱', style: 'bg-blue-500/20 text-blue-300 border-blue-400' },
                    almost: { label: 'あと少し ✨', style: 'bg-amber-500/20 text-amber-300 border-amber-400' },
                    completed: { label: 'クリア 🔷', style: 'bg-sky-500/20 text-sky-300 border-sky-400' },
                    mastered: { label: 'マスター 🌟', style: 'bg-emerald-500/20 text-emerald-300 border-emerald-400' },
                  };

                  const badgeInfo = statusBadgeMap[item.status] || statusBadgeMap.unreviewed;

                  const formattedLastDate = item.lastAnsweredAt
                    ? new Date(item.lastAnsweredAt).toLocaleString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '未挑戦';

                  return (
                    <div
                      key={item.questionId}
                      className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-amber-500/50 transition-all"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-extrabold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
                            {question.unitName}
                          </span>
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${badgeInfo.style}`}>
                            {badgeInfo.label}
                          </span>
                          <span className="text-[10px] text-slate-400 ml-auto">
                            最終挑戦: {formattedLastDate}
                          </span>
                        </div>

                        <p className="text-sm font-bold text-slate-100 line-clamp-2">
                          {question.questionText}
                        </p>

                        <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-0.5 font-medium flex-wrap">
                          <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">挑戦: {item.attemptCount}回</span>
                          <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-rose-300">間違え: {item.incorrectCount}回</span>
                          <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-emerald-300">連続正解: {item.consecutiveCorrect}回</span>
                          <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">平均時間: {item.averageTimeSpentSeconds}秒</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setPreviewQuestUnitId(item.unitId)}
                        className="w-full sm:w-auto btn-royal-gold py-2 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-1 cursor-pointer shrink-0"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-950" />
                        <span>復習する ⚔️</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            <h3 className="text-xs font-black text-amber-300 flex items-center justify-between">
              <span>📜 直近の解答ログ履歴</span>
              <span className="text-[10px] text-slate-400">※個人情報は保存されません</span>
            </h3>

            {answerHistory.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400 text-sm font-bold">
                まだ解答履歴がありません。問題に挑戦してみよう！
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {answerHistory.map((log) => {
                  const dateStr = new Date(log.timestamp).toLocaleString('ja-JP', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={log.id}
                      className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                            log.isCorrect
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/50'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-400/50'
                          }`}
                        >
                          {log.isCorrect ? '⭕' : '❌'}
                        </span>
                        <div>
                          <div className="font-bold text-slate-200 flex items-center gap-2">
                            <span>{log.unitName || '算数単元'}</span>
                            <span className="text-[10px] text-slate-400">({log.timeSpentSeconds}秒)</span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            回答: <span className="text-slate-200">{log.userAnswer || '未入力'}</span> | 正解: <span className="text-emerald-300">{log.correctAnswer}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] text-slate-400">{dateStr}</div>
                        {log.hintCount > 0 && (
                          <div className="text-[10px] text-amber-300 font-bold">💡 ヒント{log.hintCount}回使用</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- PREVIEW QUEST START DIALOG (要件17) --- */}
      <AnimatePresence>
        {previewInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-950 border-2 border-amber-400 rounded-3xl p-5 sm:p-6 max-w-md w-full space-y-4 shadow-2xl relative text-slate-100"
            >
              <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
                <div className="flex items-center gap-2 text-amber-300 font-black text-lg">
                  <Zap className="w-6 h-6 text-amber-400" />
                  <span>復習クエストの準備</span>
                </div>
                <button
                  onClick={() => setPreviewQuestUnitId(null)}
                  className="text-slate-400 hover:text-white font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 font-bold">対象単元</div>
                  <div className="text-base font-extrabold text-amber-200">
                    {previewInfo.unitTitle}
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 font-bold">出題予定問題数</div>
                  <div className="text-base font-extrabold text-emerald-300">
                    全 {previewInfo.questionCount} 問ミックス
                  </div>
                </div>

                <div className="p-3 bg-amber-950/60 rounded-2xl border border-amber-500/40 text-amber-200 font-semibold leading-relaxed">
                  💡 {previewInfo.purposeText}
                </div>

                {/* Estimated Rewards */}
                <div className="p-3 bg-emerald-950/60 rounded-2xl border border-emerald-500/40 space-y-1">
                  <div className="text-[10px] text-emerald-300 font-bold">予想獲得報酬</div>
                  <div className="flex items-center gap-4 font-black text-emerald-200">
                    <span>✨ EXP +{previewInfo.estimatedExp}</span>
                    <span>🪙 コイン +{previewInfo.estimatedCoins}</span>
                    <span>🐾 バディEXP +15</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setPreviewQuestUnitId(null)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs cursor-pointer"
                >
                  やめる
                </button>

                <button
                  onClick={() => {
                    const uId = previewQuestUnitId || undefined;
                    setPreviewQuestUnitId(null);
                    if (onStartReviewQuest) {
                      onStartReviewQuest(uId);
                    } else {
                      onStartQuestion(uId || 'area_5_rectangle');
                    }
                  }}
                  className="flex-2 btn-royal-gold py-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <Zap className="w-4 h-4 text-amber-950" />
                  <span>復習クエスト開始 ⚔️</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
