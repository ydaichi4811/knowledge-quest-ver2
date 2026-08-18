import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../lib/firebase';

let cachedUid: string | null = null;
let isAuthInProgress = false;

/**
 * Gets or creates a persistent local UID for fallback mode
 */
function getFallbackLocalUid(): string {
  try {
    let fallback = localStorage.getItem('kq_fallback_local_uid');
    if (!fallback) {
      fallback = `kq_local_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;
      localStorage.setItem('kq_fallback_local_uid', fallback);
    }
    cachedUid = fallback;
    return fallback;
  } catch {
    return 'kq_local_guest';
  }
}

/**
 * Initializes anonymous authentication with Firebase.
 * Returns the authenticated user's UID or fallback local UID if failed / offline / unconfigured.
 */
export async function ensureAnonymousUser(): Promise<string> {
  if (!isFirebaseConfigured || !auth) {
    console.warn('⚠️ [Auth Warning] Firebaseが設定されていないか初期化されていません。ローカルIDモードで動作します。');
    return getFallbackLocalUid();
  }

  if (cachedUid) {
    return cachedUid;
  }

  if (auth.currentUser) {
    cachedUid = auth.currentUser.uid;
    return cachedUid;
  }

  if (isAuthInProgress) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return auth.currentUser ? auth.currentUser.uid : (cachedUid || getFallbackLocalUid());
  }

  isAuthInProgress = true;

  try {
    const credential = await signInAnonymously(auth);
    cachedUid = credential.user.uid;
    console.info(`🎉 ✅ [Auth Success] 匿名認証成功！ 割当UID: ${cachedUid}`);
    return cachedUid;
  } catch (error: any) {
    console.warn('⚠️ [Auth Warning] Firebase Auth 匿名サインインをスキップし、ローカルIDモードに移行します:', error?.message || error);
    return getFallbackLocalUid();
  } finally {
    isAuthInProgress = false;
  }
}

/**
 * Gets the current cached UID if available
 */
export function getCurrentUid(): string {
  if (cachedUid) return cachedUid;
  if (auth?.currentUser) {
    cachedUid = auth.currentUser.uid;
    return cachedUid;
  }
  return getFallbackLocalUid();
}

/**
 * Subscribes to Auth state changes
 */
export function subscribeAuthState(callback: (user: User | null) => void): () => void {
  if (!isFirebaseConfigured || !auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      cachedUid = user.uid;
    }
    callback(user);
  });
}

