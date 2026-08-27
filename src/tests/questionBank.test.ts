import { describe, expect, it } from 'vitest';
import { ALL_LEARNING_QUESTIONS } from '../data/questionsData';
import { ALL_LEARNING_SKILLS } from '../data/skillsData';
import { AREA_STAGES, getRandomQuestionsForStage } from '../data/stageData';

describe('問題バンクの完全性', () => {
  it('問題IDが重複せず、選択肢・正解・段階ヒントが有効である', () => {
    const ids = ALL_LEARNING_QUESTIONS.map((question) => question.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const question of ALL_LEARNING_QUESTIONS) {
      expect(question.options.length).toBeGreaterThanOrEqual(3);
      expect(question.correctAnswerIndex).toBeGreaterThanOrEqual(0);
      expect(question.correctAnswerIndex).toBeLessThan(question.options.length);
      expect(question.explanation.length).toBeGreaterThan(5);
      expect(question.hint.length).toBeGreaterThan(3);
      if (question.hints) expect(question.hints).toHaveLength(3);
    }
  });

  it('学習ツリーが参照する全問題が存在する', () => {
    const ids = new Set(ALL_LEARNING_QUESTIONS.map((question) => question.id));
    const missing = ALL_LEARNING_SKILLS.flatMap((skill) =>
      skill.relatedQuestionIds.filter((questionId) => !ids.has(questionId))
    );
    expect(missing).toEqual([]);
  });

  it('各エリアステージが重複なしで必要数を出題できる', () => {
    for (const stage of AREA_STAGES) {
      const selected = getRandomQuestionsForStage(stage);
      expect(selected).toHaveLength(stage.totalQuestions);
      expect(new Set(selected.map((question) => question.id)).size).toBe(stage.totalQuestions);
    }
  });
});
