export type PPEItemType =
  | 'helmet'
  | 'safetyVest'
  | 'safetyBoots'
  | 'eyeProtection'
  | 'gloves'
  | 'hearingProtection';

export type PPEItemStatus = 'CONFIRMED' | 'UNCERTAIN' | 'MISSING';

export type PPEModelStatus = 'IDLE' | 'LOADING' | 'READY' | 'RUNNING' | 'ERROR' | 'DISPOSED';

export type PPEComplianceStatus = 'COMPLIANT' | 'NON_COMPLIANT' | 'UNCERTAIN';

export interface BoundingBox2D {
  x: number; // 0 to 1 normalized
  y: number; // 0 to 1 normalized
  width: number;
  height: number;
}

export interface PPEDetectedItem {
  id: string;
  item: PPEItemType;
  label: string;
  detected: boolean;
  confidence: number; // 0.0 to 1.0
  status: PPEItemStatus;
  boundingBox?: BoundingBox2D;
}

export interface PPEDetectionResult {
  id: string;
  timestamp: string;
  items: PPEDetectedItem[];
  overallConfidence: number;
  isDevSimulation: boolean;
  inferenceTimeMs: number;
}

export interface PPEValidationResult {
  status: PPEComplianceStatus;
  requiredItems: PPEItemType[];
  detectedItems: PPEItemType[];
  missingItems: PPEItemType[];
  uncertainItems: PPEItemType[];
  message: string;
  explanation: string;
  canAdvance: boolean;
}

export interface PPEDetectionConfig {
  confidenceThreshold: number; // e.g. 0.70
  uncertainThreshold: number;  // e.g. 0.40
  inferenceIntervalMs: number; // e.g. 600ms
  requiredMiningPPE: PPEItemType[];
}
