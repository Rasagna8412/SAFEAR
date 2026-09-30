import { PenaltyRuleConfig } from '../../types/scoring';

export const SCORING_RULES: PenaltyRuleConfig = {
  CORRECT: 0,
  WRONG_HAZARD: 5,
  WRONG_ACTION: 10,
  UNSAFE_ACTION: 20,
  SKIPPED_STEP: 10,
  INCOMPLETE: 10
};

export const STARTING_SCORE = 100;
export const MIN_SCORE = 0;
export const MAX_SCORE = 100;
export const PASSING_SCORE_THRESHOLD = 70;
