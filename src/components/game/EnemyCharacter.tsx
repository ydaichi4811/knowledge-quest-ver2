import React from 'react';
import { EnemyAvatar } from '../EnemyAvatar';
import { EnemyTypeCategory, EnemyPoseType, CharacterSize } from './characterTypes';

export interface EnemyCharacterProps extends Omit<React.ComponentProps<typeof EnemyAvatar>, 'size' | 'type'> {
  type?: EnemyTypeCategory;
  pose?: EnemyPoseType;
  size?: CharacterSize;
  accentColor?: string;
  isHit?: boolean;
  isDefeated?: boolean;
  className?: string;
  alt?: string;
}

/**
 * EnemyCharacter is the single unified common component for displaying
 * Knowledge Quest enemy monsters across all battle and quest screens.
 */
export const EnemyCharacter: React.FC<EnemyCharacterProps> = ({
  type = 'blueOgre',
  pose = 'idle',
  size = 'md',
  accentColor = '#38bdf8',
  isHit = false,
  isDefeated = false,
  className = '',
  alt = '敵モンスター',
  ...restProps
}) => {
  // Map enemy type strings to EnemyAvatar types
  let avatarType: React.ComponentProps<typeof EnemyAvatar>['type'] = 'ogre_blue';
  
  if (type === 'blueOgre' || type === 'ogre_blue') avatarType = 'ogre_blue';
  else if (type === 'redDragon' || type === 'dragon_red') avatarType = 'dragon_red';
  else if (type === 'blueDragon' || type === 'dragon_blue') avatarType = 'dragon_blue';
  else if (type === 'greenDragon' || type === 'dragon_green') avatarType = 'dragon_green';
  else if (type === 'purpleDragon' || type === 'dragon_shadow') avatarType = 'dragon_shadow';
  else if (type === 'ghost' || type === 'ghost_fire') avatarType = 'ghost_fire';
  else if (type === 'shadow' || type === 'ogre_shadow') avatarType = 'ogre_shadow';
  else if (type === 'oneEyeMonster' || type === 'ogre_cyclops') avatarType = 'ogre_cyclops';
  else if (type === 'boss' || type === 'boss_trapezoid') avatarType = 'boss_trapezoid';
  else if (typeof type === 'string' && type) {
    avatarType = type as React.ComponentProps<typeof EnemyAvatar>['type'];
  }

  // Size mapping
  let normalizedSize: 'normal' | 'large' = 'normal';
  if (size === 'large' || size === 'lg' || size === 'xl' || size === '2xl') {
    normalizedSize = 'large';
  }

  const computedIsHit = isHit || pose === 'damage' || pose === 'attack';
  const computedIsDefeated = isDefeated || pose === 'defeated';

  return (
    <div className={`inline-block relative shrink-0 ${className}`} role="img" aria-label={alt}>
      <EnemyAvatar
        {...restProps}
        type={avatarType}
        accentColor={accentColor}
        isHit={computedIsHit}
        isDefeated={computedIsDefeated}
        size={normalizedSize}
      />
    </div>
  );
};
