import { TrainingScenario } from '../types/training';

export const MINING_SAFETY_SCENARIO: TrainingScenario = {
  id: 'mining-basic-scene',
  courseId: 'mining-safety-01',
  title: 'Mining Safety Level 1 — Excavation Chamber Scenario',
  description: 'Underground mining extraction chamber containing heavy crushing machinery, high-voltage electrical panels, restricted overhead hazard zones, and designated emergency evacuation routes.',
  category: 'Mining',
  environmentType: 'MINING_EXCAVATION',
  environmentBounds: {
    width: 24,
    depth: 24,
    height: 7
  },
  cameraInitialPosition: { x: 0, y: 5.5, z: 11 },
  cameraTargetPosition: { x: 0, y: 1.2, z: 0 },
  hazards: [
    {
      id: 'hazard_elec_01',
      type: 'ELECTRICAL',
      title: 'High-Voltage Electrical Hazard (415V)',
      description: 'Exposed secondary terminal junction on main haulage substation panel. Severe risk of electrical arc flash and electrocution.',
      position: { x: -4.5, y: 1.5, z: -3.5 },
      safeDistanceRadius: 2.5,
      severity: 'CRITICAL',
      warningText: 'DANGER: 415V LIVE CIRCUIT — Maintain Minimum 2.5m Perimeter',
      requiredPrecaution: 'Perform 5-step Lockout/Tagout energy isolation before entering perimeter.',
      visualCue: {
        color: '#ef4444',
        icon: '⚡',
        pulsing: true
      }
    },
    {
      id: 'hazard_machinery_02',
      type: 'MOVING_MACHINERY',
      title: 'Active Excavation Feeder & Pinch Points',
      description: 'Continuous heavy crushing conveyor with rotating gears and high-torque rollers. Risk of mechanical entanglement.',
      position: { x: 3.5, y: 1.8, z: -2.0 },
      safeDistanceRadius: 3.0,
      severity: 'HIGH',
      warningText: 'WARNING: ROTATING MACHINERY — Keep Clear of Pinch Points',
      requiredPrecaution: 'Ensure machine is stopped and isolated before clearing debris.',
      visualCue: {
        color: '#f97316',
        icon: '⚠️',
        pulsing: true
      }
    },
    {
      id: 'hazard_restricted_03',
      type: 'RESTRICTED_ZONE',
      title: 'Restricted Overhead Rockfall Zone',
      description: 'Unreinforced excavation face undergoing active seismic vibration. Risk of overhead rockburst and loose debris fall.',
      position: { x: 0, y: 1.0, z: -7.5 },
      safeDistanceRadius: 4.0,
      severity: 'HIGH',
      warningText: 'RESTRICTED AREA: Overhead Rockfall Risk — Authorized Personnel Only',
      requiredPrecaution: 'Do not cross red perimeter barrier without geotechnical clearance.',
      visualCue: {
        color: '#dc2626',
        icon: '🚫',
        pulsing: true
      }
    },
    {
      id: 'hazard_distance_04',
      type: 'UNSAFE_DISTANCE',
      title: 'Unsafe Working Distance Proximity',
      description: 'Operating worker path within blind spot of heavy haulage loader maneuvering track.',
      position: { x: 5.5, y: 1.0, z: 2.5 },
      safeDistanceRadius: 2.0,
      severity: 'CRITICAL',
      warningText: 'PROXIMITY WARNING: Blind Spot Area — High Collision Hazard',
      requiredPrecaution: 'Stand strictly within designated high-visibility safe walkway.',
      visualCue: {
        color: '#eab308',
        icon: '👁️',
        pulsing: false
      }
    }
  ],
  objects: [
    {
      id: 'obj_ppe_station',
      type: 'PPE_STATION',
      title: 'Mandatory PPE Verification Station',
      description: 'Equipped with hard hats, high-visibility reflective vests, safety goggles, heavy leather gloves, and steel-toe boots.',
      position: { x: -6.5, y: 1.0, z: 4.5 },
      dimensions: { x: 2.0, y: 2.2, z: 1.0 },
      interactable: true,
      actionHint: 'Tap to inspect and equip mandatory mining PPE items',
      highlightColor: '#10b981'
    },
    {
      id: 'obj_elec_panel',
      type: 'ELECTRICAL_PANEL',
      title: 'Main Feed Electrical Disconnect Panel',
      description: 'Lockable 3-phase rotary switchboard for primary plant energy isolation.',
      position: { x: -4.5, y: 1.2, z: -3.5 },
      dimensions: { x: 1.2, y: 2.4, z: 0.8 },
      interactable: true,
      actionHint: 'Tap to initiate Lockout/Tagout (LOTO) energy isolation sequence',
      highlightColor: '#f59e0b'
    },
    {
      id: 'obj_machine',
      type: 'MACHINE',
      title: 'Heavy Ore Crusher & Conveyor',
      description: 'Industrial heavy mechanical crusher with integrated emergency trip wire.',
      position: { x: 3.5, y: 1.5, z: -2.0 },
      dimensions: { x: 3.0, y: 2.5, z: 4.0 },
      interactable: true,
      actionHint: 'Tap to inspect machine status and verify mechanical shutdown',
      highlightColor: '#f97316'
    },
    {
      id: 'obj_estop',
      type: 'EMERGENCY_STOP',
      title: 'Emergency Stop Mushroom Switch (E-Stop)',
      description: 'High-visibility red push button wired to instantaneous master shunt trip.',
      position: { x: 1.2, y: 1.2, z: -0.5 },
      dimensions: { x: 0.5, y: 1.2, z: 0.5 },
      interactable: true,
      actionHint: 'Tap to depress Emergency Stop and trigger rapid plant shutdown',
      highlightColor: '#ef4444'
    },
    {
      id: 'obj_safe_zone',
      type: 'SAFE_ZONE',
      title: 'Designated Safe Working Walkway',
      description: 'Yellow-bordered non-slip walkway segregated from heavy equipment tracks.',
      position: { x: -2.0, y: 0.05, z: 3.0 },
      dimensions: { x: 3.5, y: 0.1, z: 6.0 },
      interactable: true,
      actionHint: 'Tap to position worker inside marked safe operational zone',
      highlightColor: '#22c55e'
    },
    {
      id: 'obj_assembly_point',
      type: 'ASSEMBLY_POINT',
      title: 'Emergency Evacuation Muster Point',
      description: 'Pressurized safety shelter and emergency headcount check-in beacon.',
      position: { x: 7.5, y: 1.0, z: 6.0 },
      dimensions: { x: 3.0, y: 2.5, z: 3.0 },
      interactable: true,
      actionHint: 'Tap to complete evacuation drill and register arrival at assembly shelter',
      highlightColor: '#06b6d4'
    }
  ]
};

export const ALL_SCENARIOS: Record<string, TrainingScenario> = {
  'mining-basic-scene': MINING_SAFETY_SCENARIO
};

export function getScenarioById(id: string): TrainingScenario | undefined {
  return ALL_SCENARIOS[id];
}
