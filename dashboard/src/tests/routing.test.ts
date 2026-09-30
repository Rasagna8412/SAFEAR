import { describe, it, expect } from 'vitest';
import { INITIAL_COURSES } from '../data/coursesData';

describe('Phase 1 Routing & Navigation Validation', () => {
  it('1. Should resolve all required course routes from dataset', () => {
    const expectedCourseIds = ['mining-safety-01', 'mfg-safety-01', 'emergency-response-01'];
    expectedCourseIds.forEach(id => {
      const match = INITIAL_COURSES.find(c => c.id === id);
      expect(match).toBeDefined();
      expect(match?.id).toBe(id);
    });
  });

  it('2. Should handle invalid course queries by returning undefined for 404 handling', () => {
    const invalidId = 'non-existent-course-999';
    const match = INITIAL_COURSES.find(c => c.id === invalidId);
    expect(match).toBeUndefined();
  });

  it('3. Should verify course routes contain required metadata for details display', () => {
    INITIAL_COURSES.forEach(course => {
      expect(course.title.length).toBeGreaterThan(3);
      expect(course.description.length).toBeGreaterThan(10);
      expect(course.topics.length).toBeGreaterThan(0);
      expect(course.learningOutcomes.length).toBeGreaterThan(0);
    });
  });
});
