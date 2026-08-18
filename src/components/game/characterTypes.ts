import { PlayerData, CharacterCustomizationData, CompanionData, CompanionStage, CompanionExpression } from '../../types';

export type CharacterSize = 'small' | 'medium' | 'large' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// Hero Types
export type HeroGenderType = 'boy' | 'girl';
export type HeroPoseType = 'idle' | 'attack' | 'damage' | 'victory';
export type HeroExpressionType = 'normal' | 'happy' | 'determined' | 'surprised' | 'troubled' | 'idle' | 'thinking' | 'levelup' | 'guts';

export interface HeroCharacterBaseProps {
  gender?: HeroGenderType;
  pose?: HeroPoseType;
  expression?: HeroExpressionType;
  size?: CharacterSize;
  className?: string;
  alt?: string;
  player?: PlayerData | null;
  characterData?: CharacterCustomizationData;
  animationEnabled?: boolean;
}

// Buddy Types (Purple Dragon ラーニィ Ver.1.0)
export type BuddyStageType = 'egg' | 'baby' | 'child' | 'grown' | 'final';
export type BuddyElementType = 'normal' | 'fire' | 'ice' | 'ghost' | 'holy' | 'dark';
export type BuddyPoseType = 'idle' | 'attack' | 'cheer' | 'damage' | 'sleep';
export type BuddyExpressionType = 'normal' | 'happy' | 'angry' | 'sad' | 'surprised' | 'sleepy' | 'thinking';

export interface BuddyCharacterBaseProps {
  player?: PlayerData | null;
  companion?: CompanionData;
  stage?: BuddyStageType | CompanionStage;
  element?: BuddyElementType;
  pose?: BuddyPoseType;
  expression?: BuddyExpressionType | CompanionExpression;
  size?: CharacterSize;
  className?: string;
  alt?: string;
  showSparkles?: boolean;
  animationEnabled?: boolean;
  onClick?: () => void;
}

// Enemy Types
export type EnemyTypeCategory =
  | 'blueOgre'
  | 'redDragon'
  | 'blueDragon'
  | 'greenDragon'
  | 'purpleDragon'
  | 'ghost'
  | 'shadow'
  | 'oneEyeMonster'
  | 'boss'
  | string;

export type EnemyPoseType = 'idle' | 'attack' | 'damage' | 'defeated';

export interface EnemyCharacterBaseProps {
  type?: EnemyTypeCategory;
  pose?: EnemyPoseType;
  size?: CharacterSize;
  accentColor?: string;
  isHit?: boolean;
  isDefeated?: boolean;
  className?: string;
  alt?: string;
}
