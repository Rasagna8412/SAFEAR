import { PPEDetectionConfig, PPEItemType } from '../../types/ppe';

export const PPE_CONFIG: PPEDetectionConfig = {
  confidenceThreshold: 0.70,
  uncertainThreshold: 0.45,
  inferenceIntervalMs: 600,
  requiredMiningPPE: ['helmet', 'safetyVest', 'gloves', 'eyeProtection']
};

export const PPE_LABELS: Record<PPEItemType, { title: string; standard: string }> = {
  helmet: {
    title: 'Hard Hat (High-Impact Helmet)',
    standard: 'EN 397 / ANSI Z89.1 Class E'
  },
  safetyVest: {
    title: 'Hi-Vis Reflective Safety Vest',
    standard: 'EN ISO 20471 Class 2'
  },
  gloves: {
    title: 'Cut-Resistant Heavy-Duty Gloves',
    standard: 'EN 388 (4X44D)'
  },
  eyeProtection: {
    title: 'Impact Safety Glasses / Goggles',
    standard: 'EN 166 (Grade B)'
  },
  safetyBoots: {
    title: 'Steel-Toe Metatarsal Work Boots',
    standard: 'ASTM F2413 / EN ISO 20345'
  },
  hearingProtection: {
    title: 'Noise-Attenuating Ear Defenders',
    standard: 'EN 352-1 (SNR 32dB)'
  }
};
