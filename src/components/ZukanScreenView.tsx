import React, { useState } from 'react';
import { BookOpen, Sparkles, CheckCircle2, Award } from 'lucide-react';
import { PlayerData } from '../types';
import { CompanionZukanView } from './CompanionZukanView';

interface ZukanScreenViewProps {
  player?: PlayerData;
}

export const ZukanScreenView: React.FC<ZukanScreenViewProps> = ({ player }) => {
  const [activeTab, setActiveTab] = useState<'formulas' | 'monsters' | 'companion'>('companion');
  const [showCompanionZukanModal, setShowCompanionZukanModal] = useState(false);

  const FORMULAS = [
    {
      title: '平行四辺形の面積',
      formula: '底辺 × 高さ',
      icon: '▰',
      desc: '底辺に対して垂直（90度）に交わる高さを使うのがポイント！',
      example: '底辺 6cm、高さ 4cm → 6 × 4 = 24㎠',
    },
    {
      title: '三角形の面積',
      formula: '底辺 × 高さ ÷ 2',
      icon: '▲',
      desc: '平行四辺形の半分だから「÷ 2」を忘れないようにしよう！',
      example: '底辺 8cm、高さ 5cm → 8 × 5 ÷ 2 = 20㎠',
    },
    {
      title: '台形の面積',
      formula: '(上底 ＋ 下底) × 高さ ÷ 2',
      icon: '⏢',
      desc: 'カッコをつけて「上底と下底をたしてから」高さをかけて半分にする！',
      example: '(上底 3cm ＋ 下底 7cm) × 高さ 4cm ÷ 2 = 20㎠',
    },
    {
      title: 'ひし形の面積',
      formula: '対角線 × 対角線 ÷ 2',
      icon: '◆',
      desc: '2本の対角線を掛けて「÷ 2」するとひし形の面積が求められる！',
      example: '対角線 6cm × 対角線 8cm ÷ 2 = 24㎠',
    },
    {
      title: '直方体・立方体の体積',
      formula: 'たて × 横 × 高さ',
      icon: '🧊',
      desc: '立体のかさ（体積）を表す単位は ㎤ (立方センチメートル) だよ！',
      example: 'たて 3cm × 横 4cm × 高さ 5cm = 60㎤',
    },
  ];

  const MONSTERS = [
    { name: 'ルミナフォックス', icon: '🦊', element: '光', desc: '賢い狐の精霊。計算が得意でひらめきを与える。' },
    { name: 'アクアウルム', icon: '🐉', element: '水', desc: '幾何学の澄んだ水辺にすむドラゴン。論理的思考力が高い。' },
    { name: 'フローラグリフィン', icon: '🦅', element: '風', desc: '面積の森を守る聖獣。素早い暗算で敵を圧倒する。' },
    { name: 'フレイムタイガー', icon: '🐯', element: '火', desc: '情熱の数理戦士。難しい文章問題に立ち向かう強さを持つ。' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-6 my-auto relative z-10">
      <div className="royal-panel p-6 space-y-6">
        <div className="flex items-center justify-between border-b-2 border-amber-500/40 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-400" />
            <h2 className="font-cinzel text-xl sm:text-2xl font-black text-amber-300">
              マスリア王国 大図鑑
            </h2>
          </div>

          <div className="flex gap-2">
            {player && player.companion && (
              <button
                onClick={() => setActiveTab('companion')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'companion'
                    ? 'bg-emerald-500 text-slate-950 border border-emerald-300 shadow-md'
                    : 'bg-slate-900 text-slate-300 border border-slate-700'
                }`}
              >
                ✨ 知識の相棒図鑑
              </button>
            )}
            <button
              onClick={() => setActiveTab('formulas')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'formulas'
                  ? 'bg-amber-500 text-slate-950 border border-amber-300 shadow-md'
                  : 'bg-slate-900 text-slate-300 border border-slate-700'
              }`}
            >
              📐 小5算数公式
            </button>
            <button
              onClick={() => setActiveTab('monsters')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'monsters'
                  ? 'bg-amber-500 text-slate-950 border border-amber-300 shadow-md'
                  : 'bg-slate-900 text-slate-300 border border-slate-700'
              }`}
            >
              🐾 冒険モンスター
            </button>
          </div>
        </div>

        {activeTab === 'companion' && player ? (
          <div className="space-y-4 text-center py-2">
            <div className="p-6 bg-slate-950/80 border-2 border-emerald-500/50 rounded-2xl max-w-xl mx-auto space-y-3">
              <div className="text-4xl">📚✨</div>
              <h3 className="text-lg font-black text-amber-200">「知識の相棒図鑑」を閲覧する</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                これまでに発見・育成した相棒の【種族・属性・レア度形態・進化傾向】を閲覧できます！
              </p>
              <button
                onClick={() => setShowCompanionZukanModal(true)}
                className="btn-royal-gold px-6 py-3 rounded-xl text-xs font-black inline-flex items-center gap-2 cursor-pointer shadow-lg animate-gold-glow mt-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>知識の相棒図鑑を開く</span>
              </button>
            </div>
          </div>
        ) : activeTab === 'formulas' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FORMULAS.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-950/80 p-4 rounded-xl border border-amber-500/30 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-xs font-black text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-400">
                    {item.title}
                  </span>
                </div>
                <div className="text-base font-black text-emerald-300 font-cinzel text-center py-1 bg-slate-900 rounded border border-slate-800">
                  {item.formula}
                </div>
                <p className="text-xs text-slate-300">{item.desc}</p>
                <div className="text-[11px] text-amber-200 bg-amber-950/40 p-2 rounded border border-amber-500/20">
                  💡 例: {item.example}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MONSTERS.map((m, idx) => (
              <div
                key={idx}
                className="bg-slate-950/80 p-4 rounded-xl border border-amber-500/30 flex items-center gap-4"
              >
                <div className="text-5xl">{m.icon}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-amber-200">{m.name}</span>
                    <span className="text-[10px] bg-slate-900 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                      属性: {m.element}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCompanionZukanModal && player && (
        <CompanionZukanView
          player={player}
          onClose={() => setShowCompanionZukanModal(false)}
        />
      )}
    </div>
  );
};
