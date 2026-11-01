/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { ApplicationCase } from './types/civic';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection to Firestore on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

export async function signInWithGoogle(): Promise<User | null> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signOutUser(): Promise<void> {
  await firebaseSignOut(auth);
}

export function subscribeToAuthChanges(callback: (user: User | null) => void): Unsubscribe {
  return onAuthStateChanged(auth, callback);
}

export async function getAuthTokenHeader(): Promise<Record<string, string>> {
  if (!auth.currentUser) {
    return {};
  }
  try {
    const token = await auth.currentUser.getIdToken();
    return { Authorization: `Bearer ${token}` };
  } catch {
    return {};
  }
}

/**
 * Sanitizes and normalizes an ApplicationCase into a Firestore-compliant document
 * strictly adhering to firebase-blueprint.json & firestore.rules constraints.
 */
function buildFirestoreApplicationPayload(appCase: ApplicationCase, userId: string, isCreate: boolean) {
  const safeId = appCase.id.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 128);
  const maskedPhone = (appCase.phoneMasked || appCase.phone || '+91 98*** **312').slice(0, 40);
  const maskedAadhaar = (appCase.aadhaarMasked || 'XXXX XXXX 4312').slice(0, 30);

  const statusText = appCase.statusText || appCase.officialStatusText;

  const basePayload: Record<string, any> = {
    id: safeId,
    userId,
    applicantName: (appCase.applicantName || 'Citizen Applicant').slice(0, 120),
    phone: maskedPhone,
    phoneMasked: maskedPhone,
    aadhaarMasked: maskedAadhaar,
    preferredLanguage: ['hi', 'en', 'mr'].includes(appCase.preferredLanguage)
      ? appCase.preferredLanguage
      : 'hi',
    serviceId: appCase.serviceId.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 80),
    serviceName: {
      en: (appCase.serviceName.en || '').slice(0, 1000),
      hi: (appCase.serviceName.hi || '').slice(0, 1000),
      mr: (appCase.serviceName.mr || appCase.serviceName.hi || '').slice(0, 1000),
    },
    state: (appCase.state || 'Uttar Pradesh').slice(0, 80),
    portalName: (appCase.portalName || 'e-District Portal').slice(0, 160),
    status: ['needs_action', 'in_progress', 'submitted', 'delayed', 'completed'].includes(
      appCase.status
    )
      ? appCase.status
      : 'in_progress',
    statusText: {
      en: (statusText.en || '').slice(0, 1000),
      hi: (statusText.hi || '').slice(0, 1000),
      mr: (statusText.mr || statusText.hi || '').slice(0, 1000),
    },
    officialStatusText: {
      en: (appCase.officialStatusText.en || '').slice(0, 1000),
      hi: (appCase.officialStatusText.hi || '').slice(0, 1000),
      mr: (appCase.officialStatusText.mr || appCase.officialStatusText.hi || '').slice(0, 1000),
    },
    plainExplanation: {
      en: (appCase.plainExplanation.en || '').slice(0, 1000),
      hi: (appCase.plainExplanation.hi || '').slice(0, 1000),
      mr: (appCase.plainExplanation.mr || appCase.plainExplanation.hi || '').slice(0, 1000),
    },
    lastCheckedAt: (appCase.lastCheckedAt || new Date().toISOString()).slice(0, 64),
    urgency: appCase.urgency === 'high' ? 'high' : 'normal',
    documents: (appCase.documents || []).slice(0, 20),
    auditTrail: (appCase.auditTrail || []).slice(0, 50),
    followUpCalls: (appCase.followUpCalls || []).slice(0, 20),
    updatedAt: serverTimestamp(),
  };

  if (appCase.acknowledgementNumber) {
    basePayload.acknowledgementNumber = appCase.acknowledgementNumber.slice(0, 80);
  }
  if (appCase.submittedAt) {
    basePayload.submittedAt = appCase.submittedAt.slice(0, 64);
  }
  if (appCase.nextActionDate) {
    basePayload.nextActionDate = appCase.nextActionDate.slice(0, 120);
  }
  if (isCreate) {
    basePayload.createdAt = serverTimestamp();
  }

  return { safeId, payload: basePayload };
}

/**
 * Checks if the signed-in user already has applications in Firestore;
 * if not, seeds initial applications for them so they have persistent data.
 */
export async function ensureUserApplicationsSeeded(
  userId: string,
  seedApps: ApplicationCase[]
): Promise<void> {
  const path = 'applications';
  try {
    const q = query(collection(db, path), where('userId', '==', userId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return;
    }

    for (const appCase of seedApps) {
      const userScopedId = `${appCase.id}-${userId.slice(0, 8)}`.replace(/[^a-zA-Z0-9_-]/g, '-');
      const scopedCase: ApplicationCase = {
        ...appCase,
        id: userScopedId,
        userId,
      };
      const { safeId, payload } = buildFirestoreApplicationPayload(scopedCase, userId, true);
      await setDoc(doc(db, path, safeId), payload);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Subscribes to the authenticated user's applications in Firestore.
 */
export function subscribeToUserApplications(
  userId: string,
  onUpdate: (apps: ApplicationCase[]) => void
): Unsubscribe {
  const path = 'applications';
  const q = query(collection(db, path), where('userId', '==', userId));

  return onSnapshot(
    q,
    (snapshot) => {
      const apps: ApplicationCase[] = snapshot.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          id: d.id,
          userId: d.userId,
          applicantName: d.applicantName,
          phone: d.phone,
          phoneMasked: d.phoneMasked || d.phone,
          aadhaarMasked: d.aadhaarMasked || 'XXXX XXXX 4312',
          preferredLanguage: d.preferredLanguage || 'hi',
          serviceId: d.serviceId,
          serviceName: d.serviceName,
          state: d.state || 'Uttar Pradesh',
          portalName: d.portalName || 'e-District Portal',
          acknowledgementNumber: d.acknowledgementNumber,
          status: d.status,
          statusText: d.statusText || d.officialStatusText,
          officialStatusText: d.officialStatusText || d.statusText,
          plainExplanation: d.plainExplanation,
          submittedAt: d.submittedAt,
          lastCheckedAt: d.lastCheckedAt,
          nextActionDate: d.nextActionDate,
          urgency: d.urgency || 'normal',
          documents: d.documents || [],
          auditTrail: d.auditTrail || [],
          followUpCalls: d.followUpCalls || [],
        };
      });
      // Sort newest first
      apps.sort((a, b) => (b.lastCheckedAt || '').localeCompare(a.lastCheckedAt || ''));
      onUpdate(apps);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

/**
 * Creates a new application document in Firestore and writes its documents subcollection.
 */
export async function createFirestoreApplication(
  appCase: ApplicationCase,
  userId: string
): Promise<void> {
  const { safeId, payload } = buildFirestoreApplicationPayload(appCase, userId, true);
  const appPath = `applications/${safeId}`;
  try {
    await setDoc(doc(db, 'applications', safeId), payload);
    // Also persist each document in the subcollection /applications/{appId}/documents/{docId}
    for (const d of (appCase.documents || []).slice(0, 20)) {
      const docId = (d.id || `doc-${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 128);
      await setDoc(doc(db, 'applications', safeId, 'documents', docId), {
        id: docId,
        userId,
        applicationId: safeId,
        name: (d.name || 'Document').slice(0, 120),
        fileName: (d.fileName || 'file.jpg').slice(0, 160),
        verified: Boolean(d.verified),
        qualityScore: Math.max(0, Math.min(100, Number(d.qualityScore || 90))),
        consentedForPortal: Boolean(d.consentedForPortal),
        uploadedAt: (d.uploadedAt || new Date().toISOString()).slice(0, 64),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, appPath);
  }
}

/**
 * Updates an existing application document in Firestore (e.g., after a follow-up call or audit event).
 */
export async function updateFirestoreApplication(
  appCase: ApplicationCase,
  userId: string
): Promise<void> {
  const safeId = appCase.id.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 128);
  const appPath = `applications/${safeId}`;
  const statusText = appCase.statusText || appCase.officialStatusText;

  const updateFields: Record<string, any> = {
    status: appCase.status,
    statusText: {
      en: (statusText.en || '').slice(0, 1000),
      hi: (statusText.hi || '').slice(0, 1000),
      mr: (statusText.mr || statusText.hi || '').slice(0, 1000),
    },
    officialStatusText: {
      en: (appCase.officialStatusText.en || '').slice(0, 1000),
      hi: (appCase.officialStatusText.hi || '').slice(0, 1000),
      mr: (appCase.officialStatusText.mr || appCase.officialStatusText.hi || '').slice(0, 1000),
    },
    plainExplanation: {
      en: (appCase.plainExplanation.en || '').slice(0, 1000),
      hi: (appCase.plainExplanation.hi || '').slice(0, 1000),
      mr: (appCase.plainExplanation.mr || appCase.plainExplanation.hi || '').slice(0, 1000),
    },
    lastCheckedAt: new Date().toISOString(),
    urgency: appCase.urgency,
    documents: (appCase.documents || []).slice(0, 20),
    auditTrail: (appCase.auditTrail || []).slice(0, 50),
    followUpCalls: (appCase.followUpCalls || []).slice(0, 20),
    updatedAt: serverTimestamp(),
  };

  if (appCase.acknowledgementNumber) {
    updateFields.acknowledgementNumber = appCase.acknowledgementNumber.slice(0, 80);
  }
  if (appCase.submittedAt) {
    updateFields.submittedAt = appCase.submittedAt.slice(0, 64);
  }
  if (appCase.nextActionDate) {
    updateFields.nextActionDate = appCase.nextActionDate.slice(0, 120);
  }

  try {
    await updateDoc(doc(db, 'applications', safeId), updateFields);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, appPath);
  }
}
