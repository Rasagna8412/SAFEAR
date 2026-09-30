import matplotlib.pyplot as plt
import matplotlib.patches as patches

def draw_flowchart_1():
    # Flowchart for Slide 2: 4-Step Training Pipeline
    fig, ax = plt.subplots(figsize=(10.5, 2.2), dpi=300)
    ax.set_xlim(0, 10.5)
    ax.set_ylim(0, 2.2)
    ax.axis('off')

    steps = [
        ("01", "HAZARD DETECTION", "Identify gas vents, roof\ncracks & high-voltage", "#0070C0", "#F0F9FF"),
        ("02", "PPE COMPLIANCE", "Verify hard hat, headlamp\n& high-vis safety vest", "#D97706", "#FFFBEB"),
        ("03", "5-STEP LOTO DRILL", "De-energize, lock, tag,\ndissipate & test zero energy", "#10B981", "#ECFDF5"),
        ("04", "AI & BLOCKCHAIN", "On-device AI scoring, SHA-256\nseal & Ethereum QR mint", "#0F172A", "#F8FAFC")
    ]

    box_w = 2.15
    box_h = 1.6
    y_pos = 0.3

    for idx, (num, title, desc, border_col, bg_col) in enumerate(steps):
        x_pos = 0.25 + idx * 2.55

        # Card box
        box = patches.FancyBboxPatch(
            (x_pos, y_pos), box_w, box_h,
            boxstyle="round,pad=0.08,rounding_size=0.15",
            linewidth=2, edgecolor=border_col, facecolor=bg_col
        )
        ax.add_patch(box)

        # Step number pill
        pill = patches.FancyBboxPatch(
            (x_pos + 0.15, y_pos + box_h - 0.35), 0.55, 0.28,
            boxstyle="round,pad=0.04,rounding_size=0.08",
            linewidth=0, facecolor=border_col
        )
        ax.add_patch(pill)
        ax.text(x_pos + 0.425, y_pos + box_h - 0.21, num, color="white", fontsize=10, fontweight="bold", ha="center", va="center")

        # Step title
        ax.text(x_pos + 0.8, y_pos + box_h - 0.21, title, color=border_col, fontsize=8.5, fontweight="bold", ha="left", va="center")

        # Step desc
        ax.text(x_pos + box_w/2, y_pos + 0.55, desc, color="#1E293B", fontsize=8, ha="center", va="center", multialignment="center")

        # Connecting Arrow (if not last)
        if idx < 3:
            arrow_x = x_pos + box_w + 0.05
            arrow = patches.FancyArrowPatch(
                (arrow_x, y_pos + box_h/2), (arrow_x + 0.3, y_pos + box_h/2),
                arrowstyle="->,head_width=0.35,head_length=0.4",
                color="#0070C0", linewidth=2.5
            )
            ax.add_patch(arrow)

    plt.tight_layout()
    plt.savefig("flowchart_slide2.png", bbox_inches='tight', transparent=True)
    plt.close()
    print("Saved flowchart_slide2.png")

def draw_flowchart_2():
    # Flowchart for Slide 3: Edge-First Architectural Pipeline
    fig, ax = plt.subplots(figsize=(10.5, 3.2), dpi=300)
    ax.set_xlim(0, 10.5)
    ax.set_ylim(0, 3.2)
    ax.axis('off')

    stages = [
        ("PRELOAD DRILLS", "Site 3D Scenarios\n& Colliery Config", "#1F4E79", "#F0F9FF"),
        ("OFFLINE ZONE", "Underground Pits\nThree.js 60 FPS AR", "#D97706", "#FFFBEB"),
        ("AI ASSESSMENT", "State-Machine Evaluation\nSequence & Reaction", "#0284C7", "#F0F9FF"),
        ("LOCAL .DAT DB", "NIST SHA-256 Seal\nMerkle Integrity Hash", "#DC2626", "#FEF2F2"),
        ("SURFACE SYNC", "Auto-Queued Upload\nFirebase Cloud Store", "#10B981", "#ECFDF5"),
        ("BLOCKCHAIN", "Ethereum Smart Contract\nPublic QR Verifier", "#0F172A", "#F8FAFC")
    ]

    box_w = 1.45
    box_h = 2.0
    y_pos = 0.6

    for idx, (title, desc, border_col, bg_col) in enumerate(stages):
        x_pos = 0.2 + idx * 1.72

        # Card box
        box = patches.FancyBboxPatch(
            (x_pos, y_pos), box_w, box_h,
            boxstyle="round,pad=0.08,rounding_size=0.15",
            linewidth=2, edgecolor=border_col, facecolor=bg_col
        )
        ax.add_patch(box)

        # Stage Number
        ax.text(x_pos + box_w/2, y_pos + box_h - 0.3, f"STEP {idx+1}", color=border_col, fontsize=8.5, fontweight="bold", ha="center", va="center")

        # Divider line
        ax.plot([x_pos + 0.15, x_pos + box_w - 0.15], [y_pos + box_h - 0.55, y_pos + box_h - 0.55], color=border_col, linewidth=1, alpha=0.5)

        # Stage Title
        ax.text(x_pos + box_w/2, y_pos + box_h - 0.85, title, color="#0F172A", fontsize=8, fontweight="bold", ha="center", va="center")

        # Stage Desc
        ax.text(x_pos + box_w/2, y_pos + 0.5, desc, color="#334155", fontsize=7.2, ha="center", va="center", multialignment="center")

        # Arrow to next
        if idx < 5:
            arr_x = x_pos + box_w + 0.03
            arr = patches.FancyArrowPatch(
                (arr_x, y_pos + box_h/2), (arr_x + 0.21, y_pos + box_h/2),
                arrowstyle="->,head_width=0.3,head_length=0.35",
                color="#0070C0", linewidth=2.2
            )
            ax.add_patch(arr)

    # Top Banner in diagram
    banner = patches.FancyBboxPatch(
        (0.2, 2.75), 10.1, 0.35,
        boxstyle="round,pad=0.04,rounding_size=0.08",
        linewidth=0, facecolor="#0070C0"
    )
    ax.add_patch(banner)
    ax.text(5.25, 2.92, "END-TO-END PIPELINE: ZERO INTERNET PIT DRILL → SURFACE SYNC → ETHEREUM CONSENSUS", color="white", fontsize=8.5, fontweight="bold", ha="center", va="center")

    plt.tight_layout()
    plt.savefig("flowchart_slide3.png", bbox_inches='tight', transparent=True)
    plt.close()
    print("Saved flowchart_slide3.png")

if __name__ == "__main__":
    draw_flowchart_1()
    draw_flowchart_2()
