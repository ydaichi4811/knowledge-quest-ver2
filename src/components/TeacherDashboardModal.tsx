import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PlayerData, UnitProgressData } from '../types';
import { ALL_LEARNING_QUESTIONS } from '../data/questionsData';
import { Users, GraduationCap, ShieldCheck, X, AlertTriangle, Lock, Bug, CheckCircle2, Award } from 'lucide-react';

interface TeacherDashboardModalProps {
  player: PlayerData;
  onClose: () => void;
}

export const TeacherDashboardModal: React.FC<TeacherDashboardModalProps> = ({ player, onClose }) => {
  const [pinCode, setPinCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'class' | 'question_debug'>('class');

  // Sample Class Progress Analytics Data for Teacher Overview
  const classRoster = [
    { name: '児童A (スターウルフ)', solved: 142, accuracy: 92, weak: 'なし', treeCount: 1, lastActive: '本日' },
    { name: '児童B (アクアナイト)', solved: 118, accuracy: 88, weak: '複合図形の分割', treeCount: 2, lastActive: '本日' },
    { name: '児童C (モリノタマゴ)', solved: 95, accuracy: 84, weak: '台形の公式', treeCount: 3, lastActive: '昨日' },
    { name: `${player.name} (${player.nickname || 'あなた'})`, solved: player.correctAnswered || 0, accuracy: player.totalAnswered > 0 ? Math.round((player.correctAnswered / player.totalAnswered) * 100) : 100, weak: player.weakConcepts.join(', ') || 'なし', treeCount: player.reviewedConcepts.length, lastActive: '現在' },
    { name: '児童E (計算王タクマ)', solved: 64, accuracy: 78, weak: 'ひし形の対角線', treeCount: 4, lastActive: '3日前' },
  ];

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode === '1234' || pinCode === 'teacher' || pinCode === '') {
      setIsAuthenticated(true);
    } else {
      alert('PINコードが違います。(開発用デモPIN: 1234 または 空欄で通過できます)');
    }
  };

  const questionProgressMap = player.questionProgress || {};
  const unitProgressMap = player.unitProgress || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="royal-panel w-full max-w-4xl p-6 space-y-6 relative max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 bg-slate-900 p-2 rounded-full border border-slate-700 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-amber-500/40 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-400 flex items-center justify-center text-indigo-300">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-cinzel text-xl font-black text-amber-300">
                先生用ダッシュボード ＆ 学習ログ検証
              </h2>
              <p className="text-xs text-slate-300">
                児童全体の進捗および問題別クリア・重複報酬防止ログ（questionProgress）を確認できます。
              </p>
            </div>
          </div>

          {isAuthenticated && (
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('class')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'class'
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'bg-slate-900 text-slate-300 border border-slate-700'
                }`}
              >
                <Users className="w-3.5 h-3.5 inline mr-1" />
                学級一覧
              </button>
              <button
                onClick={() => setActiveTab('question_debug')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'question_debug'
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'bg-slate-900 text-slate-300 border border-slate-700'
                }`}
              >
                <Bug className="w-3.5 h-3.5 inline mr-1" />
                問題進捗デバッグ
              </button>
            </div>
          )}
        </div>

        {!isAuthenticated ? (
          /* Simple Password Entry Gate */
          <form onSubmit={handleVerifyPin} className="bg-slate-950/80 p-6 rounded-2xl border border-amber-500/30 max-w-md mx-auto space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center mx-auto text-amber-300">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-amber-200">先生用画面アクセス認証</h3>
            <p className="text-xs text-slate-300">
              ※正式版では Firebase Authentication (Google Workspace/学校アカウント) で安全にログインします。テスト用PIN: <span className="font-mono text-amber-300 font-bold">1234</span>
            </p>

            <input
              type="password"
              placeholder="PINコードを入力 (1234)"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-center font-bold tracking-widest focus:border-amber-400 focus:outline-none"
            />

            <button
              type="submit"
              className="btn-royal-gold w-full py-3 rounded-xl text-xs font-black shadow-lg cursor-pointer"
            >
              ダッシュボードに入る
            </button>
          </form>
        ) : activeTab === 'class' ? (
          /* Main Teacher Portal View */
          <div className="space-y-6">
            {/* Overview Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400">学級児童数</span>
                <div className="text-lg font-black text-amber-300">28 名</div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400">平均正答率</span>
                <div className="text-lg font-black text-emerald-400">85.4 %</div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400">今週の総解破数</span>
                <div className="text-lg font-black text-blue-400">437 問</div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400">ナレッジツリー復習</span>
                <div className="text-lg font-black text-amber-400">18 件発動</div>
              </div>
            </div>

            {/* Class Wide Alert Item */}
            <div className="p-4 bg-amber-950/40 rounded-xl border border-amber-500/40 flex items-center gap-3 text-xs text-amber-200">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-amber-300">【学級でのつまずき注意項目】</span>
                <p>「台形の公式：(上底+下底)×高さ÷2」でのカッコのつけ忘れ間違いが散見されます。</p>
              </div>
            </div>

            {/* Individual Student Progress Roster */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-400" />
                児童個人別 学習ログ一覧
              </h3>

              <div className="border border-slate-800 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-3">児童名</th>
                      <th className="p-3">解いた問題数</th>
                      <th className="p-3">正答率</th>
                      <th className="p-3">注意・苦手項目</th>
                      <th className="p-3">ナレッジ復習回数</th>
                      <th className="p-3">最終学習</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/60">
                    {classRoster.map((s, i) => (
                      <tr key={i} className="hover:bg-slate-800/50">
                        <td className="p-3 font-bold text-slate-200">{s.name}</td>
                        <td className="p-3 text-amber-300 font-bold">{s.solved} 問</td>
                        <td className="p-3 text-emerald-400 font-bold">{s.accuracy} %</td>
                        <td className="p-3 text-rose-300">{s.weak}</td>
                        <td className="p-3 text-amber-400 font-bold">{s.treeCount} 回</td>
                        <td className="p-3 text-slate-400">{s.lastActive}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>データ保護規約: 児童の個別データは校内安全権限の元で管理されています。</span>
            </div>
          </div>
        ) : (
          /* Debug & Question Progress Logs Verification View */
          <div className="space-y-5 text-xs">
            <div className="p-3 bg-slate-900 rounded-xl border border-amber-500/40 text-slate-200 space-y-1">
              <div className="font-bold text-amber-300 flex items-center gap-1.5 text-sm">
                <Bug className="w-4 h-4 text-amber-400" />
                <span>questionProgress ＆ 重複報酬防止データの詳細確認</span>
              </div>
              <p>
                「{player.name}」殿の各問題の挑戦回数、初クリア状況、本日の復習報酬獲得状態（lastReviewRewardDate）をリアルタイムに確認できます。
              </p>
            </div>

            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">問題ID / 単元</th>
                    <th className="p-2.5">挑戦回数</th>
                    <th className="p-2.5">正答 / 誤答</th>
                    <th className="p-2.5">初クリア状態</th>
                    <th className="p-2.5">初回クリア日時</th>
                    <th className="p-2.5">本日復習報酬</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/60">
                  {ALL_LEARNING_QUESTIONS.map((q) => {
                    const qProg = questionProgressMap[q.id];
                    const todayStr = new Date().toISOString().split('T')[0];
                    const isRewardedToday = qProg?.lastReviewRewardDate === todayStr;

                    return (
                      <tr key={q.id} className="hover:bg-slate-800/50">
                        <td className="p-2.5 font-mono text-slate-200">
                          <div className="font-bold text-amber-200">{q.id}</div>
                          <div className="text-[10px] text-slate-400">{q.unitName}</div>
                        </td>
                        <td className="p-2.5 font-bold text-slate-200">
                          {qProg?.attemptCount || 0} 回
                        </td>
                        <td className="p-2.5">
                          <span className="text-emerald-400 font-bold">
                            {qProg?.correctCount || 0}正
                          </span>{' '}
                          /{' '}
                          <span className="text-rose-400 font-bold">
                            {qProg?.incorrectCount || 0}誤
                          </span>
                        </td>
                        <td className="p-2.5">
                          {qProg?.earnedMainReward || qProg?.isFirstCleared ? (
                            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 font-bold rounded border border-emerald-500/40">
                              クリア済み (100%獲得)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-slate-800 text-slate-400 font-bold rounded">
                              未クリア
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 text-slate-400 font-mono text-[10px]">
                          {qProg?.firstClearedAt ? new Date(qProg.firstClearedAt).toLocaleDateString() : '-'}
                        </td>
                        <td className="p-2.5">
                          {isRewardedToday ? (
                            <span className="text-amber-300 font-bold">獲得済み (本日10%支給済)</span>
                          ) : qProg?.earnedMainReward ? (
                            <span className="text-emerald-400 font-bold">本日未獲得 (本日挑戦で10%獲得可能)</span>
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Unit Progress Summary */}
            <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 space-y-2">
              <h4 className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                単元全問制覇ボーナス（unitProgress）の状態
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                {Object.entries(unitProgressMap).length === 0 ? (
                  <div className="text-slate-400 italic col-span-2">
                    まだクリアした単元ボーナスログはありません。
                  </div>
                ) : (
                  Object.entries(unitProgressMap).map(([uId, uProgRaw]) => {
                    const uProg = uProgRaw as UnitProgressData;
                    return (
                      <div key={uId} className="p-2 bg-slate-900 rounded-lg border border-slate-800 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-slate-200">{uId}</div>
                          <div className="text-slate-400 text-[10px]">
                            クリア数: {uProg.clearedQuestionIds?.length || 0}問
                          </div>
                        </div>
                        <div>
                          {uProg.unitRewardClaimed ? (
                            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 font-bold rounded border border-emerald-500/40">
                              ボーナス受取済 (+100EXP / +50P)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded">
                              進行中
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
