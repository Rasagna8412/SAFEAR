import { PPEItemType, PPEDetectionResult, PPEValidationResult } from '../../types/ppe';
import { PPE_CONFIG, PPE_LABELS } from './PPEConfig';

export class PPETrainingValidator {
  public static validate(
    result: PPEDetectionResult,
    requiredPPE: PPEItemType[] = PPE_CONFIG.requiredMiningPPE
  ): PPEValidationResult {
    const detectedItems: PPEItemType[] = [];
    const missingItems: PPEItemType[] = [];
    const uncertainItems: PPEItemType[] = [];

    for (const reqItem of requiredPPE) {
      const detectedMatch = result.items.find(i => i.item === reqItem);
      if (!detectedMatch || !detectedMatch.detected) {
        missingItems.push(reqItem);
      } else if (detectedMatch.status === 'CONFIRMED') {
        detectedItems.push(reqItem);
      } else if (detectedMatch.status === 'UNCERTAIN') {
        uncertainItems.push(reqItem);
      } else {
        missingItems.push(reqItem);
      }
    }

    // 1. Check if all required items are confirmed
    if (detectedItems.length === requiredPPE.length && missingItems.length === 0 && uncertainItems.length === 0) {
      return {
        status: 'COMPLIANT',
        requiredItems: requiredPPE,
        detectedItems,
        missingItems,
        uncertainItems,
        message: 'All mandatory mining PPE confirmed. Full occupational protection verified.',
        explanation: 'Worker has equipped required Hard Hat, Hi-Vis Vest, Cut-Resistant Gloves, and Eye Protection.',
        canAdvance: true
      };
    }

    // 2. Check for uncertain detections
    if (uncertainItems.length > 0) {
      const uncertainNames = uncertainItems.map(item => PPE_LABELS[item]?.title || item).join(', ');
      return {
        status: 'UNCERTAIN',
        requiredItems: requiredPPE,
        detectedItems,
        missingItems,
        uncertainItems,
        message: `Detection uncertain for: ${uncertainNames}. Please reposition camera, improve lighting, or retry scan.`,
        explanation: 'Confidence threshold was not met for one or more critical PPE items. Ensure clear visibility to avoid false positives.',
        canAdvance: false
      };
    }

    // 3. Non-compliant / Missing items
    const missingNames = missingItems.map(item => PPE_LABELS[item]?.title || item).join(', ');
    return {
      status: 'NON_COMPLIANT',
      requiredItems: requiredPPE,
      detectedItems,
      missingItems,
      uncertainItems,
      message: `Missing mandatory safety equipment: ${missingNames}. Equip missing items before proceeding.`,
      explanation: 'Mining safety regulations prohibit entering excavation chambers without certified personal protective equipment.',
      canAdvance: false
    };
  }
}
