export type SyncStatusState =
  | 'uninitialized'
  | 'syncing'
  | 'synced'
  | 'local_only'
  | 'offline'
  | 'error';

export interface UserDocument {
  uid: string;
  playerCode: string;
  displayName: string;
  createdAt: any;
  updatedAt: any;
  lastLoginAt: any;
  appVersion: string;
  dataVersion: number;
}

export interface GameDataDocument {
  playerProfile: any;
  progress: any;
  companions: any;
  inventory: any;
  rewards: any;
  pretestProgress: any;
  settings: any;
  statistics: any;
  updatedAt: any;
  dataVersion: number;
}

export interface PublicProfileDocument {
  playerCode: string;
  displayName: string;
  avatarId: string;
  crestRank: string;
  companionId: string;
  bestAreaPretestScore: number;
  totalStudyCount: number;
  weeklyStudyCount: number;
  updatedAt: any;
}
