import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PlayerData, SkillProgressData, SkillStatus } from '../types';
import { ALL_LEARNING_SKILLS, getSkillById, getPrerequisitesForSkill, getNextSkillsForSkill } from '../data/skillsData';
import { getQuestionsBySkill } from '../data/questionsData';
import { getOrCreateSkillProgress } from '../services/skillService';
import { TreePine, Sparkles, CheckCircle2, ArrowUpRight, Award, Crown, RefreshCw, Zap, ShieldCheck } from 'lucide-react';

interface KnowledgeTreeScreenViewProps {
  player: PlayerData;
  onStartSkillPractice: (skillId: string) => void;
}

export const KnowledgeTreeScreenView: React.FC<KnowledgeTreeScreenViewProps> = ({
  player,
  onStartSkillPractice,
}) => {
  const skillProgressMap = getOrCreateSkillProgress(player);

  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');
  const [selectedSkillId, setSelectedSkillId] = useState<string>('rectangle_area');

  const selectedSkill = getSkillById(selectedSkillId) || ALL_LEARNING_SKILLS[0];
  const selectedProgress: SkillProgressData = skillProgressMap[selectedSkill.skillId] || {
    skillId: selectedSkill.skillId,
    attemptedQuestionIds: [],
    correctQuestionIds: [],
    attemptCount: 0,
    correctCount: 0,
    accuracy: 0,
    status: 'not_attempted',
  };

  const prerequisites = getPrerequisitesForSkill(selectedSkill.skillId);
  const nextSkills = getNextSkillsForSkill(selectedSkill.skillId);
  const relatedQuestions = getQuestionsBySkill(selectedSkill.skillId);

  const GRADES = [
    { grade: 'all', label: 'すべて' },
    { grade: 5, label: '小5 (現在)' },
    { grade: 4, label: '小4 (基礎)' },
    { grade: 3, label: '小3 (土台)' },
    { grade: 2, label: '小2 (源流)' },
  ];

  const getStatusBadge = (status: SkillStatus) => {
    switch (status) {
      case 'mastered':
        return {
          label: '👑 マスター',
          bg: 'bg-amber-500/20 text-amber-300 border-amber-400',
          badgeColor: 'bg-amber-400 text-slate-950 font-black',
        };
      case 'achieved':
        return {
          label: '🟢 できた',
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400',
          badgeColor: 'bg-emerald-500 text-slate-950 font-black',
        };
      case 'practicing':
        return {
          label: '🔵 練習中',
          bg: 'bg-blue-500/20 text-blue-300 border-blue-400',
          badgeColor: 'bg-blue-500 text-slate-950 font-black',
        };
      default:
        return {
          label: '⚪ 未挑戦',
          bg: 'bg-slate-800 text-slate-400 border-slate-700',
          badgeColor: 'bg-slate-700 text-slate-300 font-bold',
        };
    }
  };

  const filteredSkills = ALL_LEARNING_SKILLS.filter(
    (s) => selectedGrade === 'all' || s.grade === selectedGrade
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6 my-auto relative z-10">
      <div className="royal-panel p-5 sm:p-7 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-amber-500/40 pb-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 text-2xl shadow-lg">
              🌳
            </div>
            <div>
              <h2 className="font-cinzel text-xl sm:text-2xl font-black text-amber-300">
                知識の樹 ～ナレッジツリー～
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                学年を超えた算数のつながりマップ！基礎を取り戻す冒険で根っこを力強く伸ばそう。
              </p>
            </div>
          </div>

          {/* Grade Filter Bar */}
          <div className="flex items-center gap-1.5 bg-slate-950/90 p-1 rounded-xl border border-amber-500/30">
            {GRADES.map((g) => (
              <button
                key={String(g.grade)}
                onClick={() => setSelectedGrade(g.grade as number | 'all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedGrade === g.grade
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Interactive Tree Visual Matrix */}
          <div className="lg:col-span-7 bg-slate-950/90 p-5 rounded-2xl border border-amber-500/40 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-black text-amber-300 tracking-wider font-cinzel flex items-center gap-1.5">
                <TreePine className="w-4 h-4 text-emerald-400" />
                <span>学習項目ノードマップ</span>
              </span>
              <span className="text-[11px] text-slate-400">
                クリックで詳細を表示
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
              {filteredSkills.map((skill) => {
                const prog = skillProgressMap[skill.skillId] || {
                  status: 'not_attempted',
                  accuracy: 0,
                  correctCount: 0,
                  attemptCount: 0,
                };
                const isSelected = selectedSkillId === skill.skillId;
                const statusInfo = getStatusBadge(prog.status);

                return (
                  <button
                    key={skill.skillId}
                    onClick={() => setSelectedSkillId(skill.skillId)}
                    className={`p-3 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer relative flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-amber-500/25 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-102 z-10'
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-600 text-slate-200'
                    }`}
                  >
                    <span className="text-2xl shrink-0 p-1 bg-slate-950 rounded-lg border border-slate-800">
                      {skill.icon}
                    </span>

                    <div className="space-y-1 overflow-hidden w-full">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-500/30 shrink-0">
                          小{skill.grade}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded ${statusInfo.badgeColor}`}>
                          {statusInfo.label}
                        </span>
                      </div>

                      <div className="font-bold text-xs text-slate-100 truncate">
                        {skill.title}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                        <span>正解率: {prog.attemptCount > 0 ? `${prog.accuracy}%` : '-'}</span>
                        <span>{prog.correctCount} 問正解</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Selected Node Details & Launch Review */}
          <div className="lg:col-span-5 bg-slate-950/90 p-5 rounded-2xl border border-amber-500/40 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* Node Title & Icon Banner */}
              <div className="border-b border-slate-800 pb-3 flex items-start gap-3">
                <span className="text-4xl p-2 bg-slate-900 rounded-2xl border border-amber-500/30">
                  {selectedSkill.icon}
                </span>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 font-extrabold px-2 py-0.5 rounded border border-amber-400/40">
                      小学{selectedSkill.grade}年・{selectedSkill.unit}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded ${getStatusBadge(selectedProgress.status).badgeColor}`}>
                      {getStatusBadge(selectedProgress.status).label}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-amber-200">
                    {selectedSkill.title}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                {selectedSkill.description}
              </p>

              {/* Stats Box */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">正解率</div>
                  <div className="font-extrabold text-emerald-400 text-sm">
                    {selectedProgress.attemptCount > 0 ? `${selectedProgress.accuracy}%` : '-'}
                  </div>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">解法数</div>
                  <div className="font-extrabold text-amber-300 text-sm">
                    {selectedProgress.correctCount} 問
                  </div>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">問題数</div>
                  <div className="font-extrabold text-blue-400 text-sm">
                    {relatedQuestions.length} 問
                  </div>
                </div>
              </div>

              {/* Prerequisites Connected List */}
              <div className="space-y-2 text-xs">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-amber-300 font-bold flex items-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                    つながる前提知識（基礎）:
                  </span>
                  {prerequisites.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {prerequisites.map((p) => (
                        <button
                          key={p.skillId}
                          onClick={() => setSelectedSkillId(p.skillId)}
                          className="text-[11px] bg-slate-950 text-slate-200 hover:text-amber-300 px-2.5 py-1 rounded-lg border border-slate-700 hover:border-amber-400 font-bold transition-all cursor-pointer"
                        >
                          {p.icon} 【小{p.grade}】{p.title}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-400 italic">
                      🌱 この単元は算数の源流（最基礎）です！
                    </div>
                  )}
                </div>

                {/* Next Connected Skills */}
                {nextSkills.length > 0 && (
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-emerald-300 font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      次にひらける応用知識:
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {nextSkills.map((n) => (
                        <button
                          key={n.skillId}
                          onClick={() => setSelectedSkillId(n.skillId)}
                          className="text-[11px] bg-slate-950 text-slate-200 hover:text-emerald-300 px-2.5 py-1 rounded-lg border border-slate-700 hover:border-emerald-400 font-bold transition-all cursor-pointer"
                        >
                          {n.icon} 【小{n.grade}】{n.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Launch Action Button */}
            <div className="pt-2">
              <button
                onClick={() => onStartSkillPractice(selectedSkill.skillId)}
                className="btn-royal-emerald w-full py-3.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>「{selectedSkill.title}」の基礎を取り戻す冒険へ (3問試練)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
