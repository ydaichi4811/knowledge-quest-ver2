import { LearningSkill } from '../types';

export const ALL_LEARNING_SKILLS: LearningSkill[] = [
  // ==========================================
  // GRADE 2 (小2)
  // ==========================================
  {
    skillId: 'kuku',
    grade: 2,
    subject: 'math',
    unit: 'かけ算',
    title: '九九',
    description: '1けたの数どうしのかけ算（1の段～9の段）をすらすら暗唱して答える力',
    prerequisiteSkillIds: [],
    relatedQuestionIds: ['q_g2_1', 'q_g2_kuku_2', 'q_g2_kuku_3'],
    masteryThreshold: 90,
    icon: '🔢',
    mapPosition: { x: 100, y: 100 },
  },
  {
    skillId: 'simple_multiplication',
    grade: 2,
    subject: 'math',
    unit: 'かけ算',
    title: '簡単なかけ算',
    description: '「1つの数 × いくつ分」の考え方と文章題から式をつくる力',
    prerequisiteSkillIds: ['kuku'],
    relatedQuestionIds: ['q_g2_2', 'q_g2_mult_2', 'q_g2_mult_3'],
    masteryThreshold: 90,
    icon: '✖️',
    mapPosition: { x: 100, y: 220 },
  },

  // ==========================================
  // GRADE 3 (小3)
  // ==========================================
  {
    skillId: 'length_basic',
    grade: 3,
    subject: 'math',
    unit: '長さと単位',
    title: '長さ',
    description: '定規を使った長さの測定と、mm・cmの基本概念',
    prerequisiteSkillIds: [],
    relatedQuestionIds: ['q_g3_length_1', 'q_g3_length_2'],
    masteryThreshold: 90,
    icon: '📏',
    mapPosition: { x: 400, y: 100 },
  },
  {
    skillId: 'cm_m_units',
    grade: 3,
    subject: 'math',
    unit: '長さと単位',
    title: 'cmとm',
    description: '1m ＝ 100cm の関係と、長さをあわせた計算・単位換算の力',
    prerequisiteSkillIds: ['length_basic'],
    relatedQuestionIds: ['q_g3_1', 'q_g3_cm_m_2'],
    masteryThreshold: 90,
    icon: '📐',
    mapPosition: { x: 400, y: 220 },
  },
  {
    skillId: 'multiplication_column',
    grade: 3,
    subject: 'math',
    unit: 'かけ算',
    title: 'かけ算の筆算',
    description: '2けた × 1けた・くり上がりのあるかけ算の筆算力',
    prerequisiteSkillIds: ['kuku'],
    relatedQuestionIds: ['q_g3_2', 'q_g3_col_2', 'q_g3_col_3'],
    masteryThreshold: 90,
    icon: '🧮',
    mapPosition: { x: 220, y: 220 },
  },

  // ==========================================
  // GRADE 4 (小4)
  // ==========================================
  {
    skillId: 'shape_sides',
    grade: 4,
    subject: 'math',
    unit: '図形と面積',
    title: '図形の辺',
    description: '図形を構成する辺の長さ、向かい合う辺の関係、周の長さの計算',
    prerequisiteSkillIds: ['length_basic'],
    relatedQuestionIds: ['q_g4_sides_1', 'q_g4_sides_2'],
    masteryThreshold: 90,
    icon: '📐',
    mapPosition: { x: 400, y: 340 },
  },
  {
    skillId: 'rectangle_square_shape',
    grade: 4,
    subject: 'math',
    unit: '図形と面積',
    title: '長方形と正方形',
    description: '4つの角がすべて直角である長方形・正方形の定義と特徴理解',
    prerequisiteSkillIds: ['shape_sides', 'cm_m_units'],
    relatedQuestionIds: ['q_g4_rect_shape_1', 'q_g4_rect_shape_2'],
    masteryThreshold: 90,
    icon: '⬜',
    mapPosition: { x: 400, y: 460 },
  },
  {
    skillId: 'cm2_basic',
    grade: 4,
    subject: 'math',
    unit: '面積',
    title: '1平方センチメートル',
    description: '1cm × 1cm の正方形の広さを基準（1㎠）として広さを数える力',
    prerequisiteSkillIds: ['rectangle_square_shape'],
    relatedQuestionIds: ['q_g4_cm2_1'],
    masteryThreshold: 90,
    icon: '🔲',
    mapPosition: { x: 550, y: 460 },
  },
  {
    skillId: 'area_units',
    grade: 4,
    subject: 'math',
    unit: '面積',
    title: '面積の単位',
    description: '㎠・㎡・a・ha・㎢ などの広さの単位の関係と換算の力',
    prerequisiteSkillIds: ['cm2_basic', 'cm_m_units'],
    relatedQuestionIds: ['q_g4_3'],
    masteryThreshold: 90,
    icon: '🗺️',
    mapPosition: { x: 550, y: 580 },
  },
  {
    skillId: 'composite_shape_basic',
    grade: 4,
    subject: 'math',
    unit: '図形と面積',
    title: '複合図形の基礎',
    description: 'L字型などの複雑な形を、2つの長方形に分けて考える力',
    prerequisiteSkillIds: ['rectangle_square_shape'],
    relatedQuestionIds: ['q_g4_comp_basic_1'],
    masteryThreshold: 90,
    icon: '🧩',
    mapPosition: { x: 280, y: 460 },
  },

  // ==========================================
  // GRADE 5 (小5)
  // ==========================================
  {
    skillId: 'rectangle_area',
    grade: 5,
    subject: 'math',
    unit: '面積公式',
    title: '長方形の面積',
    description: '【たて × 横】で求める長方形の面積公式と計算のマスター',
    prerequisiteSkillIds: ['rectangle_square_shape', 'simple_multiplication'],
    relatedQuestionIds: ['q_g4_1', 'area_stage_1_q1'],
    masteryThreshold: 90,
    icon: '▭',
    mapPosition: { x: 200, y: 580 },
  },
  {
    skillId: 'square_area',
    grade: 5,
    subject: 'math',
    unit: '面積公式',
    title: '正方形の面積',
    description: '【1辺 × 1辺】で求める正方形の面積公式と計算のマスター',
    prerequisiteSkillIds: ['rectangle_square_shape', 'kuku'],
    relatedQuestionIds: ['q_g4_2'],
    masteryThreshold: 90,
    icon: '⬛',
    mapPosition: { x: 380, y: 580 },
  },
  {
    skillId: 'parallelogram_area',
    grade: 5,
    subject: 'math',
    unit: '面積公式',
    title: '平行四辺形の面積',
    description: '【底辺 × 高さ】で求める平行四辺形の面積公式。高さの垂直条件理解',
    prerequisiteSkillIds: ['rectangle_area'],
    relatedQuestionIds: ['area_stage_2_q1', 'area_stage_2_q2'],
    masteryThreshold: 90,
    icon: '▱',
    mapPosition: { x: 200, y: 700 },
  },
  {
    skillId: 'triangle_area',
    grade: 5,
    subject: 'math',
    unit: '面積公式',
    title: '三角形の面積',
    description: '【底辺 × 高さ ÷ 2】で求める三角形の面積公式と変形理解',
    prerequisiteSkillIds: ['rectangle_area', 'kuku'],
    relatedQuestionIds: ['area_stage_3_q1', 'q_g5_tri_2'],
    masteryThreshold: 90,
    icon: '🔺',
    mapPosition: { x: 200, y: 820 },
  },
  {
    skillId: 'trapezoid_area',
    grade: 5,
    subject: 'math',
    unit: '面積公式',
    title: '台形の面積',
    description: '【(上底 ＋ 下底) × 高さ ÷ 2】で求める台形の面積公式',
    prerequisiteSkillIds: ['parallelogram_area', 'triangle_area'],
    relatedQuestionIds: ['area_stage_4_q1'],
    masteryThreshold: 90,
    icon: '⏢',
    mapPosition: { x: 200, y: 940 },
  },
  {
    skillId: 'rhombus_area',
    grade: 5,
    subject: 'math',
    unit: '面積公式',
    title: 'ひし形の面積',
    description: '【対角線 × 対角線 ÷ 2】で求めるひし形の面積公式',
    prerequisiteSkillIds: ['triangle_area'],
    relatedQuestionIds: ['area_stage_5_q1'],
    masteryThreshold: 90,
    icon: '🔹',
    mapPosition: { x: 380, y: 940 },
  },
  {
    skillId: 'composite_area',
    grade: 5,
    subject: 'math',
    unit: '面積応用',
    title: '複合図形',
    description: '分け算（加算）や引き算（くり抜き）を駆使した複雑な図形の面積算出',
    prerequisiteSkillIds: ['rectangle_area', 'square_area', 'composite_shape_basic'],
    relatedQuestionIds: ['area_stage_6_q1'],
    masteryThreshold: 90,
    icon: '🏰',
    mapPosition: { x: 300, y: 1060 },
  },
];

export function getSkillById(skillId: string): LearningSkill | undefined {
  return ALL_LEARNING_SKILLS.find((s) => s.skillId === skillId);
}

export function getPrerequisitesForSkill(skillId: string): LearningSkill[] {
  const skill = getSkillById(skillId);
  if (!skill) return [];
  return skill.prerequisiteSkillIds
    .map((id) => getSkillById(id))
    .filter((s): s is LearningSkill => s !== undefined);
}

export function getNextSkillsForSkill(skillId: string): LearningSkill[] {
  return ALL_LEARNING_SKILLS.filter((s) => s.prerequisiteSkillIds.includes(skillId));
}
