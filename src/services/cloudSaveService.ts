import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { PlayerData } from '../types';
import { loadPlayerData, savePlayerData, createInitialPlayer } from './gameStorage';

/**
 * Firestore rejects undefined values at any nesting level. Game data contains
 * optional cosmetic fields, so remove only undefined entries while preserving
 * Firestore sentinel values such as serverTimestamp().
 */
export function sanitizeFirestoreData<T>(value: T): T {
  if (Array.isArray(value)) {
    return value
      .filter((item) => item !== undefined)
      .map((item) => sanitizeFirestoreData(item)) as T;
  }

  if (value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, item]) => item !== undefined)
        .map(([key, item]) => [key, sanitizeFirestoreData(item)])
    ) as T;
  }

  return value;
}

/**
 * Generates a random player code formatted like KQ-7F3A-92
 */
export function generatePlayerCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let p1 = '';
  let p2 = '';
  for (let i = 0; i < 4; i++) {
    p1 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  for (let i = 0; i < 2; i++) {
    p2 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `KQ-${p1}-${p2}`;
}

/**
 * Ensures user root metadata document exists in users/{uid}
 */
export async function ensureUserDocument(uid: string, player: PlayerData): Promise<string> {
  if (!isFirebaseConfigured || !db) return 'KQ-LOCAL-00';

  const userRef = doc(db, 'users', uid);
  try {
    const userSnap = await getDoc(userRef);
    let playerCode = 'KQ-0000-00';

    if (userSnap.exists()) {
      const data = userSnap.data();
      playerCode = data.playerCode || generatePlayerCode();
      await setDoc(
        userRef,
        {
          lastLoginAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } else {
      playerCode = generatePlayerCode();
      await setDoc(userRef, {
        uid,
        playerCode,
        displayName: '見習い冒険者',
        classId: player.classId || 'legacy',
        studentNumber: player.studentNumber || null,
        classroomLabel: player.classroomLabel || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        appVersion: '1.0.0',
        dataVersion: 1,
      });
    }

    return playerCode;
  } catch (err) {
    console.warn('[CloudSave] Failed to ensure user document:', err);
    return 'KQ-LOCAL-00';
  }
}

/**
 * Saves full game data and public profile to Cloud Firestore
 */
export async function saveGameDataToCloud(uid: string, player: PlayerData): Promise<boolean> {
  if (!isFirebaseConfigured || !db) return false;

  try {
    const playerCode = await ensureUserDocument(uid, player);

    // 1. Save main game data to users/{uid}/gameData/main
    const gameDataRef = doc(db, 'users', uid, 'gameData', 'main');
    const cloudGameDataPayload = {
      playerProfile: {
        name: player.name || '算数勇者',
        nickname: player.nickname || '算数勇者',
        mode: player.mode || 'adventure',
        avatar: player.avatar || 'hero',
        character: player.character,
        level: player.level || 1,
        exp: player.exp || 0,
        points: player.points ?? 100,
      },
      progress: {
        unlockedRegions: player.unlockedRegions || ['area'],
        completedQuests: player.completedQuests || [],
        unitProgress: player.unitProgress || {},
        questionProgress: player.questionProgress || {},
        skillProgress: player.skillProgress || {},
        reviewItems: player.reviewItems || {},
        reviewRewardHistory: player.reviewRewardHistory || {},
        answerHistory: (player.answerHistory || []).slice(-50), // Keep latest 50 to optimize write payload size
      },
      companions: {
        partner: player.partner,
        companion: player.companion,
        companionSettings: player.companionSettings,
      },
      inventory: {
        foodItemsCount: player.foodItemsCount || 0,
      },
      rewards: {
        unlockedTitles: player.unlockedTitles || ['見習い冒険者'],
      },
      pretestProgress: player.pretestProgress || {},
      settings: {
        furiganaMode: player.furiganaMode || 'difficult',
        privacySetting: player.privacySetting || 'class',
      },
      statistics: {
        totalAnswered: player.totalAnswered || 0,
        correctAnswered: player.correctAnswered || 0,
        currentStreak: player.currentStreak || 0,
        studyDaysCount: player.studyDaysCount || 1,
        lastStudyDate: player.lastStudyDate || new Date().toISOString().split('T')[0],
      },
      fullPlayerData: player,
      updatedAt: serverTimestamp(),
      updatedAtIso: new Date().toISOString(),
      dataVersion: 1,
    };

    await setDoc(gameDataRef, sanitizeFirestoreData(cloudGameDataPayload), { merge: true });

    // 2. Save public profile to publicProfiles/{uid} for future ranking foundation
    const publicProfileRef = doc(db, 'publicProfiles', uid);
    const crestRank = player.character?.outfitRank === 'master'
      ? 'rainbow'
      : player.character?.outfitRank === 'knight'
      ? 'gold'
      : 'silver';

    const publicPayload = {
      playerCode,
      displayName: '見習い冒険者', // Default safe nickname
      classId: player.classId || 'legacy',
      studentNumber: player.studentNumber || null,
      classroomLabel: player.classroomLabel || null,
      avatarId: player.avatar || 'hero',
      crestRank,
      companionId: player.partner?.id || 'leaf_fox',
      bestAreaPretestScore: player.pretestProgress?.area?.bestScore || 0,
      totalStudyCount: player.totalAnswered || 0,
      weeklyStudyCount: player.correctAnswered || 0,
      updatedAt: serverTimestamp(),
    };

    await setDoc(publicProfileRef, sanitizeFirestoreData(publicPayload), { merge: true });

    console.log('[CloudSave] Game data successfully saved to cloud.');
    return true;
  } catch (err) {
    console.warn('[CloudSave] Cloud save encountered an error:', err);
    return false;
  }
}

/**
 * Loads game data from Cloud Firestore
 */
export async function loadGameDataFromCloud(uid: string): Promise<{ data: PlayerData | null; updatedAtIso?: string }> {
  if (!isFirebaseConfigured || !db) return { data: null };

  try {
    const gameDataRef = doc(db, 'users', uid, 'gameData', 'main');
    const snap = await getDoc(gameDataRef);

    if (!snap.exists()) {
      return { data: null };
    }

    const raw = snap.data();
    if (raw.fullPlayerData) {
      return {
        data: raw.fullPlayerData as PlayerData,
        updatedAtIso: raw.updatedAtIso || raw.fullPlayerData.updatedAt,
      };
    }

    return { data: null };
  } catch (err) {
    console.warn('[CloudSave] Failed to load data from cloud:', err);
    return { data: null };
  }
}

/**
 * Performs seamless two-way sync & migration between LocalStorage and Cloud Firestore.
 * 1. Checks LocalStorage data.
 * 2. Checks Firestore data.
 * 3. Compares timestamps to pick newer data.
 * 4. Performs initial copy/migration from LocalStorage to Firestore if Firestore is empty.
 */
export async function syncCloudAndLocalData(
  uid: string | null,
  currentLocalData: PlayerData | null
): Promise<{ player: PlayerData | null; source: 'cloud' | 'local' | 'migrated' }> {
  // If no UID or Firebase is disabled, use local data exclusively
  if (!uid || !isFirebaseConfigured) {
    const local = currentLocalData || loadPlayerData();
    return { player: local, source: 'local' };
  }

  const localData = currentLocalData || loadPlayerData();
  const cloudResult = await loadGameDataFromCloud(uid);

  // Case 1: Local has data, Cloud has no data -> Initial Migration (Copy local to cloud)
  if (localData && !cloudResult.data) {
    console.log('[Sync] Cloud data missing. Performing initial migration from LocalStorage to Cloud...');
    await saveGameDataToCloud(uid, localData);
    return { player: localData, source: 'migrated' };
  }

  // Case 2: Cloud has data, Local has no data -> Restore cloud to local
  if (!localData && cloudResult.data) {
    console.log('[Sync] Restoring saved profile from Cloud to LocalStorage...');
    savePlayerData(cloudResult.data);
    return { player: cloudResult.data, source: 'cloud' };
  }

  // Case 3: Both have data -> Compare timestamps
  if (localData && cloudResult.data) {
    const localTime = new Date(localData.updatedAt || 0).getTime();
    const cloudTime = new Date(cloudResult.updatedAtIso || 0).getTime();

    if (cloudTime > localTime) {
      console.log('[Sync] Cloud data is newer. Updating local storage with cloud data.');
      savePlayerData(cloudResult.data);
      return { player: cloudResult.data, source: 'cloud' };
    } else {
      console.log('[Sync] Local data is newer/equal. Syncing local to cloud.');
      await saveGameDataToCloud(uid, localData);
      return { player: localData, source: 'local' };
    }
  }

  // Case 4: Neither has data -> Return null
  return { player: null, source: 'local' };
}

/**
 * Writes a explicit test document to Firestore to confirm database write permissions and creation.
 */
export async function writeTestDocumentToFirestore(uid: string, samplePlayer?: PlayerData | null): Promise<{
  success: boolean;
  uid: string;
  savedPaths: string[];
  timestamp: string;
  error?: string;
}> {
  if (!isFirebaseConfigured || !db) {
    return {
      success: false,
      uid: uid || 'none',
      savedPaths: [],
      timestamp: new Date().toISOString(),
      error: 'Firebase is not initialized or configured.',
    };
  }

  const savedPaths: string[] = [];
  const nowIso = new Date().toISOString();

  try {
    // 1. Root user doc
    const fallbackPlayer = samplePlayer || createInitialPlayer('テスト冒険者', 'adventure', 'hero', 'fox', 'leaf');
    const playerCode = await ensureUserDocument(uid, fallbackPlayer);

    savedPaths.push(`users/${uid}`);

    // 2. Test ping doc
    const pingRef = doc(db, 'users', uid, 'gameData', 'test_ping');
    await setDoc(pingRef, {
      testMessage: 'KnowledgeQuest Firestore Write Test OK',
      testedAt: serverTimestamp(),
      testedAtIso: nowIso,
      uid,
      playerCode,
    });
    savedPaths.push(`users/${uid}/gameData/test_ping`);

    // 3. Save game data
    const gameSaved = await saveGameDataToCloud(uid, fallbackPlayer);
    if (gameSaved) {
      savedPaths.push(`users/${uid}/gameData/main`);
      savedPaths.push(`publicProfiles/${uid}`);
    }


    console.info('🔥 ✅ [Firestore Write Success] Firestoreへのテストデータ書き込みが完了しました！', {
      uid,
      createdDocuments: savedPaths,
      time: nowIso,
    });
    return {
      success: true,
      uid,
      savedPaths,
      timestamp: nowIso,
    };
  } catch (err: any) {
    console.error('[CloudSave] Test write failed:', err);
    return {
      success: false,
      uid,
      savedPaths,
      timestamp: nowIso,
      error: err?.message || String(err),
    };
  }
}
