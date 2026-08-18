import { PlayerData } from '../types';
import { savePlayerData, registerSaveListener } from './gameStorage';
import { saveGameDataToCloud, syncCloudAndLocalData, writeTestDocumentToFirestore } from './cloudSaveService';
import { getCurrentUid, ensureAnonymousUser } from './authService';
import { SyncStatusState } from '../types/cloudSave';
import { isFirebaseConfigured } from '../lib/firebase';

let saveDebounceTimer: any = null;
let currentSyncStatus: SyncStatusState = isFirebaseConfigured ? 'synced' : 'local_only';
const listeners = new Set<(status: SyncStatusState) => void>();

/**
 * Queue debounced Cloud save whenever savePlayerData is invoked
 */
function queueCloudSave(player: PlayerData) {
  if (!isFirebaseConfigured) {
    notifyListeners('local_only');
    return;
  }

  if (saveDebounceTimer) {
    clearTimeout(saveDebounceTimer);
  }

  notifyListeners('syncing');

  saveDebounceTimer = setTimeout(async () => {
    try {
      let uid = getCurrentUid();
      if (!uid) {
        uid = await ensureAnonymousUser();
      }

      if (uid) {
        const cloudSuccess = await saveGameDataToCloud(uid, player);
        if (cloudSuccess) {
          notifyListeners('synced');
        } else {
          notifyListeners('offline');
        }
      } else {
        notifyListeners('local_only');
      }
    } catch (err) {
      console.warn('[SaveSync] Error during debounced cloud sync:', err);
      notifyListeners('error');
    }
  }, 1000); // 1 second debounce
}

// Auto-register save listener with gameStorage
registerSaveListener((player) => {
  queueCloudSave(player);
});

/**
 * Subscribe to sync status updates
 */
export function subscribeSyncStatus(callback: (status: SyncStatusState) => void): () => void {
  listeners.add(callback);
  callback(currentSyncStatus);
  return () => {
    listeners.delete(callback);
  };
}

function notifyListeners(status: SyncStatusState) {
  currentSyncStatus = status;
  listeners.forEach((cb) => cb(status));
}

/**
 * Gets the current sync status
 */
export function getSyncStatus(): SyncStatusState {
  return currentSyncStatus;
}

/**
 * Main Save Method: Immediately saves to LocalStorage, and triggers Cloud Save
 */
export function savePlayerDataWithCloud(player: PlayerData, immediateCloud: boolean = true): boolean {
  const localRes = savePlayerData(player);
  if (immediateCloud && isFirebaseConfigured) {
    const uid = getCurrentUid();
    if (uid) {
      saveGameDataToCloud(uid, player)
        .then((ok) => notifyListeners(ok ? 'synced' : 'offline'))
        .catch(() => notifyListeners('error'));
    }
  }
  return localRes;
}

/**
 * Explicit Firestore Test Write Function for Debugging/Verification UI
 */
export async function runFirestoreTestWrite(player?: PlayerData | null) {
  const uid = await ensureAnonymousUser();
  if (!uid) {
    return {
      success: false,
      uid: 'none',
      savedPaths: [],
      timestamp: new Date().toISOString(),
      error: 'Failed to acquire Firebase Anonymous UID.',
    };
  }

  const result = await writeTestDocumentToFirestore(uid, player);
  if (result.success) {
    notifyListeners('synced');
  } else {
    notifyListeners('error');
  }
  return result;
}

/**
 * Triggers manual immediate synchronization
 */
export async function triggerManualSync(player: PlayerData): Promise<{ success: boolean; updatedPlayer?: PlayerData }> {
  if (!isFirebaseConfigured) {
    notifyListeners('local_only');
    return { success: true, updatedPlayer: player };
  }

  notifyListeners('syncing');

  try {
    const uid = await ensureAnonymousUser();
    if (!uid) {
      notifyListeners('offline');
      return { success: false };
    }

    // Sync cloud and local data
    const syncResult = await syncCloudAndLocalData(uid, player);
    if (syncResult.player) {
      notifyListeners('synced');
      return { success: true, updatedPlayer: syncResult.player };
    } else {
      // Backup local save to cloud
      const cloudSuccess = await saveGameDataToCloud(uid, player);
      notifyListeners(cloudSuccess ? 'synced' : 'offline');
      return { success: cloudSuccess, updatedPlayer: player };
    }
  } catch (err) {
    console.warn('[SaveSync] Manual sync failed:', err);
    notifyListeners('error');
    return { success: false };
  }
}

