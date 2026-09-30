export type ThemeMode = 'dark' | 'high-contrast';

export interface AppSettings {
  language: string;
  theme: ThemeMode;
  audioFeedback: boolean;
  voiceTtsEnabled: boolean;
  offlineSimulationMode: boolean;
  devModeIndicators: boolean;
}
