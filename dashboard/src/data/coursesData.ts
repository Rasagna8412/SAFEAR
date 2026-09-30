import { Course } from '../types/course';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'mining-safety-01',
    title: 'Mining Safety Level 1',
    description: 'Comprehensive occupational safety training for underground and open-pit excavation operations. Covers mandatory PPE checks, electrical hazard zones, Lockout/Tagout procedures, and evacuation drills.',
    category: 'Mining',
    difficulty: 'Beginner',
    durationMinutes: 10,
    scenarioId: 'mining-basic-scene',
    enabled: true,
    topics: [
      'PPE Inspection & Verification',
      'Electrical Hazard Detection',
      'Safe Proximity & Perimeter Zones',
      '5-Step Lockout/Tagout (LOTO)',
      'Emergency Evacuation Protocol'
    ],
    prerequisites: ['Basic Workplace Orientation'],
    learningOutcomes: [
      'Identify critical electrical hazards in mining tunnels',
      'Execute full Lockout/Tagout sequence on heavy machinery',
      'Respond to emergency alarms and navigate to safe assembly points'
    ],
    badgeName: 'Mining Safety Certified',
    completionRate: 88
  },
  {
    id: 'mfg-safety-01',
    title: 'Manufacturing Safety & Machinery Protocols',
    description: 'Factory floor hazard awareness and mechanical safety standards. Emphasizes conveyor emergency stops, rotating part safeguards, and chemical storage handling.',
    category: 'Manufacturing',
    difficulty: 'Intermediate',
    durationMinutes: 15,
    scenarioId: 'mfg-plant-scene',
    enabled: true,
    topics: [
      'High-Risk Machinery Safeguards',
      'Emergency Stop (E-Stop) Response',
      'Chemical & Material Safety Data',
      'Ergonomics & Heavy Lifting Limits'
    ],
    prerequisites: ['Mining Safety Level 1 or Equivalent'],
    learningOutcomes: [
      'Identify pinch points and moving part hazards on automated lines',
      'Demonstrate rapid emergency stop activation',
      'Follow chemical spill containment procedures'
    ],
    badgeName: 'Manufacturing Plant Certified',
    completionRate: 74
  },
  {
    id: 'emergency-response-01',
    title: 'Industrial Emergency Response & Evacuation',
    description: 'Crisis response drill for fire, gas leak, and structural collapse situations. Focuses on alarm escalation, team coordination, and assembly point accountability.',
    category: 'Emergency',
    difficulty: 'Advanced',
    durationMinutes: 12,
    scenarioId: 'emergency-drill-scene',
    enabled: true,
    topics: [
      'Alarm Classification & Alert Raising',
      'Primary & Secondary Evacuation Paths',
      'Fire Extinguisher Selection (PASS)',
      'Assembly Point Headcount Verification'
    ],
    prerequisites: ['General Safety Induction'],
    learningOutcomes: [
      'Evaluate immediate exit routes during low-visibility scenarios',
      'Raise plant-wide alarms and initiate orderly evacuation',
      'Report headcount and verify injured worker extraction'
    ],
    badgeName: 'Emergency Response Specialist',
    completionRate: 92
  }
];
