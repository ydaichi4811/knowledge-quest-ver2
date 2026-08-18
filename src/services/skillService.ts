import { PlayerData, SkillProgressData, SkillStatus, LearningSkill, LearningQuestion } from '../types';
import { ALL_LEARNING_SKILLS, getSkillById, getPrerequisitesForSkill } from '../data/skillsData';
import { ALL_LEARNING_QUESTIONS, getQuestionsBySkill, getQuestionById } from '../data/questionsData';

/**
 * Ensures player.skillProgress has entries initialized for all skills
 */
export function getOrCreateSkillProgress(player: PlayerData): Record<string, SkillProgressData> {
  const currentMap = { ...(player.skillProgress || {}) };
  let updated = false;

  ALL_LEARNING_SKILLS.forEach((skill) => {
    if (!currentMap[skill.skillId]) {
      currentMap[skill.skillId] = {
        skillId: skill.skillId,
        attemptedQuestionIds: [],
        correctQuestionIds: [],
        attemptCount: 0,
        correctCount: 0,
        accuracy: 0,
        status: 'not_attempted',
      };
      updated = true;
    }
  });

  return currentMap;
}

/**
 * Calculates status and accuracy for a specific skill
 */
export function calculateSkillStatus(progress: SkillProgressData, totalQuestionsInSkill: number): SkillStatus {
  if (progress.attemptCount === 0) {
    return 'not_attempted';
  }

  const accuracy = progress.attemptCount > 0
    ? Math.round((progress.correctCount / progress.attemptCount) * 100)
    : 0;

  const minRequiredCorrect = Math.min(3, Math.max(1, totalQuestionsInSkill));
  const uniqueCorrect = progress.correctQuestionIds.length;

  if (accuracy >= 90 && uniqueCorrect >= minRequiredCorrect) {
    return 'mastered';
  } else if (accuracy >= 70) {
    return 'achieved';
  } else {
    return 'practicing';
  }
}

/**
 * Records an answer attempt for a skill
 */
export function recordSkillAnswer(
  player: PlayerData,
  skillId: string,
  questionId: string,
  isCorrect: boolean
): PlayerData {
  const skillMap = getOrCreateSkillProgress(player);
  const existing = skillMap[skillId] || {
    skillId,
    attemptedQuestionIds: [],
    correctQuestionIds: [],
    attemptCount: 0,
    correctCount: 0,
    accuracy: 0,
    status: 'not_attempted',
  };

  const newAttempted = Array.from(new Set([...existing.attemptedQuestionIds, questionId]));
  const newCorrect = isCorrect
    ? Array.from(new Set([...existing.correctQuestionIds, questionId]))
    : existing.correctQuestionIds;

  const newAttemptCount = existing.attemptCount + 1;
  const newCorrectCount = existing.correctCount + (isCorrect ? 1 : 0);
  const newAccuracy = Math.round((newCorrectCount / newAttemptCount) * 100);

  const relatedQuestions = getQuestionsBySkill(skillId);
  const newStatus = calculateSkillStatus(
    {
      ...existing,
      attemptCount: newAttemptCount,
      correctCount: newCorrectCount,
      accuracy: newAccuracy,
      correctQuestionIds: newCorrect,
    },
    relatedQuestions.length
  );

  const nowIso = new Date().toISOString();

  const updatedProgress: SkillProgressData = {
    ...existing,
    attemptedQuestionIds: newAttempted,
    correctQuestionIds: newCorrect,
    attemptCount: newAttemptCount,
    correctCount: newCorrectCount,
    accuracy: newAccuracy,
    status: newStatus,
    lastPracticedAt: nowIso,
    masteredAt: newStatus === 'mastered' ? (existing.masteredAt || nowIso) : existing.masteredAt,
  };

  return {
    ...player,
    skillProgress: {
      ...skillMap,
      [skillId]: updatedProgress,
    },
  };
}

export interface ReviewTargetResult {
  targetSkill: LearningSkill;
  reasonMessage: string;
  prerequisitesList: LearningSkill[];
}

/**
 * Determines the target review skill when a question is missed according to priority rules:
 * 1. Prerequisite skill with 0 correct answers (unstarted/0 correct)
 * 2. Prerequisite skill with lowest accuracy %
 * 3. Prerequisite skill in weakConcepts
 * 4. First direct prerequisite skill
 */
export function determineReviewTargetSkill(
  sourceQuestion: LearningQuestion,
  player: PlayerData
): ReviewTargetResult | null {
  // Find source skill
  let sourceSkill = sourceQuestion.skillId ? getSkillById(sourceQuestion.skillId) : undefined;

  // Fallback lookup if question has no explicit skillId
  if (!sourceSkill) {
    sourceSkill = ALL_LEARNING_SKILLS.find((s) => s.relatedQuestionIds.includes(sourceQuestion.id));
  }

  // Get direct prerequisites
  let prereqSkills: LearningSkill[] = [];
  if (sourceSkill && sourceSkill.prerequisiteSkillIds.length > 0) {
    prereqSkills = getPrerequisitesForSkill(sourceSkill.skillId);
  } else if (sourceQuestion.prerequisiteUnitId) {
    const matched = ALL_LEARNING_SKILLS.filter(
      (s) => s.skillId === sourceQuestion.prerequisiteUnitId || s.unit.includes(sourceQuestion.prerequisiteConceptName || '')
    );
    if (matched.length > 0) prereqSkills = matched;
  }

  // Fallback to Grade 2 'kuku' or Grade 4 'rectangle_square_shape'
  if (prereqSkills.length === 0) {
    const kuku = getSkillById('kuku');
    const rect = getSkillById('rectangle_square_shape');
    prereqSkills = [rect || kuku || ALL_LEARNING_SKILLS[0]].filter((s): s is LearningSkill => Boolean(s));
  }

  const skillProgressMap = getOrCreateSkillProgress(player);

  // Priority 1: Unstarted or 0 correct answers
  const unstarted = prereqSkills.find((s) => {
    const prog = skillProgressMap[s.skillId];
    return !prog || prog.correctCount === 0;
  });

  if (unstarted) {
    return {
      targetSkill: unstarted,
      reasonMessage: `この問題には、【${unstarted.title}】（${unstarted.grade}年生）の基礎パワーが必要です！`,
      prerequisitesList: prereqSkills,
    };
  }

  // Priority 2: Lowest accuracy
  const sortedByAccuracy = [...prereqSkills].sort((a, b) => {
    const accA = skillProgressMap[a.skillId]?.accuracy ?? 100;
    const accB = skillProgressMap[b.skillId]?.accuracy ?? 100;
    return accA - accB;
  });

  const lowestAccSkill = sortedByAccuracy[0];
  const lowestAcc = skillProgressMap[lowestAccSkill.skillId]?.accuracy ?? 100;

  if (lowestAcc < 70) {
    return {
      targetSkill: lowestAccSkill,
      reasonMessage: `【${lowestAccSkill.title}】の正解率が ${lowestAcc}% です。基礎をしっかり固めましょう！`,
      prerequisitesList: prereqSkills,
    };
  }

  // Priority 3 & 4: Direct prerequisite
  const defaultTarget = prereqSkills[0];
  return {
    targetSkill: defaultTarget,
    reasonMessage: `この問題には、【${defaultTarget.title}】の力が必要です！まずは3問だけ復習しよう！`,
    prerequisitesList: prereqSkills,
  };
}
