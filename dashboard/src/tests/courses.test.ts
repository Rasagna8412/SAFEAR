import { describe, it, expect } from 'vitest';
import { INITIAL_COURSES } from '../data/coursesData';

describe('Phase 1 Course Seed Data Tests', () => {
  it('1. Should contain at least 3 initial training courses', () => {
    expect(INITIAL_COURSES.length).toBeGreaterThanOrEqual(3);
  });

  it('2. Should contain Mining Safety Level 1 with valid scenario properties', () => {
    const miningCourse = INITIAL_COURSES.find(c => c.id === 'mining-safety-01');
    expect(miningCourse).toBeDefined();
    expect(miningCourse?.title).toBe('Mining Safety Level 1');
    expect(miningCourse?.category).toBe('Mining');
    expect(miningCourse?.difficulty).toBe('Beginner');
    expect(miningCourse?.durationMinutes).toBe(10);
    expect(miningCourse?.topics).toContain('5-Step Lockout/Tagout (LOTO)');
    expect(miningCourse?.learningOutcomes.length).toBeGreaterThan(0);
  });

  it('3. Should contain Manufacturing Safety with valid parameters', () => {
    const mfgCourse = INITIAL_COURSES.find(c => c.id === 'mfg-safety-01');
    expect(mfgCourse).toBeDefined();
    expect(mfgCourse?.category).toBe('Manufacturing');
    expect(mfgCourse?.topics.length).toBeGreaterThan(0);
  });

  it('4. Should contain Emergency Response with valid parameters', () => {
    const emergCourse = INITIAL_COURSES.find(c => c.id === 'emergency-response-01');
    expect(emergCourse).toBeDefined();
    expect(emergCourse?.category).toBe('Emergency');
    expect(emergCourse?.topics.length).toBeGreaterThan(0);
  });

  it('5. All courses should have unique IDs and enabled status', () => {
    const ids = INITIAL_COURSES.map(c => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);

    INITIAL_COURSES.forEach(c => {
      expect(c.enabled).toBe(true);
      expect(c.scenarioId).toBeDefined();
    });
  });
});
