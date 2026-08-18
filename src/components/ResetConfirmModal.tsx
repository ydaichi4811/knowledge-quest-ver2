import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, AlertTriangle, X } from 'lucide-react';

interface ResetConfirmModalProps {
  onClose: () => void;
  onConfirmReset: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  onClose,
  onConfirmReset,
}) => {
  const [confirmedChecked, setConfirmedChecked] = useState(false);

  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalDocOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalDocOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md max-h-[calc(100dvh-32px)] bg-slate-900 border-2 border-rose-500/80 rounded-2xl p-6 shadow-2xl relative space-y-4 overflow-y-auto text-slate-100"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
          aria-label="閉じる"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 text-rose-400">
          <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-100">
            セーブデータの初期化確認
          </h3>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/80 p-3.5 rounded-xl border border-rose-900/50">
          現在のプレイヤー名、レベル、算数のクリア記録、相棒モンスターの育成データがすべて削除されます。この操作は取り消せません。
        </p>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="reset_check"
            checked={confirmedChecked}
            onChange={(e) => setConfirmedChecked(e.target.checked)}
            className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-rose-500 focus:ring-rose-500 cursor-pointer"
          />
          <label
            htmlFor="reset_check"
            className="text-xs text-slate-200 font-bold cursor-pointer select-none"
          >
            データを削除して最初からプレイし直すことに同意します。
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-all cursor-pointer"
          >
            キャンセル
          </button>
          <button
            disabled={!confirmedChecked}
            onClick={onConfirmReset}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:hover:bg-rose-600 transition-all cursor-pointer flex items-center gap-1.5 shadow-lg"
          >
            <RotateCcw className="w-4 h-4" />
            <span>完全初期化を実行</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
