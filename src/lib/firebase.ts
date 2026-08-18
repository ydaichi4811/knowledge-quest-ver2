import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import firebaseConfigJson from '../../firebase-applet-config.json';

// Helper to resolve non-empty valid config values:
// Priority: 1. Environment variables, 2. firebase-applet-config.json
function resolveConfigVal(envVal: string | undefined, jsonVal: string | undefined): string {
  if (envVal && typeof envVal === 'string' && envVal.trim() !== '' && envVal !== 'undefined') {
    return envVal.trim();
  }
  if (jsonVal && typeof jsonVal === 'string' && jsonVal.trim() !== '' && jsonVal !== 'undefined') {
    return jsonVal.trim();
  }
  return '';
}

// Configuration resolution
const apiKey = resolveConfigVal(
  import.meta.env.VITE_FIREBASE_API_KEY,
  firebaseConfigJson?.apiKey
);
const authDomain = resolveConfigVal(
  import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  firebaseConfigJson?.authDomain
);
const projectId = resolveConfigVal(
  import.meta.env.VITE_FIREBASE_PROJECT_ID,
  firebaseConfigJson?.projectId
);
const storageBucket = resolveConfigVal(
  import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  firebaseConfigJson?.storageBucket
);
const messagingSenderId = resolveConfigVal(
  import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  firebaseConfigJson?.messagingSenderId
);
const appId = resolveConfigVal(
  import.meta.env.VITE_FIREBASE_APP_ID,
  firebaseConfigJson?.appId
);

const databaseId = resolveConfigVal(
  import.meta.env.VITE_FIREBASE_DATABASE_ID,
  firebaseConfigJson?.firestoreDatabaseId
);

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
};

// Check keys status without leaking the API key string to console
console.info('📋 [Firebase Credentials Verification]', {
  apiKeyConfigured: Boolean(apiKey),
  projectId: projectId ? `PRESENT (${projectId})` : 'MISSING',
  authDomain: authDomain ? `PRESENT (${authDomain})` : 'MISSING',
  appId: appId ? `PRESENT (${appId})` : 'MISSING',
  databaseId: databaseId ? `PRESENT (${databaseId})` : 'DEFAULT',
});

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let isFirebaseConfigured = false;

if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
    isFirebaseConfigured = true;
    console.info('✅ [Firebase] 初期化成功。クラウド保存システム準備完了。');
  } catch (err) {
    console.warn('⚠️ [Firebase] 初期化に失敗しました。ローカルストレージモードで動作を継続します。', err);
    isFirebaseConfigured = false;
  }
} else {
  console.warn('⚠️ [Firebase] 必須の設定キー (apiKey, projectId) が不足しています。ローカルストレージモードで動作を継続します。');
}

export { app, auth, db, isFirebaseConfigured };



