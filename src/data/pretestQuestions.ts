import { ReadingItem } from '../types';

export interface PretestQuestion {
  id: string;
  unitId: string;
  category: string;
  question: string;
  choices: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: number; // 1, 2, 3
  points: number;     // 10
  readings?: ReadingItem[];
  optionsReadings?: ReadingItem[][];
  explanationReadings?: ReadingItem[];
  reviewStageId: string;
  type: 'choice' | 'numeric' | 'text' | 'formula';
}

export const AREA_PRETEST_QUESTIONS: PretestQuestion[] = [
  {
    id: 'area-pretest-01',
    unitId: 'area',
    category: '長方形・正方形',
    question: 'たて8cm、横6cmの長方形の面積を求めましょう。',
    choices: ['14cm²', '28cm²', '48cm²', '96cm²'],
    correctAnswer: '48cm²',
    explanation: '長方形の面積は「たて×横」で求めます。8×6＝48なので、答えは48cm²です。',
    difficulty: 1,
    points: 10,
    reviewStageId: 'stage_area_1',
    type: 'choice',
  },
  {
    id: 'area-pretest-02',
    unitId: 'area',
    category: '長方形・正方形',
    question: '1辺の長さが7cmの正方形の面積を求めましょう。',
    choices: ['14cm²', '28cm²', '49cm²', '56cm²'],
    correctAnswer: '49cm²',
    explanation: '正方形の面積は「1辺×1辺」で求めます。7×7＝49なので、答えは49cm²です。',
    difficulty: 1,
    points: 10,
    reviewStageId: 'stage_area_1',
    type: 'choice',
  },
  {
    id: 'area-pretest-03',
    unitId: 'area',
    category: '平行四辺形',
    question: '底辺が10cm、高さが6cmの平行四辺形の面積を求めましょう。',
    choices: ['30cm²', '60cm²', '32cm²', '16cm²'],
    correctAnswer: '60cm²',
    explanation: '平行四辺形の面積は「底辺×高さ」で求めます。10×6＝60なので、答えは60cm²です。',
    difficulty: 2,
    points: 10,
    reviewStageId: 'stage_area_2',
    type: 'choice',
  },
  {
    id: 'area-pretest-04',
    unitId: 'area',
    category: '三角形',
    question: '底辺が12cm、高さが5cmの三角形の面積を求めましょう。',
    choices: ['60cm²', '30cm²', '17cm²', '34cm²'],
    correctAnswer: '30cm²',
    explanation: '三角形の面積は「底辺×高さ÷2」で求めます。12×5÷2＝30なので、答えは30cm²です。「÷2」を忘れずに！',
    difficulty: 2,
    points: 10,
    reviewStageId: 'stage_area_3',
    type: 'choice',
  },
  {
    id: 'area-pretest-05',
    unitId: 'area',
    category: '台形',
    question: '上底が4cm、下底が8cm、高さが6cmの台形の面積を求めましょう。',
    choices: ['36cm²', '72cm²', '24cm²', '48cm²'],
    correctAnswer: '36cm²',
    explanation: '台形の面積は「(上底＋下底)×高さ÷2」で求めます。(4＋8)×6÷2＝12×6÷2＝36なので、答えは36cm²です。',
    difficulty: 3,
    points: 10,
    reviewStageId: 'stage_area_boss',
    type: 'choice',
  },
  {
    id: 'area-pretest-06',
    unitId: 'area',
    category: '底辺・高さを選ぶ問題',
    question: '三角形の面積を計算するとき、高さとして選ぶ直線はどれですか。',
    choices: ['底辺と垂直に交わる直線', '一番長い斜めの辺', '底辺と平行な直線', '角と角をつなぐ線'],
    correctAnswer: '底辺と垂直に交わる直線',
    explanation: '三角形の「高さ」は、底辺に対して垂直（90度）になっている長さを選びます。',
    difficulty: 2,
    points: 10,
    reviewStageId: 'stage_area_3',
    type: 'choice',
  },
  {
    id: 'area-pretest-07',
    unitId: 'area',
    category: '単位・公式',
    question: '1辺が1mの正方形の面積を表す単位はどれですか。',
    choices: ['1cm²', '1m²', '1km²', '100cm'],
    correctAnswer: '1m²',
    explanation: '1辺が1mの正方形の面積は「1平方メートル（1m²）」です。',
    difficulty: 1,
    points: 10,
    reviewStageId: 'stage_area_1',
    type: 'choice',
  },
  {
    id: 'area-pretest-08',
    unitId: 'area',
    category: '単位・公式',
    question: '台形の面積を求める正しい公式を選びましょう。',
    choices: [
      '(上底＋下底)×高さ÷2',
      '底辺×高さ÷2',
      'たて×横',
      '対角線×対角線÷2',
    ],
    correctAnswer: '(上底＋下底)×高さ÷2',
    explanation: '台形の面積の公式は「(上底＋下底)×高さ÷2」です。',
    difficulty: 2,
    points: 10,
    reviewStageId: 'stage_area_boss',
    type: 'choice',
  },
  {
    id: 'area-pretest-09',
    unitId: 'area',
    category: '複合図形',
    question: 'たて10cm、横8cmの長方形から、1辺が3cmの正方形を1つ切り取った図形の面積を求めましょう。',
    choices: ['80cm²', '71cm²', '77cm²', '62cm²'],
    correctAnswer: '71cm²',
    explanation: '元の長方形の面積（10×8＝80cm²）から、切り取った正方形の面積（3×3＝9cm²）を引きます。80－9＝71cm²です。',
    difficulty: 3,
    points: 10,
    reviewStageId: 'stage_area_boss',
    type: 'choice',
  },
  {
    id: 'area-pretest-10',
    unitId: 'area',
    category: '文章問題',
    question: '面積が40cm²で、底辺が8cmの平行四辺形があります。この平行四辺形の高さは何cmですか。',
    choices: ['5cm', '10cm', '32cm', '4cm'],
    correctAnswer: '5cm',
    explanation: '平行四辺形の面積＝底辺×高さ です。8×高さ＝40 なので、高さは 40÷8＝5cm となります。',
    difficulty: 3,
    points: 10,
    reviewStageId: 'stage_area_2',
    type: 'choice',
  },
];
