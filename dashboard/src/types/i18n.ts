export type SupportedLanguage = 'en' | 'hi' | 'sat' | 'ta';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'sat', label: 'Santali (Jharkhand)', nativeLabel: 'ᱥᱟᱱᱛᱟᱲᱤ (Santali)' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' }
];

export interface TranslationDictionary {
  // Navigation & Common
  appTitle: string;
  appSubtitle: string;
  navHome: string;
  navCourses: string;
  navProfile: string;
  navSettings: string;
  navLogout: string;
  navLogin: string;
  navRegister: string;
  loading: string;
  saving: string;
  saved: string;
  retry: string;
  cancel: string;
  confirm: string;
  back: string;
  next: string;

  // Auth & Roles
  roleWorker: string;
  roleTrainer: string;
  roleAdmin: string;
  welcomeBack: string;
  demoLoginWorker: string;
  demoLoginTrainer: string;
  demoLoginAdmin: string;
  signInTitle: string;
  signInSubtitle: string;
  createAccountTitle: string;
  createAccountSubtitle: string;
  emailLabel: string;
  passwordLabel: string;
  fullNameLabel: string;
  preferredLanguage: string;
  alreadyHaveAccount: string;
  newWorkerWithoutAccount: string;
  dev1ClickAccounts: string;
  instantTestAccounts: string;

  // Dashboard & Analytics
  dashboardTitle: string;
  workerDashboard: string;
  trainerDashboard: string;
  adminDashboard: string;
  workerProfile: string;
  trackCertifications: string;
  launchCourseCatalog: string;
  activeRole: string;
  switchRoleView: string;
  totalTrainingSessions: string;
  completedDrills: string;
  drillsCompletedSub: string;
  averageScore: string;
  averageScoreSub: string;
  passingRate: string;
  complianceRate: string;
  ppeComplianceSub: string;
  certificatesIssued: string;
  certificatesSub: string;
  recentActivity: string;
  recentAuditLog: string;
  noRecentActivity: string;
  activeOnChainCredential: string;
  noCertificatesYet: string;
  noCertificatesSub: string;
  exploreCourses: string;
  assignedWorkers: string;
  systemOverview: string;
  blockchainStatus: string;
  onChainVerified: string;

  // Courses
  coursesTitle: string;
  coursesSubtitle: string;
  searchPlaceholder: string;
  categoryLabel: string;
  viewDetails: string;
  startDrill: string;
  coreTopics: string;
  minutesLabel: string;
  topicsLabel: string;
  allCategory: string;
  miningCategory: string;
  mfgCategory: string;
  emergencyCategory: string;
  noCoursesFound: string;
  resetFilters: string;

  // Profile
  profileTitle: string;
  profileSubtitle: string;
  avgSafetyScore: string;
  coursesEnrolled: string;
  issuedCerts: string;
  personalInfo: string;
  updateProfileSubtitle: string;
  saveProfileChanges: string;
  profileUpdated: string;
  joinedOn: string;

  // Settings
  settingsTitle: string;
  settingsSubtitle: string;
  langAndLoc: string;
  langSubtitle: string;
  audioAndVoice: string;
  audioSubtitle: string;
  hazardAlarm: string;
  hazardAlarmSub: string;
  voiceTtsLabel: string;
  voiceTtsSub: string;
  displayAccess: string;
  displayAccessSub: string;
  highContrast: string;
  highContrastSub: string;
  offlineDbTitle: string;
  offlineDbSub: string;
  exportDat: string;
  importDat: string;
  envDiagnostic: string;
  envDiagnosticSub: string;
  applyPreferences: string;
  resetDevData: string;

  // Training & PPE
  mandatoryPpeVerification: string;
  hazardIdentification: string;
  safetyAction: string;
  currentScore: string;
  finalScore: string;
  penalties: string;
  skipStep: string;
  executeAction: string;
  scanVideoFeed: string;
  ppeConfirmed: string;
  ppeMissing: string;
  ppeUncertain: string;
  switchCameraAr: string;

  // Certificate
  issueCertificate: string;
  viewCertificate: string;
  verifyCertificate: string;
  tamperProofProof: string;
  passThreshold: string;
}
