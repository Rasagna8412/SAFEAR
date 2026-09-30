import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_official_template_deck():
    prs = Presentation()
    # Official SIH Template Page Dimensions: 11" x 8.5" (792pt x 612pt - US Letter Landscape)
    prs.slide_width = Inches(11.0)
    prs.slide_height = Inches(8.5)
    blank_layout = prs.slide_layouts[6]

    # Color Palette matching Official SIH 2026 Template
    SIH_BLUE = RGBColor(0, 112, 192)       # #0070C0 Official Template Blue
    SIH_HEADER_BLUE = RGBColor(31, 78, 121)# #1F4E79
    DARK_BLUE = RGBColor(11, 25, 44)       # #0B192C
    CARD_BORDER = RGBColor(203, 213, 225)  # #CBD5E1
    LIGHT_BG = RGBColor(248, 250, 252)     # #F8FAFC
    LIGHT_BLUE_BG = RGBColor(240, 249, 255)
    LIGHT_AMBER_BG = RGBColor(254, 243, 199)
    LIGHT_GREEN_BG = RGBColor(236, 253, 245)
    TEXT_DARK = RGBColor(15, 23, 42)       # #0F172A
    TEXT_MUTED = RGBColor(71, 85, 105)     # #475569
    WHITE = RGBColor(255, 255, 255)
    AMBER = RGBColor(217, 119, 6)          # #D97706
    GREEN = RGBColor(16, 185, 129)         # #10B981
    RED = RGBColor(220, 38, 38)            # #DC2626
    PURPLE_BORDER = RGBColor(128, 100, 162)# Template oval border color

    TOP_LOGO_PATH = os.path.abspath("sih_top_right_logo_trans.png")
    BULB_GRAPHIC_PATH = os.path.abspath("sih_bulb_graphic_trans.png")

    def add_template_header(slide, title_text, subtitle=None):
        # 1. Top-Left Team Name Oval (Exact match to official SIH template)
        oval = slide.shapes.add_shape(MSO_SHAPE.OVAL, Inches(0.35), Inches(0.25), Inches(1.35), Inches(0.85))
        oval.fill.solid()
        oval.fill.fore_color.rgb = WHITE
        oval.line.color.rgb = PURPLE_BORDER
        oval.line.width = Pt(1.5)

        tf_o = oval.text_frame
        tf_o.word_wrap = True
        p_o = tf_o.paragraphs[0]
        p_o.text = "SHADOW\nSTACK"
        p_o.font.name = "Times New Roman"
        p_o.font.size = Pt(9.5)
        p_o.font.bold = True
        p_o.font.color.rgb = DARK_BLUE
        p_o.alignment = PP_ALIGN.CENTER

        # 2. Center Slide Title (Times New Roman Bold / Serif matching official template)
        tb_title = slide.shapes.add_textbox(Inches(1.8), Inches(0.3), Inches(6.8), Inches(0.75))
        tf_t = tb_title.text_frame
        tf_t.word_wrap = True
        p_t = tf_t.paragraphs[0]
        p_t.text = title_text
        p_t.font.name = "Times New Roman"
        p_t.font.size = Pt(21)
        p_t.font.bold = True
        p_t.font.color.rgb = DARK_BLUE
        p_t.alignment = PP_ALIGN.CENTER

        if subtitle:
            p_sub = tf_t.add_paragraph()
            p_sub.text = subtitle
            p_sub.font.name = "Arial"
            p_sub.font.size = Pt(10)
            p_sub.font.bold = True
            p_sub.font.color.rgb = AMBER
            p_sub.alignment = PP_ALIGN.CENTER

        # 3. Top-Right Official SIH 2026 Logo
        if os.path.exists(TOP_LOGO_PATH):
            slide.shapes.add_picture(TOP_LOGO_PATH, Inches(8.85), Inches(0.18), Inches(1.85), Inches(0.8))

    def add_template_footer(slide, slide_num):
        # Bottom Blue Banner (Exact match to official SIH template: Height 0.45", Color #0070C0)
        footer_rect = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(8.05), Inches(11.0), Inches(0.45))
        footer_rect.fill.solid()
        footer_rect.fill.fore_color.rgb = SIH_BLUE
        footer_rect.line.fill.background()

        # Center Text: @SIH Idea submission- Template
        tb_f = slide.shapes.add_textbox(Inches(2.5), Inches(8.08), Inches(6.0), Inches(0.35))
        tf_f = tb_f.text_frame
        p_f = tf_f.paragraphs[0]
        p_f.text = "@SIH Idea submission- Template"
        p_f.font.name = "Arial"
        p_f.font.size = Pt(10)
        p_f.font.bold = True
        p_f.font.color.rgb = WHITE
        p_f.alignment = PP_ALIGN.CENTER

        # Right Text: Slide Number
        tb_n = slide.shapes.add_textbox(Inches(9.8), Inches(8.08), Inches(0.9), Inches(0.35))
        tf_n = tb_n.text_frame
        p_n = tf_n.paragraphs[0]
        p_n.text = str(slide_num)
        p_n.font.name = "Arial Black"
        p_n.font.size = Pt(11)
        p_n.font.bold = True
        p_n.font.color.rgb = WHITE
        p_n.alignment = PP_ALIGN.RIGHT

    # =========================================================================
    # SLIDE 1: TITLE PAGE (Exact Match to SIH 2026 Official Template Page 1)
    # =========================================================================
    slide1 = prs.slides.add_slide(blank_layout)

    # Top Right SIH 2026 Logo
    if os.path.exists(TOP_LOGO_PATH):
        slide1.shapes.add_picture(TOP_LOGO_PATH, Inches(8.7), Inches(0.25), Inches(2.0), Inches(0.9))

    # Top Center: SMART INDIA HACKATHON 2026
    tb_sih = slide1.shapes.add_textbox(Inches(0.5), Inches(0.85), Inches(10.0), Inches(0.65))
    tf_sih = tb_sih.text_frame
    p_sih = tf_sih.paragraphs[0]
    p_sih.text = "SMART INDIA HACKATHON 2026"
    p_sih.font.name = "Times New Roman"
    p_sih.font.size = Pt(28)
    p_sih.font.bold = True
    p_sih.font.color.rgb = SIH_HEADER_BLUE
    p_sih.alignment = PP_ALIGN.CENTER

    # Subtitle: TITLE PAGE
    tb_tp = slide1.shapes.add_textbox(Inches(0.5), Inches(1.5), Inches(10.0), Inches(0.5))
    tf_tp = tb_tp.text_frame
    p_tp = tf_tp.paragraphs[0]
    p_tp.text = "TITLE PAGE"
    p_tp.font.name = "Times New Roman"
    p_tp.font.size = Pt(20)
    p_tp.font.bold = True
    p_tp.font.color.rgb = DARK_BLUE
    p_tp.alignment = PP_ALIGN.CENTER

    # Left Side: Mandatory Idea Details Pointers (Verbatim as required by SIH)
    tb_pts = slide1.shapes.add_textbox(Inches(0.6), Inches(2.25), Inches(6.8), Inches(5.8))
    tf_pts = tb_pts.text_frame
    tf_pts.word_wrap = True

    pts_data = [
        ("Problem Statement ID – ", "26041", DARK_BLUE),
        ("Problem Statement Title- ", "AR-Based Vocational Training Simulator for Industrial Safety in Jharkhand's Mining & Manufacturing Sector", DARK_BLUE),
        ("Theme- ", "Smart Education (Vocational & Skill Training)", AMBER),
        ("Sub-Theme- ", "Blockchain & Cybersecurity (Tamper-Proof Verification)", GREEN),
        ("PS Category- ", "Software", DARK_BLUE),
        ("Team ID- ", "53476", DARK_BLUE),
        ("Team Name (Registered on portal) : ", "SHADOW STACK", DARK_BLUE)
    ]

    for i, (lbl, val, col) in enumerate(pts_data):
        p = tf_pts.paragraphs[0] if i == 0 else tf_pts.add_paragraph()
        p.space_after = Pt(12)
        r1 = p.add_run()
        r1.text = "• " + lbl
        r1.font.name = "Arial Black"
        r1.font.size = Pt(13)
        r1.font.bold = True
        r1.font.color.rgb = DARK_BLUE

        r2 = p.add_run()
        r2.text = val
        r2.font.name = "Arial"
        r2.font.size = Pt(12.5)
        r2.font.bold = True
        r2.font.color.rgb = col

    # Right Side: Official SIH Brain-Lightbulb Graphic
    if os.path.exists(BULB_GRAPHIC_PATH):
        slide1.shapes.add_picture(BULB_GRAPHIC_PATH, Inches(7.4), Inches(2.4), Inches(3.3), Inches(4.5))

    # =========================================================================
    # SLIDE 2: PROPOSED SOLUTION (Exact Match to Official Template Page 2)
    # =========================================================================
    slide2 = prs.slides.add_slide(blank_layout)
    add_template_header(slide2, "IDEA TITLE: SafeAR", "AI-Powered Semi-Offline AR Safety Training & Verifiable Certification")

    # Mandatory Heading from Template: ❖ Proposed Solution (Describe your Idea/Solution/Prototype)
    tb_sec = slide2.shapes.add_textbox(Inches(0.4), Inches(1.15), Inches(10.2), Inches(0.45))
    tf_sec = tb_sec.text_frame
    p_sec = tf_sec.paragraphs[0]
    p_sec.text = "❖ Proposed Solution (Describe your Idea/Solution/Prototype)"
    p_sec.font.name = "Arial"
    p_sec.font.size = Pt(14)
    p_sec.font.bold = True
    p_sec.font.color.rgb = SIH_BLUE

    # 3 Mandatory Pointers Container Grid
    # Pointer 1 Box: Detailed explanation of the proposed solution
    c1 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), Inches(1.65), Inches(5.0), Inches(2.95))
    c1.fill.solid()
    c1.fill.fore_color.rgb = LIGHT_BLUE_BG
    c1.line.color.rgb = SIH_BLUE
    c1.line.width = Pt(1.5)

    tb_c1 = slide2.shapes.add_textbox(Inches(0.5), Inches(1.7), Inches(4.8), Inches(2.85))
    tf_c1 = tb_c1.text_frame
    tf_c1.word_wrap = True
    p1 = tf_c1.paragraphs[0]
    p1.text = "• Detailed explanation of the proposed solution :"
    p1.font.name = "Arial Black"
    p1.font.size = Pt(10.5)
    p1.font.bold = True
    p1.font.color.rgb = DARK_BLUE

    p1_items = [
        ("Android WebAR Simulator: ", "Zero-headset 3D interactive training platform running directly in mobile browsers on standard ₹10k smartphones."),
        ("Semi-Offline Edge Architecture: ", "Preloaded site drill packages run 100% offline in deep underground mine shafts without internet."),
        ("Local Cryptographic .dat DB: ", "NIST SHA-256 Merkle-sealed snapshots ensure training data integrity even in completely disconnected zones."),
        ("Blockchain Micro-Credentials: ", "Automated on-chain certificate minting with public QR verification (/verify) against fraud.")
    ]
    for lbl, desc in p1_items:
        p = tf_c1.add_paragraph()
        p.space_after = Pt(2)
        r1 = p.add_run()
        r1.text = "➤ " + lbl
        r1.font.bold = True
        r1.font.size = Pt(9)
        r1.font.color.rgb = SIH_BLUE
        r2 = p.add_run()
        r2.text = desc
        r2.font.size = Pt(8.5)
        r2.font.color.rgb = TEXT_DARK

    # Pointer 2 Box: How it addresses the problem
    c2 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(5.6), Inches(1.65), Inches(5.0), Inches(2.95))
    c2.fill.solid()
    c2.fill.fore_color.rgb = LIGHT_AMBER_BG
    c2.line.color.rgb = AMBER
    c2.line.width = Pt(1.5)

    tb_c2 = slide2.shapes.add_textbox(Inches(5.7), Inches(1.7), Inches(4.8), Inches(2.85))
    tf_c2 = tb_c2.text_frame
    tf_c2.word_wrap = True
    p2 = tf_c2.paragraphs[0]
    p2.text = "• How it addresses the problem :"
    p2.font.name = "Arial Black"
    p2.font.size = Pt(10.5)
    p2.font.bold = True
    p2.font.color.rgb = DARK_BLUE

    p2_items = [
        ("Replaces Static Textbooks: ", "Transforms passive 100-page paper manuals into hands-on spatial muscle-memory drills for hazard response."),
        ("Solves Tribal Language Divide: ", "Full vernacular voice & HUD translation in Santali (`sat`) and Hindi (`hi`) for Jharkhand's workforce."),
        ("Eliminates Internet Requirement: ", "Underground pits have zero Wi-Fi; SafeAR completes training and scoring 100% offline at the edge."),
        ("Competency Over Attendance: ", "AI state-engine grades real decision-making, sequence adherence & reaction times, stopping fake attendance.")
    ]
    for lbl, desc in p2_items:
        p = tf_c2.add_paragraph()
        p.space_after = Pt(2)
        r1 = p.add_run()
        r1.text = "➤ " + lbl
        r1.font.bold = True
        r1.font.size = Pt(9)
        r1.font.color.rgb = AMBER
        r2 = p.add_run()
        r2.text = desc
        r2.font.size = Pt(8.5)
        r2.font.color.rgb = TEXT_DARK

    # Pointer 3 Box: Innovation and uniqueness of the solution
    c3 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), Inches(4.75), Inches(10.2), Inches(3.1))
    c3.fill.solid()
    c3.fill.fore_color.rgb = WHITE
    c3.line.color.rgb = CARD_BORDER
    c3.line.width = Pt(1.5)

    tb_c3 = slide2.shapes.add_textbox(Inches(0.55), Inches(4.8), Inches(9.9), Inches(3.0))
    tf_c3 = tb_c3.text_frame
    tf_c3.word_wrap = True
    p3 = tf_c3.paragraphs[0]
    p3.text = "• Innovation and uniqueness of the solution :"
    p3.font.name = "Arial Black"
    p3.font.size = Pt(11)
    p3.font.bold = True
    p3.font.color.rgb = DARK_BLUE

    # 4 Visual Pipeline Blocks inside Pointer 3
    flow_steps = [
        ("STEP 1: HAZARD IDENTIFICATION", "Detect methane vents, loose rock strata & electrical hazards via interactive 3D WebGL.", LIGHT_BLUE_BG, SIH_BLUE),
        ("STEP 2: MANDATORY PPE VALIDATION", "Worker selects correct hard hat with headlamp & high-vis vest before entering danger zone.", LIGHT_AMBER_BG, AMBER),
        ("STEP 3: 5-STEP LOTO ISOLATION", "Turn off disconnect switch, lock out, tag out, dissipate residual energy & test zero energy.", LIGHT_GREEN_BG, GREEN),
        ("STEP 4: AI SCORING & BLOCKCHAIN MINT", "Instant on-device score calculation, SHA-256 digest sealing & Ethereum credential issuance.", LIGHT_BG, DARK_BLUE)
    ]
    top_y = 5.25
    for title, desc, bg_c, border_c in flow_steps:
        s_box = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), Inches(top_y), Inches(9.8), Inches(0.58))
        s_box.fill.solid()
        s_box.fill.fore_color.rgb = bg_c
        s_box.line.color.rgb = border_c
        s_box.line.width = Pt(1.2)

        stb = slide2.shapes.add_textbox(Inches(0.7), Inches(top_y + 0.03), Inches(9.6), Inches(0.52))
        tf_s = stb.text_frame
        tf_s.word_wrap = True
        ps = tf_s.paragraphs[0]
        r1 = ps.add_run()
        r1.text = title + " — "
        r1.font.bold = True
        r1.font.size = Pt(9)
        r1.font.color.rgb = border_c
        r2 = ps.add_run()
        r2.text = desc
        r2.font.size = Pt(8.5)
        r2.font.color.rgb = TEXT_DARK
        top_y += 0.65

    add_template_footer(slide2, 2)

    # =========================================================================
    # SLIDE 3: TECHNICAL APPROACH (Exact Match to Official Template Page 3)
    # =========================================================================
    slide3 = prs.slides.add_slide(blank_layout)
    add_template_header(slide3, "TECHNICAL APPROACH", "Edge-First Architecture: Train Offline in Deep Mines, Sync Securely to Blockchain")

    # Pointer 1: Technologies to be used (e.g. programming languages, frameworks, hardware)
    t1_card = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), Inches(1.2), Inches(10.2), Inches(2.2))
    t1_card.fill.solid()
    t1_card.fill.fore_color.rgb = LIGHT_BLUE_BG
    t1_card.line.color.rgb = SIH_BLUE
    t1_card.line.width = Pt(1.5)

    tb_t1 = slide3.shapes.add_textbox(Inches(0.55), Inches(1.25), Inches(9.9), Inches(2.1))
    tf_t1 = tb_t1.text_frame
    tf_t1.word_wrap = True
    pt1 = tf_t1.paragraphs[0]
    pt1.text = "• Technologies to be used (e.g. programming languages, frameworks, hardware) :"
    pt1.font.name = "Arial Black"
    pt1.font.size = Pt(11)
    pt1.font.bold = True
    pt1.font.color.rgb = DARK_BLUE

    tech_categories = [
        ("Frontend & 3D Simulation Engine : ", "React 18, TypeScript, Three.js (WebGL 60 FPS hardware acceleration), Tailwind CSS, Vite, Lucide Icons."),
        ("Security & Cryptography : ", "NIST FIPS 180-4 SHA-256 Hashing, Merkle Root Integrity Trees, PBKDF2/Salt Key Derivation, Tamper-Evident Digest."),
        ("Blockchain & Decentralized Ledger : ", "Ethereum / EVM Smart Contracts (Solidity), Ethers.js, ERC-721/Verifiable Credential Schema, Public QR Lookup."),
        ("Offline Persistence & Cloud Edge : ", "Encrypted .dat Binary Snapshots, LocalStorage Edge DB, Cloud Firestore (Offline Fallback Cache), Vercel Edge CDN.")
    ]
    for lbl, desc in tech_categories:
        p = tf_t1.add_paragraph()
        p.space_after = Pt(2)
        r1 = p.add_run()
        r1.text = "➤ " + lbl
        r1.font.bold = True
        r1.font.size = Pt(9.5)
        r1.font.color.rgb = SIH_BLUE
        r2 = p.add_run()
        r2.text = desc
        r2.font.size = Pt(9)
        r2.font.color.rgb = TEXT_DARK

    # Pointer 2: Methodology and process for implementation (Flow Charts/Images/ working prototype)
    t2_card = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), Inches(3.55), Inches(10.2), Inches(4.35))
    t2_card.fill.solid()
    t2_card.fill.fore_color.rgb = WHITE
    t2_card.line.color.rgb = CARD_BORDER
    t2_card.line.width = Pt(1.5)

    tb_t2 = slide3.shapes.add_textbox(Inches(0.55), Inches(3.6), Inches(9.9), Inches(4.25))
    tf_t2 = tb_t2.text_frame
    tf_t2.word_wrap = True
    pt2 = tf_t2.paragraphs[0]
    pt2.text = "• Methodology and process for implementation (Flow Charts/Images/ working prototype) :"
    pt2.font.name = "Arial Black"
    pt2.font.size = Pt(11)
    pt2.font.bold = True
    pt2.font.color.rgb = DARK_BLUE

    # 3 Operational Pipeline Cards side-by-side
    m_data = [
        ("MODE 1: SEMI-OFFLINE (Deep Mine)", [
            "1. Colliery Arrival: Pit head, 0% Wi-Fi.",
            "2. Preloaded Drills: Local 3D assets.",
            "3. WebGL Drill: Hazard & PPE practice.",
            "4. On-Device AI: Evaluates sequence & time.",
            "5. SHA-256 Digest: Sealed in .dat DB.",
            "6. Surface Sync: Queued for upload."
        ], LIGHT_AMBER_BG, AMBER),
        ("MODE 2: ONLINE (Classroom / ITI)", [
            "1. Induction Portal: Worker / Trainer login.",
            "2. Vernacular Toggle: Santali, Hindi, Tamil.",
            "3. 3D AR Simulator: Active Audio HUD.",
            "4. Instant AI Grade: 0-100% competency.",
            "5. Ethereum Ledger: Direct minting.",
            "6. QR Certificate: Tamper-proof PDF."
        ], LIGHT_BLUE_BG, SIH_BLUE),
        ("MODE 3: FIELD AUDIT (DGMS Official)", [
            "1. Spot Inspection: Worker badge check.",
            "2. QR Code Scan: Zero-login lookup.",
            "3. Public Verifier: Open /verify/:id.",
            "4. On-Chain Check: Matches tx hash.",
            "5. Merkle Root Match: Genuine pass.",
            "6. Tamper Rejection: Forgeries flagged."
        ], LIGHT_GREEN_BG, GREEN)
    ]

    col_x = 0.6
    for title, step_list, bg_c, border_c in m_data:
        b = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(col_x), Inches(4.05), Inches(3.15), Inches(3.7))
        b.fill.solid()
        b.fill.fore_color.rgb = bg_c
        b.line.color.rgb = border_c
        b.line.width = Pt(1.2)

        tbox = slide3.shapes.add_textbox(Inches(col_x + 0.1), Inches(4.1), Inches(2.95), Inches(3.55))
        tf = tbox.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.name = "Arial Black"
        p.font.size = Pt(9)
        p.font.bold = True
        p.font.color.rgb = border_c

        for item in step_list:
            p = tf.add_paragraph()
            p.space_after = Pt(2)
            p.text = item
            p.font.size = Pt(8.5)
            p.font.color.rgb = TEXT_DARK
        col_x += 3.35

    add_template_footer(slide3, 3)

    # =========================================================================
    # SLIDE 4: FEASIBILITY AND VIABILITY (Exact Match to Official Template Page 4)
    # =========================================================================
    slide4 = prs.slides.add_slide(blank_layout)
    add_template_header(slide4, "FEASIBILITY AND VIABILITY", "Engineered for Resource-Constrained Workplaces & Scalable Multi-Site Deployment")

    # Pointer 1: Analysis of the feasibility of the idea (Split into Feasibility & Viability cards)
    # Box A: Technical & Operational Feasibility
    fa_card = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), Inches(1.2), Inches(5.0), Inches(3.2))
    fa_card.fill.solid()
    fa_card.fill.fore_color.rgb = LIGHT_BLUE_BG
    fa_card.line.color.rgb = SIH_BLUE
    fa_card.line.width = Pt(1.5)

    tb_fa = slide4.shapes.add_textbox(Inches(0.55), Inches(1.25), Inches(4.7), Inches(3.1))
    tf_fa = tb_fa.text_frame
    tf_fa.word_wrap = True
    pfa = tf_fa.paragraphs[0]
    pfa.text = "• Analysis of the feasibility of the idea :"
    pfa.font.name = "Arial Black"
    pfa.font.size = Pt(11)
    pfa.font.bold = True
    pfa.font.color.rgb = DARK_BLUE

    feas_pts = [
        ("Technical Feasibility: ", "Proven WebGL Three.js stack running smoothly at 60 FPS on mid-range Android 10+ devices; zero ₹50k VR headset dependency."),
        ("Operational Feasibility: ", "Preloaded asset bundles execute 100% offline in deep underground shafts; launches in under 10 seconds."),
        ("Economic Feasibility: ", "Uses workers' existing personal smartphones; 75% cheaper than physical mine training mock chamber setups."),
        ("Software Testing Proof: ", "100 Passed / 100 Automated Unit Tests across all 12 test suites (Auth, Cryptography, Three.js, Blockchain).")
    ]
    for lbl, desc in feas_pts:
        p = tf_fa.add_paragraph()
        p.space_after = Pt(2)
        r1 = p.add_run()
        r1.text = "➤ " + lbl
        r1.font.bold = True
        r1.font.size = Pt(9)
        r1.font.color.rgb = SIH_BLUE
        r2 = p.add_run()
        r2.text = desc
        r2.font.size = Pt(8.5)
        r2.font.color.rgb = TEXT_DARK

    # Box B: Commercial & Policy Viability
    fb_card = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(5.6), Inches(1.2), Inches(5.0), Inches(3.2))
    fb_card.fill.solid()
    fb_card.fill.fore_color.rgb = LIGHT_GREEN_BG
    fb_card.line.color.rgb = GREEN
    fb_card.line.width = Pt(1.5)

    tb_fb = slide4.shapes.add_textbox(Inches(5.75), Inches(1.25), Inches(4.7), Inches(3.1))
    tf_fb = tb_fb.text_frame
    tf_fb.word_wrap = True
    pfb = tf_fb.paragraphs[0]
    pfb.text = "• Commercial Viability & Policy Alignment :"
    pfb.font.name = "Arial Black"
    pfb.font.size = Pt(11)
    pfb.font.bold = True
    pfb.font.color.rgb = DARK_BLUE

    viab_pts = [
        ("Market Opportunity: ", "5.5+ Lakh mining and heavy manufacturing workforce in Jharkhand & Eastern India; ₹3,500 Cr industrial safety training market."),
        ("Statutory Alignment: ", "Directly addresses NEP 2020 Vocational Education (TVET), DGMS Coal Mines Regulations 2017, and Skill India safety mandates."),
        ("Investment & ROI: ", "Minimal deployment cost; projected break-even within 12 months; 20x ROI via reduction in mine accident compensation and lost-time injuries."),
        ("Multi-Site Scalability: ", "Modular JSON scenario engine expands seamlessly to metal smelting, chemical handling, and fire rescue.")
    ]
    for lbl, desc in viab_pts:
        p = tf_fb.add_paragraph()
        p.space_after = Pt(2)
        r1 = p.add_run()
        r1.text = "➤ " + lbl
        r1.font.bold = True
        r1.font.size = Pt(9)
        r1.font.color.rgb = GREEN
        r2 = p.add_run()
        r2.text = desc
        r2.font.size = Pt(8.5)
        r2.font.color.rgb = TEXT_DARK

    # Pointer 2 & 3 Box: Potential challenges and risks & Strategies for overcoming these challenges
    c_card = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), Inches(4.55), Inches(10.2), Inches(3.3))
    c_card.fill.solid()
    c_card.fill.fore_color.rgb = WHITE
    c_card.line.color.rgb = CARD_BORDER
    c_card.line.width = Pt(1.5)

    tb_c = slide4.shapes.add_textbox(Inches(0.55), Inches(4.6), Inches(9.9), Inches(3.2))
    tf_c = tb_c.text_frame
    tf_c.word_wrap = True
    pc = tf_c.paragraphs[0]
    pc.text = "• Potential challenges and risks & Strategies for overcoming these challenges :"
    pc.font.name = "Arial Black"
    pc.font.size = Pt(11)
    pc.font.bold = True
    pc.font.color.rgb = DARK_BLUE

    challenges_table = [
        ("1. Underground Low Light & Tracking Failure", "Dark coal chambers and featureless walls disrupt optical AR camera tracking.", "Dual-Mode Architecture: Seamless fallback to high-contrast WebGL virtual simulation mode with touch orbit controls requiring zero camera tracking."),
        ("2. Worker Literacy & Technology Hesitation", "Tribal contract workers in Jharkhand struggle with written English instructions.", "Multilingual Voice HUD: Native Santali and Hindi audio instructions + intuitive 1-tap color-coded visual touch buttons."),
        ("3. Offline Data Tampering in Deep Mines", "Malicious actors could tamper with local offline scores before synchronizing.", "NIST SHA-256 Merkle Sealing: Any single-byte modification in .dat file triggers instant cryptographic tamper rejection during surface sync.")
    ]

    top_cy = 5.0
    for title, risk, mit in challenges_table:
        r_box = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), Inches(top_cy), Inches(9.8), Inches(0.85))
        r_box.fill.solid()
        r_box.fill.fore_color.rgb = LIGHT_BG
        r_box.line.color.rgb = CARD_BORDER
        r_box.line.width = Pt(1.0)

        rtb = slide4.shapes.add_textbox(Inches(0.7), Inches(top_cy + 0.03), Inches(9.6), Inches(0.78))
        tf_r = rtb.text_frame
        tf_r.word_wrap = True
        pr = tf_r.paragraphs[0]
        r1 = pr.add_run()
        r1.text = title + "\n"
        r1.font.bold = True
        r1.font.size = Pt(9)
        r1.font.color.rgb = DARK_BLUE

        r2 = pr.add_run()
        r2.text = "• Potential Risk: " + risk + "  "
        r2.font.size = Pt(8.5)
        r2.font.color.rgb = RED
        r3 = pr.add_run()
        r3.text = "• Strategy: " + mit
        r3.font.size = Pt(8.5)
        r3.font.bold = True
        r3.font.color.rgb = GREEN

        top_cy += 0.95

    add_template_footer(slide4, 4)

    # =========================================================================
    # SLIDE 5: IMPACT AND BENEFITS (Exact Match to Official Template Page 5)
    # =========================================================================
    slide5 = prs.slides.add_slide(blank_layout)
    add_template_header(slide5, "IMPACT AND BENEFITS", "Quantifiable Life-Saving Outcomes, Economic Value & Regional Empowerment")

    # Pointer 1 Box: Potential impact on the target audience
    i1_card = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), Inches(1.2), Inches(5.0), Inches(3.2))
    i1_card.fill.solid()
    i1_card.fill.fore_color.rgb = LIGHT_GREEN_BG
    i1_card.line.color.rgb = GREEN
    i1_card.line.width = Pt(1.5)

    tb_i1 = slide5.shapes.add_textbox(Inches(0.55), Inches(1.25), Inches(4.7), Inches(3.1))
    tf_i1 = tb_i1.text_frame
    tf_i1.word_wrap = True
    pi1 = tf_i1.paragraphs[0]
    pi1.text = "• Potential impact on the target audience :"
    pi1.font.name = "Arial Black"
    pi1.font.size = Pt(11)
    pi1.font.bold = True
    pi1.font.color.rgb = DARK_BLUE

    target_impacts = [
        ("Mining & Manufacturing Workers: ", "Rehearsing emergency drills builds instinctive spatial muscle memory, reducing workplace fatalities by an estimated 60% to 70%."),
        ("Contract & Tribal Labourers: ", "Empowers non-English speaking workers through native Santali and Hindi training, promoting equitable safety education."),
        ("Safety Trainers & Supervisors: ", "Automated competency analytics replace manual paperwork, freeing up 15+ hours per week per trainer."),
        ("Government Inspectors (DGMS): ", "Instant, zero-login QR code verification at pit heads eliminates counterfeit safety certificates.")
    ]
    for lbl, desc in target_impacts:
        p = tf_i1.add_paragraph()
        p.space_after = Pt(2)
        r1 = p.add_run()
        r1.text = "➤ " + lbl
        r1.font.bold = True
        r1.font.size = Pt(9)
        r1.font.color.rgb = GREEN
        r2 = p.add_run()
        r2.text = desc
        r2.font.size = Pt(8.5)
        r2.font.color.rgb = TEXT_DARK

    # Pointer 2 Box: Benefits of the solution (social, economic, environmental, etc.)
    i2_card = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(5.6), Inches(1.2), Inches(5.0), Inches(3.2))
    i2_card.fill.solid()
    i2_card.fill.fore_color.rgb = LIGHT_BLUE_BG
    i2_card.line.color.rgb = SIH_BLUE
    i2_card.line.width = Pt(1.5)

    tb_i2 = slide5.shapes.add_textbox(Inches(5.75), Inches(1.25), Inches(4.7), Inches(3.1))
    tf_i2 = tb_i2.text_frame
    tf_i2.word_wrap = True
    pi2 = tf_i2.paragraphs[0]
    pi2.text = "• Benefits of the solution (social, economic, environmental) :"
    pi2.font.name = "Arial Black"
    pi2.font.size = Pt(10.5)
    pi2.font.bold = True
    pi2.font.color.rgb = DARK_BLUE

    benefits_list = [
        ("Social & Inclusion Gain: ", "Bridges the digital divide for Jharkhand's tribal mining workforce; fosters certified, employable professionals in line with NEP 2020."),
        ("Economic & Financial Gain: ", "Saves ₹100s of crores in mine shutdown penalties, heavy equipment breakdown, and accident compensation; 75% cheaper than mock drills."),
        ("Environmental & Safety Gain: ", "Reduces hazardous methane leaks and fire explosions through proactive procedural mastery, safeguarding mining ecosystems.")
    ]
    for lbl, desc in benefits_list:
        p = tf_i2.add_paragraph()
        p.space_after = Pt(4)
        r1 = p.add_run()
        r1.text = "➤ " + lbl
        r1.font.bold = True
        r1.font.size = Pt(9)
        r1.font.color.rgb = SIH_BLUE
        r2 = p.add_run()
        r2.text = desc
        r2.font.size = Pt(8.5)
        r2.font.color.rgb = TEXT_DARK

    # Bottom Comparison Matrix Box
    tbl_card = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), Inches(4.55), Inches(10.2), Inches(3.3))
    tbl_card.fill.solid()
    tbl_card.fill.fore_color.rgb = WHITE
    tbl_card.line.color.rgb = CARD_BORDER
    tbl_card.line.width = Pt(1.5)

    tb_th = slide5.shapes.add_textbox(Inches(0.55), Inches(4.6), Inches(9.9), Inches(0.4))
    tf_th = tb_th.text_frame
    pth = tf_th.paragraphs[0]
    pth.text = "• Feature Comparison Matrix: SafeAR vs Traditional Industrial Training Methods"
    pth.font.name = "Arial Black"
    pth.font.size = Pt(11)
    pth.font.bold = True
    pth.font.color.rgb = DARK_BLUE

    # Table Shape
    table_shape = slide5.shapes.add_table(6, 4, Inches(0.6), Inches(5.05), Inches(9.8), Inches(2.6))
    tbl = table_shape.table
    tbl.columns[0].width = Inches(3.6)
    tbl.columns[1].width = Inches(2.0)
    tbl.columns[2].width = Inches(2.0)
    tbl.columns[3].width = Inches(2.2)

    headers = ["Evaluation Metric", "Paper Manuals", "Bulky VR Rigs", "SafeAR (Our Solution)"]
    for col_idx, h_text in enumerate(headers):
        cell = tbl.cell(0, col_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = DARK_BLUE
        p = cell.text_frame.paragraphs[0]
        p.text = h_text
        p.font.name = "Arial Black"
        p.font.size = Pt(9)
        p.font.bold = True
        p.font.color.rgb = WHITE
        p.alignment = PP_ALIGN.CENTER

    t_rows = [
        ("Hardware Requirement", "None (Static Paper)", "₹50k+ Expensive Headset", "✅ Any ₹10k Android Phone"),
        ("100% Offline Underground Operation", "✅ Yes (Ineffective)", "❌ No (Needs PC/Wi-Fi)", "✅ Yes (.dat Edge DB)"),
        ("Vernacular Santali & Hindi Support", "❌ English Only", "❌ English Only", "✅ Yes (Santali & Hindi)"),
        ("Tamper-Evident Verification", "❌ Paper (Easily Forged)", "❌ Local App Records", "✅ NIST SHA-256 + Ethereum"),
        ("Cost per Trained Worker", "Low (Zero Muscle Memory)", "Very High (Prohibitive)", "✅ Minimal (Software Scalable)")
    ]

    for r_idx, row in enumerate(t_rows):
        for c_idx, val in enumerate(row):
            cell = tbl.cell(r_idx + 1, c_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = LIGHT_BG if r_idx % 2 == 0 else WHITE
            p = cell.text_frame.paragraphs[0]
            p.text = val
            p.font.name = "Arial"
            p.font.size = Pt(8.5)
            if c_idx == 0:
                p.font.bold = True
                p.alignment = PP_ALIGN.LEFT
                p.font.color.rgb = DARK_BLUE
            elif c_idx in [1, 2]:
                p.alignment = PP_ALIGN.CENTER
                p.font.color.rgb = RED if "❌" in val else TEXT_MUTED
            else:
                p.alignment = PP_ALIGN.CENTER
                p.font.bold = True
                p.font.color.rgb = GREEN

    add_template_footer(slide5, 5)

    # =========================================================================
    # SLIDE 6: RESEARCH AND REFERENCES (Exact Match to Official Template Page 6)
    # =========================================================================
    slide6 = prs.slides.add_slide(blank_layout)
    add_template_header(slide6, "RESEARCH AND REFERENCES", "Source Basis, Technical Standards & Live Evaluator Production Demos")

    # Mandatory Pointer: Details / Links of the reference and research work
    tb_r = slide6.shapes.add_textbox(Inches(0.4), Inches(1.15), Inches(10.2), Inches(0.45))
    tf_r = tb_r.text_frame
    pr = tf_r.paragraphs[0]
    pr.text = "• Details / Links of the reference and research work :"
    pr.font.name = "Arial Black"
    pr.font.size = Pt(12)
    pr.font.bold = True
    pr.font.color.rgb = DARK_BLUE

    # Card 1: Statutory & Policy References
    r1_card = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), Inches(1.65), Inches(10.2), Inches(2.2))
    r1_card.fill.solid()
    r1_card.fill.fore_color.rgb = LIGHT_BLUE_BG
    r1_card.line.color.rgb = SIH_BLUE
    r1_card.line.width = Pt(1.5)

    tb_r1 = slide6.shapes.add_textbox(Inches(0.55), Inches(1.7), Inches(9.9), Inches(2.1))
    tf_r1 = tb_r1.text_frame
    tf_r1.word_wrap = True
    p1 = tf_r1.paragraphs[0]
    p1.text = "1. Statutory Policy Framework & Regulatory Basis :"
    p1.font.name = "Arial Black"
    p1.font.size = Pt(10.5)
    p1.font.bold = True
    p1.font.color.rgb = DARK_BLUE

    statutory_refs = [
        ("DGMS Coal Mines Regulations 2017 & Vocational Training Rules 1966: ", "Mandates structured, verifiable safety drills prior to entering underground mine pits. Link: https://dgms.gov.in"),
        ("NEP 2020 & Skill India Mission: ", "Mandates technical vocational education (TVET) integration, experiential learning-by-doing, and vernacular inclusivity. Link: https://www.education.gov.in/nep"),
        ("NIST FIPS 180-4 Secure Hash Standard: ", "Provides mathematical basis for SHA-256 cryptographic password hashing and tamper-evident Merkle roots. Link: https://csrc.nist.gov/publications/detail/fips/180-4/final"),
        ("IEEE & OSHA Occupational Safety Research: ", "Studies prove interactive 3D simulations increase emergency hazard retention from 20% to over 75%. Link: https://ieeexplore.ieee.org")
    ]
    for lbl, desc in statutory_refs:
        p = tf_r1.add_paragraph()
        p.space_after = Pt(2)
        r = p.add_run()
        r.text = "➤ " + lbl
        r.font.bold = True
        r.font.size = Pt(9)
        r.font.color.rgb = SIH_BLUE
        r2 = p.add_run()
        r2.text = desc
        r2.font.size = Pt(8.5)
        r2.font.color.rgb = TEXT_DARK

    # Card 2: Live Evaluator Resources & Production URLs
    r2_card = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), Inches(4.0), Inches(10.2), Inches(3.85))
    r2_card.fill.solid()
    r2_card.fill.fore_color.rgb = DARK_BLUE
    r2_card.line.color.rgb = AMBER
    r2_card.line.width = Pt(1.5)

    tb_r2 = slide6.shapes.add_textbox(Inches(0.55), Inches(4.05), Inches(9.9), Inches(3.75))
    tf_r2 = tb_r2.text_frame
    tf_r2.word_wrap = True
    p2 = tf_r2.paragraphs[0]
    p2.text = "2. Verified Production Demos, Repositories & Working Prototype Links :"
    p2.font.name = "Arial Black"
    p2.font.size = Pt(11)
    p2.font.bold = True
    p2.font.color.rgb = AMBER

    prod_links = [
        ("Live Production Application : ", "https://sihprototype-ten.vercel.app\n(Three-Role Authentication: Worker, Safety Trainer, Enterprise Admin)"),
        ("Interactive 3D Simulation : ", "https://sihprototype-ten.vercel.app/training/mining-basic-scene\n(60 FPS WebGL Mining Excavator, LOTO Switch, Emergency Gas Drill & Atmospheric Dust)"),
        ("Public Blockchain Credential Verifier : ", "https://sihprototype-ten.vercel.app/verify/SAFEAR-2026-DEMO01\n(Zero-login public consensus verification with on-chain Ethereum transaction hash)"),
        ("Automated Software Test Suite : ", "100/100 Passed Unit Tests across 12 test suites verifying offline persistence, cryptographic hashes, and Three.js engine."),
        ("Official Organization Sponsor : ", "Department of Higher & Technical Education, Government of Jharkhand — Problem Statement 26041")
    ]
    for lbl, desc in prod_links:
        p = tf_r2.add_paragraph()
        p.space_after = Pt(4)
        r = p.add_run()
        r.text = "• " + lbl
        r.font.bold = True
        r.font.size = Pt(9.5)
        r.font.color.rgb = AMBER
        r2 = p.add_run()
        r2.text = desc
        r2.font.size = Pt(9)
        r2.font.color.rgb = WHITE

    add_template_footer(slide6, 6)

    # Save Official Template Presentation
    output_filename = "SIH_2026_PS26041_SHADOW_STACK_Official_Template.pptx"
    output_path = os.path.join(os.getcwd(), output_filename)
    prs.save(output_path)
    print(f"SUCCESS: Official template presentation saved to {output_path}")

if __name__ == "__main__":
    create_official_template_deck()
