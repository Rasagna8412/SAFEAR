import { TrainingStep } from '../../types/trainingEngine';

export const MINING_TRAINING_STEPS: TrainingStep[] = [
  {
    id: 'step_01_ppe',
    stepNumber: 1,
    title: 'Mandatory PPE Verification',
    description: 'Before entering the excavation chamber, all personnel must inspect and verify standard mandatory safety equipment.',
    objective: 'Locate the PPE Station and equip hard hat, reflective high-visibility vest, safety goggles, and heavy-duty gloves.',
    targetObjectId: 'obj_ppe_station',
    requiredActionId: 'act_equip_ppe',
    allowedActions: [
      {
        id: 'act_equip_ppe',
        title: 'Inspect & Equip Mandatory PPE Items',
        description: 'Thoroughly verify condition of hard hat, eye protection, and high-visibility vest before entry.',
        actionType: 'EQUIP_PPE',
        isSafe: true,
        targetObjectId: 'obj_ppe_station'
      },
      {
        id: 'act_bypass_ppe',
        title: 'Enter Chamber Without Protective Gear',
        description: 'Bypass PPE checkpoint to quickly check mining machinery.',
        actionType: 'UNSAFE_ACTION',
        isSafe: false
      },
      {
        id: 'act_inspect_machine_early',
        title: 'Approach Ore Crusher First',
        description: 'Walk directly to heavy machinery before verifying personal protective equipment.',
        actionType: 'INSPECT',
        isSafe: false
      }
    ],
    successMessage: 'Correct safety action. Mandatory PPE verified and equipped.',
    failureMessage: 'Incorrect action. You must verify and equip PPE before accessing the facility.',
    unsafeMessage: 'Unsafe action! Entering an active mining excavation without PPE violates critical safety regulations.',
    explanation: 'Mandatory PPE is the primary defense line against falling rock fragments, low-light collisions, and flying debris.'
  },
  {
    id: 'step_02_identify_elec',
    stepNumber: 2,
    title: 'Hazard Identification: High-Voltage Electrical',
    description: 'Inspect the primary power distribution area for exposed electrical hazards and compromised insulation.',
    objective: 'Identify and flag the exposed 415V secondary junction box on the main haulage substation panel.',
    targetHazardId: 'hazard_elec_01',
    requiredActionId: 'act_select_elec_hazard',
    allowedActions: [
      {
        id: 'act_select_elec_hazard',
        title: 'Flag 415V Live Electrical Hazard',
        description: 'Tag exposed terminal junction as critical electrical danger requiring perimeter isolation.',
        actionType: 'INSPECT',
        isSafe: true,
        targetHazardId: 'hazard_elec_01'
      },
      {
        id: 'act_ignore_elec',
        title: 'Ignore Warning Spark & Continue Walkway Inspection',
        description: 'Treat minor electrical arcing as normal mining background condition.',
        actionType: 'UNSAFE_ACTION',
        isSafe: false
      },
      {
        id: 'act_touch_terminal',
        title: 'Manually Touch Terminal to Test Voltage',
        description: 'Attempt physical check of bare conductors without insulated test equipment.',
        actionType: 'UNSAFE_ACTION',
        isSafe: false
      }
    ],
    successMessage: 'Correct hazard identified. High-voltage 415V hazard tagged for isolation.',
    failureMessage: 'That is not the target hazard for this inspection step. Look for exposed electrical junctions.',
    unsafeMessage: 'Unsafe action! Never approach or touch unverified electrical conductors.',
    explanation: '415V three-phase electrical circuits carry lethal arc-flash energy capable of causing severe trauma.'
  },
  {
    id: 'step_03_loto_isolation',
    stepNumber: 3,
    title: '5-Step Lockout/Tagout (LOTO) Energy Isolation',
    description: 'Before performing maintenance or hazard remediation, electrical energy must be de-energized, locked, and tagged.',
    objective: 'Execute full 5-Step Lockout/Tagout procedure on the Main Feed Electrical Disconnect Panel.',
    targetObjectId: 'obj_elec_panel',
    requiredActionId: 'act_execute_loto',
    allowedActions: [
      {
        id: 'act_execute_loto',
        title: 'Execute 5-Step LOTO Isolation Sequence',
        description: 'Notify -> Shut down -> Isolate energy -> Apply Lock & Tag -> Verify zero energy state.',
        actionType: 'ISOLATE_LOTO',
        isSafe: true,
        targetObjectId: 'obj_elec_panel'
      },
      {
        id: 'act_switch_off_only',
        title: 'Flip Switch Off Without Padlock or Tag',
        description: 'Simply turn the rotary handle to OFF without attaching safety padlock and warning tag.',
        actionType: 'INSPECT',
        isSafe: true
      },
      {
        id: 'act_work_live',
        title: 'Begin Wire Adjustment While Circuit is Energized',
        description: 'Perform quick adjustment while machine continues operation.',
        actionType: 'UNSAFE_ACTION',
        isSafe: false
      }
    ],
    successMessage: 'Correct safety action. 5-step LOTO isolation verified with zero stored electrical energy.',
    failureMessage: 'Incomplete procedure. Turning a switch off without Lockout/Tagout leaves equipment vulnerable to accidental re-energization.',
    unsafeMessage: 'Unsafe action! Attempting maintenance on energized equipment creates immediate electrocution hazard.',
    explanation: 'Lockout/Tagout ensures that only the authorized worker holds the key to re-energizing the circuit.'
  },
  {
    id: 'step_04_perimeter_isolation',
    stepNumber: 4,
    title: 'Machinery Safe Working Perimeter',
    description: 'Heavy continuous crushing conveyors have powerful rotating pinch points that can draw in clothing and limbs.',
    objective: 'Establish and verify a minimum 2.5m safe perimeter and segregate worker walkway from rotating pinch points.',
    targetHazardId: 'hazard_machinery_02',
    requiredActionId: 'act_set_safe_perimeter',
    allowedActions: [
      {
        id: 'act_set_safe_perimeter',
        title: 'Establish 2.5m Barricade & Stand in Safe Walkway',
        description: 'Position safety barrier and operate strictly inside yellow-bordered designated walkway.',
        actionType: 'SET_PERIMETER',
        isSafe: true,
        targetObjectId: 'obj_safe_zone'
      },
      {
        id: 'act_reach_into_roller',
        title: 'Reach Across Active Rollers to Clear Trapped Rock',
        description: 'Use bare hands to pull lodged stone while conveyor rollers are rotating.',
        actionType: 'UNSAFE_ACTION',
        isSafe: false
      },
      {
        id: 'act_lean_on_guard',
        title: 'Lean Over Machine Guarding Rail',
        description: 'Rest against mechanical barrier while looking into crushing chamber.',
        actionType: 'UNSAFE_ACTION',
        isSafe: false
      }
    ],
    successMessage: 'Correct safety action. Safe working perimeter verified and walkway clearance maintained.',
    failureMessage: 'That action does not maintain the required safety perimeter.',
    unsafeMessage: 'Unsafe action! Reaching into active mechanical pinch points causes severe crushing injuries.',
    explanation: 'Mechanical pinch points generate tons of drawing force that cannot be resisted manually.'
  },
  {
    id: 'step_05_estop_check',
    stepNumber: 5,
    title: 'Emergency Stop (E-Stop) Response Drill',
    description: 'Verify the physical location and operational readiness of the rapid mushroom emergency shutoff button.',
    objective: 'Inspect and test the emergency stop mechanism to ensure immediate shunt trip responsiveness.',
    targetObjectId: 'obj_estop',
    requiredActionId: 'act_test_estop',
    allowedActions: [
      {
        id: 'act_test_estop',
        title: 'Depress Mushroom E-Stop Button',
        description: 'Activate Emergency Stop to verify instantaneous mechanical trip and power disconnection.',
        actionType: 'TRIGGER_ESTOP',
        isSafe: true,
        targetObjectId: 'obj_estop'
      },
      {
        id: 'act_block_estop',
        title: 'Place Tool Bag in Front of E-Stop Pillar',
        description: 'Obstruct emergency shutoff access with temporary equipment.',
        actionType: 'UNSAFE_ACTION',
        isSafe: false
      },
      {
        id: 'act_ignore_estop',
        title: 'Bypass E-Stop Verification',
        description: 'Assume emergency controls are functioning without performing diagnostic test.',
        actionType: 'INSPECT',
        isSafe: false
      }
    ],
    successMessage: 'Correct safety action. Emergency Stop response verified and all machine drives tripped.',
    failureMessage: 'Incorrect action. You must test the emergency stop switch to verify plant shutdown.',
    unsafeMessage: 'Unsafe action! Obstructing or bypassing emergency controls creates extreme catastrophic risk.',
    explanation: 'E-Stop switches provide a fail-safe hardwired trip directly cutting master contactor power.'
  },
  {
    id: 'step_06_evacuation_muster',
    stepNumber: 6,
    title: 'Emergency Evacuation & Muster Check-In',
    description: 'Upon emergency siren escalation or gas leak detection, workers must rapidly evacuate to designated shelter points.',
    objective: 'Navigate through primary evacuation route and check in at the cyan Emergency Muster Point shelter.',
    targetObjectId: 'obj_assembly_point',
    requiredActionId: 'act_evacuate_muster',
    allowedActions: [
      {
        id: 'act_evacuate_muster',
        title: 'Evacuate to Cyan Emergency Muster Shelter',
        description: 'Follow illuminated green exit path to pressurized assembly point and register headcount.',
        actionType: 'EVACUATE',
        isSafe: true,
        targetObjectId: 'obj_assembly_point'
      },
      {
        id: 'act_stay_in_tunnel',
        title: 'Remain in Excavation Tunnel to Collect Tools',
        description: 'Delay evacuation to pack personal belongings and handheld tools.',
        actionType: 'UNSAFE_ACTION',
        isSafe: false
      },
      {
        id: 'act_reenter_blast_zone',
        title: 'Re-enter Chamber During Active Alarm',
        description: 'Turn around to check on unattended machinery during evacuation alert.',
        actionType: 'UNSAFE_ACTION',
        isSafe: false
      }
    ],
    successMessage: 'Correct safety action. Evacuation completed and worker arrival registered at assembly muster point.',
    failureMessage: 'Incorrect evacuation procedure. Headcount check-in at the muster point is mandatory.',
    unsafeMessage: 'Unsafe action! Never delay evacuation or re-enter a hazardous chamber during an active emergency alarm.',
    explanation: 'Rapid evacuation and accurate muster accounting prevent casualties and assist emergency rescue teams.'
  }
];
