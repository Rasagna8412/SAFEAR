export type CourseCategory = 'Mining' | 'Manufacturing' | 'Emergency';
export type CourseDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Course {
  id: string;
  title: string;
  description: string;
  category: CourseCategory;
  difficulty: CourseDifficulty;
  durationMinutes: number;
  scenarioId: string;
  enabled: boolean;
  topics: string[];
  prerequisites?: string[];
  learningOutcomes: string[];
  badgeName?: string;
  completionRate?: number;
}
