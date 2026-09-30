import * as THREE from 'three';

export class CameraController {
  private camera: THREE.PerspectiveCamera;
  private domElement: HTMLElement;
  private target: THREE.Vector3;

  private isPointerDown: boolean = false;
  private previousPointerPosition: { x: number; y: number } = { x: 0, y: 0 };
  private spherical: THREE.Spherical;

  private targetPosition: THREE.Vector3 | null = null;
  private targetLookAt: THREE.Vector3 | null = null;
  private isAnimating: boolean = false;

  private onPointerDownBound: (e: PointerEvent) => void;
  private onPointerMoveBound: (e: PointerEvent) => void;
  private onPointerUpBound: (e: PointerEvent) => void;
  private onWheelBound: (e: WheelEvent) => void;
  private onTouchMoveBound: (e: TouchEvent) => void;

  constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement, target: THREE.Vector3) {
    this.camera = camera;
    this.domElement = domElement;
    this.target = target.clone();

    // Convert camera position to spherical coordinates relative to target
    const offset = this.camera.position.clone().sub(this.target);
    this.spherical = new THREE.Spherical().setFromVector3(offset);

    // Bind event handlers
    this.onPointerDownBound = this.onPointerDown.bind(this);
    this.onPointerMoveBound = this.onPointerMove.bind(this);
    this.onPointerUpBound = this.onPointerUp.bind(this);
    this.onWheelBound = this.onWheel.bind(this);
    this.onTouchMoveBound = this.onTouchMove.bind(this);

    this.attachEvents();
  }

  private attachEvents(): void {
    this.domElement.addEventListener('pointerdown', this.onPointerDownBound);
    window.addEventListener('pointermove', this.onPointerMoveBound);
    window.addEventListener('pointerup', this.onPointerUpBound);
    this.domElement.addEventListener('wheel', this.onWheelBound, { passive: false });
    this.domElement.addEventListener('touchmove', this.onTouchMoveBound, { passive: false });
  }

  private onPointerDown(e: PointerEvent): void {
    if (e.button !== 0) return; // Left mouse click or touch
    this.isPointerDown = true;
    this.isAnimating = false;
    this.previousPointerPosition = { x: e.clientX, y: e.clientY };
  }

  private onPointerMove(e: PointerEvent): void {
    if (!this.isPointerDown) return;

    const deltaX = e.clientX - this.previousPointerPosition.x;
    const deltaY = e.clientY - this.previousPointerPosition.y;
    this.previousPointerPosition = { x: e.clientX, y: e.clientY };

    const rotateSpeed = 0.005;
    this.spherical.theta -= deltaX * rotateSpeed;
    this.spherical.phi -= deltaY * rotateSpeed;

    // Restrict phi to avoid flipping
    this.spherical.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, this.spherical.phi));

    this.updateCameraPosition();
  }

  private onPointerUp(): void {
    this.isPointerDown = false;
  }

  private onWheel(e: WheelEvent): void {
    e.preventDefault();
    const zoomSpeed = 0.002;
    this.spherical.radius += e.deltaY * zoomSpeed * (this.spherical.radius * 0.5);
    this.spherical.radius = Math.max(2.0, Math.min(30.0, this.spherical.radius));

    this.updateCameraPosition();
  }

  private onTouchMove(e: TouchEvent): void {
    if (e.touches.length > 1) {
      e.preventDefault(); // Prevent default mobile zoom
    }
  }

  private updateCameraPosition(): void {
    const offset = new THREE.Vector3().setFromSpherical(this.spherical);
    this.camera.position.copy(this.target).add(offset);
    this.camera.lookAt(this.target);
  }

  public setTarget(newTarget: THREE.Vector3): void {
    this.target.copy(newTarget);
    const offset = this.camera.position.clone().sub(this.target);
    this.spherical.setFromVector3(offset);
    this.updateCameraPosition();
  }

  public animateTo(cameraPos: THREE.Vector3, lookAtTarget: THREE.Vector3): void {
    this.targetPosition = cameraPos.clone();
    this.targetLookAt = lookAtTarget.clone();
    this.isAnimating = true;
  }

  public update(): void {
    if (this.isAnimating && this.targetPosition && this.targetLookAt) {
      this.camera.position.lerp(this.targetPosition, 0.08);
      this.target.lerp(this.targetLookAt, 0.08);
      this.camera.lookAt(this.target);

      if (this.camera.position.distanceTo(this.targetPosition) < 0.05) {
        this.camera.position.copy(this.targetPosition);
        this.target.copy(this.targetLookAt);
        this.isAnimating = false;
        const offset = this.camera.position.clone().sub(this.target);
        this.spherical.setFromVector3(offset);
      }
    }
  }

  public dispose(): void {
    this.domElement.removeEventListener('pointerdown', this.onPointerDownBound);
    window.removeEventListener('pointermove', this.onPointerMoveBound);
    window.removeEventListener('pointerup', this.onPointerUpBound);
    this.domElement.removeEventListener('wheel', this.onWheelBound);
    this.domElement.removeEventListener('touchmove', this.onTouchMoveBound);
  }
}
