import React, { useState } from 'react';
import { PlayerData } from '../types';
import { HeroCharacter } from './game/HeroCharacter';
import { Trophy, Award, Crown, Shield, Sparkles, Flame, Calendar, BookOpen, UserCheck } from 'lucide-react';

interface RankingScreenViewProps {
  player: PlayerData;
}

export const RankingScreenView: React.FC<RankingScreenViewProps> = ({ player }) => {
  const [metricTab, setMetricTab] = useState<'exp' | 'solved' | 'streak' | 'days'>('exp');

  // Sample Class/School Leaderboard Data (Privacy compliant: Nicknames only)
  const sampleRankings = [
    { rank: 1, nickname: 'スターウルフ', level: 18, exp: 1250, solved: 142, streak: 12, days: 15, classId: 'class_5a', icon: '🧙‍♂️', badge: '単元マスター' },
    { rank: 2, nickname: 'アクアナイト', level: 16, exp: 1100, solved: 118, streak: 9, days: 12, classId: 'class_5a', icon: '🛡️', badge: '連続学習王' },
    { rank: 3, nickname: 'モリノタマゴ', level: 14, exp: 980, solved: 95, streak: 7, days: 10, classId: 'class_5a', icon: '🦊', badge: '今週のがんばり' },
    {
      rank: 4,
      nickname: (player.nickname || player.name) + ' (あなた)',
      level: player.level,
      exp: player.exp + (player.level - 1) * 100,
      solved: player.correctAnswered || 0,
      streak: player.currentStreak || 0,
      days: player.studyDaysCount || 1,
      classId: player.classId || 'class_5a',
      icon: player.partner?.avatarIcon || '⚔️',
      badge: '自己ベスト更新中',
      isSelf: true,
    },
    { rank: 5, nickname: '計算王タクマ', level: 11, exp: 720, solved: 64, streak: 4, days: 6, classId: 'class_5a', icon: '📜', badge: '速算マスター' },
    { rank: 6, nickname: 'ひらめきミナミ', level: 9, exp: 580, solved: 45, streak: 3, days: 5, classId: 'class_5a', icon: '🍃', badge: 'ナレッジ復習達人' },
  ];

  // Sort dynamically based on active tab
  const sortedRankings = [...sampleRankings]
    .sort((a, b) => {
      if (metricTab === 'exp') return b.exp - a.exp;
      if (metricTab === 'solved') return b.solved - a.solved;
      if (metricTab === 'streak') return b.streak - a.streak;
      return b.days - a.days;
    })
    .map((item, idx) => ({ ...item, rank: idx + 1 }));

  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-6 my-auto relative z-10">
      <div className="royal-panel p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-amber-500/40 pb-3 gap-2">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <h2 className="font-cinzel text-xl sm:text-2xl font-black text-amber-300">
              マスリア王国 冒険者ランキング
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold text-amber-300 bg-slate-950 px-3 py-1 rounded-full border border-amber-500/40 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>表示: ニックネームのみ ({player.privacySetting === 'class' ? '学級内公開' : '自分のみ'})</span>
            </span>
          </div>
        </div>

        {/* Metric Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => setMetricTab('exp')}
            className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              metricTab === 'exp'
                ? 'btn-royal-gold text-slate-950 shadow-md'
                : 'bg-slate-950/80 border border-slate-800 text-slate-300 hover:border-slate-600'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>獲得EXP</span>
          </button>

          <button
            onClick={() => setMetricTab('solved')}
            className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              metricTab === 'solved'
                ? 'btn-royal-gold text-slate-950 shadow-md'
                : 'bg-slate-950/80 border border-slate-800 text-slate-300 hover:border-slate-600'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>解いた問題数</span>
          </button>

          <button
            onClick={() => setMetricTab('streak')}
            className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              metricTab === 'streak'
                ? 'btn-royal-gold text-slate-950 shadow-md'
                : 'bg-slate-950/80 border border-slate-800 text-slate-300 hover:border-slate-600'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>連続正解数</span>
          </button>

          <button
            onClick={() => setMetricTab('days')}
            className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              metricTab === 'days'
                ? 'btn-royal-gold text-slate-950 shadow-md'
                : 'bg-slate-950/80 border border-slate-800 text-slate-300 hover:border-slate-600'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>学習日数</span>
          </button>
        </div>

        {/* Ranking List */}
        <div className="space-y-2.5">
          {sortedRankings.map((item) => (
            <div
              key={item.nickname}
              className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                item.isSelf
                  ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)] scale-102 z-10'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Rank Trophy */}
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm font-cinzel shrink-0">
                  {item.rank === 1 && <Crown className="w-6 h-6 text-amber-400" />}
                  {item.rank === 2 && <span className="text-slate-300 font-bold">2位</span>}
                  {item.rank === 3 && <span className="text-amber-600 font-bold">3位</span>}
                  {item.rank > 3 && <span className="text-slate-500">{item.rank}位</span>}
                </div>

                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-950 border border-amber-500/40 shrink-0 flex items-center justify-center">
                  <HeroCharacter
                    player={item.isSelf ? player : null}
                    gender={item.rank % 2 === 0 ? 'girl' : 'boy'}
                    size="sm"
                    viewType="sd"
                  />
                </div>

                <div>
                  <div className="font-bold text-sm text-slate-100 flex items-center gap-2">
                    <span>{item.nickname}</span>
                    <span className="text-[10px] bg-slate-900 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                      {item.badge}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Lv.{item.level} ・ 学習日数: {item.days}日
                  </div>
                </div>
              </div>

              {/* Metric Value Display */}
              <div className="text-right shrink-0">
                <div className="text-sm font-black text-amber-300 font-cinzel">
                  {metricTab === 'exp' && `${item.exp} EXP`}
                  {metricTab === 'solved' && `${item.solved} 問突破`}
                  {metricTab === 'streak' && `${item.streak} 連続正解`}
                  {metricTab === 'days' && `${item.days} 日間`}
                </div>
                <div className="text-[10px] text-emerald-400 font-bold">
                  がんばり評価 ★★★
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 text-center">
          💡 本名やクラス番号は公開されません。自分のペースで楽しく学びを続けよう！
        </div>
      </div>
    </div>
  );
};
