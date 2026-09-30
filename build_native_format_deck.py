import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def build_native_format_deck():
    prs = Presentation()
    # Official SIH Template Dimensions: 11" x 8.5" (792pt x 612pt - US Letter Landscape)
    prs.slide_width = Inches(11.0)
    prs.slide_height = Inches(8.5)
    blank_layout = prs.slide_layouts[6]

    # Color Palette matching Official SIH Format
    SIH_BLUE = RGBColor(0, 112, 192)       # #0070C0 Official Template Blue
    SIH_HEADER_BLUE = RGBColor(31, 78, 121)# #1F4E79
    DARK_BLUE = RGBColor(11, 25, 44)       # #0B192C Deep Navy
    CARD_BORDER = RGBColor(203, 213, 225)  # #CBD5E1 Slate 300
    LIGHT_BG = RGBColor(248, 250, 252)     # #F8FAFC
    LIGHT_BLUE_BG = RGBColor(240, 249, 255)# #F0F9FF
    LIGHT_AMBER_BG = RGBColor(254, 243, 199)# #FFFBEB
    LIGHT_GREEN_BG = RGBColor(236, 253, 245)# #ECFDF5
    TEXT_DARK = RGBColor(15, 23, 42)       # #0F172A
    TEXT_MUTED = RGBColor(71, 85, 105)     # #475569
    WHITE = RGBColor(255, 255, 255)
    AMBER = RGBColor(217, 119, 6)          # #D97706
    GREEN = RGBColor(16, 185, 129)         # #10B981
    RED = RGBColor(220, 38, 38)            # #DC2626
    PURPLE_BORDER = RGBColor(128, 100, 162)# #8064A2 Template Oval Border

    TOP_LOGO_PATH = os.path.abspath("sih_top_right_logo_trans.png")
    BULB_GRAPHIC_PATH = os.path.abspath("sih_bulb_graphic_trans.png")

    def add_header(slide, title_text, subtitle_text=None):
        # 1. Native Top-Left Oval Badge: SHADOW STACK
        oval = slide.shapes.add_shape(MSO_SHAPE.OVAL, Inches(0.4), Inches(0.22), Inches(1.35), Inches(0.85))
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

        # 2. Native Center Slide Title
        tb_title = slide.shapes.add_textbox(Inches(1.8), Inches(0.22), Inches(6.8), Inches(0.85))
        tf_t = tb_title.text_frame
        tf_t.word_wrap = True
        p_t = tf_t.paragraphs[0]
        p_t.text = title_text
        p_t.font.name = "Times New Roman"
        p_t.font.size = Pt(21)
        p_t.font.bold = True
        p_t.font.color.rgb = DARK_BLUE
        p_t.alignment = PP_ALIGN.CENTER

        if subtitle_text:
            p_sub = tf_t.add_paragraph()
            p_sub.text = subtitle_text
            p_sub.font.name = "Arial"
            p_sub.font.size = Pt(9.5)
            p_sub.font.bold = True
            p_sub.font.color.rgb = AMBER
            p_sub.alignment = PP_ALIGN.CENTER

        # 3. Official SIH 2026 Logo (Top-Right)
        if os.path.exists(TOP_LOGO_PATH):
            slide.shapes.add_picture(TOP_LOGO_PATH, Inches(8.85), Inches(0.18), Inches(1.85), Inches(0.8))

    def add_footer(slide, slide_num):
        # Official Bottom Blue Banner
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
    # SLIDE 1: TITLE PAGE (Native Content & Official Alignment)
    # =========================================================================
    slide1 = prs.slides.add_slide(blank_layout)

    # Top Right SIH 2026 Logo
    if os.path.exists(TOP_LOGO_PATH):
        slide1.shapes.add_picture(TOP_LOGO_PATH, Inches(8.7), Inches(0.25), Inches(2.0), Inches(0.9))

    # Top Center Title: SMART INDIA HACKATHON 2026
    tb_sih = slide1.shapes.add_textbox(Inches(0.5), Inches(0.8), Inches(10.0), Inches(0.65))
    tf_sih = tb_sih.text_frame
    p_sih = tf_sih.paragraphs[0]
    p_sih.text = "SMART INDIA HACKATHON 2026"
    p_sih.font.name = "Times New Roman"
    p_sih.font.size = Pt(28)
    p_sih.font.bold = True
    p_sih.font.color.rgb = SIH_HEADER_BLUE
    p_sih.alignment = PP_ALIGN.CENTER

    # Subtitle: TITLE PAGE
    tb_tp = slide1.shapes.add_textbox(Inches(0.5), Inches(1.45), Inches(10.0), Inches(0.5))
    tf_tp = tb_tp.text_frame
    p_tp = tf_tp.paragraphs[0]
    p_tp.text = "TITLE PAGE"
    p_tp.font.name = "Times New Roman"
    p_tp.font.size = Pt(20)
    p_tp.font.bold = True
    p_tp.font.color.rgb = DARK_BLUE
    p_tp.alignment = PP_ALIGN.CENTER

    # Left Container Box for Pointers (Aligned Perfectly)
    card1 = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.5), Inches(2.15), Inches(6.8), Inches(5.8))
    card1.fill.solid()
    card1.fill.fore_color.rgb = LIGHT_BG
    card1.line.color.rgb = CARD_BORDER
    card1.line.width = Pt(1.5)

    tb_pts = slide1.shapes.add_textbox(Inches(0.7), Inches(2.25), Inches(6.4), Inches(5.6))
    tf_pts = tb_pts.text_frame
    tf_pts.word_wrap = True

    pts_data = [
        ("Problem Statement ID – ", "26041", DARK_BLUE),
        ("Problem Statement Title- ", "AR-Based Vocational Training Simulator for Industrial Safety in Jharkhand's Mining & Manufacturing Sector", DARK_BLUE),
        ("Organization- ", "Department of Higher & Technical Education, Government of Jharkhand", DARK_BLUE),
        ("Theme- ", "Smart Education (Vocational & Skill Training)", AMBER),
        ("Sub-Theme- ", "Blockchain & Cybersecurity (Tamper-Proof Verification)", GREEN),
        ("PS Category- ", "Software", DARK_BLUE),
        ("Team ID- ", "53476", DARK_BLUE),
        ("Team Name (Registered on portal) : ", "SHADOW STACK", DARK_BLUE)
    ]

    for i, (lbl, val, col) in enumerate(pts_data):
        p = tf_pts.paragraphs[0] if i == 0 else tf_pts.add_paragraph()
        p.space_after = Pt(10)
        r1 = p.add_run()
        r1.text = "• " + lbl
        r1.font.name = "Arial Black"
        r1.font.size = Pt(12)
        r1.font.bold = True
        r1.font.color.rgb = DARK_BLUE

        r2 = p.add_run()
        r2.text = val
        r2.font.name = "Arial"
        r2.font.size = Pt(11.5)
        r2.font.bold = True
        r2.font.color.rgb = col

    # Right Side: Official SIH Brain-Lightbulb Artwork
    if os.path.exists(BULB_GRAPHIC_PATH):
        slide1.shapes.add_picture(BULB_GRAPHIC_PATH, Inches(7.5), Inches(2.3), Inches(3.2), Inches(4.5))

    # =========================================================================
    # SLIDE 2: THE SOLUTION (Native Flowchart Shapes & Clean Columns)
    # =========================================================================
    slide2 = prs.slides.add_slide(blank_layout)
    add_header(slide2, "THE SOLUTION", "AI-POWERED SEMI OFFLINE AR SAFETY TRAINING & VERIFIABLE CERTIFICATION")

    # Three Aligned Native Cards (Top Section)
    col_w = Inches(3.15)
    col_h = Inches(3.45)
    top_y = Inches(1.25)

    # Column 1: PROPOSED SOLUTION
    c1 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), top_y, col_w, col_h)
    c1.fill.solid()
    c1.fill.fore_color.rgb = LIGHT_BLUE_BG
    c1.line.color.rgb = SIH_BLUE
    c1.line.width = Pt(1.5)

    tb1 = slide2.shapes.add_textbox(Inches(0.5), top_y + Inches(0.08), col_w - Inches(0.2), col_h - Inches(0.16))
    tf1 = tb1.text_frame
    tf1.word_wrap = True
    p = tf1.paragraphs[0]
    p.text = "PROPOSED SOLUTION"
    p.font.name = "Arial Black"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = SIH_BLUE
    p.alignment = PP_ALIGN.CENTER

    c1_bullets = [
        "Android-first AR training running in mobile browsers without requiring ₹50,000 VR headsets.",
        "On-device AI evaluates worker safety decisions, PPE compliance, and procedure sequence.",
        "Preloaded, site-specific 3D training packages work 100% offline in underground mine pits.",
        "Tamper-proof digital certificates backed by NIST SHA-256 digests and Ethereum blockchain."
    ]
    for b in c1_bullets:
        p = tf1.add_paragraph()
        p.space_after = Pt(4)
        r = p.add_run()
        r.text = "• " + b
        r.font.size = Pt(8.5)
        r.font.color.rgb = TEXT_DARK

    # Column 2: HOW IT ADDRESSES THE PROBLEM
    c2 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(3.92), top_y, col_w, col_h)
    c2.fill.solid()
    c2.fill.fore_color.rgb = LIGHT_AMBER_BG
    c2.line.color.rgb = AMBER
    c2.line.width = Pt(1.5)

    tb2 = slide2.shapes.add_textbox(Inches(4.02), top_y + Inches(0.08), col_w - Inches(0.2), col_h - Inches(0.16))
    tf2 = tb2.text_frame
    tf2.word_wrap = True
    p = tf2.paragraphs[0]
    p.text = "HOW IT ADDRESSES PROBLEM"
    p.font.name = "Arial Black"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = AMBER
    p.alignment = PP_ALIGN.CENTER

    c2_bullets = [
        "Replaces static, theoretical paper manuals with interactive spatial muscle-memory practice.",
        "Native Santali (sat) & Hindi (hi) localization bridges language barriers for tribal miners.",
        "Works seamlessly in remote deep coal shafts (Jharia, Dhanbad) with zero Wi-Fi or internet.",
        "Evaluates real operational competency and reaction time—not just passive attendance."
    ]
    for b in c2_bullets:
        p = tf2.add_paragraph()
        p.space_after = Pt(4)
        r = p.add_run()
        r.text = "• " + b
        r.font.size = Pt(8.5)
        r.font.color.rgb = TEXT_DARK

    # Column 3: INNOVATION & UNIQUENESS
    c3 = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.45), top_y, col_w, col_h)
    c3.fill.solid()
    c3.fill.fore_color.rgb = LIGHT_GREEN_BG
    c3.line.color.rgb = GREEN
    c3.line.width = Pt(1.5)

    tb3 = slide2.shapes.add_textbox(Inches(7.55), top_y + Inches(0.08), col_w - Inches(0.2), col_h - Inches(0.16))
    tf3 = tb3.text_frame
    tf3.word_wrap = True
    p = tf3.paragraphs[0]
    p.text = "INNOVATION & UNIQUENESS"
    p.font.name = "Arial Black"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = GREEN
    p.alignment = PP_ALIGN.CENTER

    c3_bullets = [
        "AI + AR + edge inference: on-device 60 FPS WebGL simulation running on standard smartphones.",
        "Cryptographic .dat database: SHA-256 Merkle root integrity flags offline data tampering.",
        "Public QR verification portal: safety inspectors verify compliance at /verify without login.",
        "Configurable scenario schema: easily expands to gas leaks, roof falls, and machinery."
    ]
    for b in c3_bullets:
        p = tf3.add_paragraph()
        p.space_after = Pt(4)
        r = p.add_run()
        r.text = "• " + b
        r.font.size = Pt(8.5)
        r.font.color.rgb = TEXT_DARK

    # Bottom Flowchart Card: Native Shapes & Arrows (NO Screenshots!)
    bot_card = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), Inches(4.9), Inches(10.2), Inches(3.0))
    bot_card.fill.solid()
    bot_card.fill.fore_color.rgb = WHITE
    bot_card.line.color.rgb = CARD_BORDER
    bot_card.line.width = Pt(1.5)

    tb_bot = slide2.shapes.add_textbox(Inches(0.55), Inches(4.95), Inches(9.9), Inches(0.4))
    tf_b = tb_bot.text_frame
    pb = tf_b.paragraphs[0]
    pb.text = "EXAMPLE FLOWCHART — MINING EMERGENCY & 5-STEP LOTO RESPONSE DRILL"
    pb.font.name = "Arial Black"
    pb.font.size = Pt(10.5)
    pb.font.bold = True
    pb.font.color.rgb = DARK_BLUE

    # 4 Native Process Boxes + 3 Native Right Arrows
    step_boxes = [
        ("01", "IDENTIFY HAZARD", "Detect methane vents, rock\ncracks & electrical sparks", LIGHT_BLUE_BG, SIH_BLUE),
        ("02", "SELECT PPE", "Validate hard hat with lamp\n& high-vis reflective vest", LIGHT_AMBER_BG, AMBER),
        ("03", "FOLLOW PROCEDURE", "Virtual 5-Step LOTO:\nde-energize, lock, tag & test", LIGHT_GREEN_BG, GREEN),
        ("04", "AI ASSESSMENT", "Compute 0-100% score, seal\nSHA-256 digest & QR mint", LIGHT_BG, DARK_BLUE)
    ]

    bx_w = Inches(2.05)
    bx_h = Inches(1.9)
    arr_w = Inches(0.38)
    bx_y = Inches(5.45)
    start_x = Inches(0.6)

    for i, (num, title, desc, bg_c, border_c) in enumerate(step_boxes):
        cur_x = start_x + i * (bx_w + arr_w + Inches(0.2))

        # Native Box
        s_box = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cur_x, bx_y, bx_w, bx_h)
        s_box.fill.solid()
        s_box.fill.fore_color.rgb = bg_c
        s_box.line.color.rgb = border_c
        s_box.line.width = Pt(1.5)

        # Number badge pill
        pill = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cur_x + Inches(0.15), bx_y + Inches(0.15), Inches(0.55), Inches(0.32))
        pill.fill.solid()
        pill.fill.fore_color.rgb = border_c
        pill.line.fill.background()
        tf_pill = pill.text_frame
        p_pill = tf_pill.paragraphs[0]
        p_pill.text = num
        p_pill.font.name = "Arial Black"
        p_pill.font.size = Pt(11)
        p_pill.font.bold = True
        p_pill.font.color.rgb = WHITE
        p_pill.alignment = PP_ALIGN.CENTER

        # Box Text
        t_box = slide2.shapes.add_textbox(cur_x + Inches(0.1), bx_y + Inches(0.55), bx_w - Inches(0.2), bx_h - Inches(0.65))
        tf_tx = t_box.text_frame
        tf_tx.word_wrap = True
        p1 = tf_tx.paragraphs[0]
        p1.text = title
        p1.font.name = "Arial Black"
        p1.font.size = Pt(9)
        p1.font.bold = True
        p1.font.color.rgb = border_c
        p1.alignment = PP_ALIGN.CENTER

        p2 = tf_tx.add_paragraph()
        p2.text = desc
        p2.font.name = "Arial"
        p2.font.size = Pt(8)
        p2.font.color.rgb = TEXT_DARK
        p2.alignment = PP_ALIGN.CENTER

        # Native Right Arrow (if not last)
        if i < 3:
            arr_x = cur_x + bx_w + Inches(0.08)
            arr = slide2.shapes.add_shape(MSO_SHAPE.RIGHT_ARROW, arr_x, bx_y + Inches(0.75), arr_w, Inches(0.35))
            arr.fill.solid()
            arr.fill.fore_color.rgb = SIH_BLUE
            arr.line.fill.background()

    add_footer(slide2, 2)

    # =========================================================================
    # SLIDE 3: TECHNICAL APPROACH (Native Architectural Flowchart Pipeline)
    # =========================================================================
    slide3 = prs.slides.add_slide(blank_layout)
    add_header(slide3, "TECHNICAL APPROACH", "Edge-first architecture: train offline, sync securely")

    # Native 6-Step Top Flowchart Pipeline
    pipe_y = Inches(1.22)
    pipe_w = Inches(1.35)
    pipe_h = Inches(1.3)
    p_arr_w = Inches(0.32)
    p_start_x = Inches(0.4)

    pipe_steps = [
        ("ADMIN / SITE", "SETUP\nCurriculum & Assets", LIGHT_BG, DARK_BLUE),
        ("TRAINING", "PACKAGE\nPreloaded 3D Model", LIGHT_BLUE_BG, SIH_BLUE),
        ("ANDROID", "APP / WEBAR\n₹10k Phone Access", LIGHT_AMBER_BG, AMBER),
        ("AR + AI", "ENGINE\n60 FPS Simulation", LIGHT_GREEN_BG, GREEN),
        ("ASSESSMENT", "+ LOCAL DB\nSHA-256 .dat File", LIGHT_BG, DARK_BLUE),
        ("SECURE", "SYNC\nEthereum Consensus", LIGHT_BLUE_BG, SIH_BLUE)
    ]

    for idx, (t1, t2, bg_col, border_col) in enumerate(pipe_steps):
        px = p_start_x + idx * (pipe_w + p_arr_w + Inches(0.05))

        p_box = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, px, pipe_y, pipe_w, pipe_h)
        p_box.fill.solid()
        p_box.fill.fore_color.rgb = bg_col
        p_box.line.color.rgb = border_col
        p_box.line.width = Pt(1.5)

        t_pipe = slide3.shapes.add_textbox(px, pipe_y + Inches(0.08), pipe_w, pipe_h - Inches(0.16))
        tf_p = t_pipe.text_frame
        tf_p.word_wrap = True
        p = tf_p.paragraphs[0]
        p.text = t1
        p.font.name = "Arial Black"
        p.font.size = Pt(8.5)
        p.font.bold = True
        p.font.color.rgb = border_col
        p.alignment = PP_ALIGN.CENTER

        p_sub = tf_p.add_paragraph()
        p_sub.text = t2
        p_sub.font.name = "Arial"
        p_sub.font.size = Pt(7.5)
        p_sub.font.color.rgb = TEXT_DARK
        p_sub.alignment = PP_ALIGN.CENTER

        if idx < 5:
            arr_px = px + pipe_w + Inches(0.02)
            arr_p = slide3.shapes.add_shape(MSO_SHAPE.RIGHT_ARROW, arr_px, pipe_y + Inches(0.48), p_arr_w, Inches(0.28))
            arr_p.fill.solid()
            arr_p.fill.fore_color.rgb = SIH_BLUE
            arr_p.line.fill.background()

    # Middle Split Section: Left = OFFLINE ZONE, Right = VERIFIABLE CERTIFICATION
    mid_y = Inches(2.7)
    mid_h = Inches(3.45)

    # Left: OFFLINE ZONE (Deep Mine)
    off_card = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), mid_y, Inches(5.9), mid_h)
    off_card.fill.solid()
    off_card.fill.fore_color.rgb = LIGHT_BLUE_BG
    off_card.line.color.rgb = SIH_BLUE
    off_card.line.width = Pt(1.5)

    tb_off = slide3.shapes.add_textbox(Inches(0.55), mid_y + Inches(0.08), Inches(5.6), mid_h - Inches(0.16))
    tf_off = tb_off.text_frame
    tf_off.word_wrap = True
    p = tf_off.paragraphs[0]
    p.text = "⚡ OFFLINE ZONE (UNDERGROUND DEEP MINE PIT)"
    p.font.name = "Arial Black"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = SIH_BLUE

    off_points = [
        ("Preloaded AR assets & site config: ", "Complete 3D colliery models cached locally on phone."),
        ("On-device AI state machine: ", "Evaluates procedure sequence and reaction timing without internet."),
        ("Encrypted local assessment/results: ", "Results stored in local .dat database sealed with SHA-256 digest."),
        ("Continuous training & scoring: ", "Workers practice and get graded autonomously in deep shafts."),
        ("Queued secure synchronization: ", "Pending records queue automatically for sync when network is detected."),
        ("Zero cloud dependence underground: ", "Mine site data is never continuously streamed to cloud servers.")
    ]
    for lbl, desc in off_points:
        p = tf_off.add_paragraph()
        p.space_after = Pt(2)
        r1 = p.add_run()
        r1.text = "• " + lbl
        r1.font.bold = True
        r1.font.size = Pt(8.5)
        r1.font.color.rgb = DARK_BLUE
        r2 = p.add_run()
        r2.text = desc
        r2.font.size = Pt(8)
        r2.font.color.rgb = TEXT_DARK

    # Right: VERIFIABLE CERTIFICATION (Native Vertical Flow)
    ver_card = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.5), mid_y, Inches(4.1), mid_h)
    ver_card.fill.solid()
    ver_card.fill.fore_color.rgb = LIGHT_GREEN_BG
    ver_card.line.color.rgb = GREEN
    ver_card.line.width = Pt(1.5)

    tb_ver = slide3.shapes.add_textbox(Inches(6.65), mid_y + Inches(0.08), Inches(3.8), mid_h - Inches(0.16))
    tf_ver = tb_ver.text_frame
    tf_ver.word_wrap = True
    p = tf_ver.paragraphs[0]
    p.text = "🛡️ VERIFIABLE CERTIFICATION"
    p.font.name = "Arial Black"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = GREEN
    p.alignment = PP_ALIGN.CENTER

    # 3 Native Vertical Step Cards inside right box
    v_steps = [
        ("1. Certificate + Embedded QR", "Contains worker ID, score & timestamp", LIGHT_BG, DARK_BLUE),
        ("2. NIST SHA-256 Hash Digest", "Mathematical proof of tamper-free record", LIGHT_BLUE_BG, SIH_BLUE),
        ("3. Ethereum Blockchain Anchor", "Public on-chain verification at /verify", LIGHT_AMBER_BG, AMBER)
    ]
    v_top = mid_y + Inches(0.42)
    for t_h, t_d, bg_c, bord_c in v_steps:
        vb = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.7), v_top, Inches(3.7), Inches(0.72))
        vb.fill.solid()
        vb.fill.fore_color.rgb = bg_c
        vb.line.color.rgb = bord_c
        vb.line.width = Pt(1.2)

        vtb = slide3.shapes.add_textbox(Inches(6.75), v_top + Inches(0.04), Inches(3.6), Inches(0.64))
        vtf = vtb.text_frame
        vtf.word_wrap = True
        vp1 = vtf.paragraphs[0]
        vp1.text = t_h
        vp1.font.name = "Arial Black"
        vp1.font.size = Pt(8.5)
        vp1.font.bold = True
        vp1.font.color.rgb = bord_c

        vp2 = vtf.add_paragraph()
        vp2.text = t_d
        vp2.font.size = Pt(7.5)
        vp2.font.color.rgb = TEXT_DARK
        v_top += Inches(0.92)

    # Bottom Technology Stack Bar
    t_bar = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), Inches(6.3), Inches(10.2), Inches(1.6))
    t_bar.fill.solid()
    t_bar.fill.fore_color.rgb = DARK_BLUE
    t_bar.line.color.rgb = AMBER
    t_bar.line.width = Pt(1.5)

    tb_ts = slide3.shapes.add_textbox(Inches(0.55), Inches(6.35), Inches(9.9), Inches(1.5))
    tf_ts = tb_ts.text_frame
    tf_ts.word_wrap = True
    p = tf_ts.paragraphs[0]
    p.text = "💻 PRODUCTION TECHNOLOGY STACK & CRYPTOGRAPHIC STANDARDS"
    p.font.name = "Arial Black"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = AMBER
    p.alignment = PP_ALIGN.CENTER

    ts_bullets = [
        ("Frontend & WebAR Engine : ", "React 18, TypeScript, Three.js (WebGL 60 FPS hardware acceleration), Tailwind CSS, Vite, Lucide Icons"),
        ("On-Device AI & Simulation : ", "State-Machine Procedural Validator, Spatial Raycasting, Gesture & Touch Orbit Controls, Vernacular Audio Engine"),
        ("Security & Cryptography : ", "NIST FIPS 180-4 SHA-256 Hashing, Merkle Trees, Salted Key Derivation, Tamper-Evident .dat Snapshots"),
        ("Ledger & Offline Persistence : ", "Ethereum / EVM Smart Contracts (Solidity), Ethers.js, Cloud Firestore Offline Cache, LocalStorage Edge DB")
    ]
    for lbl, desc in ts_bullets:
        p = tf_ts.add_paragraph()
        p.space_after = Pt(2)
        r1 = p.add_run()
        r1.text = "• " + lbl
        r1.font.bold = True
        r1.font.size = Pt(8.5)
        r1.font.color.rgb = AMBER
        r2 = p.add_run()
        r2.text = desc
        r2.font.size = Pt(8)
        r2.font.color.rgb = WHITE

    add_footer(slide3, 3)

    # =========================================================================
    # SLIDE 4: FEASIBILITY AND VIABILITY (Structured Aligned Native Cards)
    # =========================================================================
    slide4 = prs.slides.add_slide(blank_layout)
    add_header(slide4, "FEASIBILITY & VIABILITY", "Build a small, polished end-to-end prototype first")

    # Three Aligned Columns (Top Section)
    c_w = Inches(3.15)
    c_h = Inches(4.3)
    c_y = Inches(1.25)

    # Column 1: FEASIBILITY
    fc1 = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), c_y, c_w, c_h)
    fc1.fill.solid()
    fc1.fill.fore_color.rgb = LIGHT_BLUE_BG
    fc1.line.color.rgb = SIH_BLUE
    fc1.line.width = Pt(1.5)

    ftb1 = slide4.shapes.add_textbox(Inches(0.5), c_y + Inches(0.08), c_w - Inches(0.2), c_h - Inches(0.16))
    ftf1 = ftb1.text_frame
    ftf1.word_wrap = True
    p = ftf1.paragraphs[0]
    p.text = "FEASIBILITY"
    p.font.name = "Arial Black"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = SIH_BLUE
    p.alignment = PP_ALIGN.CENTER

    f_items = [
        ("Mid-range Android target: ", "Optimized for Android 10+ smartphones without requiring external headsets."),
        ("WebAR zero-friction: ", "Runs directly in mobile browsers, eliminating app store installation barriers."),
        ("Preloaded site packages: ", "Executes 100% offline in underground mine shafts in under 10 seconds."),
        ("On-device AI inference: ", "Client-side evaluation preserves zero battery drain and high responsiveness."),
        ("Two complete safety modules: ", "Interactive Continuous Miner Drill and 5-Step Lockout/Tagout."),
        ("100/100 automated unit tests: ", "12 test suites passing across authentication, crypto, and 3D engine.")
    ]
    for lbl, desc in f_items:
        p = ftf1.add_paragraph()
        p.space_after = Pt(2)
        r1 = p.add_run()
        r1.text = "• " + lbl
        r1.font.bold = True
        r1.font.size = Pt(8.5)
        r1.font.color.rgb = DARK_BLUE
        r2 = p.add_run()
        r2.text = desc
        r2.font.size = Pt(8)
        r2.font.color.rgb = TEXT_DARK

    # Column 2: CHALLENGES & RISKS
    fc2 = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(3.92), c_y, c_w, c_h)
    fc2.fill.solid()
    fc2.fill.fore_color.rgb = LIGHT_AMBER_BG
    fc2.line.color.rgb = AMBER
    fc2.line.width = Pt(1.5)

    ftb2 = slide4.shapes.add_textbox(Inches(4.02), c_y + Inches(0.08), c_w - Inches(0.2), c_h - Inches(0.16))
    ftf2 = ftb2.text_frame
    ftf2.word_wrap = True
    p = ftf2.paragraphs[0]
    p.text = "CHALLENGES / RISKS"
    p.font.name = "Arial Black"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = AMBER
    p.alignment = PP_ALIGN.CENTER

    risk_items = [
        ("Low-light optical tracking: ", "Dark coal chambers and dusty air disrupt AR camera feature detection."),
        ("Tribal language & literacy: ", "Workers struggle with written English instructions and tech hesitation."),
        ("Offline data tampering: ", "Risk of tampering with locally stored safety training scores in deep pits."),
        ("Certificate privacy: ", "Worker PII must be protected while allowing public verification."),
        ("Device performance: ", "Thermal throttling and battery drain during intensive 3D rendering.")
    ]
    for lbl, desc in risk_items:
        p = ftf2.add_paragraph()
        p.space_after = Pt(4)
        r1 = p.add_run()
        r1.text = "• " + lbl
        r1.font.bold = True
        r1.font.size = Pt(8.5)
        r1.font.color.rgb = RED
        r2 = p.add_run()
        r2.text = desc
        r2.font.size = Pt(8)
        r2.font.color.rgb = TEXT_DARK

    # Column 3: MITIGATION STRATEGIES
    fc3 = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.45), c_y, c_w, c_h)
    fc3.fill.solid()
    fc3.fill.fore_color.rgb = LIGHT_GREEN_BG
    fc3.line.color.rgb = GREEN
    fc3.line.width = Pt(1.5)

    ftb3 = slide4.shapes.add_textbox(Inches(7.55), c_y + Inches(0.08), c_w - Inches(0.2), c_h - Inches(0.16))
    ftf3 = ftb3.text_frame
    ftf3.word_wrap = True
    p = ftf3.paragraphs[0]
    p.text = "MITIGATION STRATEGIES"
    p.font.name = "Arial Black"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = GREEN
    p.alignment = PP_ALIGN.CENTER

    mit_items = [
        ("High-contrast WebGL virtual mode: ", "Dual-mode fallback with gyro and touch orbit controls requiring zero camera tracking."),
        ("Santali & Hindi voice HUD: ", "Multilingual audio guidance + large intuitive color-coded touch icons."),
        ("NIST SHA-256 Merkle sealing: ", "Local .dat files are cryptographically sealed; any modification triggers immediate tamper rejection."),
        ("Zero-knowledge hash verification: ", "Only cryptographic hashes stored on-chain; sensitive worker PII remains private."),
        ("Lightweight 60 FPS Three.js: ", "Low polygon models and optimized WebGL shaders guarantee 60 FPS without overheating.")
    ]
    for lbl, desc in mit_items:
        p = ftf3.add_paragraph()
        p.space_after = Pt(3)
        r1 = p.add_run()
        r1.text = "• " + lbl
        r1.font.bold = True
        r1.font.size = Pt(8.5)
        r1.font.color.rgb = GREEN
        r2 = p.add_run()
        r2.text = desc
        r2.font.size = Pt(8)
        r2.font.color.rgb = TEXT_DARK

    # Bottom Native 6-Step Implementation Path (Native Shapes & Arrows)
    bot_r = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), Inches(5.7), Inches(10.2), Inches(2.2))
    bot_r.fill.solid()
    bot_r.fill.fore_color.rgb = WHITE
    bot_r.line.color.rgb = CARD_BORDER
    bot_r.line.width = Pt(1.5)

    tb_ip = slide4.shapes.add_textbox(Inches(0.55), Inches(5.75), Inches(9.9), Inches(0.35))
    tf_ip = tb_ip.text_frame
    p = tf_ip.paragraphs[0]
    p.text = "IMPLEMENTATION PATH: PROTOTYPE ➔ SCALED INDUSTRIAL DEPLOYMENT"
    p.font.name = "Arial Black"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = DARK_BLUE

    steps_path = [
        ("1", "AR Module 1\nMining Excavator"),
        ("2", "AI Assessment\nSequence Logic"),
        ("3", "Security Layer\nNIST SHA-256"),
        ("4", "Blockchain Cert\nEthereum Mint"),
        ("5", "Offline Sync\n.dat Database"),
        ("6", "Multi-Site Portal\nDGMS Dashboard")
    ]
    ip_w = Inches(1.35)
    ip_h = Inches(1.35)
    ip_arr_w = Inches(0.28)
    ip_y = Inches(6.2)
    ip_start_x = Inches(0.5)

    for i, (num, label) in enumerate(steps_path):
        cur_ix = ip_start_x + i * (ip_w + ip_arr_w + Inches(0.08))

        ibox = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cur_ix, ip_y, ip_w, ip_h)
        ibox.fill.solid()
        ibox.fill.fore_color.rgb = LIGHT_BG
        ibox.line.color.rgb = SIH_BLUE
        ibox.line.width = Pt(1.5)

        # Number pill
        ipill = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cur_ix + Inches(0.1), ip_y + Inches(0.1), Inches(0.35), Inches(0.28))
        ipill.fill.solid()
        ipill.fill.fore_color.rgb = SIH_BLUE
        ipill.line.fill.background()
        tf_ipill = ipill.text_frame
        p_ipill = tf_ipill.paragraphs[0]
        p_ipill.text = num
        p_ipill.font.name = "Arial Black"
        p_ipill.font.size = Pt(10)
        p_ipill.font.bold = True
        p_ipill.font.color.rgb = WHITE
        p_ipill.alignment = PP_ALIGN.CENTER

        # Text
        itb = slide4.shapes.add_textbox(cur_ix, ip_y + Inches(0.42), ip_w, ip_h - Inches(0.45))
        itf = itb.text_frame
        itf.word_wrap = True
        ip_txt = itf.paragraphs[0]
        ip_txt.text = label
        ip_txt.font.name = "Arial"
        ip_txt.font.size = Pt(8)
        ip_txt.font.bold = True
        ip_txt.font.color.rgb = DARK_BLUE
        ip_txt.alignment = PP_ALIGN.CENTER

        if i < 5:
            arr_ix = cur_ix + ip_w + Inches(0.02)
            arr_i = slide4.shapes.add_shape(MSO_SHAPE.RIGHT_ARROW, arr_ix, ip_y + Inches(0.5), ip_arr_w, Inches(0.25))
            arr_i.fill.solid()
            arr_i.fill.fore_color.rgb = SIH_BLUE
            arr_i.line.fill.background()

    add_footer(slide4, 4)

    # =========================================================================
    # SLIDE 5: IMPACT AND BENEFITS (Native Comparison Table & Scope Pills)
    # =========================================================================
    slide5 = prs.slides.add_slide(blank_layout)
    add_header(slide5, "IMPACT & BENEFITS", "From one training module to a scalable industrial safety platform")

    # Left Column: TARGET AUDIENCE & KEY BENEFITS
    left_w = Inches(4.8)
    left_h = Inches(4.7)
    card_l = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), Inches(1.25), left_w, left_h)
    card_l.fill.solid()
    card_l.fill.fore_color.rgb = LIGHT_BLUE_BG
    card_l.line.color.rgb = SIH_BLUE
    card_l.line.width = Pt(1.5)

    tb_l = slide5.shapes.add_textbox(Inches(0.55), Inches(1.3), left_w - Inches(0.2), left_h - Inches(0.15))
    tf_l = tb_l.text_frame
    tf_l.word_wrap = True

    p = tf_l.paragraphs[0]
    p.text = "TARGET AUDIENCE & KEY BENEFITS"
    p.font.name = "Arial Black"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = SIH_BLUE

    p_aud = tf_l.add_paragraph()
    p_aud.space_before = Pt(4)
    r = p_aud.add_run()
    r.text = "1. Target Audience :"
    r.font.name = "Arial Black"
    r.font.size = Pt(9.5)
    r.font.bold = True
    r.font.color.rgb = DARK_BLUE

    aud_list = [
        "Mining & manufacturing workers: underground coal pits & metal smelting plants.",
        "Contract & newly inducted tribal laborers: direct training in Santali & Hindi.",
        "Safety trainers & compliance supervisors: automated tracking & instant grading.",
        "Government & institutional verifiers (DGMS): public zero-login verification."
    ]
    for a in aud_list:
        p = tf_l.add_paragraph()
        r = p.add_run()
        r.text = "• " + a
        r.font.size = Pt(8)
        r.font.color.rgb = TEXT_DARK

    p_ben = tf_l.add_paragraph()
    p_ben.space_before = Pt(6)
    r = p_ben.add_run()
    r.text = "2. Measurable Key Benefits :"
    r.font.name = "Arial Black"
    r.font.size = Pt(9.5)
    r.font.bold = True
    r.font.color.rgb = DARK_BLUE

    ben_list = [
        "Higher engagement through practical AR: builds real spatial muscle memory.",
        "Measurable competency + audit trail: replaces easily faked paper attendance.",
        "Lower dependence on physical drills: saves ₹100s of crores in mock mine setup.",
        "Offline reach for remote worksites: operates where cloud tools fail completely.",
        "Tamper-evident certification: NIST SHA-256 + Ethereum public verification."
    ]
    for b in ben_list:
        p = tf_l.add_paragraph()
        r = p.add_run()
        r.text = "• " + b
        r.font.size = Pt(8)
        r.font.color.rgb = TEXT_DARK

    # Right Column: Native Comparison Table
    right_w = Inches(5.15)
    table_shape = slide5.shapes.add_table(6, 4, Inches(5.45), Inches(1.25), right_w, left_h)
    tbl = table_shape.table
    tbl.columns[0].width = Inches(1.95)
    tbl.columns[1].width = Inches(1.0)
    tbl.columns[2].width = Inches(1.0)
    tbl.columns[3].width = Inches(1.2)

    headers = ["Feature", "Manuals", "VR Rigs", "SafeAR"]
    for col_idx, h_text in enumerate(headers):
        cell = tbl.cell(0, col_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = DARK_BLUE
        p = cell.text_frame.paragraphs[0]
        p.text = h_text
        p.font.name = "Arial Black"
        p.font.size = Pt(8.5)
        p.font.bold = True
        p.font.color.rgb = WHITE
        p.alignment = PP_ALIGN.CENTER

    t_rows = [
        ("Hardware Cost", "Zero (Paper)", "₹50k+ VR", "✅ ₹10k Phone"),
        ("Deep Mine Offline", "✅ Yes (Passive)", "❌ Needs PC", "✅ .dat DB"),
        ("Santali & Hindi", "❌ English", "❌ English", "✅ Synced"),
        ("Tamper-Proof", "❌ Forged", "❌ Local", "✅ SHA-256"),
        ("AI Competency", "❌ None", "⚠️ Basic", "✅ State AI")
    ]
    for r_idx, row in enumerate(t_rows):
        for c_idx, val in enumerate(row):
            cell = tbl.cell(r_idx + 1, c_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = LIGHT_BG if r_idx % 2 == 0 else WHITE
            p = cell.text_frame.paragraphs[0]
            p.text = val
            p.font.name = "Arial"
            p.font.size = Pt(8)
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

    # Bottom Native Expansion Scale Bar
    sc_card = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), Inches(6.15), Inches(10.2), Inches(1.75))
    sc_card.fill.solid()
    sc_card.fill.fore_color.rgb = DARK_BLUE
    sc_card.line.color.rgb = GREEN
    sc_card.line.width = Pt(1.5)

    tb_sc = slide5.shapes.add_textbox(Inches(0.55), Inches(6.2), Inches(9.9), Inches(1.65))
    tf_sc = tb_sc.text_frame
    tf_sc.word_wrap = True
    p = tf_sc.paragraphs[0]
    p.text = "SCALE: EXTENSIBLE MULTI-HAZARD SCENARIOS ACROSS MULTIPLE SITES & STATES"
    p.font.name = "Arial Black"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = GREEN
    p.alignment = PP_ALIGN.CENTER

    # Native Pills inside bottom scale bar
    pills_data = ["FIRE / EXPLOSION", "TOXIC GAS LEAK", "CONFINED SPACE", "HEAVY MACHINERY", "MINE EVACUATION"]
    pill_w = Inches(1.8)
    pill_h = Inches(0.45)
    pill_y = Inches(6.65)
    p_start = Inches(0.6)

    for i, p_txt in enumerate(pills_data):
        px = p_start + i * (pill_w + Inches(0.18))
        pl = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, px, pill_y, pill_w, pill_h)
        pl.fill.solid()
        pl.fill.fore_color.rgb = SIH_BLUE
        pl.line.fill.background()

        ptf = pl.text_frame
        pp = ptf.paragraphs[0]
        pp.text = p_txt
        pp.font.name = "Arial Black"
        pp.font.size = Pt(7.5)
        pp.font.bold = True
        pp.font.color.rgb = WHITE
        pp.alignment = PP_ALIGN.CENTER

    tb_reg = slide5.shapes.add_textbox(Inches(0.6), Inches(7.25), Inches(9.8), Inches(0.4))
    tf_reg = tb_reg.text_frame
    p = tf_reg.paragraphs[0]
    p.text = "Deployable across major mining clusters: Jharia, Dhanbad, Bokaro, Ranchi, and Eastern Coalfields Ltd."
    p.font.name = "Arial"
    p.font.size = Pt(8)
    p.font.color.rgb = WHITE
    p.alignment = PP_ALIGN.CENTER

    add_footer(slide5, 5)

    # =========================================================================
    # SLIDE 6: RESEARCH AND REFERENCES (Exact Match to User Previous Format)
    # =========================================================================
    slide6 = prs.slides.add_slide(blank_layout)
    add_header(slide6, "RESEARCH & REFERENCES", "Source basis and technical areas to verify before final SIH submission")

    # Left Column: PROBLEM / POLICY BASIS & RESEARCH
    rw_l = Inches(4.9)
    rh_l = Inches(6.6)
    r_card_l = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.4), Inches(1.25), rw_l, rh_l)
    r_card_l.fill.solid()
    r_card_l.fill.fore_color.rgb = LIGHT_BLUE_BG
    r_card_l.line.color.rgb = SIH_BLUE
    r_card_l.line.width = Pt(1.5)

    tb_rl = slide6.shapes.add_textbox(Inches(0.55), Inches(1.3), rw_l - Inches(0.2), rh_l - Inches(0.15))
    tf_rl = tb_rl.text_frame
    tf_rl.word_wrap = True

    p = tf_rl.paragraphs[0]
    p.text = "PROBLEM / POLICY BASIS"
    p.font.name = "Arial Black"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = SIH_BLUE

    p_refs1 = [
        ("SIH 2026 Problem Statement 26041 : ", "Supplied problem statement by the Ministry."),
        ("Department of Higher & Technical Education, Government of Jharkhand : ", "Organization named in the PS."),
        ("PS Requirements : ", "Android 10+, WebAR modules, AI assessment, QR certificate verification, Hindi & Santali localization, offline operation, web admin dashboard."),
        ("PS Theme : ", "Smart Education (Vocational & Skill Training). Sub-theme: Blockchain & Cybersecurity.")
    ]
    for lbl, desc in p_refs1:
        p = tf_rl.add_paragraph()
        p.space_after = Pt(3)
        r1 = p.add_run()
        r1.text = "• " + lbl
        r1.font.bold = True
        r1.font.size = Pt(8.5)
        r1.font.color.rgb = DARK_BLUE
        r2 = p.add_run()
        r2.text = desc
        r2.font.size = Pt(8)
        r2.font.color.rgb = TEXT_DARK

    p_t = tf_rl.add_paragraph()
    p_t.space_before = Pt(8)
    p_t.text = "TECHNICAL RESEARCH AREAS"
    p_t.font.name = "Arial Black"
    p_t.font.size = Pt(10)
    p_t.font.bold = True
    p_t.font.color.rgb = SIH_BLUE

    p_refs2 = [
        ("Google ARCore & WebGL : ", "Mobile AR foundations & high-speed 3D rendering."),
        ("Android Developers : ", "Offline-first / local data synchronization patterns."),
        ("OWASP Mobile Top 10 : ", "Secure authentication, authorization & mobile security guidance."),
        ("NIST FIPS 180-4 : ", "Cryptographic hashing & tamper-evident Merkle digest standards."),
        ("Ethereum & EVM : ", "Transaction consensus, gas optimization & verifiable credential issuance.")
    ]
    for lbl, desc in p_refs2:
        p = tf_rl.add_paragraph()
        p.space_after = Pt(2)
        r1 = p.add_run()
        r1.text = "• " + lbl
        r1.font.bold = True
        r1.font.size = Pt(8.5)
        r1.font.color.rgb = DARK_BLUE
        r2 = p.add_run()
        r2.text = desc
        r2.font.size = Pt(8)
        r2.font.color.rgb = TEXT_DARK

    # Right Column: LIVE PRODUCTION DEMOS & VERIFIED ARTIFACTS
    rw_r = Inches(5.1)
    r_card_r = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(5.5), Inches(1.25), rw_r, rh_l)
    r_card_r.fill.solid()
    r_card_r.fill.fore_color.rgb = DARK_BLUE
    r_card_r.line.color.rgb = AMBER
    r_card_r.line.width = Pt(1.5)

    tb_rr = slide6.shapes.add_textbox(Inches(5.65), Inches(1.3), rw_r - Inches(0.2), rh_l - Inches(0.15))
    tf_rr = tb_rr.text_frame
    tf_rr.word_wrap = True

    p = tf_rr.paragraphs[0]
    p.text = "🔗 LIVE EVALUATOR PROOF LINKS & ARTIFACTS"
    p.font.name = "Arial Black"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = AMBER

    links_data = [
        ("Live Production Application : ", "https://sihprototype-ten.vercel.app\n(Three-Role Authentication: Worker, Trainer, Admin)"),
        ("Interactive 3D Simulation : ", "https://sihprototype-ten.vercel.app/training/mining-basic-scene\n(60 FPS WebGL Mining Excavator, LOTO Switch & Dust)"),
        ("Public Blockchain Verifier : ", "https://sihprototype-ten.vercel.app/verify/SAFEAR-2026-DEMO01\n(Zero-login public on-chain Ethereum consensus verification)"),
        ("Automated Software Test Suite : ", "100/100 Passed Unit Tests across 12 suites (Auth, Crypto, 3D Engine, Firebase Persistence)"),
        ("Offline Database Inspector : ", "Accessible under Settings: live SHA-256 account inspection & .dat binary export/import")
    ]
    for lbl, desc in links_data:
        p = tf_rr.add_paragraph()
        p.space_after = Pt(6)
        r1 = p.add_run()
        r1.text = "• " + lbl
        r1.font.name = "Arial Black"
        r1.font.size = Pt(9)
        r1.font.bold = True
        r1.font.color.rgb = AMBER
        r2 = p.add_run()
        r2.text = desc
        r2.font.name = "Arial"
        r2.font.size = Pt(8.5)
        r2.font.color.rgb = WHITE

    add_footer(slide6, 6)

    # Save Native Presentation
    output_filename = "SIH_2026_PS26041_SHADOW_STACK_Native_Format.pptx"
    output_path = os.path.join(os.getcwd(), output_filename)
    prs.save(output_path)
    print(f"SUCCESS: Native format presentation saved to {output_path}")

    # Export PDF via PowerPoint COM
    import win32com.client
    pdf_output = os.path.join(os.getcwd(), "SIH_2026_PS26041_SHADOW_STACK_Native_Format.pdf")
    try:
        powerpoint = win32com.client.Dispatch("Powerpoint.Application")
        deck = powerpoint.Presentations.Open(output_path, WithWindow=False)
        deck.SaveAs(pdf_output, 32)
        deck.Close()
        powerpoint.Quit()
        print(f"SUCCESS: Exported PDF to {pdf_output}")
    except Exception as e:
        print("PDF export note:", e)

if __name__ == "__main__":
    build_native_format_deck()
