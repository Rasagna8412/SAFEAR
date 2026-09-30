import { SupportedLanguage } from '../types/i18n';
import { TrainingStep, SafetyAction } from '../types/trainingEngine';

interface LocalizedStepContent {
  title: string;
  objective: string;
  description?: string;
  actions: Record<string, { title: string; description: string }>;
}

export const TRAINING_STEP_TRANSLATIONS: Record<SupportedLanguage, Record<string, LocalizedStepContent>> = {
  en: {
    step_01_ppe: {
      title: 'Mandatory PPE Verification',
      objective: 'Locate the PPE Station and equip hard hat, reflective high-visibility vest, safety goggles, and heavy-duty gloves.',
      actions: {
        act_equip_ppe: {
          title: 'Inspect & Equip Mandatory PPE Items',
          description: 'Thoroughly verify condition of hard hat, eye protection, and high-visibility vest before entry.'
        },
        act_bypass_ppe: {
          title: 'Enter Chamber Without Protective Gear',
          description: 'Bypass PPE checkpoint to quickly check mining machinery.'
        },
        act_inspect_machine_early: {
          title: 'Approach Ore Crusher First',
          description: 'Walk directly to heavy machinery before verifying personal protective equipment.'
        }
      }
    },
    step_02_identify_elec: {
      title: 'Hazard Identification: High-Voltage Electrical',
      objective: 'Identify and flag the exposed 415V secondary junction box on the main haulage substation panel.',
      actions: {
        act_select_elec_hazard: {
          title: 'Flag 415V Live Electrical Hazard',
          description: 'Tag exposed terminal junction as critical electrical danger requiring perimeter isolation.'
        },
        act_ignore_elec: {
          title: 'Ignore Warning Spark & Continue Walkway Inspection',
          description: 'Treat minor electrical arcing as normal mining background condition.'
        },
        act_touch_terminal: {
          title: 'Manually Touch Terminal to Test Voltage',
          description: 'Attempt physical check of bare conductors without insulated test equipment.'
        }
      }
    },
    step_03_loto_isolation: {
      title: '5-Step Lockout/Tagout (LOTO) Energy Isolation',
      objective: 'Execute full 5-Step Lockout/Tagout procedure on the Main Feed Electrical Disconnect Panel.',
      actions: {
        act_execute_loto: {
          title: 'Execute 5-Step LOTO Isolation Sequence',
          description: 'Notify -> Shut down -> Isolate energy -> Apply Lock & Tag -> Verify zero energy state.'
        },
        act_switch_off_only: {
          title: 'Flip Switch Off Without Padlock or Tag',
          description: 'Simply turn the rotary handle to OFF without attaching safety padlock and warning tag.'
        },
        act_pull_fuse_live: {
          title: 'Pull High-Voltage Fuse Under Active Load',
          description: 'Attempt manual extraction of secondary fuses while circuit is fully energized.'
        }
      }
    },
    step_04_rockfall_perimeter: {
      title: 'Overhead Rockfall Hazard Zone Perimeter',
      objective: 'Identify unsupported roof section and maintain mandatory safe distance beyond the hazard marker.',
      actions: {
        act_stand_back_rockfall: {
          title: 'Deploy Perimeter Warning & Stand Clear',
          description: 'Place warning stanchion and remain outside the 4.0m active vibration radius.'
        },
        act_walk_under_unsupported: {
          title: 'Walk Under Unsupported Excavation Face',
          description: 'Inspect rock bolts directly underneath loose fractured ceiling strata.'
        }
      }
    },
    step_05_machine_guarding: {
      title: 'Excavation Conveyor Pinch-Point Guarding',
      objective: 'Inspect active crusher feed conveyor and verify interlocked mechanical barrier guards.',
      actions: {
        act_verify_e_stop: {
          title: 'Verify Conveyor Guard & Test E-Stop',
          description: 'Check physical yellow guard mesh and verify pull-cord emergency stop line.'
        },
        act_reach_into_conveyor: {
          title: 'Reach Over Running Conveyor Belt',
          description: 'Manually remove rock obstruction while roller drive is in active motion.'
        }
      }
    },
    step_06_evacuation_muster: {
      title: 'Emergency Evacuation & Muster Protocol',
      objective: 'Locate designated green illuminated evacuation route and proceed to Primary Chamber Muster Point.',
      actions: {
        act_evacuate_muster: {
          title: 'Proceed to Primary Safety Muster Station',
          description: 'Follow illuminated photoluminescent signs to reinforced underground refuge chamber.'
        },
        act_run_to_unlit_drift: {
          title: 'Flee Toward Abandoned Ventilation Shaft',
          description: 'Rush down uninspected drift without checking emergency airflow indicators.'
        }
      }
    }
  },
  hi: {
    step_01_ppe: {
      title: 'अनिवार्य पीपीई (PPE) सत्यापन',
      objective: 'पीपीई स्टेशन पर जाएं और हेलमेट, रिफ्लेक्टिव वेस्ट, सुरक्षा चश्मा और भारी दस्ताने पहनें।',
      actions: {
        act_equip_ppe: {
          title: 'अनिवार्य पीपीई आइटम की जांच करें और पहनें',
          description: 'प्रवेश करने से पहले हेलमेट, आंखों की सुरक्षा और हाई-विजिबिलिटी वेस्ट की स्थिति जांचें।'
        },
        act_bypass_ppe: {
          title: 'सुरक्षा गियर के बिना कक्ष में प्रवेश करें',
          description: 'मशीनरी की जांच करने के लिए पीपीई चेकपॉइंट को छोड़ें।'
        },
        act_inspect_machine_early: {
          title: 'पहले अयस्क कोल्हू के पास जाएं',
          description: 'व्यक्तिगत सुरक्षा उपकरण सत्यापित करने से पहले सीधे भारी मशीनरी के पास जाएं।'
        }
      }
    },
    step_02_identify_elec: {
      title: 'खतरे की पहचान: उच्च-वोल्टेज विद्युत',
      objective: 'मुख्य सबस्टेशन पैनल पर खुले हुए 415V सेकेंडरी जंक्शन बॉक्स को पहचानें और चिह्नित करें।',
      actions: {
        act_select_elec_hazard: {
          title: '415V लाइव विद्युत खतरे को चिह्नित करें',
          description: 'खुले टर्मिनल को गंभीर विद्युत खतरे के रूप में टैग करें जिसे आइसोलेशन की आवश्यकता है।'
        },
        act_ignore_elec: {
          title: 'चेतावनी चिंगारी को अनदेखा करें और आगे बढ़ें',
          description: 'विद्युत चिंगारी को सामान्य खनन स्थिति मानकर अनदेखा करें।'
        },
        act_touch_terminal: {
          title: 'वोल्टेज का परीक्षण करने के लिए टर्मिनल को छुएं',
          description: 'बिना इंसुलेटेड उपकरणों के नंगे तारों को हाथ से छूने का प्रयास करें।'
        }
      }
    },
    step_03_loto_isolation: {
      title: '5-चरणीय लॉकआउट/टैगआउट (LOTO) ऊर्जा पृथक्करण',
      objective: 'मुख्य विद्युत डिस्कनेक्ट पैनल पर पूर्ण 5-चरणीय लॉकआउट/टैगआउट प्रक्रिया निष्पादित करें।',
      actions: {
        act_execute_loto: {
          title: '5-चरणीय LOTO आइसोलेशन अनुक्रम निष्पादित करें',
          description: 'सूचित करें -> बंद करें -> ऊर्जा अलग करें -> लॉक और टैग लगाएं -> शून्य ऊर्जा की पुष्टि करें।'
        },
        act_switch_off_only: {
          title: 'बिना ताला या टैग के स्विच बंद करें',
          description: 'सुरक्षा ताला और चेतावनी टैग लगाए बिना केवल रोटरी हैंडल को OFF करें।'
        },
        act_pull_fuse_live: {
          title: 'सक्रिय लोड के तहत उच्च-वोल्टेज फ्यूज खींचें',
          description: 'सर्किट चालू होने के दौरान मैन्युअल रूप से फ्यूज निकालने का प्रयास करें।'
        }
      }
    },
    step_04_rockfall_perimeter: {
      title: 'चट्टान गिरने का खतरा क्षेत्र परिधि',
      objective: 'असुरक्षित छत वाले हिस्से की पहचान करें और खतरे के निशान से अनिवार्य सुरक्षित दूरी बनाए रखें।',
      actions: {
        act_stand_back_rockfall: {
          title: 'चेतावनी बैरियर लगाएं और दूर रहें',
          description: 'चेतावनी बोर्ड लगाएं और 4.0 मीटर सक्रिय कंपन त्रिज्या के बाहर रहें।'
        },
        act_walk_under_unsupported: {
          title: 'असुरक्षित छत के नीचे चलें',
          description: 'ढीली छत के ठीक नीचे रॉक बोल्ट का निरीक्षण करें।'
        }
      }
    },
    step_05_machine_guarding: {
      title: 'उत्खनन कन्वेयर पिंच-पॉइंट सुरक्षा गार्ड',
      objective: 'सक्रिय क्रशर कन्वेयर का निरीक्षण करें और मैकेनिकल बैरियर गार्ड की पुष्टि करें।',
      actions: {
        act_verify_e_stop: {
          title: 'कन्वेयर गार्ड जांचें और ई-स्टॉप का परीक्षण करें',
          description: 'पीली जालीदार गार्ड की जांच करें और आपातकालीन स्टॉप कॉर्ड का परीक्षण करें।'
        },
        act_reach_into_conveyor: {
          title: 'चलती कन्वेयर बेल्ट में हाथ डालें',
          description: 'रोलर गति में होने के दौरान हाथ से पत्थर की रुकावट हटाने का प्रयास करें।'
        }
      }
    },
    step_06_evacuation_muster: {
      title: 'आपातकालीन निकासी और मस्टर प्रोटोकॉल',
      objective: 'हरे रंग के आपातकालीन निकासी मार्ग का पता लगाएं और प्राथमिक मस्टर पॉइंट की ओर बढ़ें।',
      actions: {
        act_evacuate_muster: {
          title: 'प्राथमिक सुरक्षा मस्टर स्टेशन की ओर बढ़ें',
          description: 'भूमिगत शरण कक्ष तक पहुंचने के लिए प्रकाशमान संकेतों का पालन करें।'
        },
        act_run_to_unlit_drift: {
          title: 'अंधेरी वेंटिलेशन शाफ्ट की ओर भागें',
          description: 'आपातकालीन वायु प्रवाह की जांच किए बिना अनिरीक्षित रास्ते में भागें।'
        }
      }
    }
  },
  sat: {
    step_01_ppe: {
      title: 'ᱡᱟᱹᱨᱩᱲᱟᱱ PPE ᱡᱟᱸᱪ (Mandatory PPE)',
      objective: 'PPE ᱥᱴᱮᱥᱚᱱ ᱥᱮᱱ ᱠᱟᱛᱮ ᱦᱮᱞᱢᱮᱴ, ᱨᱤᱯᱷᱞᱮᱠᱴᱤᱵᱷ ᱵᱷᱮᱥᱴ, ᱪᱚᱥᱢᱟ ᱟᱨ ᱡᱩᱛᱟᱹ ᱦᱚᱨᱚᱜ ᱢᱮ᱾',
      actions: {
        act_equip_ppe: {
          title: 'PPE ᱡᱤᱱᱤᱥ ᱠᱚ ᱡᱟᱸᱪ ᱠᱟᱛᱮ ᱦᱚᱨᱚᱜ ᱢᱮ',
          description: 'ᱠᱷᱟᱫᱟᱱ ᱵᱚᱞᱚᱱ ᱢᱟᱲᱟᱝ ᱨᱮ ᱦᱮᱞᱢᱮᱴ ᱟᱨ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱟᱢᱟᱱ ᱴᱷᱤᱠ ᱛᱮ ᱧᱮᱞ ᱢᱮ᱾'
        },
        act_bypass_ppe: {
          title: 'PPE ᱵᱮᱜᱚᱨ ᱵᱚᱞᱚᱱ',
          description: 'ᱞᱚᱜᱚᱱ ᱠᱟᱹᱢᱤ ᱧᱮᱞ ᱞᱟᱹᱜᱤᱫ PPE ᱵᱟᱝ ᱦᱚᱨᱚᱜ ᱠᱟᱛᱮ ᱵᱚᱞᱚᱱ᱾'
        },
        act_inspect_machine_early: {
          title: 'ᱢᱟᱲᱟᱝ ᱢᱮᱥᱤᱱ ᱥᱩᱨ ᱥᱮᱱᱚᱜ',
          description: 'PPE ᱵᱟᱝ ᱡᱟᱸᱪ ᱠᱟᱛᱮ ᱵᱷᱟᱹᱨᱤ ᱢᱮᱥᱤᱱ ᱥᱩᱨ ᱪᱟᱞᱟᱣ᱾'
        }
      }
    },
    step_02_identify_elec: {
      title: 'ᱵᱚᱛᱚᱨᱟᱱ ᱴᱷᱟᱶ: 415V ᱵᱤᱡᱽᱞᱤ ᱵᱚᱛᱚᱨ',
      objective: 'ᱢᱩᱬᱩᱛ ᱯᱮᱱᱮᱞ ᱨᱮ 415V ᱵᱤᱡᱽᱞᱤ ᱡᱟᱸᱠᱥᱚᱱ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ᱾',
      actions: {
        act_select_elec_hazard: {
          title: '415V ᱵᱤᱡᱽᱞᱤ ᱵᱚᱛᱚᱨ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ',
          description: 'ᱡᱷᱤᱡ ᱛᱟᱨ ᱠᱚ ᱵᱚᱛᱚᱨᱟᱱ ᱴᱷᱟᱶ ᱞᱮᱠᱟᱛᱮ ᱪᱤᱱᱦᱟᱹᱣ ᱢᱮ᱾'
        },
        act_ignore_elec: {
          title: 'ᱵᱤᱡᱽᱞᱤ ᱪᱤᱝᱜᱟᱹᱨᱤ ᱟᱲᱟᱜ ᱜᱤᱰᱤ',
          description: 'ᱵᱤᱡᱽᱞᱤ ᱥᱯᱟᱨᱠ ᱧᱮᱞ ᱠᱟᱛᱮ ᱦᱚᱸ ᱵᱟᱝ ᱫᱷᱮᱭᱟᱱ᱾'
        },
        act_touch_terminal: {
          title: 'ᱛᱤ ᱛᱮ ᱛᱟᱨ ᱡᱚᱴᱮᱫ',
          description: 'ᱵᱮᱜᱚᱨ ᱴᱩᱞᱥ ᱛᱮ ᱱᱟᱝᱜᱟ ᱛᱟᱨ ᱡᱚᱴᱮᱫ ᱨᱮᱱᱟᱜ ᱵᱷᱩᱞ ᱠᱟᱹᱢᱤ᱾'
        }
      }
    },
    step_03_loto_isolation: {
      title: '5-ᱫᱷᱟᱯ LOTO ᱵᱤᱡᱽᱞᱤ ᱵᱚᱸᱫᱽ (Energy Isolation)',
      objective: 'ᱢᱩᱬᱩᱛ ᱵᱤᱡᱽᱞᱤ ᱯᱮᱱᱮᱞ ᱨᱮ 5-ᱫᱷᱟᱯ LOTO ᱠᱟᱹᱢᱤᱦᱚᱨᱟ ᱯᱩᱨᱟᱹᱣ ᱢᱮ᱾',
      actions: {
        act_execute_loto: {
          title: '5-ᱫᱷᱟᱯ LOTO ᱠᱟᱹᱢᱤ ᱯᱩᱨᱟᱹᱣ ᱢᱮ',
          description: 'ᱞᱟᱹᱭ ᱢᱮ -> ᱵᱚᱸᱫᱽ ᱢᱮ -> ᱵᱤᱡᱽᱞᱤ ᱵᱷᱮᱜᱟᱨ -> ᱛᱟᱞᱟ ᱞᱟᱜᱟᱣ -> ᱡᱤᱨᱳ ᱯᱟᱣᱟᱨ ᱡᱟᱸᱪ᱾'
        },
        act_switch_off_only: {
          title: 'ᱵᱮᱜᱚᱨ ᱛᱟᱞᱟ ᱛᱮ ᱥᱩᱭᱤᱪ ᱵᱚᱸᱫᱽ',
          description: 'ᱛᱟᱞᱟ ᱟᱨ ᱴᱮᱜᱽ ᱵᱟᱝ ᱞᱟᱜᱟᱣ ᱠᱟᱛᱮ ᱥᱩᱢᱩᱝ ᱥᱩᱭᱤᱪ ᱚᱯᱷ᱾'
        },
        act_pull_fuse_live: {
          title: 'ᱪᱟᱹᱞᱩ ᱚᱠᱛᱚ ᱯᱷᱤᱭᱩᱡᱽ ᱚᱰᱚᱠ',
          description: 'ᱞᱟᱭᱤᱱ ᱪᱟᱹᱞᱩ ᱛᱟᱦᱮᱸᱱ ᱨᱮ ᱯᱷᱤᱭᱩᱡᱽ ᱚᱰᱚᱠ ᱨᱮᱱᱟᱜ ᱵᱚᱛᱚᱨᱟᱱ ᱠᱟᱹᱢᱤ᱾'
        }
      }
    },
    step_04_rockfall_perimeter: {
      title: 'ᱪᱮᱛᱟᱱ ᱠᱷᱚᱱ ᱫᱷᱤᱨᱤ ᱧᱩᱨᱩᱜ ᱵᱚᱛᱚᱨ ᱴᱷᱟᱶ',
      objective: 'ᱵᱟᱝ ᱴᱷᱟᱹᱣᱠᱟᱹ ᱪᱷᱟᱛ ᱪᱤᱱᱦᱟᱹᱣ ᱠᱟᱛᱮ ᱥᱟᱺᱜᱤᱧ ᱨᱮ ᱛᱟᱦᱮᱸᱱ ᱢᱮ᱾',
      actions: {
        act_stand_back_rockfall: {
          title: 'ᱵᱚᱛᱚᱨ ᱵᱳᱨᱰ ᱞᱟᱜᱟᱣ ᱟᱨ ᱥᱟᱺᱜᱤᱧ ᱛᱟᱦᱮᱸᱱ',
          description: '᱔ ᱢᱤᱴᱟᱨ ᱥᱟᱺᱜᱤᱧ ᱨᱮ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱛᱮ ᱛᱟᱦᱮᱸᱱ ᱢᱮ᱾'
        },
        act_walk_under_unsupported: {
          title: 'ᱵᱚᱛᱚᱨᱟᱱ ᱪᱷᱟᱛ ᱞᱟᱛᱟᱨ ᱛᱮ ᱛᱟᱲᱟᱢ',
          description: 'ᱧᱩᱨᱩᱜ ᱠᱟᱱ ᱪᱷᱟᱛ ᱞᱟᱛᱟᱨ ᱥᱮᱱᱚᱜ ᱨᱮᱱᱟᱜ ᱵᱷᱩᱞ ᱠᱟᱹᱢᱤ᱾'
        }
      }
    },
    step_05_machine_guarding: {
      title: 'ᱠᱷᱟᱫᱟᱱ ᱠᱚᱱᱵᱷᱮᱭᱟᱨ ᱯᱤᱧᱪ-ᱯᱚᱭᱮᱱᱴ ᱜᱟᱨᱰ',
      objective: 'ᱪᱟᱹᱞᱩ ᱢᱮᱥᱤᱱ ᱨᱮᱱᱟᱜ ᱡᱟᱹᱞᱤ ᱜᱟᱨᱰ ᱟᱨ ᱤ-ᱥᱴᱚᱯ ᱡᱟᱸᱪ ᱢᱮ᱾',
      actions: {
        act_verify_e_stop: {
          title: 'ᱜᱟᱨᱰ ᱟᱨ ᱮᱢᱟᱨᱡᱮᱱᱥᱤ ᱥᱴᱚᱯ ᱡᱟᱸᱪ',
          description: 'ᱥᱟᱥᱟᱝ ᱡᱟᱹᱞᱤ ᱜᱟᱨᱰ ᱟᱨ ᱫᱟᱹᱲᱤ ᱤ-ᱥᱴᱚᱯ ᱡᱟᱸᱪ ᱢᱮ᱾'
        },
        act_reach_into_conveyor: {
          title: 'ᱪᱟᱹᱞᱩ ᱵᱮᱞᱴ ᱨᱮ ᱛᱤ ᱟᱲᱟᱜ',
          description: 'ᱢᱮᱥᱤᱱ ᱪᱟᱹᱞᱩ ᱛᱟᱦᱮᱸᱱ ᱨᱮ ᱛᱤ ᱛᱮ ᱫᱷᱤᱨᱤ ᱚᱰᱚᱠ ᱨᱮᱱᱟᱜ ᱵᱚᱛᱚᱨᱟᱱ ᱠᱟᱹᱢᱤ᱾'
        }
      }
    },
    step_06_evacuation_muster: {
      title: 'ᱟᱯᱟᱛᱠᱟᱞᱤᱱ ᱚᱰᱚᱠ ᱟᱨ ᱥᱮᱞᱮᱫ ᱴᱷᱟᱶ (Evacuation)',
      objective: 'ᱦᱟᱹᱨᱭᱟᱹᱲ ᱟᱯᱟᱛᱠᱟᱞᱤᱱ ᱪᱤᱱᱦᱟᱹ ᱧᱮᱞ ᱠᱟᱛᱮ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱴᱷᱟᱶ ᱪᱟᱞᱟᱣ ᱢᱮ᱾',
      actions: {
        act_evacuate_muster: {
          title: 'ᱨᱩᱠᱷᱤᱭᱟᱹ ᱥᱮᱞᱮᱫ ᱴᱷᱟᱶ ᱛᱮ ᱥᱮᱱᱚᱜ',
          description: 'ᱠᱷᱟᱫᱟᱱ ᱵᱷᱤᱛᱨᱤ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱪᱮᱢᱵᱚᱨ ᱛᱮ ᱥᱮᱱᱚᱜ ᱢᱮ᱾'
        },
        act_run_to_unlit_drift: {
          title: 'ᱟᱸᱫᱷᱟᱨ ᱨᱟᱥᱛᱟ ᱛᱮ ᱫᱟᱹᱲ',
          description: 'ᱦᱚᱭ ᱵᱟᱝ ᱧᱮᱞ ᱠᱟᱛᱮ ᱵᱚᱛᱚᱨᱟᱱ ᱰᱟᱦᱟᱨ ᱛᱮ ᱫᱟᱹᱲ᱾'
        }
      }
    }
  },
  ta: {
    step_01_ppe: {
      title: 'கட்டாய PPE சரிபார்ப்பு',
      objective: 'PPE நிலையத்தைக் கண்டறிந்து ஹெல்மெட், பார்வை ஆடை, பாதுகாப்பு கண்ணாடிகள் அணியவும்.',
      actions: {
        act_equip_ppe: {
          title: 'கட்டாய PPE பொருட்களை சரிபார்த்து அணியவும்',
          description: 'நுழைவதற்கு முன் பாதுகாப்பு சாதனங்களின் நிலையை முழுமையாக சரிபார்க்கவும்.'
        },
        act_bypass_ppe: {
          title: 'பாதுகாப்பு சாதனங்கள் இல்லாமல் நுழையவும்',
          description: 'இயந்திரங்களை விரைவாக சரிபார்க்க PPE நிலையத்தை தவிர்க்கவும்.'
        },
        act_inspect_machine_early: {
          title: 'முதலில் தாது நொறுக்கி இயந்திரத்தை அணுகவும்',
          description: 'பாதுகாப்பு உபகரணங்களை சரிபார்க்கும் முன் கனரக இயந்திரங்களை அணுகவும்.'
        }
      }
    },
    step_02_identify_elec: {
      title: 'ஆபத்து அடையாளம்: உயர் மின்னழுத்தம்',
      objective: 'முக்கிய மின் பேனலில் வெளிப்படும் 415V மின் பெட்டியைக் கண்டறிந்து குறிக்கவும்.',
      actions: {
        act_select_elec_hazard: {
          title: '415V மின் ஆபத்தைக் குறிக்கவும்',
          description: 'வெளிப்படும் முனையத்தை முக்கியமான மின் ஆபத்தாகக் குறிக்கவும்.'
        },
        act_ignore_elec: {
          title: 'எச்சரிக்கை தீப்பொறியை புறக்கணித்து தொடரவும்',
          description: 'மின் தீப்பொறியை இயல்பான நிலை என்று புறக்கணிக்கவும்.'
        },
        act_touch_terminal: {
          title: 'மின்னழுத்தத்தை சோதிக்க முனையத்தைத் தொடவும்',
          description: 'காப்பிடப்படாத உபகரணங்கள் இல்லாமல் கம்பிகளைத் தொட முயற்சிக்கவும்.'
        }
      }
    },
    step_03_loto_isolation: {
      title: '5-படி லாக்அவுட்/டேக்அவுட் (LOTO) மின் தனிமைப்படுத்தல்',
      objective: 'முக்கிய மின் துண்டிப்பு பேனலில் முழு 5-படி LOTO நடைமுறையை செயல்படுத்தவும்.',
      actions: {
        act_execute_loto: {
          title: '5-படி LOTO வரிசையை செயல்படுத்தவும்',
          description: 'அறிவிக்கவும் -> அணைக்கவும் -> மின்சாரத்தை தனிமைப்படுத்தவும் -> பூட்டவும் -> பூஜ்ஜிய நிலையை சரிபார்க்கவும்.'
        },
        act_switch_off_only: {
          title: 'பூட்டு இல்லாமல் சுவிட்சை மட்டும் அணைக்கவும்',
          description: 'பூட்டு மற்றும் எச்சரிக்கை அட்டை இல்லாமல் சுவிட்சை மட்டும் OFF செய்யவும்.'
        },
        act_pull_fuse_live: {
          title: 'மின்சாரம் இருக்கும் போது உருகியை இழுக்கவும்',
          description: 'மின்சுற்று இயங்கும் போது உருகியை கைமுறையாக எடுக்க முயற்சிக்கவும்.'
        }
      }
    },
    step_04_rockfall_perimeter: {
      title: 'பாறை வீழ்ச்சி ஆபத்து மண்டல எல்லை',
      objective: 'ஆதரவற்ற கூரை பகுதியை அடையாளம் கண்டு பாதுகாப்பான தூரத்தை பராமரிக்கவும்.',
      actions: {
        act_stand_back_rockfall: {
          title: 'எல்லை எச்சரிக்கையை அமைத்து விலகி நிற்கவும்',
          description: 'எச்சரிக்கை பலகையை அமைத்து 4.0 மீ சுற்றளவுக்கு வெளியே நிற்கவும்.'
        },
        act_walk_under_unsupported: {
          title: 'ஆதரவற்ற கூரையின் கீழ் நடக்கவும்',
          description: 'தளர்வான கூரைக்கு நேராக அடியில் பாறை போல்ட்களை ஆய்வு செய்யவும்.'
        }
      }
    },
    step_05_machine_guarding: {
      title: 'கன்வேயர் பாதுகாப்பு கவசங்கள்',
      objective: 'இயங்கும் நொறுக்கி கன்வேயரை ஆய்வு செய்து பாதுகாப்பு கவசங்களை சரிபார்க்கவும்.',
      actions: {
        act_verify_e_stop: {
          title: 'கன்வேயர் கவசத்தை சரிபார்த்து E-Stop ஐ சோதிக்கவும்',
          description: 'பாதுகாப்பு வலையை சரிபார்த்து அவசரகால நிறுத்த கயிற்றை சோதிக்கவும்.'
        },
        act_reach_into_conveyor: {
          title: 'இயங்கும் கன்வேயர் பெல்ட்டுக்குள் கையை வைக்கவும்',
          description: 'ரோலர் இயங்கும் போது கைகளால் பாறை அடைப்பை அகற்ற முயற்சிக்கவும்.'
        }
      }
    },
    step_06_evacuation_muster: {
      title: 'அவசரகால வெளியேற்றம் மற்றும் பாதுகாப்பு மையம்',
      objective: 'பச்சை நிற அவசரகால வெளியேற்ற வழியைக் கண்டறிந்து பாதுகாப்பு அறைக்குச் செல்லவும்.',
      actions: {
        act_evacuate_muster: {
          title: 'முதன்மையான பாதுகாப்பு மையத்திற்குச் செல்லவும்',
          description: 'சுரங்க பாதுகாப்பு அடைக்கல அறைக்கு செல்ல ஒளிரும் பலகைகளைப் பின்பற்றவும்.'
        },
        act_run_to_unlit_drift: {
          title: 'இருண்ட காற்றோட்ட தண்டு நோக்கி ஓடவும்',
          description: 'காற்றோட்டத்தை சரிபார்க்காமல் ஆய்வு செய்யப்படாத பாதையில் ஓடவும்.'
        }
      }
    }
  }
};

/**
 * Returns localized title & objective for a training step
 */
export function getLocalizedStep(step: TrainingStep, language: SupportedLanguage): { title: string; objective: string } {
  const langDict = TRAINING_STEP_TRANSLATIONS[language] || TRAINING_STEP_TRANSLATIONS.en;
  const localized = langDict[step.id];
  if (localized) {
    return {
      title: localized.title,
      objective: localized.objective
    };
  }
  return {
    title: step.title,
    objective: step.objective
  };
}

/**
 * Returns localized title & description for a safety action
 */
export function getLocalizedAction(
  stepId: string,
  action: SafetyAction,
  language: SupportedLanguage
): { title: string; description: string } {
  const langDict = TRAINING_STEP_TRANSLATIONS[language] || TRAINING_STEP_TRANSLATIONS.en;
  const localizedStep = langDict[stepId];
  if (localizedStep && localizedStep.actions && localizedStep.actions[action.id]) {
    return localizedStep.actions[action.id];
  }
  return {
    title: action.title,
    description: action.description
  };
}
