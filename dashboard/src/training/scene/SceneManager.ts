import * as THREE from 'three';
import { TrainingScenario } from '../../types/training';
import { ScenarioLoader } from './ScenarioLoader';
import { CameraController } from './CameraController';
import { ObjectInteraction, InteractiveHitResult } from '../interaction/ObjectInteraction';

export interface SceneManagerConfig {
  container: HTMLDivElement;
  scenario: TrainingScenario;
  onObjectSelected?: (result: InteractiveHitResult) => void;
  isAROverlay?: boolean;
}

export class SceneManager {
  private container: HTMLDivElement;
  private scenario: TrainingScenario;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private cameraController: CameraController;
  private scenarioLoader: ScenarioLoader;
  private objectInteraction: ObjectInteraction;

  private animationFrameId: number | null = null;
  private isDisposed: boolean = false;
  private isAROverlay: boolean = false;
  private resizeObserver: ResizeObserver | null = null;

  constructor(config: SceneManagerConfig) {
    this.container = config.container;
    this.scenario = config.scenario;
    this.isAROverlay = !!config.isAROverlay;

    // 1. Initialize Three.js Scene
    this.scene = new THREE.Scene();
    if (!this.isAROverlay) {
      this.scene.background = new THREE.Color(0x0b1120); // Dark industrial slate
      this.scene.fog = new THREE.FogExp2(0x0b1120, 0.04);
    } else {
      this.scene.background = null; // Transparent for Camera AR overlay
    }

    // 2. Camera Setup
    const aspect = this.container.clientWidth / (this.container.clientHeight || 1);
    this.camera = new THREE.PerspectiveCamera(55, aspect, 0.1, 100);
    this.camera.position.set(
      this.scenario.cameraInitialPosition.x,
      this.scenario.cameraInitialPosition.y,
      this.scenario.cameraInitialPosition.z
    );

    // 3. WebGL Renderer Setup
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: this.isAROverlay,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = !this.isAROverlay;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Clear previous children and append canvas
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
    this.container.appendChild(this.renderer.domElement);

    // 4. Lighting Setup
    this.setupLighting();

    // 5. Build Environment & Scenario Objects
    this.scenarioLoader = new ScenarioLoader(this.scene, this.scenario, this.isAROverlay);
    this.scenarioLoader.load();

    // 6. Camera Controller
    this.cameraController = new CameraController(
      this.camera,
      this.renderer.domElement,
      new THREE.Vector3(
        this.scenario.cameraTargetPosition.x,
        this.scenario.cameraTargetPosition.y,
        this.scenario.cameraTargetPosition.z
      )
    );

    // 7. Interaction Raycaster
    this.objectInteraction = new ObjectInteraction(
      this.camera,
      this.renderer.domElement,
      this.scenarioLoader.getInteractiveObjects(),
      (hit) => {
        if (config.onObjectSelected) {
          config.onObjectSelected(hit);
        }
      }
    );

    // 8. Resize Handler
    this.setupResizeHandler();

    // 9. Start Render Loop
    this.startAnimationLoop();
  }

  private setupLighting(): void {
    // Soft Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, this.isAROverlay ? 1.4 : 0.85);
    this.scene.add(ambientLight);

    // Main Overhead Industrial Spotlight with Soft PCF Shadows
    const mainLight = new THREE.DirectionalLight(0xfffbeb, this.isAROverlay ? 1.6 : 1.25);
    mainLight.position.set(8, 14, 10);
    mainLight.castShadow = !this.isAROverlay;
    if (mainLight.shadow) {
      mainLight.shadow.mapSize.width = 2048;
      mainLight.shadow.mapSize.height = 2048;
      mainLight.shadow.bias = -0.0005;
      mainLight.shadow.camera.near = 0.5;
      mainLight.shadow.camera.far = 40;
      mainLight.shadow.camera.left = -16;
      mainLight.shadow.camera.right = 16;
      mainLight.shadow.camera.top = 16;
      mainLight.shadow.camera.bottom = -16;
    }
    this.scene.add(mainLight);

    // Warm Tungsten Excavation Tunnel Floodlight
    const fillLight = new THREE.PointLight(0xf59e0b, 1.8, 25);
    fillLight.position.set(-6, 5, -3);
    this.scene.add(fillLight);

    // Cyan High-Tech Electrical Substation Glow
    const subLight = new THREE.PointLight(0x38bdf8, 1.2, 20);
    subLight.position.set(6, 4, 6);
    this.scene.add(subLight);

    // Red Emergency Beacon Light
    const alertLight = new THREE.PointLight(0xef4444, 0.9, 15);
    alertLight.position.set(0, 3.5, 0);
    this.scene.add(alertLight);
  }

  private setupResizeHandler(): void {
    const handleResize = () => {
      if (!this.container || this.isDisposed) return;
      const width = this.container.clientWidth;
      const height = this.container.clientHeight || 1;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    };

    this.resizeObserver = new ResizeObserver(handleResize);
    this.resizeObserver.observe(this.container);
  }

  private startAnimationLoop(): void {
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      if (this.isDisposed) return;

      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Update controllers & animations
      this.cameraController.update();
      this.scenarioLoader.update(delta);
      this.objectInteraction.update();

      // Render frame
      this.renderer.render(this.scene, this.camera);

      this.animationFrameId = requestAnimationFrame(animate);
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  public setARMode(isAR: boolean): void {
    this.isAROverlay = isAR;
    if (this.isAROverlay) {
      this.scene.background = null;
      this.renderer.setClearColor(0x000000, 0);
    } else {
      this.scene.background = new THREE.Color(0x0b1120);
      this.renderer.setClearColor(0x0b1120, 1);
    }
    this.scenarioLoader.setARMode(isAR);
  }

  public resetCamera(): void {
    this.camera.position.set(
      this.scenario.cameraInitialPosition.x,
      this.scenario.cameraInitialPosition.y,
      this.scenario.cameraInitialPosition.z
    );
    this.cameraController.setTarget(
      new THREE.Vector3(
        this.scenario.cameraTargetPosition.x,
        this.scenario.cameraTargetPosition.y,
        this.scenario.cameraTargetPosition.z
      )
    );
  }

  public focusOnObject(position: { x: number; y: number; z: number }): void {
    this.cameraController.animateTo(
      new THREE.Vector3(position.x, position.y + 1.5, position.z + 3.5),
      new THREE.Vector3(position.x, position.y, position.z)
    );
  }

  /**
   * Proper disposal of all Three.js geometries, materials, listeners, and renderer.
   */
  public dispose(): void {
    this.isDisposed = true;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    if (this.cameraController) {
      this.cameraController.dispose();
    }

    if (this.objectInteraction) {
      this.objectInteraction.dispose();
    }

    if (this.scenarioLoader) {
      this.scenarioLoader.dispose();
    }

    // Traverse scene and dispose of remaining geometries and materials
    this.scene.traverse((child) => {
      if ((child as THREE.Mesh).geometry) {
        (child as THREE.Mesh).geometry.dispose();
      }
      if ((child as THREE.Mesh).material) {
        const mat = (child as THREE.Mesh).material;
        if (Array.isArray(mat)) {
          mat.forEach((m) => m.dispose());
        } else {
          mat.dispose();
        }
      }
    });

    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }
  }
}
