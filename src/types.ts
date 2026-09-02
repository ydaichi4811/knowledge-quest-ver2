export type GameMode = 'adventure' | 'raising';

export type GameScreen = 'title' | 'registration' | 'home' | 'map' | 'companion_zukan';

export type AvatarOption = 'hero' | 'mage' | 'knight' | 'scholar';

export type PartnerType = 'dragon' | 'fox' | 'golem';

export interface PartnerStats {
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  speed: number;
}

export interface PartnerData {
  id: string;
  name: string;
  type: PartnerType;
  level: number;
  exp: number;
  maxExp: number;
  happiness: number; // 0 - 100
  satiety: number;   // 0 - 100
  stage: 1 | 2 | 3;
  stats: PartnerStats;
  avatarIcon: string;
  element: '草' | '火' | '水';
}

export type PrivacySetting = 'private' | 'class' | 'teacher_only';

export type ClassroomId = 'class_1' | 'class_2' | 'class_3';

export type HeroGender = 'boy' | 'girl';
export type HeroViewType = 'sd' | 'portrait';
export type HeroOutfitRank = 'novice' | 'royal' | 'knight' | 'master';

export interface CharacterCustomizationData {
  characterId: string;
  gender?: HeroGender;
  viewType?: HeroViewType;
  outfitRank?: HeroOutfitRank;
  hairStyle: string;
  hairColor: string;
  skinTone: string;
  outfitId: string;
  weaponId: string;
  accessoryId: string;
  petId: string;
  animationEnabled?: boolean;
}

export type ReviewStatus = 'unreviewed' | 'practicing' | 'almost' | 'completed' | 'mastered';

export type UnitMasteryStatus = 'mastered' | 'good' | 'almost' | 'practicing';

export interface AnswerHistoryRecord {
  id: string; // unique answer event ID
  questionId: string;
  stageId?: string;
  subject: string; // 'math'
  grade: number;
  unitId: string;
  unitName?: string;
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
  selectedChoiceIndex?: number;
  selectedChoiceText?: string;
  correctChoiceIndex?: number;
  correctChoiceText?: string;
  usedHint?: boolean;
  hintCount: number; // 0, 1, 2, 3
  attemptCount: number; // 1, 2, ...
  timestamp: string; // ISO 8601 string
  timeSpentSeconds: number;
  isFirstTryCorrect: boolean;
}

export interface ReviewCandidateItem {
  questionId: string;
  unitId: string;
  subject: string;
  grade: number;
  status: ReviewStatus;
  attemptCount: number;
  correctCount: number;
  incorrectCount: number;
  consecutiveCorrect: number;
  lastHintCount: number;
  maxHintCount: number;
  totalTimeSpentSeconds: number;
  averageTimeSpentSeconds: number;
  lastAnsweredAt: string;
  lastIncorrectAt?: string;
  lastReviewedAt?: string;
  masteredAt?: string;
  lastCorrectDates?: string[]; // YYYY-MM-DD strings for multi-day mastery check
}

export interface QuestionProgressData {
  questionId: string;
  attemptCount: number;
  correctCount: number;
  incorrectCount: number;
  firstClearedAt?: string;
  lastAnsweredAt: string;
  isFirstCleared: boolean;
  bestResult?: 'first_try' | 'hint' | 'foundation_reviewed' | 'retry';
  hintUsed: boolean;
  earnedMainReward: boolean;
  lastReviewRewardDate?: string; // YYYY-MM-DD
  consecutiveCorrect?: number;
  reviewStatus?: ReviewStatus;
}

export interface UnitProgressData {
  unitId?: string;
  totalAttempted: number;
  totalCorrect: number;
  cleared: boolean;
  mastered: boolean;
  clearedQuestionIds?: string[];
  isUnitCompleted?: boolean;
  unitRewardClaimed?: boolean;
  unitRewardClaimedAt?: string;
}

export type SkillStatus = 'not_attempted' | 'practicing' | 'achieved' | 'mastered';

export interface LearningSkill {
  skillId: string;
  grade: number; // 2, 3, 4, 5
  subject: string; // 'math'
  unit: string;
  title: string;
  description: string;
  prerequisiteSkillIds: string[];
  relatedQuestionIds: string[];
  masteryThreshold: number; // e.g. 90% or 3 questions
  icon: string;
  mapPosition: { x: number; y: number };
}

export interface SkillProgressData {
  skillId: string;
  attemptedQuestionIds: string[];
  correctQuestionIds: string[];
  attemptCount: number;
  correctCount: number;
  accuracy: number; // 0 - 100
  status: SkillStatus;
  lastPracticedAt?: string;
  masteredAt?: string;
}

export type CompanionStage = 'egg' | 'hatched' | 'child' | 'grown' | 'evolved';

export type CompanionExpression = 'normal' | 'happy' | 'thinking' | 'sleeping' | 'levelup' | 'pre_evolution';

export type CompanionSpeciesId = 'mokoru' | 'rifin' | 'lumia' | 'kurudo' | 'poruka';

export type CompanionAttribute = 'fire' | 'water' | 'forest' | 'wind' | 'light' | 'star';

export type CompanionPersonality =
  | 'ganbariya'
  | 'sakitagari'
  | 'nonbiri'
  | 'chitei'
  | 'amembou'
  | 'yuukan'
  | 'hirameki'
  | 'genki'
  | 'yasashii'
  | 'boukenzuki';

export type CompanionRarity = 'N' | 'R' | 'SR' | 'UR' | 'SEC';

export type CompanionEvolutionType = 'hirameki' | 'doryoku' | 'bouken' | 'kizuna' | 'yuuki';

export interface CompanionAppearance {
  bodyType: string;
  bodyColor: string;       // Primary color hex/name
  secondaryColor: string;   // Secondary accent color
  eyeType: string;
  eyeColor: string;
  earType: string;
  hornType?: string;
  patternType: string;     // e.g. 'none', 'stripes', 'spots', 'stars', 'runes', 'ripples'
  tailType: string;
  wingType?: string;
  effectType?: string;     // e.g. 'none', 'sparkles', 'flames', 'leaves', 'bubbles', 'aura'
  accessoryId?: string;
}

export interface ProgressTraits {
  insightPoints: number;   // ひらめき (First try correct)
  effortPoints: number;    // 努力 (Foundation reviews)
  adventurePoints: number; // 冒険 (Different units / stages)
  bondPoints: number;      // きずな (Daily care & streaks)
  couragePoints: number;   // 勇気 (Retrying after incorrect)
}

export interface CompanionGrowthLogEntry {
  id: string;
  type: 'obtained_egg' | 'hatched' | 'named' | 'grown_child' | 'grown_adult' | 'final_evolved' | 'rarity_upgraded' | 'first_unit_cleared' | 'foundation_review_mastered';
  title: string;
  description: string;
  date: string;
  icon: string;
  cardBadge?: string;
}

export interface CompanionSettings {
  partnerAnimationEnabled: boolean;
  partnerDialogueEnabled: boolean;
  shortenGrowthAnimation: boolean;
}

export interface CompanionData {
  companionId: string;
  generationSeed: string;    // Seed for reproducible exact appearance & stats
  chosenEggType: string;     // e.g. 'egg_fluffy' | 'egg_leaf' | 'egg_light' | 'egg_dragon' | 'egg_drop'
  name: string;
  speciesId: CompanionSpeciesId;
  attribute: CompanionAttribute;
  personality: CompanionPersonality;
  birthRarity: 'N' | 'R' | 'SR' | 'UR';
  currentRarity: CompanionRarity;
  rarityUpgraded?: boolean;
  stage: CompanionStage;
  level: number;
  growthExp: number;        // 知識エネルギー
  bond: number;             // きずな
  energy: number;
  appearance: CompanionAppearance;
  progressTraits: ProgressTraits;
  evolutionType: CompanionEvolutionType;
  obtainedAt: string;
  hatchedAt?: string;
  grownChildAt?: string;
  lastInteractionAt?: string;
  lastCaredDates?: {
    petDate?: string;
    playDate?: string;
    talkDate?: string;
  };
  equippedAccessoryId?: string;
  unlockedAccessories: string[];
  roomItemIds: string[];
  unlockedActions: string[];
  growthLogs: CompanionGrowthLogEntry[];
  zukanDiscoveredSpecies?: string[];
  zukanDiscoveredAttributes?: string[];
  zukanDiscoveredPatterns?: string[];
}

export interface ReviewSessionData {
  sourceQuestionId: string;
  sourceSkillId?: string;
  reviewSkillId: string;
  reviewQuestionIds: string[];
  currentReviewIndex: number;
  correctCount: number;
  startedAt: string;
  completedAt?: string;
  isCompleted: boolean;
  returnedToSource: boolean;
}

export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type ItemType = 'growth' | 'trait' | 'bond' | 'special' | 'evolution';

export interface InventoryItem {
  itemId: string;
  itemType: ItemType;
  name: string;
  description: string;
  rarity: ItemRarity;
  quantity: number;
  obtainedAt: string;
  lastObtainedAt: string;
  icon: string;
}

export interface ItemUsageHistoryEntry {
  id: string;
  itemId: string;
  usedAt: string;
  targetCompanionId: string;
  effectType: string;
  effectAmount: number;
}

export type CompanionRoomTheme = 'hajimari' | 'mori' | 'hoshizora' | 'umibe' | 'bouken';

export interface CompanionRoomData {
  roomThemeId: CompanionRoomTheme;
  wallpaperId: string;
  floorId: string;
  bedId: string;
  deskId: string;
  shelfId: string;
  lightId: string;
  plantId: string;
  decorationIds: string[];
  windowViewId: string;
  unlockedRoomItemIds: string[];
  lastUpdatedAt: string;
}

export type DailyMissionType =
  | 'first_clear_1'
  | 'answer_3'
  | 'foundation_review_1'
  | 'retry_incorrect_1'
  | 'different_unit_1'
  | 'talk_companion_1'
  | 'play_companion_1'
  | 'study_10min';

export interface DailyMissionReward {
  energy?: number;
  bond?: number;
  points?: number;
  itemId?: string;
  itemQuantity?: number;
  roomItemId?: string;
  accessoryId?: string;
  label?: string;
  icon?: string;
}

export interface DailyMission {
  date: string; // YYYY-MM-DD
  missionId: string;
  type: DailyMissionType;
  title: string;
  description: string;
  icon: string;
  targetValue: number;
  currentValue: number;
  isCompleted: boolean;
  rewardClaimed: boolean;
  reward: DailyMissionReward;
}

export interface DiscoveredPartsData {
  ears: string[];
  horns: string[];
  wings: string[];
  tails: string[];
}

export interface CompanionEncyclopediaData {
  discoveredSpecies: string[];
  discoveredAttributes: string[];
  discoveredPersonalities: string[];
  discoveredRarities: string[];
  discoveredPatterns: string[];
  discoveredParts: DiscoveredPartsData;
  discoveredEvolutionForms: string[];
  discoveredNpcIds: string[];
  lastRegisteredAt?: string;
}

export interface StageProgressData {
  stageId: string;
  isUnlocked: boolean;
  attemptCount: number;
  bestCorrectCount: number;
  bestStars: number; // 0, 1, 2, 3
  isCleared: boolean;
  isPerfectCleared: boolean;
  firstClearedAt?: string;
  lastPlayedAt?: string;
  firstClearRewardClaimed: boolean;
  perfectClearRewardClaimed: boolean;
}

export interface BattleSettingsData {
  battleAnimationEnabled: boolean;
  showSkillNames: boolean;
  shortenBossAnimation: boolean;
}

export type FuriganaMode = 'all' | 'difficult' | 'off';

export type ReadingLevel = 'difficult' | 'all';

export interface ReadingItem {
  word: string;
  displayWord?: string;
  reading: string;
  level?: ReadingLevel;
}

export interface PretestUnitProgress {
  unitId: string;
  attempts: number;
  bestScore: number;
  lastScore: number;
  cleared: boolean;
  perfectCleared: boolean;
  firstClearRewardClaimed: boolean;
  perfectRewardClaimed: boolean;
  lastAttemptedAt?: string;
}

export interface PlayerStats {
  maxHp: number;
  attack: number;
  defense: number;
}

export interface LevelUpDetail {
  fromLevel: number;
  toLevel: number;
  reqExp: number;
  statGains: PlayerStats;
}

export interface ExperienceGrantResult {
  updatedPlayer: PlayerData;
  oldLevel: number;
  newLevel: number;
  gainedExp: number;
  levelUpCount: number;
  levelUpDetails: LevelUpDetail[];
  currentExp: number;
  maxExp: number;
  statDiff: PlayerStats;
  leveledUp: boolean;
}

export interface PlayerData {
  playerId?: string;         // Unique ID for Firebase sync
  classId?: string;          // Class ID for school group ranking
  studentNumber?: number;     // Attendance number (1-40)
  classroomLabel?: string;    // Safe display label such as "1組"
  name: string;             // Max 10 chars
  nickname?: string;         // Display name for ranking/public
  privacySetting?: PrivacySetting;
  mode: GameMode;
  furiganaMode?: FuriganaMode; // 'all' | 'difficult' | 'off'
  avatar: AvatarOption;
  character: CharacterCustomizationData;
  level: number;
  exp: number;
  currentExp?: number;       // Alias for current EXP in level
  totalExp?: number;         // Total cumulative EXP
  maxExp: number;
  points: number;           // KQ Points
  baseStats?: PlayerStats;    // Hero base stats
  computedStats?: PlayerStats;// Hero computed stats
  partner: PartnerData;
  companion?: CompanionData; // 知識の相棒育成データ
  companionSettings?: CompanionSettings;
  battleSettings?: BattleSettingsData;
  stageProgress?: Record<string, StageProgressData>;
  pretestProgress?: Record<string, PretestUnitProgress>;
  unlockedCards?: string[];
  foodItemsCount?: number;   // お世話用のごはんアイテム数
  inventory?: Record<string, InventoryItem>;
  /** Persistent collection of treasures and equipment won from the gacha. */
  gachaCollection?: Record<string, number>;
  /** Total shop purchases by item ID. Optional for compatibility with older saves. */
  shopPurchaseCounts?: Record<string, number>;
  itemUsageHistory?: ItemUsageHistoryEntry[];
  companionRoom?: CompanionRoomData;
  dailyMissions?: DailyMission[];
  companionEncyclopedia?: CompanionEncyclopediaData;
  claimedRewardIds?: string[];
  lastDailyMissionDate?: string;
  hasSeenDailyPopupToday?: string; // YYYY-MM-DD
  unlockedRegions: string[]; // e.g. ['area']
  completedQuests: string[];
  totalAnswered: number;
  correctAnswered: number;
  currentStreak: number;
  studyDaysCount: number;
  unitProgress: Record<string, UnitProgressData>;
  questionProgress: Record<string, QuestionProgressData>;
  skillProgress: Record<string, SkillProgressData>;
  reviewSession?: ReviewSessionData | null;
  weakConcepts: string[];    // Array of unit IDs needing practice
  reviewedConcepts: string[]; // Array of unit IDs reviewed via Knowledge Tree
  answerHistory?: AnswerHistoryRecord[];
  reviewItems?: Record<string, ReviewCandidateItem>;
  reviewRewardHistory?: Record<string, { lastRewardDate: string; totalRewardCount: number }>;
  unlockedTitles: string[];
  lastStudyDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegionInfo {
  id: string;
  name: string;
  japaneseName: string;
  mathCategory: string;
  description: string;
  unlocked: boolean;
  requiredLevel: number;
  badgeIcon: string;
  accentColor: string;
  stages: QuestStage[];
}

export interface QuestStage {
  id: string;
  title: string;
  description: string;
  difficulty: '★☆☆' | '★★☆' | '★★★';
  topic: string;
  expReward: number;
  pointsReward: number;
  unlocked?: boolean;
  requiredStageId?: string;
  prerequisiteConcept?: string;
}

export interface LearningQuestion {
  id: string;
  grade: number; // 2, 3, 4, 5
  subject: 'math';
  unitId: string; // e.g. 'multiplication_2', 'area_5_parallel'
  unitName: string; // e.g. '平行四辺形の面積'
  skillId?: string; // Associated skill ID
  topic: string;
  difficulty: 'easy' | 'normal' | 'hard';
  questionText: string;
  diagramSvg?: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  hint: string;
  hints?: string[]; // 段階的ヒント 1〜3
  structuredExplanation?: {
    correctAnswerText?: string;
    concept?: string;
    formula?: string;
    diagramSvg?: string;
    prerequisiteConceptName?: string;
    tipPoint?: string;
  };
  expReward: number;
  pointReward: number;
  prerequisiteUnitId?: string; // Unit to review if missed
  prerequisiteConceptName?: string; // Human name of foundation
  readings?: ReadingItem[];
  optionsReadings?: ReadingItem[][];
  explanationReadings?: ReadingItem[];
  hintReadings?: ReadingItem[];
}

export interface MathQuestion {
  id: string;
  grade?: number;
  subject?: 'math';
  unitId?: string;
  unitName?: string;
  topic?: string;
  difficulty?: string;
  questionText?: string;
  question?: string;
  options: string[];
  correctAnswerIndex?: number;
  correctAnswer?: string;
  explanation: string;
  hint: string;
  hints?: string[]; // 段階的ヒント 1〜3
  structuredExplanation?: {
    correctAnswerText?: string;
    concept?: string;
    formula?: string;
    diagramSvg?: string;
    prerequisiteConceptName?: string;
    tipPoint?: string;
  };
  expReward?: number;
  pointReward?: number;
  regionId?: string;
  stageId?: string;
  prerequisiteUnitId?: string;
  prerequisiteConceptName?: string;
  readings?: ReadingItem[];
  optionsReadings?: ReadingItem[][];
  explanationReadings?: ReadingItem[];
  hintReadings?: ReadingItem[];
}
