import { describe, expect, it } from 'vitest';
import { calculateBattleOutcome } from '../components/MathBattleModal';

describe('battle result rules', () => {
  it('counts a retried answer as learned but not first-try correct', () => {
    const result = calculateBattleOutcome({
      firstTryCorrectCount: 4,
      eventualCorrectCount: 5,
      totalQuestions: 5,
      requiredClearCount: 3,
      usedAnyHint: false,
    });

    expect(result.accuracy).toBe(80);
    expect(result.rank).toBe('B');
    expect(result.isCleared).toBe(true);
    expect(result.isPerfectClear).toBe(false);
  });

  it('does not clear a stage below its required learned-question count', () => {
    const result = calculateBattleOutcome({
      firstTryCorrectCount: 1,
      eventualCorrectCount: 2,
      totalQuestions: 5,
      requiredClearCount: 3,
      usedAnyHint: false,
    });

    expect(result.isCleared).toBe(false);
  });

  it('awards perfect clear only when every answer is correct first try without hints', () => {
    const result = calculateBattleOutcome({
      firstTryCorrectCount: 5,
      eventualCorrectCount: 5,
      totalQuestions: 5,
      requiredClearCount: 3,
      usedAnyHint: false,
    });

    expect(result.accuracy).toBe(100);
    expect(result.rank).toBe('S');
    expect(result.isPerfectClear).toBe(true);
  });
});
