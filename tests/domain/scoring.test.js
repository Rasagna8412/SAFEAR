// Deterministic scoring baseline test
function calculateScore(actions) {
  let score = 100;
  for (const action of actions) {
    if (action.type === 'WRONG_HAZARD') score -= 5;
    else if (action.type === 'WRONG_ACTION') score -= 10;
    else if (action.type === 'DANGEROUS_ACTION') score -= 20;
    else if (action.type === 'SKIPPED_STEP') score -= 10;
    else if (action.type === 'CORRECT_HAZARD') score += 5;
    else if (action.type === 'CORRECT_PPE') score += 5;
    else if (action.type === 'CORRECT_PROCEDURE') score += 10;
    else if (action.type === 'CORRECT_EMERGENCY') score += 10;
  }
  return Math.max(0, Math.min(100, score));
}

// Unit test validation
const assert = require('assert');

// Test 1: Perfect session
assert.strictEqual(calculateScore([]), 100, 'Baseline perfect score must be 100');

// Test 2: One wrong hazard
assert.strictEqual(calculateScore([{ type: 'WRONG_HAZARD' }]), 95, 'One wrong hazard must produce 95');

// Test 3: Dangerous action
assert.strictEqual(calculateScore([{ type: 'DANGEROUS_ACTION' }]), 80, 'Dangerous action must produce 80');

// Test 4: Score lower bound clamp
assert.strictEqual(calculateScore([
  { type: 'DANGEROUS_ACTION' },
  { type: 'DANGEROUS_ACTION' },
  { type: 'DANGEROUS_ACTION' },
  { type: 'DANGEROUS_ACTION' },
  { type: 'DANGEROUS_ACTION' },
  { type: 'DANGEROUS_ACTION' }
]), 0, 'Score must not fall below 0');

// Test 5: Score upper bound clamp
assert.strictEqual(calculateScore([
  { type: 'CORRECT_PROCEDURE' },
  { type: 'CORRECT_EMERGENCY' }
]), 100, 'Score must not exceed 100');

console.log('✓ Scoring domain unit tests passed (5/5 assertions verified)');
