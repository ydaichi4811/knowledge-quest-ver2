import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameScreen, PlayerData, GameMode, AvatarOption, PartnerType, PrivacySetting, QuestionProgressData, QuestStage } from './types';
import {
  loadPlayerData,
  savePlayerData,
  createInitialPlayer,
  resetPlayerData,
} from './services/gameStorage';
import { ensureAnonymousUser } from './services/authService';
import { syncCloudAndLocalData } from './services/cloudSaveService';
import { savePlayerDataWithCloud } from './services/saveSyncService';
import { CloudSaveStatus } from './components/CloudSaveStatus';
import { MathriaBackground } from './components/MathriaBackground';
import { GameFooterMenu, MainTabType, NavTabType } from './components/GameFooterMenu';
import { HomeScreen } from './components/HomeScreen';
import { MainGameLayout } from './components/MainGameLayout';
import { CharacterScreenView } from './components/CharacterScreenView';
import { GachaScreenView } from './components/GachaScreenView';
import { RankingScreenView } from './components/RankingScreenView';
import { ZukanScreenView } from './components/ZukanScreenView';
import { SettingsScreenView } from './components/SettingsScreenView';
import { TitleScreen } from './components/TitleScreen';
import { RegistrationScreen } from './components/RegistrationScreen';
import { MapScreen } from './components/MapScreen';
import { MathBattleModal } from './components/MathBattleModal';
import { PartnerCareModal } from './components/PartnerCareModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { KnowledgeTreeScreenView } from './components/KnowledgeTreeScreenView';
import { FoundationReviewView } from './components/FoundationReviewView';
import { TeacherDashboardModal } from './components/TeacherDashboardModal';
import { CompanionRoomModal } from './components/CompanionRoomModal';
import { CompanionHatchingModal } from './components/CompanionHatchingModal';
import { CompanionGrowthModal } from './components/CompanionGrowthModal';
import { PretestModal } from './components/PretestModal';
import { FuriganaProvider } from './context/FuriganaContext';

export default function App() {
  const [player, setPlayer] = useState<PlayerData | null>(null);
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('title');
  const [activeTab, setActiveTab] = useState<MainTabType>('study');

  // Modals state
  const [activeQuestStage, setActiveQuestStage] = useState<{
    regionId?: string;
    stageId: string;
    targetUnitId?: string;
    stageInfo?: QuestStage;
  } | null>(null);

  const [showPartnerCareModal, setShowPartnerCareModal] = useState(false);
  const [showCompanionRoomModal, setShowCompanionRoomModal] = useState(false);
  const [showCompanionHatchingModal, setShowCompanionHatchingModal] = useState(false);
  const [showCompanionGrowthModal, setShowCompanionGrowthModal] = useState(false);
  const [showPretestModal, setShowPretestModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showTeacherDashboard, setShowTeacherDashboard] = useState(false);

  // Load save data & initialize Firebase Anonymous Cloud Sync on mount
  useEffect(() => {
    async function initAppSaveData() {
      const initialLocal = loadPlayerData();
      if (initialLocal) {
        setPlayer(initialLocal);
      }

      try {
        // Anonymous authentication & cloud restore / migration check
        const uid = await ensureAnonymousUser();
        if (uid) {
          const syncResult = await syncCloudAndLocalData(uid, initialLocal);
          if (syncResult.player) {
            setPlayer(syncResult.player);
          }
        }
      } catch (err) {
        console.warn('⚠️ [App Init] クラウド同期処理で例外が発生しましたが、ローカルデータで起動を継続します:', err);
      }
    }

    initAppSaveData();
  }, []);


  // Check companion hatching/growth triggers when player state changes
  useEffect(() => {
    if (!player || !player.companion) return;
    const comp = player.companion;

    if (comp.stage === 'egg' && comp.growthExp >= 50 && !showCompanionHatchingModal) {
      setShowCompanionHatchingModal(true);
    } else if (comp.stage === 'hatched' && comp.growthExp >= 150 && !showCompanionGrowthModal) {
      const uniqueCleared = Object.values(player.questionProgress || {}).filter((q: QuestionProgressData) => q.isFirstCleared).length;
      const reviewCount = (player.reviewedConcepts || []).length + (player.reviewSession?.isCompleted ? 1 : 0);

      if (uniqueCleared >= 10 && reviewCount >= 1) {
        setShowCompanionGrowthModal(true);
      }
    }
  }, [player]);

  // Handlers
  const handleStartNew = () => {
    setCurrentScreen('registration');
  };

  const handleContinue = () => {
    if (player) {
      setCurrentScreen('home');
      setActiveTab('study');
    }
  };

  const handleRegister = (
    name: string,
    mode: GameMode,
    avatar: AvatarOption,
    partnerType: PartnerType,
    eggType: string
  ) => {
    const newPlayer = createInitialPlayer(name, mode, avatar, partnerType, eggType);
    savePlayerDataWithCloud(newPlayer);
    setPlayer(newPlayer);
    setCurrentScreen('home');
    setActiveTab('study');
  };

  const handleToggleMode = (newMode: GameMode) => {
    if (!player) return;
    const updated: PlayerData = { ...player, mode: newMode };
    savePlayerDataWithCloud(updated);
    setPlayer(updated);
  };

  const handleUpdatePrivacySetting = (setting: PrivacySetting) => {
    if (!player) return;
    const updated: PlayerData = { ...player, privacySetting: setting };
    savePlayerDataWithCloud(updated);
    setPlayer(updated);
  };

  const handleStartQuest = (regionId: string, stageId: string, stageInfo?: QuestStage) => {
    setActiveQuestStage({ regionId, stageId, stageInfo });
  };

  const handleStartSkillPractice = (skillId: string) => {
    setActiveQuestStage({ stageId: 'foundation_review', targetUnitId: skillId });
  };

  const handleStartUnitQuestion = (targetUnitId: string) => {
    setActiveQuestStage({ stageId: 'foundation_review', targetUnitId });
  };

  const handleOpenResetModal = () => {
    setShowResetModal(true);
  };

  const handleConfirmReset = () => {
    resetPlayerData();
    setPlayer(null);
    setShowResetModal(false);
    setCurrentScreen('title');
    setActiveTab('study');
  };

  const handleSelectTab = (tab: NavTabType) => {
    if (tab === 'map') {
      setCurrentScreen('map');
    } else {
      setActiveTab(tab as MainTabType);
      if (currentScreen === 'map') {
        setCurrentScreen('home');
      }
    }
  };

  return (
    <FuriganaProvider
      mode={player?.furiganaMode || 'difficult'}
      excludeNames={[player?.name || '', player?.companion?.name || '']}
    >
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Universal Game Fantasy Background (Castle, Sky, Grass) */}
      <MathriaBackground />

      {/* Top Header Title Bar for Active Game Session (hidden when on full master HomeScreen layout) */}
      {player && currentScreen !== 'title' && currentScreen !== 'registration' && (currentScreen !== 'home' || activeTab !== 'study') && (
        <header className="w-full bg-slate-950/80 border-b-2 border-amber-500/50 px-4 py-2 flex items-center justify-between relative z-20 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏰</span>
            <span className="font-cinzel text-base sm:text-lg font-black text-amber-300">
              Knowledge Quest ～マスリア王国～
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <CloudSaveStatus player={player} onPlayerUpdated={(updated) => setPlayer(updated)} compact />
            <div className="bg-slate-900 border border-amber-500/40 px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-bold text-amber-300">
              <span>💎 {player.points} pt</span>
            </div>
            <div className="bg-slate-900 border border-blue-500/40 px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-bold text-blue-300">
              <span>Lv.{player.level} {player.nickname || player.name}</span>
            </div>
          </div>
        </header>
      )}

      {/* Main View Display Area */}
      <main className="flex-1 flex flex-col relative z-10 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen === 'home' ? `home-${activeTab}` : currentScreen}
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.99 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex-1 flex flex-col w-full min-h-full"
          >
            {currentScreen === 'title' && (
              <TitleScreen
                saveData={player}
                onStartNew={handleStartNew}
                onContinue={handleContinue}
                onOpenResetModal={handleOpenResetModal}
              />
            )}

            {currentScreen === 'registration' && (
              <RegistrationScreen
                onRegister={handleRegister}
                onBackToTitle={() => setCurrentScreen('title')}
              />
            )}

            {/* In-Game Tab Views */}
            {currentScreen === 'home' && player && (
              <>
                {activeTab === 'study' && (
                  <HomeScreen
                    player={player}
                    onNavigate={(screen) => setCurrentScreen(screen)}
                    onStartQuest={handleStartQuest}
                    onOpenPartnerCare={() => setShowPartnerCareModal(true)}
                    onOpenCompanionRoom={() => setShowCompanionRoomModal(true)}
                    onToggleMode={handleToggleMode}
                    onUpdatePlayer={(updated) => setPlayer(updated)}
                    onSelectTab={handleSelectTab}
                  />
                )}

                {activeTab === 'review' && (
                  <FoundationReviewView
                    player={player}
                    onStartQuestion={handleStartUnitQuestion}
                    onStartReviewQuest={(unitId) => handleStartQuest('area_stage_1', unitId)}
                  />
                )}

                {activeTab === 'tree' && (
                  <KnowledgeTreeScreenView
                    player={player}
                    onStartSkillPractice={handleStartSkillPractice}
                  />
                )}

                {activeTab === 'character' && (
                  <CharacterScreenView
                    player={player}
                    onOpenPartnerCare={() => setShowPartnerCareModal(true)}
                    onPlayerUpdate={(updated) => setPlayer(updated)}
                  />
                )}

                {activeTab === 'gacha' && (
                  <GachaScreenView
                    player={player}
                    onPlayerUpdate={(updated) => setPlayer(updated)}
                  />
                )}

                {activeTab === 'ranking' && (
                  <RankingScreenView player={player} />
                )}

                {activeTab === 'zukan' && (
                  <ZukanScreenView player={player || undefined} />
                )}

                {activeTab === 'settings' && (
                  <SettingsScreenView
                    player={player}
                    onToggleMode={handleToggleMode}
                    onResetGame={handleOpenResetModal}
                    onOpenTeacherDashboard={() => setShowTeacherDashboard(true)}
                    onUpdatePrivacySetting={handleUpdatePrivacySetting}
                    onPlayerUpdate={(updated) => setPlayer(updated)}
                  />
                )}
              </>
            )}

            {currentScreen === 'map' && player && (
              <MapScreen
                player={player}
                onBackToHome={() => setCurrentScreen('home')}
                onStartQuest={handleStartQuest}
                onOpenPretest={() => setShowPretestModal(true)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Royal Game Menu Footer Bar (hidden when on full master HomeScreen layout) */}
      {player && currentScreen !== 'title' && currentScreen !== 'registration' && (currentScreen !== 'home' || activeTab !== 'study') && (
        <GameFooterMenu
          activeTab={activeTab}
          currentScreen={currentScreen}
          onSelectTab={handleSelectTab}
        />
      )}

      {/* Interactive Quests / Battle Modal */}
      {activeQuestStage && player && (
        <MathBattleModal
          player={player}
          stageId={activeQuestStage.stageId}
          stageInfo={activeQuestStage.stageInfo}
          targetUnitId={activeQuestStage.targetUnitId}
          onClose={() => setActiveQuestStage(null)}
          onPlayerUpdate={(updated) => {
            console.log(`⑦/⑧ [App.tsx -> onPlayerUpdate] Received updated player. player.name=${updated.name}, EXP=${updated.exp}, KQ=${updated.points}`);
            savePlayerDataWithCloud(updated);
            setPlayer(updated);
          }}
        />
      )}

      {/* Partner Care Modal */}
      {showPartnerCareModal && player && (
        <PartnerCareModal
          player={player}
          onClose={() => setShowPartnerCareModal(false)}
          onPlayerUpdate={(updated) => setPlayer(updated)}
        />
      )}

      {/* Companion Room Modal */}
      {showCompanionRoomModal && player && (
        <CompanionRoomModal
          player={player}
          onClose={() => setShowCompanionRoomModal(false)}
          onPlayerUpdate={(updated) => setPlayer(updated)}
        />
      )}

      {/* Companion Hatching Event Modal */}
      {showCompanionHatchingModal && player && (
        <CompanionHatchingModal
          player={player}
          onClose={() => setShowCompanionHatchingModal(false)}
          onPlayerUpdate={(updated) => setPlayer(updated)}
        />
      )}

      {/* Companion Growth Evolution Modal */}
      {showCompanionGrowthModal && player && (
        <CompanionGrowthModal
          player={player}
          onClose={() => setShowCompanionGrowthModal(false)}
          onPlayerUpdate={(updated) => setPlayer(updated)}
        />
      )}

      {/* Pretest Bonus Mission Modal */}
      {showPretestModal && player && (
        <PretestModal
          player={player}
          unitId="area"
          onClose={() => setShowPretestModal(false)}
          onPlayerUpdate={(updated) => setPlayer(updated)}
          onNavigateToStage={(stageId) => {
            setShowPretestModal(false);
            setActiveQuestStage({ stageId });
          }}
        />
      )}

      {/* Teacher Dashboard Modal */}
      {showTeacherDashboard && player && (
        <TeacherDashboardModal
          player={player}
          onClose={() => setShowTeacherDashboard(false)}
        />
      )}

      {/* Data Reset Confirmation Modal */}
      {showResetModal && (
        <ResetConfirmModal
          onClose={() => setShowResetModal(false)}
          onConfirmReset={handleConfirmReset}
        />
      )}
    </div>
    </FuriganaProvider>
  );
}
