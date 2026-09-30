import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    # 16:9 Widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_slide_layout = prs.slide_layouts[6]

    # Colors definition
    NAVY_DARK = RGBColor(11, 25, 44)      # #0B192C Deep Navy
    SLATE_DARK = RGBColor(15, 23, 42)     # #0F172A
    CARD_BG = RGBColor(255, 255, 255)     # #FFFFFF
    BORDER_COLOR = RGBColor(203, 213, 225)# #CBD5E1 Slate 300
    AMBER = RGBColor(245, 158, 11)        # #F59E0B Safety Gold
    AMBER_DARK = RGBColor(217, 119, 6)    # #D97706
    CYAN = RGBColor(2, 132, 199)          # #0284C7 Sky Blue
    GREEN = RGBColor(16, 185, 129)        # #10B981 Emerald
    RED = RGBColor(220, 38, 38)           # #DC2626
    TEXT_DARK = RGBColor(15, 23, 42)      # #0F172A
    TEXT_MUTED = RGBColor(71, 85, 105)    # #475569
    WHITE = RGBColor(255, 255, 255)
    LIGHT_GRAY_BG = RGBColor(248, 250, 252) # #F8FAFC
    LIGHT_RED_BG = RGBColor(254, 242, 242)
    LIGHT_BLUE_BG = RGBColor(240, 249, 255)
    LIGHT_AMBER_BG = RGBColor(254, 243, 199)
    LIGHT_GREEN_BG = RGBColor(236, 253, 245)

    TOP_LOGO_PATH = os.path.abspath("sih_top_right_logo_trans.png")
    BULB_GRAPHIC_PATH = os.path.abspath("sih_bulb_graphic_trans.png")

    def add_header(slide, title_text, subtitle=None):
        # 1. Top-left Team Logo / Brand Box
        logo_box = slide.shapes.add_textbox(Inches(0.4), Inches(0.18), Inches(3.2), Inches(0.75))
        tf = logo_box.text_frame
        tf.word_wrap = True
        tf.margin_top = Inches(0)
        tf.margin_bottom = Inches(0)
        tf.margin_left = Inches(0)
        p = tf.paragraphs[0]
        p.text = "SafeAR"
        p.font.name = "Arial Black"
        p.font.size = Pt(22)
        p.font.bold = True
        p.font.color.rgb = NAVY_DARK

        p_sub = tf.add_paragraph()
        p_sub.text = "SHADOW STACK • VOCATIONAL SIMULATOR"
        p_sub.font.name = "Arial"
        p_sub.font.size = Pt(8.5)
        p_sub.font.bold = True
        p_sub.font.color.rgb = AMBER_DARK

        # 2. Top Center Title Box
        title_box = slide.shapes.add_textbox(Inches(3.3), Inches(0.18), Inches(7.2), Inches(0.75))
        tf_t = title_box.text_frame
        tf_t.word_wrap = True
        tf_t.margin_top = Inches(0)
        p_t = tf_t.paragraphs[0]
        p_t.text = title_text
        p_t.font.name = "Arial Black"
        p_t.font.size = Pt(17)
        p_t.font.bold = True
        p_t.font.color.rgb = NAVY_DARK
        p_t.alignment = PP_ALIGN.CENTER

        if subtitle:
            p_subt = tf_t.add_paragraph()
            p_subt.text = subtitle
            p_subt.font.name = "Arial"
            p_subt.font.size = Pt(10)
            p_subt.font.bold = True
            p_subt.font.color.rgb = AMBER_DARK
            p_subt.alignment = PP_ALIGN.CENTER

        # 3. Top-Right EXACT Official SIH Logo Image from Reference PDF
        if os.path.exists(TOP_LOGO_PATH):
            slide.shapes.add_picture(TOP_LOGO_PATH, Inches(10.9), Inches(0.12), Inches(2.1), Inches(0.85))

    def add_footer(slide, slide_num):
        # Bottom dark blue bar
        footer_rect = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(7.1), Inches(13.333), Inches(0.4))
        footer_rect.fill.solid()
        footer_rect.fill.fore_color.rgb = NAVY_DARK
        footer_rect.line.fill.background()

        tb = slide.shapes.add_textbox(Inches(0.5), Inches(7.12), Inches(6.5), Inches(0.35))
        tf = tb.text_frame
        p = tf.paragraphs[0]
        p.text = "@ SHADOW STACK — SafeAR"
        p.font.name = "Arial"
        p.font.size = Pt(10.5)
        p.font.bold = True
        p.font.color.rgb = WHITE

        tb_num = slide.shapes.add_textbox(Inches(12.0), Inches(7.12), Inches(0.9), Inches(0.35))
        tf_num = tb_num.text_frame
        p_num = tf_num.paragraphs[0]
        p_num.text = str(slide_num)
        p_num.font.name = "Arial Black"
        p_num.font.size = Pt(12)
        p_num.font.bold = True
        p_num.font.color.rgb = WHITE
        p_num.alignment = PP_ALIGN.RIGHT

    # =========================================================================
    # SLIDE 1: TITLE PAGE (Exact Match to SIH 2025 Winning Template)
    # =========================================================================
    slide1 = prs.slides.add_slide(blank_slide_layout)

    # Top Brand Logo Left
    logo_b1 = slide1.shapes.add_textbox(Inches(0.6), Inches(0.35), Inches(4.0), Inches(1.0))
    tf1 = logo_b1.text_frame
    p1 = tf1.paragraphs[0]
    p1.text = "SafeAR"
    p1.font.name = "Arial Black"
    p1.font.size = Pt(36)
    p1.font.bold = True
    p1.font.color.rgb = NAVY_DARK
    p1_sub = tf1.add_paragraph()
    p1_sub.text = "Industrial Safety & Vocational Simulator"
    p1_sub.font.name = "Arial"
    p1_sub.font.size = Pt(11)
    p1_sub.font.bold = True
    p1_sub.font.color.rgb = AMBER_DARK

    # Top Right SIH Official Logo Image
    if os.path.exists(TOP_LOGO_PATH):
        slide1.shapes.add_picture(TOP_LOGO_PATH, Inches(10.7), Inches(0.2), Inches(2.2), Inches(0.95))

    # Main Title Bar
    title_bar = slide1.shapes.add_textbox(Inches(0.6), Inches(1.35), Inches(12.1), Inches(0.75))
    tf_tb = title_bar.text_frame
    p_tb = tf_tb.paragraphs[0]
    p_tb.text = "SMART INDIA HACKATHON 2026"
    p_tb.font.name = "Arial Black"
    p_tb.font.size = Pt(28)
    p_tb.font.bold = True
    p_tb.font.color.rgb = CYAN
    p_tb.alignment = PP_ALIGN.CENTER

    # Project Information Card Box (Left Side)
    card1 = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), Inches(2.2), Inches(7.8), Inches(4.6))
    card1.fill.solid()
    card1.fill.fore_color.rgb = LIGHT_GRAY_BG
    card1.line.color.rgb = BORDER_COLOR
    card1.line.width = Pt(1.5)

    info_box = slide1.shapes.add_textbox(Inches(0.85), Inches(2.3), Inches(7.3), Inches(4.4))
    tf_info = info_box.text_frame
    tf_info.word_wrap = True

    fields = [
        ("Problem Statement ID : ", "26041", NAVY_DARK),
        ("Problem Statement Title : ", "AR-Based Vocational Training Simulator for Industrial Safety in Jharkhand's Mining & Manufacturing Sector", NAVY_DARK),
        ("Organization : ", "Department of Higher & Technical Education, Government of Jharkhand", NAVY_DARK),
        ("Theme : ", "Smart Education (Vocational & Skill Training)", AMBER_DARK),
        ("Sub-Theme : ", "Blockchain & Cybersecurity (Tamper-Proof Verification)", GREEN),
        ("PS Category : ", "Software", NAVY_DARK),
        ("Team ID : ", "53476", NAVY_DARK),
        ("Team Name : ", "SHADOW STACK", NAVY_DARK)
    ]

    for i, (label, val, col) in enumerate(fields):
        p = tf_info.paragraphs[0] if i == 0 else tf_info.add_paragraph()
        p.space_after = Pt(8)
        run1 = p.add_run()
        run1.text = "• " + label
        run1.font.name = "Arial Black"
        run1.font.size = Pt(13)
        run1.font.bold = True
        run1.font.color.rgb = NAVY_DARK

        run2 = p.add_run()
        run2.text = val
        run2.font.name = "Arial"
        run2.font.size = Pt(13)
        run2.font.bold = True
        run2.font.color.rgb = col

    # Right Side EXACT SIH Lightbulb / Brain Motif Image from Reference PDF
    if os.path.exists(BULB_GRAPHIC_PATH):
        slide1.shapes.add_picture(BULB_GRAPHIC_PATH, Inches(8.7), Inches(2.1), Inches(4.1), Inches(4.7))

    add_footer(slide1, 1)

    # =========================================================================
    # SLIDE 2: THE SOLUTION (SafeAR Architecture & UVP)
    # =========================================================================
    slide2 = prs.slides.add_slide(blank_slide_layout)
    add_header(slide2, "SAFEAR", "(AI-Powered Semi-Offline AR Safety Training & Verifiable Certification)")

    # Innovation Tag below title
    inno_box = slide2.shapes.add_textbox(Inches(9.2), Inches(0.85), Inches(3.8), Inches(0.4))
    tf_in = inno_box.text_frame
    p_in = tf_in.paragraphs[0]
    p_in.text = "⭐ Innovation: WebAR + Regional Vernacular + .dat Edge DB"
    p_in.font.name = "Arial Black"
    p_in.font.size = Pt(8.5)
    p_in.font.color.rgb = AMBER_DARK
    p_in.alignment = PP_ALIGN.RIGHT

    # LEFT COLUMN: Problem Existing + Proposed Solution + UVP
    # 1. Problem Existing (Red Header Card)
    prob_card = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), Inches(1.15), Inches(6.8), Inches(1.65))
    prob_card.fill.solid()
    prob_card.fill.fore_color.rgb = LIGHT_RED_BG
    prob_card.line.color.rgb = RED
    prob_card.line.width = Pt(1.5)

    prob_tb = slide2.shapes.add_textbox(Inches(0.55), Inches(1.2), Inches(6.5), Inches(1.5))
    tf_p = prob_tb.text_frame
    tf_p.word_wrap = True
    p0 = tf_p.paragraphs[0]
    p0.text = "⚠️ PROBLEM EXISTING (Jharkhand Mining & Heavy Industry)"
    p0.font.name = "Arial Black"
    p0.font.size = Pt(10.5)
    p0.font.bold = True
    p0.font.color.rgb = RED

    probs = [
        ("High Mining Fatalities: ", "Theoretical classroom manuals fail to build real muscle-memory for gas leaks, roof falls, and LOTO drills."),
        ("Language & Literacy Barrier: ", "Tribal contract workers in Jharkhand struggle with English manuals; zero tools in Santali & Hindi."),
        ("Zero Underground Connectivity: ", "Remote underground collieries (Jharia, Dhanbad) have no internet; cloud-only simulators fail completely.")
    ]
    for lbl, desc in probs:
        p = tf_p.add_paragraph()
        p.space_after = Pt(2)
        r1 = p.add_run()
        r1.text = "➤ " + lbl
        r1.font.bold = True
        r1.font.size = Pt(9.5)
        r1.font.color.rgb = RED
        r2 = p.add_run()
        r2.text = desc
        r2.font.size = Pt(9)
        r2.font.color.rgb = TEXT_DARK

    # 2. Proposed Solution (Blue Header Card)
    sol_card = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), Inches(2.9), Inches(6.8), Inches(2.0))
    sol_card.fill.solid()
    sol_card.fill.fore_color.rgb = LIGHT_BLUE_BG
    sol_card.line.color.rgb = CYAN
    sol_card.line.width = Pt(1.5)

    sol_tb = slide2.shapes.add_textbox(Inches(0.55), Inches(2.95), Inches(6.5), Inches(1.9))
    tf_s = sol_tb.text_frame
    tf_s.word_wrap = True
    p0 = tf_s.paragraphs[0]
    p0.text = "💡 PROPOSED SOLUTION (SafeAR Platform)"
    p0.font.name = "Arial Black"
    p0.font.size = Pt(10.5)
    p0.font.bold = True
    p0.font.color.rgb = CYAN

    sols = [
        ("Headset-Free Android WebAR: ", "Runs directly on mid-range smartphones (Android 10+) in mobile browsers without ₹50,000 VR gear."),
        ("100% Vernacular Inclusivity: ", "Complete localized instruction in Santali (Ol Chiki/Latin) and Hindi across 100% of UI and 3D drills."),
        ("Semi-Offline Edge Database: ", "Preloaded packages run 100% offline in mine shafts; stores results in Merkle-hashed .dat database."),
        ("Tamper-Proof Blockchain Credentials: ", "NIST SHA-256 digests ensure fake certificates are mathematically impossible to forge.")
    ]
    for lbl, desc in sols:
        p = tf_s.add_paragraph()
        p.space_after = Pt(2)
        r1 = p.add_run()
        r1.text = "➤ " + lbl
        r1.font.bold = True
        r1.font.size = Pt(9.5)
        r1.font.color.rgb = CYAN
        r2 = p.add_run()
        r2.text = desc
        r2.font.size = Pt(9)
        r2.font.color.rgb = TEXT_DARK

    # 3. UVP (Amber Header Card)
    uvp_card = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), Inches(5.0), Inches(6.8), Inches(1.95))
    uvp_card.fill.solid()
    uvp_card.fill.fore_color.rgb = LIGHT_AMBER_BG
    uvp_card.line.color.rgb = AMBER_DARK
    uvp_card.line.width = Pt(1.5)

    uvp_tb = slide2.shapes.add_textbox(Inches(0.55), Inches(5.05), Inches(6.5), Inches(1.85))
    tf_u = uvp_tb.text_frame
    tf_u.word_wrap = True
    p0 = tf_u.paragraphs[0]
    p0.text = "⭐ UVP (UNIQUE VALUE PROPOSITION)"
    p0.font.name = "Arial Black"
    p0.font.size = Pt(10.5)
    p0.font.bold = True
    p0.font.color.rgb = AMBER_DARK

    uvps = [
        ("Competency Over Attendance: ", "Measures reaction times, safety sequence adherence, and PPE compliance—not just attendance."),
        ("Zero Infrastructure Cost: ", "Works on existing worker smartphones; 75% cheaper than physical mine training chambers."),
        ("Self-Contained .dat Snapshots: ", "Offline database import/export with instant cryptographic tamper alerts upon any modification."),
        ("Public QR Verification Portal: ", "DGMS inspectors verify compliance instantly at /verify without requiring credentials.")
    ]
    for lbl, desc in uvps:
        p = tf_u.add_paragraph()
        p.space_after = Pt(2)
        r1 = p.add_run()
        r1.text = "➤ " + lbl
        r1.font.bold = True
        r1.font.size = Pt(9.5)
        r1.font.color.rgb = AMBER_DARK
        r2 = p.add_run()
        r2.text = desc
        r2.font.size = Pt(9)
        r2.font.color.rgb = TEXT_DARK

    # RIGHT COLUMN: Architectural Diagram Box
    arch_card = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.4), Inches(1.15), Inches(5.5), Inches(5.8))
    arch_card.fill.solid()
    arch_card.fill.fore_color.rgb = WHITE
    arch_card.line.color.rgb = NAVY_DARK
    arch_card.line.width = Pt(1.5)

    arch_tb = slide2.shapes.add_textbox(Inches(7.5), Inches(1.2), Inches(5.3), Inches(0.45))
    tf_a = arch_tb.text_frame
    pa = tf_a.paragraphs[0]
    pa.text = "ARCHITECTURE & WORKFLOW"
    pa.font.name = "Arial Black"
    pa.font.size = Pt(12)
    pa.font.bold = True
    pa.font.color.rgb = NAVY_DARK
    pa.alignment = PP_ALIGN.CENTER

    steps = [
        ("1. USER ONBOARDING & ROLE AUTH", "Worker | Safety Trainer | Enterprise Admin (3 Portals)", LIGHT_GRAY_BG, NAVY_DARK),
        ("2. THREE OPERATIONAL MODES", "• Online (Classroom)  • Semi-Offline (Mine Shaft)  • Audit (DGMS)", LIGHT_BLUE_BG, CYAN),
        ("3. INTERACTIVE 3D SIMULATION ENGINE", "Three.js 60 FPS • LOTO 5-Step • Gas Hazard • PPE Audit", LIGHT_AMBER_BG, AMBER_DARK),
        ("4. ON-DEVICE AI ASSESSMENT & LOCAL DB", "Procedure Sequence Trail • NIST SHA-256 Digest • .dat Sealing", LIGHT_RED_BG, RED),
        ("5. SECURE SYNC & BLOCKCHAIN VERIFIER", "Ethereum On-Chain Minting • Public QR Code Verification (/verify)", LIGHT_GREEN_BG, GREEN)
    ]

    top_y = 1.7
    for title, desc, bg_c, border_c in steps:
        s_box = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.6), Inches(top_y), Inches(5.1), Inches(0.82))
        s_box.fill.solid()
        s_box.fill.fore_color.rgb = bg_c
        s_box.line.color.rgb = border_c
        s_box.line.width = Pt(1.2)

        stb = slide2.shapes.add_textbox(Inches(7.7), Inches(top_y + 0.04), Inches(4.9), Inches(0.74))
        tf_st = stb.text_frame
        tf_st.word_wrap = True
        p1 = tf_st.paragraphs[0]
        p1.text = title
        p1.font.name = "Arial Black"
        p1.font.size = Pt(9.5)
        p1.font.bold = True
        p1.font.color.rgb = border_c

        p2 = tf_st.add_paragraph()
        p2.text = desc
        p2.font.name = "Arial"
        p2.font.size = Pt(8.5)
        p2.font.color.rgb = TEXT_DARK
        top_y += 0.92

    std_box = slide2.shapes.add_textbox(Inches(7.5), Inches(6.35), Inches(5.3), Inches(0.45))
    tf_std = std_box.text_frame
    p_std = tf_std.paragraphs[0]
    p_std.text = "STANDARDS: NIST FIPS 180-4 • DGMS CMR 2017 • NEP 2020 TVET • ETHEREUM"
    p_std.font.name = "Arial Black"
    p_std.font.size = Pt(8.5)
    p_std.font.bold = True
    p_std.font.color.rgb = TEXT_MUTED
    p_std.alignment = PP_ALIGN.CENTER

    add_footer(slide2, 2)

    # =========================================================================
    # SLIDE 3: TECHNICAL APPROACH (Detailed Pipeline Flowchart & Tech Stack)
    # =========================================================================
    slide3 = prs.slides.add_slide(blank_slide_layout)
    add_header(slide3, "TECHNICAL APPROACH", "Edge-First Architecture: Train Offline in Deep Mines, Sync Securely to Blockchain")

    # Mode 1 Flowchart Box: SEMI-OFFLINE MODE (Left - Orange/Amber Theme)
    m1_card = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), Inches(1.05), Inches(4.1), Inches(4.55))
    m1_card.fill.solid()
    m1_card.fill.fore_color.rgb = LIGHT_AMBER_BG
    m1_card.line.color.rgb = AMBER_DARK
    m1_card.line.width = Pt(1.5)

    m1_tb = slide3.shapes.add_textbox(Inches(0.5), Inches(1.1), Inches(3.9), Inches(4.4))
    tf_m1 = m1_tb.text_frame
    tf_m1.word_wrap = True
    p = tf_m1.paragraphs[0]
    p.text = "⚡ MODE 1: SEMI-OFFLINE (Underground Mine)"
    p.font.name = "Arial Black"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = AMBER_DARK

    m1_steps = [
        ("Colliery Arrival", "Worker arrives at underground shaft (0% internet)."),
        ("Preloaded Packages", "Loads pre-cached 3D excavation chamber drill."),
        ("Interactive 3D AR", "WebGL Three.js simulation with hazard detection."),
        ("On-Device AI Grading", "Evaluates sequence, PPE selection & reaction times."),
        ("SHA-256 Digest", "Computes NIST FIPS 180-4 cryptographic hash."),
        ("Encrypted .dat DB", "Seals record in local edge storage with Merkle root."),
        ("Surface Sync", "Auto-queues & uploads once worker reaches surface.")
    ]
    for step, desc in m1_steps:
        p = tf_m1.add_paragraph()
        p.space_after = Pt(2)
        r1 = p.add_run()
        r1.text = "↓ " + step + ": "
        r1.font.bold = True
        r1.font.size = Pt(8.5)
        r1.font.color.rgb = AMBER_DARK
        r2 = p.add_run()
        r2.text = desc
        r2.font.size = Pt(8)
        r2.font.color.rgb = TEXT_DARK

    # Mode 2 Flowchart Box: ONLINE CLASSROOM MODE (Middle - Blue Theme)
    m2_card = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(4.7), Inches(1.05), Inches(3.9), Inches(4.55))
    m2_card.fill.solid()
    m2_card.fill.fore_color.rgb = LIGHT_BLUE_BG
    m2_card.line.color.rgb = CYAN
    m2_card.line.width = Pt(1.5)

    m2_tb = slide3.shapes.add_textbox(Inches(4.8), Inches(1.1), Inches(3.7), Inches(4.4))
    tf_m2 = m2_tb.text_frame
    tf_m2.word_wrap = True
    p = tf_m2.paragraphs[0]
    p.text = "🌐 MODE 2: ONLINE (Classroom / ITI Center)"
    p.font.name = "Arial Black"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = CYAN

    m2_steps = [
        ("Induction Login", "Worker or Trainer logs into SafeAR portal."),
        ("Curriculum Catalog", "Selects Mining Safety, LOTO, or Gas drills."),
        ("Language Selection", "1-Click switch to Santali, Hindi, English, Tamil."),
        ("3D Virtual Simulation", "Full audio HUD, emergency alarms & instructions."),
        ("Instant Evaluation", "Immediate 0-100% score calculation & feedback."),
        ("Cloud Sync & Minting", "Direct synchronization to Firebase & Ethereum."),
        ("Verified Certificate", "Issues verifiable certificate with embedded QR.")
    ]
    for step, desc in m2_steps:
        p = tf_m2.add_paragraph()
        p.space_after = Pt(2)
        r1 = p.add_run()
        r1.text = "↓ " + step + ": "
        r1.font.bold = True
        r1.font.size = Pt(8.5)
        r1.font.color.rgb = CYAN
        r2 = p.add_run()
        r2.text = desc
        r2.font.size = Pt(8)
        r2.font.color.rgb = TEXT_DARK

    # Mode 3 Flowchart Box: FIELD AUDIT & INSPECTOR (Right - Green Theme)
    m3_card = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.8), Inches(1.05), Inches(4.1), Inches(4.55))
    m3_card.fill.solid()
    m3_card.fill.fore_color.rgb = LIGHT_GREEN_BG
    m3_card.line.color.rgb = GREEN
    m3_card.line.width = Pt(1.5)

    m3_tb = slide3.shapes.add_textbox(Inches(8.9), Inches(1.1), Inches(3.9), Inches(4.4))
    tf_m3 = m3_tb.text_frame
    tf_m3.word_wrap = True
    p = tf_m3.paragraphs[0]
    p.text = "🛡️ MODE 3: FIELD AUDIT (DGMS Inspectors)"
    p.font.name = "Arial Black"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = GREEN

    m3_steps = [
        ("Gate Check", "Government/mine safety officer stops worker on site."),
        ("QR Code Scan", "Scans certificate QR code on worker ID or phone."),
        ("Public Verifier", "Opens /verify/:id with ZERO login requirement."),
        ("On-Chain Lookup", "Queries Ethereum smart contract transaction hash."),
        ("Merkle Root Check", "Compares SHA-256 certificate digest."),
        ("Authenticity Verified", "Displays VALID status, scores & training date."),
        ("Tamper Rejection", "Any forged score shows immediate INVALID flag.")
    ]
    for step, desc in m3_steps:
        p = tf_m3.add_paragraph()
        p.space_after = Pt(2)
        r1 = p.add_run()
        r1.text = "↓ " + step + ": "
        r1.font.bold = True
        r1.font.size = Pt(8.5)
        r1.font.color.rgb = GREEN
        r2 = p.add_run()
        r2.text = desc
        r2.font.size = Pt(8)
        r2.font.color.rgb = TEXT_DARK

    # Bottom Tech Stack Bar
    t_card = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), Inches(5.72), Inches(12.5), Inches(1.2))
    t_card.fill.solid()
    t_card.fill.fore_color.rgb = NAVY_DARK
    t_card.line.color.rgb = AMBER
    t_card.line.width = Pt(1.5)

    t_tb = slide3.shapes.add_textbox(Inches(0.6), Inches(5.75), Inches(12.1), Inches(1.1))
    tf_t = t_tb.text_frame
    tf_t.word_wrap = True
    p_th = tf_t.paragraphs[0]
    p_th.text = "💻 PRODUCTION TECHNOLOGY STACK & CRYPTOGRAPHIC STANDARDS"
    p_th.font.name = "Arial Black"
    p_th.font.size = Pt(10.5)
    p_th.font.bold = True
    p_th.font.color.rgb = AMBER
    p_th.alignment = PP_ALIGN.CENTER

    tech_specs = (
        "• Frontend & AR Engine: React 18, TypeScript, Three.js (WebGL 60 FPS), Tailwind CSS, Vite, Lucide Icons\n"
        "• Cryptography & Blockchain: NIST FIPS 180-4 SHA-256 Hashing, Merkle Root Verification, Ethers.js, EVM Smart Contracts\n"
        "• Persistence & Edge Storage: Encrypted .dat Binary Snapshots, LocalStorage Edge DB, Cloud Firestore with Offline Fallbacks"
    )
    p_ts = tf_t.add_paragraph()
    p_ts.text = tech_specs
    p_ts.font.name = "Arial"
    p_ts.font.size = Pt(9)
    p_ts.font.color.rgb = WHITE
    p_ts.alignment = PP_ALIGN.CENTER

    add_footer(slide3, 3)

    # =========================================================================
    # SLIDE 4: FEASIBILITY AND VIABILITY (Exact Layout to NIET Winning PPT)
    # =========================================================================
    slide4 = prs.slides.add_slide(blank_slide_layout)
    add_header(slide4, "FEASIBILITY AND VIABILITY", "Engineered for Resource-Constrained Workplaces & Scalable Multi-Site Deployment")

    # LEFT BOX: FEASIBILITY (Blue Frame)
    feas_card = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), Inches(1.05), Inches(6.1), Inches(3.55))
    feas_card.fill.solid()
    feas_card.fill.fore_color.rgb = WHITE
    feas_card.line.color.rgb = CYAN
    feas_card.line.width = Pt(1.5)

    feas_tb = slide4.shapes.add_textbox(Inches(0.55), Inches(1.1), Inches(5.8), Inches(3.4))
    tf_f = feas_tb.text_frame
    tf_f.word_wrap = True
    p = tf_f.paragraphs[0]
    p.text = "FEASIBILITY :"
    p.font.name = "Arial Black"
    p.font.size = Pt(12.5)
    p.font.bold = True
    p.font.color.rgb = CYAN

    feas_items = [
        ("Technical : ", "Proven stack (React 18 + Three.js + Ethers.js) optimized for low-end mobile devices (Android 10+); zero headset requirement; 100/100 automated test pass rate."),
        ("Data Compliance : ", "NIST FIPS 180-4 SHA-256 standard ensures tamper-proof passwords and mathematical certainty against forged certificates."),
        ("Operational : ", "Preloaded packages run 100% offline in mine shafts; workers launch drills in under 10 seconds; automatic surface synchronization."),
        ("Economic : ", "Uses existing worker smartphones; zero hardware acquisition costs; 75% cheaper than physical mine training chambers.")
    ]
    for lbl, desc in feas_items:
        p = tf_f.add_paragraph()
        p.space_after = Pt(4)
        r1 = p.add_run()
        r1.text = "• " + lbl
        r1.font.bold = True
        r1.font.size = Pt(9)
        r1.font.color.rgb = NAVY_DARK
        r2 = p.add_run()
        r2.text = desc
        r2.font.size = Pt(8.5)
        r2.font.color.rgb = TEXT_DARK

    # RIGHT BOX: VIABILITY (Green Frame)
    viab_card = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.05), Inches(6.1), Inches(3.55))
    viab_card.fill.solid()
    viab_card.fill.fore_color.rgb = WHITE
    viab_card.line.color.rgb = GREEN
    viab_card.line.width = Pt(1.5)

    viab_tb = slide4.shapes.add_textbox(Inches(6.95), Inches(1.1), Inches(5.8), Inches(3.4))
    tf_v = viab_tb.text_frame
    tf_v.word_wrap = True
    p = tf_v.paragraphs[0]
    p.text = "VIABILITY :"
    p.font.name = "Arial Black"
    p.font.size = Pt(12.5)
    p.font.bold = True
    p.font.color.rgb = GREEN

    viab_items = [
        ("Market Opportunity : ", "5.5+ Lakh mining & heavy manufacturing workers in Jharkhand & Eastern India; ₹3,500 Cr industrial safety & compliance market."),
        ("Policy & Governance : ", "Directly addresses NEP 2020 Vocational Education, DGMS Coal Mines Regulations 2017, and Skill India workforce safety mandates."),
        ("Investment & ROI : ", "Minimal deployment cost; projected break-even within 12 months; 20x ROI via reduction in mine accident compensation and lost-time injuries."),
        ("Scalability : ", "Modular JSON scenario engine expands seamlessly to metal smelting, chemical manufacturing, and fire rescue across multiple states.")
    ]
    for lbl, desc in viab_items:
        p = tf_v.add_paragraph()
        p.space_after = Pt(4)
        r1 = p.add_run()
        r1.text = "• " + lbl
        r1.font.bold = True
        r1.font.size = Pt(9)
        r1.font.color.rgb = NAVY_DARK
        r2 = p.add_run()
        r2.text = desc
        r2.font.size = Pt(8.5)
        r2.font.color.rgb = TEXT_DARK

    # BOTTOM LEFT: TECHNICAL CHALLENGES & MITIGATIONS
    tch_card = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), Inches(4.75), Inches(6.1), Inches(2.2))
    tch_card.fill.solid()
    tch_card.fill.fore_color.rgb = LIGHT_GRAY_BG
    tch_card.line.color.rgb = BORDER_COLOR
    tch_card.line.width = Pt(1.2)

    tch_tb = slide4.shapes.add_textbox(Inches(0.55), Inches(4.8), Inches(5.8), Inches(2.05))
    tf_tc = tch_tb.text_frame
    tf_tc.word_wrap = True
    p = tf_tc.paragraphs[0]
    p.text = "TECHNICAL CHALLENGES & MITIGATIONS :"
    p.font.name = "Arial Black"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = CYAN

    p_r = tf_tc.add_paragraph()
    r = p_r.add_run()
    r.text = "Risk : "
    r.font.bold = True
    r.font.color.rgb = RED
    r.font.size = Pt(9)
    r2 = p_r.add_run()
    r2.text = "Low lighting & lack of spatial visual anchors in underground coal shafts can break optical AR tracking."
    r2.font.size = Pt(8.5)

    p_m = tf_tc.add_paragraph()
    r = p_m.add_run()
    r.text = "Mitigation : "
    r.font.bold = True
    r.font.color.rgb = GREEN
    r.font.size = Pt(9)
    r2 = p_m.add_run()
    r2.text = "Hybrid dual-mode: Smooth fallback to high-contrast WebGL virtual simulation mode with touch orbit controls requiring zero camera tracking."
    r2.font.size = Pt(8.5)

    # BOTTOM RIGHT: BUSINESS / USER CHALLENGES & MITIGATIONS
    bch_card = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(4.75), Inches(6.1), Inches(2.2))
    bch_card.fill.solid()
    bch_card.fill.fore_color.rgb = LIGHT_GRAY_BG
    bch_card.line.color.rgb = BORDER_COLOR
    bch_card.line.width = Pt(1.2)

    bch_tb = slide4.shapes.add_textbox(Inches(6.95), Inches(4.8), Inches(5.8), Inches(2.05))
    tf_bc = bch_tb.text_frame
    tf_bc.word_wrap = True
    p = tf_bc.paragraphs[0]
    p.text = "BUSINESS / USER CHALLENGES & MITIGATIONS :"
    p.font.name = "Arial Black"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = AMBER_DARK

    p_r2 = tf_bc.add_paragraph()
    r = p_r2.add_run()
    r.text = "Risk : "
    r.font.bold = True
    r.font.color.rgb = RED
    r.font.size = Pt(9)
    r2 = p_r2.add_run()
    r2.text = "Low digital literacy and language barriers among tribal contract workers causing hesitation to use app."
    r2.font.size = Pt(8.5)

    p_m2 = tf_bc.add_paragraph()
    r = p_m2.add_run()
    r.text = "Mitigation : "
    r.font.bold = True
    r.font.color.rgb = GREEN
    r.font.size = Pt(9)
    r2 = p_m2.add_run()
    r2.text = "Full Santali and Hindi audio/voice guidance HUD + intuitive one-tap large visual touch buttons requiring zero reading capability."
    r2.font.size = Pt(8.5)

    add_footer(slide4, 4)

    # =========================================================================
    # SLIDE 5: IMPACTS & BENEFITS (With Feature Comparison Matrix Table)
    # =========================================================================
    slide5 = prs.slides.add_slide(blank_slide_layout)
    add_header(slide5, "IMPACTS & BENEFITS", "Quantifiable Life-Saving Impact, Economic Returns & Inclusive Workforce Upskilling")

    # LEFT TOP: 3 Macro Impacts
    imp_card = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), Inches(1.05), Inches(6.8), Inches(3.55))
    imp_card.fill.solid()
    imp_card.fill.fore_color.rgb = WHITE
    imp_card.line.color.rgb = BORDER_COLOR
    imp_card.line.width = Pt(1.5)

    imp_tb = slide5.shapes.add_textbox(Inches(0.55), Inches(1.1), Inches(6.5), Inches(3.4))
    tf_i = imp_tb.text_frame
    tf_i.word_wrap = True

    macro_impacts = [
        ("Safety & Life-Saving Impact : ", "Repetitive interactive 3D drills build instinctive muscle memory for dangerous emergency evacuations, gas leaks, and LOTO isolations, projected to reduce industrial mining fatalities by 60% to 70% in high-risk zones.", GREEN),
        ("Economic & Productivity Returns : ", "Eliminates ₹100s of crores in mine shutdown penalties, equipment breakdown, and accident compensation. Drastically reduces physical mock drill setup costs by 75%.", CYAN),
        ("Social & Tribal Inclusion : ", "Delivers quality technical education directly to grassroots tribal communities in Santali and Hindi, fostering certified, employable mining safety professionals in alignment with NEP 2020.", AMBER_DARK)
    ]
    for i, (lbl, desc, col) in enumerate(macro_impacts):
        p = tf_i.paragraphs[0] if i == 0 else tf_i.add_paragraph()
        p.space_after = Pt(6)
        r1 = p.add_run()
        r1.text = "• " + lbl
        r1.font.name = "Arial Black"
        r1.font.size = Pt(9.5)
        r1.font.bold = True
        r1.font.color.rgb = col
        r2 = p.add_run()
        r2.text = desc
        r2.font.name = "Arial"
        r2.font.size = Pt(8.5)
        r2.font.color.rgb = TEXT_DARK

    # RIGHT TOP: COMPARISON MATRIX TABLE
    table_shape = slide5.shapes.add_table(7, 3, Inches(7.4), Inches(1.05), Inches(5.5), Inches(3.55))
    table = table_shape.table
    table.columns[0].width = Inches(3.1)
    table.columns[1].width = Inches(1.2)
    table.columns[2].width = Inches(1.2)

    headers = ["Key Feature / Capability", "Existing Tools", "SafeAR"]
    for col_idx, h_text in enumerate(headers):
        cell = table.cell(0, col_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = NAVY_DARK
        p = cell.text_frame.paragraphs[0]
        p.text = h_text
        p.font.name = "Arial Black"
        p.font.size = Pt(8.5)
        p.font.bold = True
        p.font.color.rgb = WHITE
        p.alignment = PP_ALIGN.CENTER

    matrix_data = [
        ("Headset-Free Mobile AR (Any Android Phone)", "❌ (Needs VR)", "✅ (100% Mobile)"),
        ("100% Semi-Offline Deep Shaft Operation", "❌ (Needs Wi-Fi)", "✅ (.dat Edge DB)"),
        ("Vernacular Santali & Hindi Localization", "❌ (English Only)", "✅ (100% Synced)"),
        ("Tamper-Proof Cryptographic Storage", "❌ (Plain Text)", "✅ (NIST SHA-256)"),
        ("Public On-Chain QR Verification (/verify)", "❌ (Paper-based)", "✅ (Instant Web)"),
        ("Competency Scoring vs Attendance-only", "❌ (Sign-in only)", "✅ (AI Evaluated)")
    ]

    for row_idx, row_data in enumerate(matrix_data):
        for col_idx, val in enumerate(row_data):
            cell = table.cell(row_idx + 1, col_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = LIGHT_GRAY_BG if row_idx % 2 == 0 else WHITE
            p = cell.text_frame.paragraphs[0]
            p.text = val
            p.font.name = "Arial"
            p.font.size = Pt(8)
            if col_idx == 0:
                p.alignment = PP_ALIGN.LEFT
                p.font.bold = True
                p.font.color.rgb = NAVY_DARK
            elif col_idx == 1:
                p.alignment = PP_ALIGN.CENTER
                p.font.color.rgb = RED
                p.font.bold = True
            else:
                p.alignment = PP_ALIGN.CENTER
                p.font.color.rgb = GREEN
                p.font.bold = True

    # BOTTOM: HOW SAFEAR WORKS (3 Operational Execution Modes)
    # Mode 1 Card (Online)
    c1 = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), Inches(4.78), Inches(4.0), Inches(2.15))
    c1.fill.solid()
    c1.fill.fore_color.rgb = LIGHT_BLUE_BG
    c1.line.color.rgb = CYAN
    c1.line.width = Pt(1.5)
    tb1 = slide5.shapes.add_textbox(Inches(0.5), Inches(4.83), Inches(3.8), Inches(2.0))
    tf1 = tb1.text_frame
    tf1.word_wrap = True
    p = tf1.paragraphs[0]
    p.text = "MODE 1: ONLINE (Induction Center)"
    p.font.name = "Arial Black"
    p.font.size = Pt(9.5)
    p.font.bold = True
    p.font.color.rgb = CYAN
    c1_txt = [
        "• For : Classroom, ITI training & web portal",
        "• Process : Login → 3D AR Simulator → AI Exam",
        "• Result : Instant Ethereum Blockchain Minting",
        "• Time : 10-15 minutes per safety module",
        "• Best For : Formal hiring induction & recertification"
    ]
    for t in c1_txt:
        p = tf1.add_paragraph()
        p.text = t
        p.font.size = Pt(8)
        p.font.color.rgb = TEXT_DARK

    # Mode 2 Card (Semi-Offline)
    c2 = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(4.65), Inches(4.78), Inches(4.0), Inches(2.15))
    c2.fill.solid()
    c2.fill.fore_color.rgb = LIGHT_AMBER_BG
    c2.line.color.rgb = AMBER_DARK
    c2.line.width = Pt(1.5)
    tb2 = slide5.shapes.add_textbox(Inches(4.75), Inches(4.83), Inches(3.8), Inches(2.0))
    tf2 = tb2.text_frame
    tf2.word_wrap = True
    p = tf2.paragraphs[0]
    p.text = "MODE 2: OFFLINE (Mine Colliery)"
    p.font.name = "Arial Black"
    p.font.size = Pt(9.5)
    p.font.bold = True
    p.font.color.rgb = AMBER_DARK
    c2_txt = [
        "• For : Remote underground mines without Wi-Fi",
        "• Process : Preloaded package → Edge drill → .dat DB",
        "• Result : Cryptographic SHA-256 Merkle snapshot",
        "• Time : 5-10 minutes on-site refresher",
        "• Best For : Daily shift safety rehearsal underground"
    ]
    for t in c2_txt:
        p = tf2.add_paragraph()
        p.text = t
        p.font.size = Pt(8)
        p.font.color.rgb = TEXT_DARK

    # Mode 3 Card (Field Audit)
    c3 = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.9), Inches(4.78), Inches(4.0), Inches(2.15))
    c3.fill.solid()
    c3.fill.fore_color.rgb = LIGHT_GREEN_BG
    c3.line.color.rgb = GREEN
    c3.line.width = Pt(1.5)
    tb3 = slide5.shapes.add_textbox(Inches(9.0), Inches(4.83), Inches(3.8), Inches(2.0))
    tf3 = tb3.text_frame
    tf3.word_wrap = True
    p = tf3.paragraphs[0]
    p.text = "MODE 3: FIELD AUDIT (DGMS Inspection)"
    p.font.name = "Arial Black"
    p.font.size = Pt(9.5)
    p.font.bold = True
    p.font.color.rgb = GREEN
    c3_txt = [
        "• For : Mining inspectors & compliance officers",
        "• Process : Scan badge QR code → Open /verify",
        "• Result : Zero-login on-chain consensus validation",
        "• Time : < 3 seconds verification speed",
        "• Best For : Legal compliance & zero-forgery audit"
    ]
    for t in c3_txt:
        p = tf3.add_paragraph()
        p.text = t
        p.font.size = Pt(8)
        p.font.color.rgb = TEXT_DARK

    add_footer(slide5, 5)

    # =========================================================================
    # SLIDE 6: RESEARCH AND REFERENCES (With Verified Prototype Links)
    # =========================================================================
    slide6 = prs.slides.add_slide(blank_slide_layout)
    add_header(slide6, "RESEARCH AND REFERENCES", "Statutory Policy Alignment, Empirical Research & Live Production Proof")

    # Top Box: Policy & Standards Guidance
    pol_card = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), Inches(1.05), Inches(12.5), Inches(1.8))
    pol_card.fill.solid()
    pol_card.fill.fore_color.rgb = WHITE
    pol_card.line.color.rgb = BORDER_COLOR
    pol_card.line.width = Pt(1.5)

    pol_tb = slide6.shapes.add_textbox(Inches(0.6), Inches(1.1), Inches(12.1), Inches(1.7))
    tf_po = pol_tb.text_frame
    tf_po.word_wrap = True

    p0 = tf_po.paragraphs[0]
    p0.text = "🏛️ STATUTORY REGULATORY & RESEARCH STANDARDS"
    p0.font.name = "Arial Black"
    p0.font.size = Pt(10.5)
    p0.font.bold = True
    p0.font.color.rgb = NAVY_DARK

    standards = [
        ("DGMS Coal Mines Regulations 2017 & Vocational Training Rules 1966 : ", "Mandates structured, verifiable practical training and safety drill refreshers prior to underground pit operations."),
        ("NEP 2020 & Skill India Mission : ", "Mandates technical vocational education (TVET) integration, experiential learning-by-doing, and vernacular inclusivity for marginalized demographics."),
        ("NIST FIPS 180-4 Secure Hash Standard : ", "Provides the mathematical cryptographic basis for SHA-256 password hashing and immutable Merkle record digests in offline .dat database files."),
        ("IEEE & OSHA Empirical Studies : ", "Occupational research proves interactive 3D simulations increase emergency procedural retention rates from 20% (passive reading) to over 75% (spatial AR practice).")
    ]
    for lbl, desc in standards:
        p = tf_po.add_paragraph()
        p.space_after = Pt(2)
        r1 = p.add_run()
        r1.text = "• " + lbl
        r1.font.bold = True
        r1.font.size = Pt(8.5)
        r1.font.color.rgb = CYAN
        r2 = p.add_run()
        r2.text = desc
        r2.font.size = Pt(8.5)
        r2.font.color.rgb = TEXT_DARK

    # Middle Comparison Box: Solutions Already Exist vs SafeAR
    # Left: Existing Solutions
    ex_card = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), Inches(2.95), Inches(5.9), Inches(1.8))
    ex_card.fill.solid()
    ex_card.fill.fore_color.rgb = LIGHT_RED_BG
    ex_card.line.color.rgb = RED
    ex_card.line.width = Pt(1.2)

    ex_tb = slide6.shapes.add_textbox(Inches(0.55), Inches(3.0), Inches(5.6), Inches(1.7))
    tf_ex = ex_tb.text_frame
    tf_ex.word_wrap = True
    p = tf_ex.paragraphs[0]
    p.text = "⚠️ EXISTING SOLUTIONS IN MARKET"
    p.font.name = "Arial Black"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = RED

    ex_items = [
        "• Static Paper Manuals: Zero muscle memory; high failure rate.",
        "• Bulky VR Headsets (HTC Vive / Oculus): ₹50,000+ per unit, fragile in dusty mines, causes nausea.",
        "• English-Only Software: Completely inaccessible to tribal workers.",
        "• Paper Safety Certificates: Rampant forgery; zero verification."
    ]
    for it in ex_items:
        p = tf_ex.add_paragraph()
        p.text = it
        p.font.size = Pt(8.5)
        p.font.color.rgb = TEXT_DARK

    # Right: SafeAR Stands Out
    so_card = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.0), Inches(2.95), Inches(5.9), Inches(1.8))
    so_card.fill.solid()
    so_card.fill.fore_color.rgb = LIGHT_GREEN_BG
    so_card.line.color.rgb = GREEN
    so_card.line.width = Pt(1.2)

    so_tb = slide6.shapes.add_textbox(Inches(7.15), Inches(3.0), Inches(5.6), Inches(1.7))
    tf_so = so_tb.text_frame
    tf_so.word_wrap = True
    p = tf_so.paragraphs[0]
    p.text = "⭐ SAFEAR STANDS OUT (OUR COMPETITIVE EDGE)"
    p.font.name = "Arial Black"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = GREEN

    so_items = [
        "• Zero-Cost Mobile AR: Runs on any standard ₹10k Android smartphone.",
        "• 100% Semi-Offline: Preloaded packages work in deep underground shafts.",
        "• Santali & Hindi Localization: Equal access for all tribal workers.",
        "• Blockchain Verifier: Tamper-proof on-chain QR code authentication."
    ]
    for it in so_items:
        p = tf_so.add_paragraph()
        p.text = it
        p.font.size = Pt(8.5)
        p.font.color.rgb = TEXT_DARK

    # Bottom Box: LIVE PROJECT RESOURCES & DEMO PROOFS (Exact match to winning PPT)
    res_card = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), Inches(4.88), Inches(12.5), Inches(2.05))
    res_card.fill.solid()
    res_card.fill.fore_color.rgb = NAVY_DARK
    res_card.line.color.rgb = AMBER
    res_card.line.width = Pt(1.5)

    res_tb = slide6.shapes.add_textbox(Inches(0.6), Inches(4.92), Inches(12.1), Inches(1.95))
    tf_res = res_tb.text_frame
    tf_res.word_wrap = True
    p = tf_res.paragraphs[0]
    p.text = "🔗 LIVE PROJECT RESOURCES & EVALUATOR PROOF LINKS"
    p.font.name = "Arial Black"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = AMBER

    links = [
        ("Live Deployed Application : ", "https://sihprototype-ten.vercel.app (Interactive 3-Role Portal & 3D AR Simulator)"),
        ("Interactive 3D Simulation : ", "https://sihprototype-ten.vercel.app/training/mining-basic-scene (60 FPS WebGL Mining Drill)"),
        ("Public Blockchain Verifier : ", "https://sihprototype-ten.vercel.app/verify/SAFEAR-2026-DEMO01 (Open Zero-Login Verification)"),
        ("Verified Test Suite : ", "100 Passed / 100 Tests (12 Test Suites passing - Auth, Cryptography, Blockchain, Three.js Engine)")
    ]
    for lbl, url in links:
        p = tf_res.add_paragraph()
        p.space_after = Pt(2)
        r1 = p.add_run()
        r1.text = "• " + lbl
        r1.font.name = "Arial Black"
        r1.font.bold = True
        r1.font.size = Pt(9)
        r1.font.color.rgb = AMBER
        r2 = p.add_run()
        r2.text = url
        r2.font.name = "Arial"
        r2.font.size = Pt(9)
        r2.font.color.rgb = WHITE

    add_footer(slide6, 6)

    # Save Presentation with official SIH logos
    output_filename = "SIH_2026_PS26041_SHADOW_STACK_SafeAR_Official.pptx"
    output_path = os.path.join(os.getcwd(), output_filename)
    prs.save(output_path)
    print(f"SUCCESS: Presentation with exact SIH symbols saved to {output_path}")

if __name__ == "__main__":
    create_deck()
