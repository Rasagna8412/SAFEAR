import * as THREE from 'three';
import { HazardDefinition, InteractiveObjectDefinition } from '../../types/training';

export interface InteractiveHitResult {
  type: 'HAZARD' | 'EQUIPMENT';
  data: HazardDefinition | InteractiveObjectDefinition;
  point: { x: number; y: number; z: number };
}

export class ObjectInteraction {
  private camera: THREE.PerspectiveCamera;
  private domElement: HTMLElement;
  private interactiveRoots: THREE.Object3D[];
  private onSelectCallback: (hit: InteractiveHitResult) => void;

  private raycaster: THREE.Raycaster;
  private pointer: THREE.Vector2;
  private hoveredGroup: THREE.Object3D | null = null;
  private originalMaterials = new Map<THREE.Mesh, THREE.Material | THREE.Material[]>();

  private onPointerMoveBound: (e: PointerEvent) => void;
  private onPointerDownBound: (e: PointerEvent) => void;
  private onPointerUpBound: (e: PointerEvent) => void;

  private pointerDownPos = { x: 0, y: 0 };

  constructor(
    camera: THREE.PerspectiveCamera,
    domElement: HTMLElement,
    interactiveRoots: THREE.Object3D[],
    onSelectCallback: (hit: InteractiveHitResult) => void
  ) {
    this.camera = camera;
    this.domElement = domElement;
    this.interactiveRoots = interactiveRoots;
    this.onSelectCallback = onSelectCallback;

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2(-999, -999);

    this.onPointerMoveBound = this.onPointerMove.bind(this);
    this.onPointerDownBound = this.onPointerDown.bind(this);
    this.onPointerUpBound = this.onPointerUp.bind(this);

    this.attachEvents();
  }

  private attachEvents(): void {
    this.domElement.addEventListener('pointermove', this.onPointerMoveBound);
    this.domElement.addEventListener('pointerdown', this.onPointerDownBound);
    this.domElement.addEventListener('pointerup', this.onPointerUpBound);
  }

  private updatePointerCoords(e: PointerEvent): void {
    const rect = this.domElement.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }

  private onPointerMove(e: PointerEvent): void {
    this.updatePointerCoords(e);
  }

  private onPointerDown(e: PointerEvent): void {
    this.pointerDownPos = { x: e.clientX, y: e.clientY };
  }

  private onPointerUp(e: PointerEvent): void {
    // Only register as click if pointer did not drag
    const moveDist = Math.hypot(e.clientX - this.pointerDownPos.x, e.clientY - this.pointerDownPos.y);
    if (moveDist > 6) return;

    this.updatePointerCoords(e);
    this.raycaster.setFromCamera(this.pointer, this.camera);

    const intersects = this.raycaster.intersectObjects(this.interactiveRoots, true);
    if (intersects.length > 0) {
      const topHit = intersects[0];
      const rootGroup = this.findInteractiveRoot(topHit.object);
      if (rootGroup && rootGroup.userData && rootGroup.userData.isInteractive) {
        this.onSelectCallback({
          type: rootGroup.userData.objectType,
          data: rootGroup.userData.data,
          point: {
            x: topHit.point.x,
            y: topHit.point.y,
            z: topHit.point.z
          }
        });
      }
    }
  }

  private findInteractiveRoot(obj: THREE.Object3D): THREE.Object3D | null {
    let curr: THREE.Object3D | null = obj;
    while (curr) {
      if (curr.userData && curr.userData.isInteractive) {
        return curr;
      }
      curr = curr.parent;
    }
    return null;
  }

  public update(): void {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveRoots, true);

    if (intersects.length > 0) {
      const rootGroup = this.findInteractiveRoot(intersects[0].object);
      if (rootGroup !== this.hoveredGroup) {
        this.resetHover();
        this.hoveredGroup = rootGroup;
        this.applyHoverHighlight(rootGroup);
      }
      this.domElement.style.cursor = 'pointer';
    } else {
      if (this.hoveredGroup) {
        this.resetHover();
      }
      this.domElement.style.cursor = 'grab';
    }
  }

  private applyHoverHighlight(group: THREE.Object3D | null): void {
    if (!group) return;
    group.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material && (mesh.material as THREE.MeshStandardMaterial).emissive) {
          const stdMat = mesh.material as THREE.MeshStandardMaterial;
          if (!this.originalMaterials.has(mesh)) {
            this.originalMaterials.set(mesh, stdMat.clone());
          }
          stdMat.emissive.setHex(0xf59e0b);
          stdMat.emissiveIntensity = 0.4;
        }
      }
    });
  }

  private resetHover(): void {
    if (this.hoveredGroup) {
      this.hoveredGroup.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const orig = this.originalMaterials.get(mesh);
          if (orig && (mesh.material as THREE.MeshStandardMaterial).emissive) {
            const stdMat = mesh.material as THREE.MeshStandardMaterial;
            const origStd = orig as THREE.MeshStandardMaterial;
            stdMat.emissive.copy(origStd.emissive);
            stdMat.emissiveIntensity = origStd.emissiveIntensity;
          }
        }
      });
      this.hoveredGroup = null;
    }
  }

  public dispose(): void {
    this.domElement.removeEventListener('pointermove', this.onPointerMoveBound);
    this.domElement.removeEventListener('pointerdown', this.onPointerDownBound);
    this.domElement.removeEventListener('pointerup', this.onPointerUpBound);
    this.resetHover();
    this.originalMaterials.clear();
  }
}
