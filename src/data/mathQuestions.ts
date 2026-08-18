import { MathQuestion } from '../types';

export const MATH_QUESTIONS_BANK: MathQuestion[] = [
  // --- アレア地方 Stage 1: 平行四辺形の面積 ---
  {
    id: 'q_para_1',
    regionId: 'area',
    stageId: 'area_stage_1',
    question: '底辺が 8cm 、高さが 5cm の平行四辺形の面積は何cm²ですか？',
    options: ['40 cm²', '20 cm²', '26 cm²', '13 cm²'],
    correctAnswer: '40 cm²',
    hint: '平行四辺形の面積 ＝ 底辺 × 高さ です（÷2 はしません）。',
    explanation: '公式：底辺 × 高さ ＝ 8 × 5 ＝ 40 cm² です。',
  },
  {
    id: 'q_para_2',
    regionId: 'area',
    stageId: 'area_stage_1',
    question: '底辺が 12cm 、高さが 7cm の平行四辺形の面積は何cm²ですか？',
    options: ['84 cm²', '42 cm²', '38 cm²', '96 cm²'],
    correctAnswer: '84 cm²',
    hint: '底辺 × 高さ のかけ算を計算してみよう。',
    explanation: '公式：底辺 × 高さ ＝ 12 × 7 ＝ 84 cm² です。',
  },
  {
    id: 'q_para_3',
    regionId: 'area',
    stageId: 'area_stage_1',
    question: '面積が 60cm² で、底辺が 10cm の平行四辺形があります。高さは何cmですか？',
    options: ['6 cm', '12 cm', '5 cm', '30 cm'],
    correctAnswer: '6 cm',
    hint: '面積 ÷ 底辺 ＝ 高さ です。',
    explanation: '60 ÷ 10 ＝ 6 cm です。',
  },

  // --- アレア地方 Stage 2: 三角形の面積 ---
  {
    id: 'q_tri_1',
    regionId: 'area',
    stageId: 'area_stage_2',
    question: '底辺が 10cm 、高さが 6cm の三角形の面積は何cm²ですか？',
    options: ['30 cm²', '60 cm²', '16 cm²', '20 cm²'],
    correctAnswer: '30 cm²',
    hint: '三角形の面積 ＝ 底辺 × 高さ ÷ 2 です！最後に「÷ 2」を忘れないようにしよう。',
    explanation: '公式：10 × 6 ÷ 2 ＝ 60 ÷ 2 ＝ 30 cm² です。',
  },
  {
    id: 'q_tri_2',
    regionId: 'area',
    stageId: 'area_stage_2',
    question: '底辺が 14cm 、高さが 9cm の三角形の面積は何cm²ですか？',
    options: ['63 cm²', '126 cm²', '46 cm²', '31.5 cm²'],
    correctAnswer: '63 cm²',
    hint: '14 × 9 を計算してから 2 で割ろう！',
    explanation: '14 × 9 ＝ 126。 126 ÷ 2 ＝ 63 cm² です。',
  },
  {
    id: 'q_tri_3',
    regionId: 'area',
    stageId: 'area_stage_2',
    question: '面積が 36cm² で、高さが 8cm の三角形の底辺は何cmですか？',
    options: ['9 cm', '4.5 cm', '18 cm', '72 cm'],
    correctAnswer: '9 cm',
    hint: '底辺 ＝ 面積 × 2 ÷ 高さ で求められます。',
    explanation: '36 × 2 ＝ 72。 72 ÷ 8 ＝ 9 cm です。',
  },

  // --- アレア地方 Stage 3: 台形とひし形 ---
  {
    id: 'q_trap_1',
    regionId: 'area',
    stageId: 'area_stage_3',
    question: '上底が 4cm 、下底が 8cm 、高さが 5cm の台形の面積は何cm²ですか？',
    options: ['30 cm²', '60 cm²', '20 cm²', '32 cm²'],
    correctAnswer: '30 cm²',
    hint: '台形の面積 ＝ (上底 ＋ 下底) × 高さ ÷ 2 です。',
    explanation: 'かっこから計算！ (4 ＋ 8) × 5 ÷ 2 ＝ 12 × 5 ÷ 2 ＝ 60 ÷ 2 ＝ 30 cm² です。',
  },
  {
    id: 'q_rhombus_1',
    regionId: 'area',
    stageId: 'area_stage_3',
    question: '対角線が 6cm と 8cm のひし形の面積は何cm²ですか？',
    options: ['24 cm²', '48 cm²', '14 cm²', '28 cm²'],
    correctAnswer: '24 cm²',
    hint: 'ひし形の面積 ＝ 対角線 × 対角線 ÷ 2 です。',
    explanation: '6 × 8 ÷ 2 ＝ 48 ÷ 2 ＝ 24 cm² です。',
  },
  {
    id: 'q_trap_2',
    regionId: 'area',
    stageId: 'area_stage_3',
    question: '上底が 6cm 、下底が 10cm 、高さが 7cm の台形の面積は何cm²ですか？',
    options: ['56 cm²', '112 cm²', '35 cm²', '42 cm²'],
    correctAnswer: '56 cm²',
    hint: '(6 ＋ 10) を先に計算してから 7 をかけて 2 で割ろう。',
    explanation: '(6 ＋ 10) × 7 ÷ 2 ＝ 16 × 7 ÷ 2 ＝ 112 ÷ 2 ＝ 56 cm² です。',
  },
];

/**
 * Gets questions for a specific region and stage
 */
export function getQuestionsForStage(regionId: string, stageId: string): MathQuestion[] {
  const filtered = MATH_QUESTIONS_BANK.filter(
    (q) => q.regionId === regionId && q.stageId === stageId
  );
  if (filtered.length > 0) return filtered;

  // Fallback to any questions in region
  return MATH_QUESTIONS_BANK.filter((q) => q.regionId === regionId);
}
