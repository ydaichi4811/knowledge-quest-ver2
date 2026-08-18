import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { SyncStatusState } from '../types/cloudSave';
import { subscribeSyncStatus, triggerManualSync, runFirestoreTestWrite } from '../services/saveSyncService';
import { PlayerData } from '../types';
import { Cloud, CloudCheck, CloudOff, RefreshCw, Smartphone, Database, CheckCircle2, AlertTriangle } from 'lucide-react';
import { FuriganaText } from './FuriganaText';

export interface CloudSaveStatusProps {
  player: PlayerData | null;
  onPlayerUpdated?: (updated: PlayerData) => void;
  compact?: boolean;
  className?: string;
}

export const CloudSaveStatus: React.FC<CloudSaveStatusProps> = ({
  player,
  onPlayerUpdated,
  compact = false,
  className = '',
}) => {
  const [status, setStatus] = useState<SyncStatusState>('synced');
  const [isSyncing, setIsSyncing] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    uid: string;
    savedPaths: string[];
    timestamp: string;
    error?: string;
  } | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeSyncStatus((newStatus) => {
      setStatus(newStatus);
    });
    return () => unsubscribe();
  }, []);

  const handleManualSync = async () => {
    if (!player || isSyncing) return;
    setIsSyncing(true);
    const res = await triggerManualSync(player);
    setIsSyncing(false);
    if (res.success && res.updatedPlayer && onPlayerUpdated) {
      onPlayerUpdated(res.updatedPlayer);
    }
  };

  const handleTestWrite = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setTestResult(null);
    const res = await runFirestoreTestWrite(player);
    setIsSyncing(false);
    setTestResult(res);
  };

  // Status configuration details
  const getStatusInfo = () => {
    switch (status) {
      case 'synced':
        return {
          icon: <CloudCheck className="w-4 h-4 text-emerald-400" />,
          label: 'クラウド保存済み',
          badgeBg: 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300',
          dotColor: 'bg-emerald-400',
        };
      case 'syncing':
        return {
          icon: <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />,
          label: 'クラウドに保存中...',
          badgeBg: 'bg-amber-950/80 border-amber-500/50 text-amber-300',
          dotColor: 'bg-amber-400 animate-ping',
        };
      case 'offline':
      case 'error':
        return {
          icon: <CloudOff className="w-4 h-4 text-sky-400" />,
          label: 'この端末にはセーブされています',
          badgeBg: 'bg-slate-900 border-sky-500/50 text-sky-300',
          dotColor: 'bg-sky-400',
        };
      case 'local_only':
      default:
        return {
          icon: <Smartphone className="w-4 h-4 text-amber-300" />,
          label: 'この端末に保存済み',
          badgeBg: 'bg-slate-900 border-slate-700 text-slate-300',
          dotColor: 'bg-amber-400',
        };
    }
  };

  const info = getStatusInfo();

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold shadow ${info.badgeBg} ${className}`}>
        <span className={`w-2 h-2 rounded-full ${info.dotColor}`} />
        {info.icon}
        <span><FuriganaText text={info.label} /></span>
      </div>
    );
  }

  return (
    <div className={`p-3.5 bg-slate-950/90 rounded-xl border border-slate-800 shadow-md flex flex-col gap-3 ${className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg border ${info.badgeBg}`}>
            {info.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-300">セーブ状態:</span>
              <span className="text-xs font-bold text-slate-100">
                <FuriganaText text={info.label} />
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              <FuriganaText text="冒険の記録は自動的に保護されています。" />
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={handleTestWrite}
            disabled={isSyncing}
            className="px-2.5 py-1.5 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/50 rounded-lg text-xs font-bold text-indigo-300 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
            title="Firestoreへの接続およびテストデータ保存を実行します"
          >
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span>Firestoreテスト保存</span>
          </button>

          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-amber-500/40 rounded-lg text-xs font-bold text-amber-300 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span><FuriganaText text={isSyncing ? '同期中...' : '再接続・同期'} /></span>
          </button>
        </div>
      </div>

      {testResult && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-lg border text-xs font-mono space-y-1 ${
            testResult.success
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/60 border-rose-500/40 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-1.5 font-bold">
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>
              {testResult.success ? 'Firestoreテスト保存に成功しました！' : 'Firestoreテスト保存に失敗しました'}
            </span>
          </div>

          <div className="text-[11px] opacity-90 space-y-0.5 pt-1 border-t border-white/10">
            <p>匿名UID: <span className="text-amber-300 font-bold">{testResult.uid}</span></p>
            {testResult.success && testResult.savedPaths.length > 0 && (
              <p>作成ドキュメント: <span className="text-emerald-300">{testResult.savedPaths.join(', ')}</span></p>
            )}
            {testResult.error && (
              <p className="text-rose-300">エラー詳細: {testResult.error}</p>
            )}
            <p className="text-[10px] text-slate-400">タイムスタンプ: {testResult.timestamp}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

