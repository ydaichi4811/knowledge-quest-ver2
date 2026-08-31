import { describe, expect, it } from 'vitest';
import {
  CLASSROOMS,
  getClassroomLabel,
  getClassroomSeatId,
  normalizeStudentNumber,
} from '../services/classroomService';

describe('classroom roster helpers', () => {
  it('defines three classes with 40 seats each', () => {
    expect(CLASSROOMS).toHaveLength(3);
    expect(CLASSROOMS.every((classroom) => classroom.capacity === 40)).toBe(true);
    expect(CLASSROOMS.reduce((sum, classroom) => sum + classroom.capacity, 0)).toBe(120);
  });

  it('creates stable seat IDs for each class and number', () => {
    expect(getClassroomSeatId('class_1', 1)).toBe('class_1_01');
    expect(getClassroomSeatId('class_3', 40)).toBe('class_3_40');
    expect(getClassroomLabel('class_2')).toBe('2組');
  });

  it('keeps student numbers inside the 1 to 40 range', () => {
    expect(normalizeStudentNumber(0)).toBe(1);
    expect(normalizeStudentNumber(18.9)).toBe(18);
    expect(normalizeStudentNumber(99)).toBe(40);
  });
});
