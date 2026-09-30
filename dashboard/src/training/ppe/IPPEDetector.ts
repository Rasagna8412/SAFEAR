import { PPEDetectionResult, PPEModelStatus } from '../../types/ppe';

export interface IPPEDetector {
  initialize(): Promise<void>;
  detect(videoOrCanvas: HTMLVideoElement | HTMLCanvasElement): Promise<PPEDetectionResult>;
  getStatus(): PPEModelStatus;
  dispose(): void;
  onStatusChange(callback: (status: PPEModelStatus) => void): () => void;
}
