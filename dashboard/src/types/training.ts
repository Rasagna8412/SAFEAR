export type TrainingMode = 'SIMULATION_3D' | 'CAMERA_AR';

export type CameraPermissionStatus = 'IDLE' | 'REQUESTING' | 'GRANTED' | 'DENIED' | 'UNAVAILABLE' | 'ERROR';

export type HazardType = 'ELECTRICAL' | 'MOVING_MACHINERY' | 'RESTRICTED_ZONE' | 'MISSING_PPE' | 'UNSAFE_DISTANCE' | 'EMERGENCY_OBSTACLE';

export type HazardSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type InteractiveObjectType = 'PPE_STATION' | 'ELECTRICAL_PANEL' | 'MACHINE' | 'EMERGENCY_STOP' | 'WARNING_SIGN' | 'SAFE_ZONE' | 'ASSEMBLY_POINT' | 'BARRIER';

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface HazardDefinition {
  id: string;
  type: HazardType;
  title: string;
  description: string;
  position: Vector3D;
  safeDistanceRadius: number; // in meters
  severity: HazardSeverity;
  warningText: string;
  requiredPrecaution: string;
  visualCue: {
    color: string;
    icon: string;
    pulsing: boolean;
  };
}

export interface InteractiveObjectDefinition {
  id: string;
  type: InteractiveObjectType;
  title: string;
  description: string;
  position: Vector3D;
  dimensions?: Vector3D;
  interactable: boolean;
  actionHint: string;
  highlightColor?: string;
}

export interface TrainingScenario {
  id: string;
  courseId: string;
  title: string;
  description: string;
  category: 'Mining' | 'Manufacturing' | 'Emergency';
  environmentType: 'MINING_EXCAVATION' | 'FACTORY_FLOOR' | 'EMERGENCY_FACILITY';
  environmentBounds: {
    width: number;
    depth: number;
    height: number;
  };
  cameraInitialPosition: Vector3D;
  cameraTargetPosition: Vector3D;
  hazards: HazardDefinition[];
  objects: InteractiveObjectDefinition[];
  targetMarkerUrl?: string;
}
