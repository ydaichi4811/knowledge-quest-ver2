import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlayerData, CompanionRoomData, CompanionRoomTheme } from '../types';
import { ROOM_THEMES, FURNITURE_CATALOG, FurnitureItemDefinition } from '../services/itemAndRoomService';
import { savePlayerData } from '../services/gameStorage';
import { Home, Sparkles, X, Check, Lock, RotateCcw } from 'lucide-react';

interface CompanionRoomDecorationModalProps {
  player: PlayerData;
  onUpdatePlayer: (updated: PlayerData) => void;
  onClose: () => void;
}

export const CompanionRoomDecorationModal: React.FC<CompanionRoomDecorationModalProps> = ({
  player,
  onUpdatePlayer,
  onClose,
}) => {
  const currentRoom = player.companionRoom || {
    roomThemeId: 'hajimari',
    wallpaperId: 'wall_wood',
    floorId: 'floor_carpet',
    bedId: 'bed_standard',
    deskId: 'desk_adventurer',
    shelfId: 'shelf_wooden',
    lightId: 'light_lamp',
    plantId: 'plant_potted',
    decorationIds: ['decor_globe'],
    windowViewId: 'win_blue_sky',
    unlockedRoomItemIds: ['wall_wood', 'floor_carpet', 'bed_standard', 'desk_adventurer', 'shelf_wooden', 'light_lamp', 'plant_potted', 'decor_globe', 'win_blue_sky'],
    lastUpdatedAt: new Date().toISOString(),
  };

  const [workingRoom, setWorkingRoom] = useState<CompanionRoomData>({ ...currentRoom });
  const [activeTab, setActiveTab] = useState<'themes' | 'wallpaper' | 'floor' | 'bed' | 'desk' | 'shelf' | 'light' | 'plant' | 'decoration' | 'window'>('themes');

  const unlockedIds = workingRoom.unlockedRoomItemIds || [];

  // Handle Theme Selection
  const handleSelectTheme = (themeId: CompanionRoomTheme) => {
    const themeDef = ROOM_THEMES[themeId];
    if (!themeDef) return;

    setWorkingRoom((prev) => ({
      ...prev,
      roomThemeId: themeId,
      wallpaperId: themeDef.defaultWallpaper,
      floorId: themeDef.defaultFloor,
      bedId: themeDef.defaultBed,
      deskId: themeDef.defaultDesk,
      shelfId: themeDef.defaultShelf,
      lightId: themeDef.defaultLight,
      plantId: themeDef.defaultPlant,
      decorationIds: [themeDef.defaultDecoration],
      windowViewId: themeDef.defaultWindow,
    }));
  };

  // Handle Item Select
  const handleSelectItem = (item: FurnitureItemDefinition) => {
    if (!unlockedIds.includes(item.id)) return; // Locked

    setWorkingRoom((prev) => {
      switch (item.category) {
        case 'wallpaper': return { ...prev, wallpaperId: item.id };
        case 'floor': return { ...prev, floorId: item.id };
        case 'bed': return { ...prev, bedId: item.id };
        case 'desk': return { ...prev, deskId: item.id };
        case 'shelf': return { ...prev, shelfId: item.id };
        case 'light': return { ...prev, lightId: item.id };
        case 'plant': return { ...prev, plantId: item.id };
        case 'decoration': return { ...prev, decorationIds: [item.id] };
        case 'window': return { ...prev, windowViewId: item.id };
        default: return prev;
      }
    });
  };

  const handleSave = () => {
    const updatedRoom: CompanionRoomData = {
      ...workingRoom,
      lastUpdatedAt: new Date().toISOString(),
    };

    const updatedPlayer: PlayerData = {
      ...player,
      companionRoom: updatedRoom,
    };

    savePlayerData(updatedPlayer);
    onUpdatePlayer(updatedPlayer);
    onClose();
  };

  const handleReset = () => {
    setWorkingRoom({ ...currentRoom });
  };

  // Filter Catalog by active tab
  const filteredCatalog = FURNITURE_CATALOG.filter((item) => item.category === activeTab);

  const activeTheme = ROOM_THEMES[workingRoom.roomThemeId] || ROOM_THEMES.hajimari;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-3xl bg-slate-900 border-2 border-emerald-500/50 rounded-3xl shadow-2xl p-6 text-slate-100 space-y-4 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/40">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-emerald-200">相棒のお部屋・模様替え</h2>
              <p className="text-xs text-slate-400">
                お好きな家具やテーマを選んで、相棒の過ごしやすいお部屋に模様替えしましょう！
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Live Preview Card */}
        <div className={`p-4 rounded-2xl border border-emerald-500/30 bg-gradient-to-b ${activeTheme.bgClass} flex items-center justify-between`}>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 px-2 py-0.5 bg-emerald-950/80 rounded-md border border-emerald-500/40">
              現在の模様替えテーマ: {activeTheme.name}
            </span>
            <div className="text-xs text-slate-200 flex flex-wrap gap-2 pt-1">
              <span>壁: {workingRoom.wallpaperId}</span> • <span>床: {workingRoom.floorId}</span> • <span>ベッド: {workingRoom.bedId}</span> • <span>机: {workingRoom.deskId}</span>
            </div>
          </div>
          <div className="text-3xl">{activeTheme.icon}</div>
        </div>

        {/* Slot Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
          <button
            onClick={() => setActiveTab('themes')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'themes'
                ? 'bg-emerald-500 text-slate-950 border border-emerald-300 font-black'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🏠 部屋テーマ
          </button>
          <button
            onClick={() => setActiveTab('wallpaper')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'wallpaper' ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
            }`}
          >
            🪵 壁紙
          </button>
          <button
            onClick={() => setActiveTab('floor')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'floor' ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
            }`}
          >
            🧶 床
          </button>
          <button
            onClick={() => setActiveTab('bed')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'bed' ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
            }`}
          >
            🛏️ ベッド
          </button>
          <button
            onClick={() => setActiveTab('desk')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'desk' ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
            }`}
          >
            🪑 机
          </button>
          <button
            onClick={() => setActiveTab('shelf')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'shelf' ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
            }`}
          >
            📚 本棚
          </button>
          <button
            onClick={() => setActiveTab('light')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'light' ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
            }`}
          >
            💡 照明
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="max-h-[260px] overflow-y-auto pr-1">
          {activeTab === 'themes' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.values(ROOM_THEMES).map((theme) => {
                const isSelected = workingRoom.roomThemeId === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => handleSelectTheme(theme.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'bg-emerald-950/60 border-emerald-400 shadow-lg shadow-emerald-950/50'
                        : 'bg-slate-800/80 border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <div className="text-3xl p-2 bg-slate-900 rounded-xl border border-slate-700">
                      {theme.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-amber-200">{theme.name}</h3>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <p className="text-[11px] text-slate-300 leading-tight pt-1">{theme.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredCatalog.map((item) => {
                const isUnlocked = unlockedIds.includes(item.id);
                let isEquipped = false;
                switch (item.category) {
                  case 'wallpaper': isEquipped = workingRoom.wallpaperId === item.id; break;
                  case 'floor': isEquipped = workingRoom.floorId === item.id; break;
                  case 'bed': isEquipped = workingRoom.bedId === item.id; break;
                  case 'desk': isEquipped = workingRoom.deskId === item.id; break;
                  case 'shelf': isEquipped = workingRoom.shelfId === item.id; break;
                  case 'light': isEquipped = workingRoom.lightId === item.id; break;
                  case 'plant': isEquipped = workingRoom.plantId === item.id; break;
                  case 'decoration': isEquipped = workingRoom.decorationIds.includes(item.id); break;
                  case 'window': isEquipped = workingRoom.windowViewId === item.id; break;
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectItem(item)}
                    disabled={!isUnlocked}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                      isEquipped
                        ? 'bg-emerald-950/60 border-emerald-400'
                        : isUnlocked
                        ? 'bg-slate-800/80 border-slate-700 hover:border-slate-500 cursor-pointer'
                        : 'bg-slate-950/40 border-slate-800/80 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="text-2xl p-2 bg-slate-900 rounded-xl border border-slate-700 relative">
                      {item.icon}
                      {!isUnlocked && (
                        <div className="absolute inset-0 bg-slate-950/80 rounded-xl flex items-center justify-center text-slate-400">
                          <Lock className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-200">{item.name}</h4>
                        {isEquipped && <span className="text-[10px] font-black text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">設置中</span>}
                      </div>
                      <p className="text-[10px] text-slate-400 pt-1">
                        {isUnlocked ? item.description : `🔒 解放条件: ${item.unlockCondition}`}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>元に戻す</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-xl text-xs transition-all cursor-pointer shadow-lg flex items-center gap-1.5 border border-emerald-300"
            >
              <Check className="w-4 h-4" />
              <span>決定する</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
