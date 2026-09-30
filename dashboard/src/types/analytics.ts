import { TrainingResultRecord } from '../services/repositories/trainingResultRepository';
import { CertificateRecord } from './certificate';

export interface WorkerProgressSummary {
  userId: string;
  userName: string;
  role: string;
  drillsCompleted: number;
  totalAttempts: number;
  averageScore: number;
  latestScore: number;
  passedCount: number;
  failedCount: number;
  ppeComplianceRate: number;
  certificates: CertificateRecord[];
  recentResults: TrainingResultRecord[];
}

export interface TrainerDashboardData {
  assignedWorkersCount: number;
  totalDrillsConducted: number;
  averagePassingRate: number;
  averageCohortScore: number;
  workers: WorkerProgressSummary[];
  recentActivity: TrainingResultRecord[];
  scoreDistribution: { range: string; count: number }[];
}

export interface AdminSystemAnalytics {
  totalRegisteredUsers: number;
  workerCount: number;
  trainerCount: number;
  adminCount: number;
  totalCoursesCount: number;
  totalScenariosCount: number;
  totalDrillsCompleted: number;
  overallAverageScore: number;
  overallPassingRate: number;
  totalCertificatesIssued: number;
  blockchainVerificationRate: number;
  ppeComplianceRate: number;
  systemHealth: 'OPERATIONAL' | 'DEGRADED';
  recentCertificates: CertificateRecord[];
  recentActivity: TrainingResultRecord[];
  scoreDistribution: { range: string; count: number }[];
}
