import { LearningQuestion, MathQuestion } from '../types';

export interface GraduatedHintSet {
  step1: string; // 注目する点・大切な言葉
  step2: string; // 考え方・公式
  step3: string; // 詳しい解き方の途中
}

export interface StructuredExplanationSet {
  correctAnswerText: string;
  concept: string; // 考え方
  formula?: string; // 式
  diagramNote?: string; // 図やイメージの補足
  prerequisiteConceptName?: string; // 関連する既習事項
  tipPoint: string; // 次に気を付けるポイント
}

/**
 * 各問題 ID に応じた段階的ヒントマッピング（要件18〜20）
 */
export const CUSTOM_GRADUATED_HINTS: Record<string, GraduatedHintSet> = {
  // --- 九九・計算 ---
  q_g2_1: {
    step1: '「7」が「8つ分」あるよ。7の段を指でかぞえてみよう！',
    step2: '7の段：7, 14, 21, 28, 35, 42, 49, ... と8回分足してみよう。',
    step3: '7 × 7 ＝ 49 に、もう一度「7」をたすと 49 ＋ 7 ＝ 56 になるよ！',
  },
  q_g2_kuku_2: {
    step1: '「6」が「7つ分」あるよ。6の段を唱えてみよう！',
    step2: '6の段：6, 12, 18, 24, 30, 36, ...',
    step3: '6 × 6 ＝ 36 に、もう一度「6」をたすと 36 ＋ 6 ＝ 42 になるよ！',
  },
  q_g2_kuku_3: {
    step1: '「9」が「4つ分」だよ。9の段を思い出してみよう！',
    step2: '9の段：9, 18, 27, 36！',
    step3: '9 × 3 ＝ 27 に、もう1つ 9 をたすと 27 ＋ 9 ＝ 36 になるよ。',
  },
  q_g2_2: {
    step1: '「1皿に4個」が「6皿分」あるよ。何算を使えばいいかな？',
    step2: '1つの数(4個) × いくつ分(6皿) の公式を使おう。',
    step3: '式は「4 × 6」になるよ。4の段を唱えて計算してみよう！',
  },

  // --- アレア地方: 面積公式 ---
  q_para_1: {
    step1: '問題文の「底辺 8cm」と「高さ 5cm」に注目しよう！',
    step2: '平行四辺形の面積公式は【底辺 × 高さ】だよ。（÷2 はしないよ！）',
    step3: '8 と 5 をかけ算しよう。 8 × 5 ＝ ?',
  },
  q_para_2: {
    step1: '底辺(12cm) と 高さ(7cm) を見つけよう。',
    step2: '平行四辺形の面積公式は【底辺 × 高さ】だよ。',
    step3: '12 × 7 を筆算または暗算で計算してみよう。 10 × 7 ＝ 70 、 2 × 7 ＝ 14！',
  },
  q_para_3: {
    step1: 'わかっているのは「面積 60cm²」と「底辺 10cm」だよ。',
    step2: '底辺 × 高さ ＝ 60 なので、高さ ＝ 面積 ÷ 底辺 で求められるよ。',
    step3: '60 ÷ 10 を計算してみよう！',
  },
  q_tri_1: {
    step1: '「底辺 10cm」と「高さ 6cm」の【三角形】の面積だよ。',
    step2: '三角形の面積 ＝【底辺 × 高さ ÷ 2】だよ！「÷ 2」を忘れないようにしよう。',
    step3: 'まず 10 × 6 ＝ 60。それを 2 で割ると 60 ÷ 2 ＝ ?',
  },
  q_tri_2: {
    step1: '底辺(14cm) と 高さ(9cm) に注目しよう。',
    step2: '公式：底辺 × 高さ ÷ 2 を使おう。',
    step3: '14 × 9 ＝ 126。 126 ÷ 2 を計算してみよう！',
  },
  q_tri_3: {
    step1: '「面積 36cm²」「高さ 8cm」から「底辺」を求めたいよ。',
    step2: '三角形は半分に割る前の長方形の面積（面積 × 2）から考えよう！',
    step3: '36 × 2 ＝ 72。 72 ÷ 8 を計算すると底辺がわかるよ。',
  },
  q_trap_1: {
    step1: '「上底 4cm」「下底 8cm」「高さ 5cm」にマークしてみよう！',
    step2: '台形の面積 ＝【 (上底 ＋ 下底) × 高さ ÷ 2 】だよ。かっこを先に計算しよう！',
    step3: '(4 ＋ 8) ＝ 12。 12 × 5 ÷ 2 ＝ 60 ÷ 2 ＝ ?',
  },
  q_rhombus_1: {
    step1: '2本の対角線「6cm」と「8cm」に注目しよう！',
    step2: 'ひし形の面積 ＝【対角線 × 対角線 ÷ 2】だよ。',
    step3: '6 × 8 ＝ 48。これを 2 で割ると 48 ÷ 2 ＝ ?',
  },
  q_trap_2: {
    step1: '上底 6cm, 下底 10cm, 高さ 7cm だね。',
    step2: '公式：(上底 ＋ 下底) × 高さ ÷ 2 を使おう。',
    step3: '(6 ＋ 10) ＝ 16。 16 × 7 ＝ 112。 112 ÷ 2 ＝ ?',
  },
};

/**
 * 段階的ヒントを取得（既存問題のヒントから動的に分解・取得も可能）
 */
export function getStructuredHintsForQuestion(question: LearningQuestion | MathQuestion): GraduatedHintSet {
  if (CUSTOM_GRADUATED_HINTS[question.id]) {
    return CUSTOM_GRADUATED_HINTS[question.id];
  }

  if (question.hints && question.hints.length >= 3) {
    return {
      step1: question.hints[0],
      step2: question.hints[1],
      step3: question.hints[2],
    };
  }

  const baseHint = question.hint || '問題文をよく読んで考えよう！';
  return {
    step1: `【1. 着眼点】問題文の「数字」と「何を聞かれているか」に注目しよう！ (${baseHint})`,
    step2: `【2. 考え方】図や関係の式を書いて、整理してみよう！`,
    step3: `【3. 解き方】順順に計算を進めて、確かめてみよう！`,
  };
}

/**
 * 構造化解説を取得（要件25〜27）
 */
export function getStructuredExplanationForQuestion(
  question: LearningQuestion | MathQuestion,
  userAnswer?: string
): StructuredExplanationSet {
  const mathQ = question as MathQuestion;
  let correctAnswerText = mathQ.correctAnswer || '';
  if (!correctAnswerText && typeof question.correctAnswerIndex === 'number' && question.options) {
    correctAnswerText = question.options[question.correctAnswerIndex] || '';
  }

  // 特定の問題のカスタマイズ解説
  if (question.id === 'q_tri_1') {
    return {
      correctAnswerText,
      concept: '三角形は、同じ形を2つ合わせると平行四辺形になります。だから「÷ 2」をします。',
      formula: '10cm (底辺) × 6cm (高さ) ÷ 2 ＝ 30cm²',
      diagramNote: '📐 底辺と高さが垂直（90度）になっている部分をかけ合わせるのがポイントです。',
      prerequisiteConceptName: '平行四辺形の面積公式（底辺×高さ）',
      tipPoint: '最後に「÷ 2」を忘れないように指差し確認しよう！',
    };
  }

  if (question.id === 'q_trap_1') {
    return {
      correctAnswerText,
      concept: '台形は、上底と下底を足すことで、大きな平行四辺形の底辺に見立てて計算します。',
      formula: '(4 ＋ 8) × 5 ÷ 2 ＝ 12 × 5 ÷ 2 ＝ 30cm²',
      diagramNote: '🟩 (上底＋下底) をかっこで括って先に計算するのが決まりです。',
      prerequisiteConceptName: 'かっこ ( ) のある式の計算順序',
      tipPoint: '上底と下底を先に足し算してから、高さをかけて2で割ろう！',
    };
  }

  // 汎用構造化解説
  const exp = question.explanation || '問題の考え方を振り返りましょう。';
  return {
    correctAnswerText,
    concept: exp,
    formula: exp.includes('＝') ? exp : undefined,
    diagramNote: question.topic?.includes('図形') ? '図形の位置関係をよく確かめてみよう。' : undefined,
    prerequisiteConceptName: question.prerequisiteConceptName || '基本の計算と単位',
    tipPoint: '単位のつけ忘れや計算ミスに気をつけて、もう一度挑戦してみよう！',
  };
}
