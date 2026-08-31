import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { ClassroomId } from '../types';
import { db, isFirebaseConfigured } from '../lib/firebase';

export const CLASSROOMS: ReadonlyArray<{ id: ClassroomId; label: string; capacity: number }> = [
  { id: 'class_1', label: '1組', capacity: 40 },
  { id: 'class_2', label: '2組', capacity: 40 },
  { id: 'class_3', label: '3組', capacity: 40 },
];

export function getClassroomLabel(classroomId: ClassroomId): string {
  return CLASSROOMS.find((item) => item.id === classroomId)?.label || '未設定';
}

export function normalizeStudentNumber(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.max(1, Math.min(40, Math.floor(value)));
}

export function getClassroomSeatId(classroomId: ClassroomId, studentNumber: number): string {
  return `${classroomId}_${String(normalizeStudentNumber(studentNumber)).padStart(2, '0')}`;
}

export async function claimClassroomSeat(
  uid: string,
  classroomId: ClassroomId,
  studentNumber: number
): Promise<{ success: boolean; seatId: string; error?: string }> {
  const normalizedNumber = normalizeStudentNumber(studentNumber);
  const seatId = getClassroomSeatId(classroomId, normalizedNumber);

  // Browser smoke tests must not consume real classroom seats.
  if (import.meta.env.VITE_DISABLE_CLASSROOM_RESERVATION === 'true') {
    return { success: true, seatId };
  }

  if (!isFirebaseConfigured || !db || !uid) {
    return {
      success: false,
      seatId,
      error: 'クラス登録にはインターネット接続が必要です。接続を確認してください。',
    };
  }

  try {
    await runTransaction(db, async (transaction) => {
      const seatRef = doc(db!, 'classroomSeats', seatId);
      const snapshot = await transaction.get(seatRef);

      if (snapshot.exists() && snapshot.data().ownerUid !== uid) {
        throw new Error('SEAT_ALREADY_CLAIMED');
      }

      transaction.set(
        seatRef,
        {
          ownerUid: uid,
          classId: classroomId,
          classroomLabel: getClassroomLabel(classroomId),
          studentNumber: normalizedNumber,
          updatedAt: serverTimestamp(),
          ...(snapshot.exists() ? {} : { createdAt: serverTimestamp() }),
        },
        { merge: true }
      );
    });

    return { success: true, seatId };
  } catch (error) {
    if (error instanceof Error && error.message === 'SEAT_ALREADY_CLAIMED') {
      return {
        success: false,
        seatId,
        error: `${getClassroomLabel(classroomId)} ${normalizedNumber}番は登録済みです。先生に確認してください。`,
      };
    }

    console.warn('[Classroom] Failed to claim seat:', error);
    return {
      success: false,
      seatId,
      error: 'クラス登録を確認できませんでした。通信状態を確認して、もう一度お試しください。',
    };
  }
}
