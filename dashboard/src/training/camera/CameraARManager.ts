import { CameraPermissionStatus } from '../../types/training';

export class CameraARManager {
  private stream: MediaStream | null = null;
  private status: CameraPermissionStatus = 'IDLE';
  private errorMessage: string | null = null;
  private onStatusChangeCallbacks: ((status: CameraPermissionStatus, error: string | null) => void)[] = [];

  public getStatus(): CameraPermissionStatus {
    return this.status;
  }

  public getErrorMessage(): string | null {
    return this.errorMessage;
  }

  public onStatusChange(callback: (status: CameraPermissionStatus, error: string | null) => void): () => void {
    this.onStatusChangeCallbacks.push(callback);
    callback(this.status, this.errorMessage);
    return () => {
      this.onStatusChangeCallbacks = this.onStatusChangeCallbacks.filter(cb => cb !== callback);
    };
  }

  private setStatus(status: CameraPermissionStatus, error: string | null = null): void {
    this.status = status;
    this.errorMessage = error;
    for (const cb of this.onStatusChangeCallbacks) {
      cb(this.status, this.errorMessage);
    }
  }

  public async startCamera(videoElement?: HTMLVideoElement | null): Promise<MediaStream | null> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.setStatus('UNAVAILABLE', 'Camera API is not supported in this browser environment.');
      return null;
    }

    this.setStatus('REQUESTING');

    try {
      // Request environment (back) camera if available, fallback to user camera
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.setStatus('GRANTED');

      if (videoElement && this.stream) {
        videoElement.srcObject = this.stream;
        videoElement.play().catch(() => {
          // Auto-play policy handled
        });
      }

      return this.stream;
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        this.setStatus('DENIED', 'Camera access permission was denied by the user or system.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        this.setStatus('UNAVAILABLE', 'No camera hardware device found on this system.');
      } else {
        this.setStatus('ERROR', err.message || 'Failed to initialize camera video stream.');
      }
      return null;
    }
  }

  public stopCamera(videoElement?: HTMLVideoElement | null): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => {
        track.stop();
      });
      this.stream = null;
    }

    if (videoElement) {
      videoElement.srcObject = null;
    }

    this.setStatus('IDLE');
  }

  public dispose(): void {
    this.stopCamera();
    this.onStatusChangeCallbacks = [];
  }
}
