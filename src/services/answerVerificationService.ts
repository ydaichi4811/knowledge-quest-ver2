import { PlayerData, LearningQuestion, MathQuestion, AnswerHistoryRecord } from '../types';
import { savePlayerData } from './gameStorage';

/**
 * Normalizes user answer text:
 * 1. Trims leading and trailing whitespace
 * 2. Converts full-width numbers (０-９) to half-width digits (0-9)
 * 3. Converts full-width symbols (．, ＋, －/ー/―, ／) to half-width (., +, -, /)
 * 4. Strips thousand separator commas from pure numeric representations (e.g. 1,000 -> 1000)
 */
export function normalizeAnswerText(input: string | number | null | undefined): string {
  if (input === null || input === undefined) return '';

  let text = String(input).trim();
  if (!text) return '';

  // 1. Full-width numbers to half-width numbers (０-９ -> 0-9)
  text = text.replace(/[０-９]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0));

  // 2. Full-width symbols to half-width
  text = text
    .replace(/．/g, '.')
    .replace(/＋/g, '+')
    .replace(/[－ー―]/g, '-')
    .replace(/／/g, '/')
    .replace(/＝/g, '=');

  // 3. Normalize Japanese/English full-width spaces
  text = text.replace(/　/g, ' ').replace(/\s+/g, ' ').trim();

  // 4. Strip comma separators in numeric values like "1,000" -> "1000"
  if (/^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(text)) {
    text = text.replace(/,/g, '');
  }

  return text;
}

/**
 * Evaluates whether two answers match semantically or numerically:
 * - Direct string match (case-insensitive)
 * - Numerical match: e.g. "12" === "12.0", "0.50" === "0.5"
 */
export function compareAnswers(
  userAnswer: string | number | undefined | null,
  correctAnswer: string | number | undefined | null
): {
  isCorrect: boolean;
  isNumericMatch: boolean;
  normalizedUser: string;
  normalizedCorrect: string;
} {
  const normUser = normalizeAnswerText(userAnswer);
  const normCorrect = normalizeAnswerText(correctAnswer);

  if (!normUser || !normCorrect) {
    return {
      isCorrect: false,
      isNumericMatch: false,
      normalizedUser: normUser,
      normalizedCorrect: normCorrect,
    };
  }

  // 1. Exact string match (case-insensitive)
  if (normUser.toLowerCase() === normCorrect.toLowerCase()) {
    return {
      isCorrect: true,
      isNumericMatch: false,
      normalizedUser: normUser,
      normalizedCorrect: normCorrect,
    };
  }

  // 2. Numeric comparison if both strings parse as valid numbers
  const userNum = Number(normUser);
  const correctNum = Number(normCorrect);

  if (!isNaN(userNum) && !isNaN(correctNum) && isFinite(userNum) && isFinite(correctNum)) {
    const isNumEqual = Math.abs(userNum - correctNum) < 1e-9;
    if (isNumEqual) {
      return {
        isCorrect: true,
        isNumericMatch: true,
        normalizedUser: normUser,
        normalizedCorrect: normCorrect,
      };
    }
  }

  return {
    isCorrect: false,
    isNumericMatch: false,
    normalizedUser: normUser,
    normalizedCorrect: normCorrect,
  };
}

/**
 * Validates answer input string before checking
 */
export function validateAnswerInput(input: string | null | undefined): {
  isValid: boolean;
  normalizedText: string;
  warningMessage?: string;
} {
  const normalizedText = normalizeAnswerText(input);

  if (!normalizedText) {
    return {
      isValid: false,
      normalizedText: '',
      warningMessage: '答えを入力してください。',
    };
  }

  return {
    isValid: true,
    normalizedText,
  };
}

export interface QuizSessionState {
  questionId: string;
  userAnswer: string;
  selectedOptionIndex: number | null;
  isAnswered: boolean;
  isCorrect: boolean;
  attemptCount: number;
  rewardGranted: boolean;
  showHint: boolean;
  showExplanation: boolean;
  warningMessage: string | null;
}

/**
 * Generates an initial clean quiz session state
 */
export function createInitialQuizState(questionId: string): QuizSessionState {
  return {
    questionId,
    userAnswer: '',
    selectedOptionIndex: null,
    isAnswered: false,
    isCorrect: false,
    attemptCount: 0,
    rewardGranted: false,
    showHint: false,
    showExplanation: false,
    warningMessage: null,
  };
}

/**
 * Verifies 4-option multiple choice answers:
 * - Returns invalid status and warning message if no option is selected
 * - Checks whether selected option index matches correct answer index
 */
export function verifyMultipleChoiceAnswer(options: {
  selectedIndex: number | null | undefined;
  correctIndex: number;
  choices: string[];
}): {
  isValid: boolean;
  isCorrect: boolean;
  selectedChoiceText: string;
  correctChoiceText: string;
  warningMessage: string | null;
} {
  const { selectedIndex, correctIndex, choices } = options;

  if (selectedIndex === null || selectedIndex === undefined || selectedIndex < 0) {
    return {
      isValid: false,
      isCorrect: false,
      selectedChoiceText: '',
      correctChoiceText: choices[correctIndex] || '',
      warningMessage: '答えをえらんでください',
    };
  }

  const selectedChoiceText = choices[selectedIndex] || '';
  const correctChoiceText = choices[correctIndex] || '';
  const isCorrect = selectedIndex === correctIndex;

  return {
    isValid: true,
    isCorrect,
    selectedChoiceText,
    correctChoiceText,
    warningMessage: null,
  };
}

export interface RecordAnswerHistoryOptions {
  player: PlayerData;
  question: LearningQuestion | MathQuestion;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  selectedChoiceIndex?: number | null;
  selectedChoiceText?: string;
  correctChoiceIndex?: number;
  correctChoiceText?: string;
  hintCount?: number;
  usedHint?: boolean;
  attemptCount: number;
  timeSpentSeconds?: number;
}

/**
 * Saves quiz answer history result to player data and persists via gameStorage
 */
export function saveAnswerResult(options: RecordAnswerHistoryOptions): {
  updatedPlayer: PlayerData;
  answerRecord: AnswerHistoryRecord;
} {
  const {
    player,
    question,
    userAnswer,
    correctAnswer,
    isCorrect,
    selectedChoiceIndex,
    selectedChoiceText,
    correctChoiceIndex,
    correctChoiceText,
    hintCount = 0,
    usedHint,
    attemptCount,
    timeSpentSeconds = 0,
  } = options;

  const nowIso = new Date().toISOString();
  const recordId = `ans_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const finalUsedHint = usedHint !== undefined ? usedHint : hintCount > 0;

  const answerRecord: AnswerHistoryRecord = {
    id: recordId,
    questionId: question.id,
    unitId: question.unitId || 'general',
    unitName: question.unitName || '',
    subject: question.subject || 'math',
    grade: question.grade || 2,
    isCorrect,
    userAnswer: selectedChoiceText || userAnswer,
    correctAnswer: correctChoiceText || correctAnswer,
    selectedChoiceIndex: selectedChoiceIndex ?? undefined,
    selectedChoiceText: selectedChoiceText || userAnswer,
    correctChoiceIndex: correctChoiceIndex ?? undefined,
    correctChoiceText: correctChoiceText || correctAnswer,
    hintCount,
    usedHint: finalUsedHint,
    attemptCount,
    timestamp: nowIso,
    timeSpentSeconds,
    isFirstTryCorrect: isCorrect && attemptCount === 1,
  };

  const existingHistory = player.answerHistory || [];
  // Keep up to 200 recent answer history records
  const updatedHistory = [answerRecord, ...existingHistory].slice(0, 200);

  const updatedPlayer: PlayerData = {
    ...player,
    totalAnswered: (player.totalAnswered || 0) + 1,
    correctAnswered: (player.correctAnswered || 0) + (isCorrect ? 1 : 0),
    answerHistory: updatedHistory,
    updatedAt: nowIso,
  };

  savePlayerData(updatedPlayer);

  return {
    updatedPlayer,
    answerRecord,
  };
}
