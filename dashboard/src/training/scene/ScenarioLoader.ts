import * as THREE from 'three';
import { TrainingScenario, InteractiveObjectDefinition } from '../../types/training';

/**
 * Generates a high-resolution procedural industrial hazard stripe canvas texture.
 */
function createHazardTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#f59e0b'; // Amber yellow
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = '#0f172a'; // Deep slate black
    ctx.beginPath();
    for (let i = -256; i < 512; i += 64) {
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 32, 0);
      ctx.lineTo(i + 256 + 32, 256);
      ctx.lineTo(i + 256, 256);
      ctx.closePath();
    }
    ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export class ScenarioLoader {
  private scene: THREE.Scene;
  private scenario: TrainingScenario;
  private isARMode: boolean;

  private interactiveObjects: THREE.Object3D[] = [];
  private pulsingMaterials: (THREE.MeshBasicMaterial | THREE.LineBasicMaterial)[] = [];
  private animatingBeacons: THREE.Mesh[] = [];
  private spinningBits: THREE.Object3D[] = [];
  private dustParticles: THREE.Points | null = null;
  private hazardTexture: THREE.CanvasTexture;

  private environmentGroup: THREE.Group;
  private equipmentGroup: THREE.Group;
  private hazardGroup: THREE.Group;

  constructor(scene: THREE.Scene, scenario: TrainingScenario, isARMode: boolean = false) {
    this.scene = scene;
    this.scenario = scenario;
    this.isARMode = isARMode;
    this.hazardTexture = createHazardTexture();

    this.environmentGroup = new THREE.Group();
    this.equipmentGroup = new THREE.Group();
    this.hazardGroup = new THREE.Group();

    this.scene.add(this.environmentGroup);
    this.scene.add(this.equipmentGroup);
    this.scene.add(this.hazardGroup);
  }

  public load(): void {
    if (!this.isARMode) {
      this.buildEnvironment();
      this.buildAtmosphericParticles();
    }
    this.buildEquipmentObjects();
    this.buildHazardIndicators();
  }

  public setARMode(isAR: boolean): void {
    this.isARMode = isAR;
    this.environmentGroup.visible = !isAR;
    if (this.dustParticles) {
      this.dustParticles.visible = !isAR;
    }
  }

  public getInteractiveObjects(): THREE.Object3D[] {
    return this.interactiveObjects;
  }

  /**
   * 1. Realistic Mining Chamber / Industrial Excavation Tunnel Environment
   */
  private buildEnvironment(): void {
    const { width, depth } = this.scenario.environmentBounds;

    // Floor with Concrete Shading & Metallic Grain
    const floorGeo = new THREE.PlaneGeometry(width, depth, 16, 16);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.82,
      metalness: 0.18
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.environmentGroup.add(floor);

    // High-Contrast Walkway Safety Markings
    const grid = new THREE.GridHelper(width, 24, 0xf59e0b, 0x334155);
    grid.position.y = 0.015;
    this.environmentGroup.add(grid);

    // Hazard Safety Boundary Strip around the workspace
    const borderMat = new THREE.MeshStandardMaterial({
      map: this.hazardTexture,
      roughness: 0.6
    });
    const borderGeo = new THREE.BoxGeometry(width, 0.08, 0.4);
    const topBorder = new THREE.Mesh(borderGeo, borderMat);
    topBorder.position.set(0, 0.04, -depth / 2 + 0.2);
    this.environmentGroup.add(topBorder);

    const botBorder = new THREE.Mesh(borderGeo, borderMat);
    botBorder.position.set(0, 0.04, depth / 2 - 0.2);
    this.environmentGroup.add(botBorder);

    // Mining Chamber Rock Walls with Jagged Roughness
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.95,
      metalness: 0.05
    });

    // Back Wall
    const backWallGeo = new THREE.BoxGeometry(width, 8, 0.6);
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(0, 4, -depth / 2);
    backWall.receiveShadow = true;
    this.environmentGroup.add(backWall);

    // Left Wall
    const leftWallGeo = new THREE.BoxGeometry(0.6, 8, depth);
    const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
    leftWall.position.set(-width / 2, 4, 0);
    leftWall.receiveShadow = true;
    this.environmentGroup.add(leftWall);

    // Right Wall
    const rightWallGeo = new THREE.BoxGeometry(0.6, 8, depth);
    const rightWall = new THREE.Mesh(rightWallGeo, wallMat);
    rightWall.position.set(width / 2, 4, 0);
    rightWall.receiveShadow = true;
    this.environmentGroup.add(rightWall);

    // Heavy Industrial Steel I-Beams & Roof Support Arches
    const steelBeamMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.45,
      metalness: 0.85
    });

    for (let z = -depth / 2 + 4; z < depth / 2; z += 5) {
      // Horizontal Crossbeam
      const beamGeo = new THREE.BoxGeometry(width, 0.45, 0.45);
      const beam = new THREE.Mesh(beamGeo, steelBeamMat);
      beam.position.set(0, 7.2, z);
      this.environmentGroup.add(beam);

      // Vertical Pillar Left
      const pillarGeo = new THREE.BoxGeometry(0.4, 7.2, 0.4);
      const pillarL = new THREE.Mesh(pillarGeo, steelBeamMat);
      pillarL.position.set(-width / 2 + 0.5, 3.6, z);
      this.environmentGroup.add(pillarL);

      // Vertical Pillar Right
      const pillarR = new THREE.Mesh(pillarGeo, steelBeamMat);
      pillarR.position.set(width / 2 - 0.5, 3.6, z);
      this.environmentGroup.add(pillarR);

      // Overhead Fluorescent Mining Light Fixture
      const lightTubeGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.0, 8);
      const lightTubeMat = new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        emissive: 0xfef08a,
        emissiveIntensity: 0.9
      });
      const tube = new THREE.Mesh(lightTubeGeo, lightTubeMat);
      tube.rotation.z = Math.PI / 2;
      tube.position.set(0, 6.9, z);
      this.environmentGroup.add(tube);
    }
  }

  /**
   * 2. Atmospheric Mining Underground Dust & Spark Particles
   */
  private buildAtmosphericParticles(): void {
    const particleCount = 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    const { width, depth } = this.scenario.environmentBounds;

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * width;
      positions[i + 1] = Math.random() * 6.0 + 0.2;
      positions[i + 2] = (Math.random() - 0.5) * depth;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xfbbf24,
      size: 0.06,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });

    this.dustParticles = new THREE.Points(geometry, material);
    this.environmentGroup.add(this.dustParticles);
  }

  /**
   * 3. Industrial Equipment & Machinery
   */
  private buildEquipmentObjects(): void {
    for (const objDef of this.scenario.objects) {
      const group = new THREE.Group();
      group.position.set(objDef.position.x, objDef.position.y, objDef.position.z);
      group.userData = {
        isInteractive: true,
        objectType: 'EQUIPMENT',
        data: objDef
      };

      switch (objDef.type) {
        case 'PPE_STATION':
          this.buildPPEStationMesh(group, objDef);
          break;
        case 'ELECTRICAL_PANEL':
          this.buildElectricalPanelMesh(group, objDef);
          break;
        case 'MACHINE':
          this.buildMachineMesh(group, objDef);
          break;
        case 'EMERGENCY_STOP':
          this.buildEStopMesh(group, objDef);
          break;
        case 'SAFE_ZONE':
          this.buildSafeZoneMesh(group, objDef);
          break;
        case 'ASSEMBLY_POINT':
          this.buildAssemblyPointMesh(group, objDef);
          break;
        default:
          this.buildGenericObjectMesh(group, objDef);
      }

      // Add interactive subtle pulse ring at the base
      const targetRingGeo = new THREE.RingGeometry(0.6, 0.75, 24);
      const targetRingMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4
      });
      const targetRing = new THREE.Mesh(targetRingGeo, targetRingMat);
      targetRing.rotation.x = -Math.PI / 2;
      targetRing.position.y = 0.02 - objDef.position.y;
      group.add(targetRing);
      this.pulsingMaterials.push(targetRingMat);

      this.equipmentGroup.add(group);
      this.interactiveObjects.push(group);
    }
  }

  /**
   * 4. 3D Hazard Indicators & Volumetric Warning Beacons
   */
  private buildHazardIndicators(): void {
    for (const hazard of this.scenario.hazards) {
      const group = new THREE.Group();
      group.position.set(hazard.position.x, hazard.position.y, hazard.position.z);
      group.userData = {
        isInteractive: true,
        objectType: 'HAZARD',
        data: hazard
      };

      const colorHex = parseInt(hazard.visualCue.color.replace('#', '0x')) || 0xef4444;

      // 1. Safe Distance Perimeter Ring on Floor
      const ringGeo = new THREE.RingGeometry(
        hazard.safeDistanceRadius - 0.2,
        hazard.safeDistanceRadius,
        36
      );
      const ringMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.65
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.05 - hazard.position.y;
      group.add(ring);
      this.pulsingMaterials.push(ringMat);

      // 2. High-Tech Pulsing Holographic 3D Danger Cage
      const boxGeo = new THREE.BoxGeometry(1.8, 2.4, 1.8);
      const wireframeGeo = new THREE.WireframeGeometry(boxGeo);
      const boxMat = new THREE.LineBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.85
      });
      const wireframe = new THREE.LineSegments(wireframeGeo, boxMat);
      group.add(wireframe);
      this.pulsingMaterials.push(boxMat);

      // 3. Stanchion Safety Post
      const postGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.4, 12);
      const postMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.3 });
      const post = new THREE.Mesh(postGeo, postMat);
      post.position.y = 1.7;
      group.add(post);

      // 4. Rotating Diamond Caution Hologram
      const signGeo = new THREE.BoxGeometry(0.85, 0.85, 0.08);
      const signMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 0.5,
        roughness: 0.3
      });
      const sign = new THREE.Mesh(signGeo, signMat);
      sign.rotation.z = Math.PI / 4;
      sign.position.y = 2.4;
      group.add(sign);
      this.animatingBeacons.push(sign);

      this.hazardGroup.add(group);
      this.interactiveObjects.push(group);
    }
  }

  // --- Specific Detailed Equipment Models ---

  private buildPPEStationMesh(group: THREE.Group, _obj: InteractiveObjectDefinition): void {
    // Industrial Metal Storage Locker
    const cabinetMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.35 });
    const cabinetGeo = new THREE.BoxGeometry(1.8, 2.2, 0.7);
    const cabinet = new THREE.Mesh(cabinetGeo, cabinetMat);
    cabinet.castShadow = true;
    group.add(cabinet);

    // Hazard Stripes Top Header
    const headerMat = new THREE.MeshStandardMaterial({ map: this.hazardTexture });
    const headerGeo = new THREE.BoxGeometry(1.8, 0.3, 0.72);
    const header = new THREE.Mesh(headerGeo, headerMat);
    header.position.y = 1.15;
    group.add(header);

    // Hard Hat with Headlamp
    const hatMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.25, metalness: 0.1 });
    const hatGeo = new THREE.SphereGeometry(0.22, 16, 16);
    const hat = new THREE.Mesh(hatGeo, hatMat);
    hat.position.set(-0.45, 0.5, 0.25);
    group.add(hat);

    const lampMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.8 });
    const lampGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.06, 8);
    const lamp = new THREE.Mesh(lampGeo, lampMat);
    lamp.rotation.x = Math.PI / 2;
    lamp.position.set(-0.45, 0.5, 0.45);
    group.add(lamp);

    // High-Vis Safety Vest with Silver Reflective Stripes
    const vestMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.6 });
    const vestGeo = new THREE.BoxGeometry(0.45, 0.65, 0.12);
    const vest = new THREE.Mesh(vestGeo, vestMat);
    vest.position.set(0.45, 0.45, 0.25);
    group.add(vest);

    const stripeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.1 });
    const stripeGeo = new THREE.BoxGeometry(0.46, 0.08, 0.13);
    const stripe = new THREE.Mesh(stripeGeo, stripeMat);
    stripe.position.set(0.45, 0.45, 0.25);
    group.add(stripe);
  }

  private buildElectricalPanelMesh(group: THREE.Group, _obj: InteractiveObjectDefinition): void {
    // Steel Enclosure Cabinet
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.85, roughness: 0.25 });
    const boxGeo = new THREE.BoxGeometry(1.3, 2.5, 0.8);
    const panel = new THREE.Mesh(boxGeo, panelMat);
    panel.castShadow = true;
    group.add(panel);

    // Hazard Warning Chevron Door
    const doorMat = new THREE.MeshStandardMaterial({ map: this.hazardTexture, roughness: 0.4 });
    const doorGeo = new THREE.BoxGeometry(0.9, 0.9, 0.04);
    const door = new THREE.Mesh(doorGeo, doorMat);
    door.position.set(0, 0.35, 0.42);
    group.add(door);

    // Rotary Lockout Switch Handle (Red LOTO Isolation Switch)
    const switchGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.22, 16);
    const switchMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.3, roughness: 0.3 });
    const rotarySwitch = new THREE.Mesh(switchGeo, switchMat);
    rotarySwitch.rotation.x = Math.PI / 2;
    rotarySwitch.position.set(0, -0.3, 0.45);
    group.add(rotarySwitch);

    // Status Indicator LEDs (Green Active / Red Tripped)
    const ledGreenMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x22c55e, emissiveIntensity: 0.9 });
    const ledGreen = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), ledGreenMat);
    ledGreen.position.set(-0.3, 0.95, 0.42);
    group.add(ledGreen);

    const ledRedMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 0.5 });
    const ledRed = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), ledRedMat);
    ledRed.position.set(0.3, 0.95, 0.42);
    group.add(ledRed);
  }

  private buildMachineMesh(group: THREE.Group, _obj: InteractiveObjectDefinition): void {
    // Heavy Excavation Rock Crusher / Mining Machine
    const chassisMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8, roughness: 0.35 });
    const darkSteelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.3 });

    // 1. Caterpillar Tracks / Base Platform
    const trackGeo = new THREE.BoxGeometry(0.5, 0.6, 4.2);
    const trackL = new THREE.Mesh(trackGeo, darkSteelMat);
    trackL.position.set(-1.4, 0.3, 0);
    trackL.castShadow = true;
    group.add(trackL);

    const trackR = new THREE.Mesh(trackGeo, darkSteelMat);
    trackR.position.set(1.4, 0.3, 0);
    trackR.castShadow = true;
    group.add(trackR);

    // 2. Main Chassis Body
    const bodyGeo = new THREE.BoxGeometry(2.4, 1.8, 3.2);
    const body = new THREE.Mesh(bodyGeo, chassisMat);
    body.position.set(0, 1.4, -0.2);
    body.castShadow = true;
    group.add(body);

    // 3. Hazard Striping Side Panels
    const sideMat = new THREE.MeshStandardMaterial({ map: this.hazardTexture });
    const sidePanelGeo = new THREE.BoxGeometry(0.05, 0.4, 3.0);
    const sideL = new THREE.Mesh(sidePanelGeo, sideMat);
    sideL.position.set(-1.23, 1.4, -0.2);
    group.add(sideL);

    const sideR = new THREE.Mesh(sidePanelGeo, sideMat);
    sideR.position.set(1.23, 1.4, -0.2);
    group.add(sideR);

    // 4. Hydraulic Articulated Cutter Arm & Rotary Bit
    const armGeo = new THREE.CylinderGeometry(0.18, 0.22, 2.5, 12);
    const arm = new THREE.Mesh(armGeo, chassisMat);
    arm.rotation.x = -Math.PI / 4;
    arm.position.set(0, 1.8, 1.4);
    group.add(arm);

    // Rotating Diamond Cutter Drum
    const bitGeo = new THREE.CylinderGeometry(0.45, 0.45, 1.4, 16);
    const bitMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95, roughness: 0.15 });
    const cutterBit = new THREE.Mesh(bitGeo, bitMat);
    cutterBit.rotation.z = Math.PI / 2;
    cutterBit.position.set(0, 1.0, 2.3);
    cutterBit.castShadow = true;
    group.add(cutterBit);
    this.spinningBits.push(cutterBit);

    // Diesel Exhaust Stack
    const exhaustGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.4, 8);
    const exhaust = new THREE.Mesh(exhaustGeo, darkSteelMat);
    exhaust.position.set(-0.8, 2.6, -1.2);
    group.add(exhaust);
  }

  private buildEStopMesh(group: THREE.Group, _obj: InteractiveObjectDefinition): void {
    // Pedestal Post
    const postGeo = new THREE.CylinderGeometry(0.07, 0.07, 1.1, 16);
    const postMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.6, roughness: 0.3 });
    const post = new THREE.Mesh(postGeo, postMat);
    group.add(post);

    // Yellow Caution Collar Base
    const collarGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.08, 20);
    const collarMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.3 });
    const collar = new THREE.Mesh(collarGeo, collarMat);
    collar.position.y = 0.56;
    group.add(collar);

    // Big Red Mushroom Stop Button
    const btnGeo = new THREE.CylinderGeometry(0.22, 0.16, 0.18, 20);
    const btnMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      emissive: 0x991b1b,
      emissiveIntensity: 0.4,
      roughness: 0.25
    });
    const btn = new THREE.Mesh(btnGeo, btnMat);
    btn.position.y = 0.68;
    btn.castShadow = true;
    group.add(btn);
  }

  private buildSafeZoneMesh(group: THREE.Group, obj: InteractiveObjectDefinition): void {
    const w = obj.dimensions?.x || 3.5;
    const d = obj.dimensions?.z || 6.0;

    // Glowing Green Floor Pad
    const zoneGeo = new THREE.PlaneGeometry(w, d);
    const zoneMat = new THREE.MeshBasicMaterial({
      color: 0x22c55e,
      transparent: true,
      opacity: 0.32,
      side: THREE.DoubleSide
    });
    const zone = new THREE.Mesh(zoneGeo, zoneMat);
    zone.rotation.x = -Math.PI / 2;
    zone.position.y = 0.02;
    group.add(zone);

    // Holographic Safety Perimeter Ring
    const frameGeo = new THREE.RingGeometry(w / 2 - 0.15, w / 2, 4);
    const frameMat = new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.rotation.x = -Math.PI / 2;
    frame.position.y = 0.03;
    group.add(frame);
  }

  private buildAssemblyPointMesh(group: THREE.Group, _obj: InteractiveObjectDefinition): void {
    // High Muster Mast
    const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.2, 16);
    const postMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, metalness: 0.85, roughness: 0.2 });
    const post = new THREE.Mesh(postGeo, postMat);
    post.position.y = 1.6;
    group.add(post);

    // Illuminated Cyan Evacuation Beacon
    const beaconGeo = new THREE.SphereGeometry(0.4, 20, 20);
    const beaconMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.9,
      roughness: 0.1
    });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.y = 3.3;
    group.add(beacon);
    this.animatingBeacons.push(beacon);
  }

  private buildGenericObjectMesh(group: THREE.Group, obj: InteractiveObjectDefinition): void {
    const w = obj.dimensions?.x || 1.2;
    const h = obj.dimensions?.y || 1.2;
    const d = obj.dimensions?.z || 1.2;

    const boxGeo = new THREE.BoxGeometry(w, h, d);
    const boxMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7, roughness: 0.4 });
    const mesh = new THREE.Mesh(boxGeo, boxMat);
    mesh.castShadow = true;
    group.add(mesh);
  }

  public update(delta: number): void {
    const time = performance.now() * 0.003;

    // 1. Smooth pulsing of hazard zones and interactive reticles
    const pulseOpacity = 0.45 + 0.35 * Math.sin(time * 3);
    for (const mat of this.pulsingMaterials) {
      mat.opacity = pulseOpacity;
    }

    // 2. Rotate hazard signboards and muster point beacon
    for (const beacon of this.animatingBeacons) {
      beacon.rotation.y += delta * 1.6;
    }

    // 3. Spin cutter drum bit on heavy mining machine
    for (const bit of this.spinningBits) {
      bit.rotation.x += delta * 4.0;
    }

    // 4. Subtle drifting animation for underground dust particles
    if (this.dustParticles) {
      const positions = this.dustParticles.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= delta * 0.15;
        if (positions[i] < 0.1) {
          positions[i] = 6.0;
        }
      }
      this.dustParticles.geometry.attributes.position.needsUpdate = true;
    }
  }

  public dispose(): void {
    this.interactiveObjects = [];
    this.pulsingMaterials = [];
    this.animatingBeacons = [];
    this.spinningBits = [];
    if (this.hazardTexture) {
      this.hazardTexture.dispose();
    }
  }
}
