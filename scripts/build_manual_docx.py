#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script hoàn chỉnh xây dựng tài liệu Word: HUONG_DAN_SU_DUNG_CO_TU_HERITAGE_AR.docx
Biên soạn bởi chuyên gia hướng dẫn sử dụng phần mềm dành cho học sinh THPT.
Chủ đề: Văn hóa Cơ Tu – Di sản đại ngàn Tây Giang.
"""

import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

# ----------------- ĐỊNH NGHĨA BẢNG MÀU VĂN HÓA -----------------
HEX_FOREST_GREEN = "1E3A2B"   # Xanh lá rừng già Tây Giang
HEX_OCHRE_GOLD   = "C68A4C"   # Vàng đất thổ cẩm Cơ Tu
HEX_WOOD_BROWN   = "5A381E"   # Nâu gỗ lim cột Gươl
HEX_CREAM_SAND   = "F8F6F0"   # Kem cát vỏ cây
HEX_TIP_AMBER    = "FEF7EC"   # Vàng nhạt hộp mẹo hay
HEX_BODY_DARK    = "2A2E2B"   # Xám than chữ chính dễ đọc
HEX_BORDER_MUTED = "D5DCD7"   # Xám viền nhẹ nhàng
HEX_WHITE        = "FFFFFF"

RGB_FOREST_GREEN = RGBColor(0x1E, 0x3A, 0x2B)
RGB_OCHRE_GOLD   = RGBColor(0xC6, 0x8A, 0x4C)
RGB_WOOD_BROWN   = RGBColor(0x5A, 0x38, 0x1E)
RGB_BODY_DARK    = RGBColor(0x2A, 0x2E, 0x2B)
RGB_MUTED_GRAY   = RGBColor(0x66, 0x70, 0x6A)

FONT_PRIMARY = "Arial"

# ----------------- CÁC HÀM TIỆN ÍCH XML & ĐỊNH DẠNG -----------------

def set_cell_background(cell, color_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=140, bottom=140, left=200, right=200):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'''
        <w:tcMar {nsdecls("w")}>
            <w:top w:w="{top}" w:type="dxa"/>
            <w:bottom w:w="{bottom}" w:type="dxa"/>
            <w:left w:w="{left}" w:type="dxa"/>
            <w:right w:w="{right}" w:type="dxa"/>
        </w:tcMar>
    ''')
    tcPr.append(tcMar)

def set_cell_border(cell, **kwargs):
    tcPr = cell._tc.get_or_add_tcPr()
    borders_elm = ['<w:tcBorders %s>' % nsdecls('w')]
    for edge in ('top', 'left', 'bottom', 'right', 'insideH', 'insideV'):
        edge_data = kwargs.get(edge)
        if edge_data:
            tag = f'w:{edge}'
            val = edge_data.get('val', 'single')
            sz = edge_data.get('sz', 4)
            space = edge_data.get('space', 0)
            color = edge_data.get('color', 'auto')
            borders_elm.append(f'<{tag} w:val="{val}" w:sz="{sz}" w:space="{space}" w:color="{color}"/>')
        else:
            borders_elm.append(f'<w:{edge} w:val="none"/>')
    borders_elm.append('</w:tcBorders>')
    tcPr.append(parse_xml(''.join(borders_elm)))

def add_page_number_field(run):
    fldChar1 = parse_xml(r'<w:fldChar %s w:fldCharType="begin"/>' % nsdecls('w'))
    instrText = parse_xml(r'<w:instrText %s xml:space="preserve"> PAGE </w:instrText>' % nsdecls('w'))
    fldChar2 = parse_xml(r'<w:fldChar %s w:fldCharType="separate"/>' % nsdecls('w'))
    fldChar3 = parse_xml(r'<w:fldChar %s w:fldCharType="end"/>' % nsdecls('w'))
    r = run._r
    r.append(fldChar1)
    r.append(instrText)
    r.append(fldChar2)
    r.append(fldChar3)

def add_header_paragraph(doc, text, level=1):
    p = doc.add_paragraph()
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = FONT_PRIMARY
    run.bold = True

    if level == 1:
        p.paragraph_format.space_before = Pt(20)
        p.paragraph_format.space_after = Pt(8)
        run.font.size = Pt(15.5)
        run.font.color.rgb = RGB_FOREST_GREEN
        pBdr = parse_xml(f'''
            <w:pBdr {nsdecls("w")}>
                <w:bottom w:val="single" w:sz="14" w:space="5" w:color="{HEX_OCHRE_GOLD}"/>
            </w:pBdr>
        ''')
        p._p.get_or_add_pPr().append(pBdr)
    elif level == 2:
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(6)
        run.font.size = Pt(13)
        run.font.color.rgb = RGB_OCHRE_GOLD
    elif level == 3:
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(4)
        run.font.size = Pt(11)
        run.font.color.rgb = RGB_WOOD_BROWN

    return p

def add_body_paragraph(doc, text, bold_prefix="", italic=False):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(5)
    p.paragraph_format.line_spacing = 1.25

    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = FONT_PRIMARY
        r_pre.font.size = Pt(10.5)
        r_pre.bold = True
        r_pre.font.color.rgb = RGB_BODY_DARK

    run = p.add_run(text)
    run.font.name = FONT_PRIMARY
    run.font.size = Pt(10.5)
    run.italic = italic
    run.font.color.rgb = RGB_BODY_DARK
    return p

def add_bullet_point(doc, text, bold_prefix=""):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_before = Pt(1)
    p.paragraph_format.space_after = Pt(3.5)
    p.paragraph_format.line_spacing = 1.2

    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = FONT_PRIMARY
        r_pre.font.size = Pt(10.5)
        r_pre.bold = True
        r_pre.font.color.rgb = RGB_BODY_DARK

    run = p.add_run(text)
    run.font.name = FONT_PRIMARY
    run.font.size = Pt(10.5)
    run.font.color.rgb = RGB_BODY_DARK
    return p

def add_numbered_step(doc, step_num, step_title, step_desc):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(3)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.22

    r_num = p.add_run(f"Bước {step_num}: ")
    r_num.font.name = FONT_PRIMARY
    r_num.font.size = Pt(10.5)
    r_num.bold = True
    r_num.font.color.rgb = RGB_OCHRE_GOLD

    r_title = p.add_run(f"{step_title} — ")
    r_title.font.name = FONT_PRIMARY
    r_title.font.size = Pt(10.5)
    r_title.bold = True
    r_title.font.color.rgb = RGB_FOREST_GREEN

    r_desc = p.add_run(step_desc)
    r_desc.font.name = FONT_PRIMARY
    r_desc.font.size = Pt(10.5)
    r_desc.font.color.rgb = RGB_BODY_DARK
    return p

def add_callout_box(doc, title, content_lines, box_type="info"):
    if box_type == "tip":
        bg_color = HEX_TIP_AMBER
        border_color = HEX_OCHRE_GOLD
        title_color = RGB_OCHRE_GOLD
        icon = "💡 MẸO NHỎ CHO HỌC SINH:"
    elif box_type == "warning":
        bg_color = HEX_TIP_AMBER
        border_color = HEX_WOOD_BROWN
        title_color = RGB_WOOD_BROWN
        icon = "⚠️ LƯU Ý QUAN TRỌNG:"
    elif box_type == "discovery":
        bg_color = "EAF2ED"
        border_color = HEX_FOREST_GREEN
        title_color = RGB_FOREST_GREEN
        icon = "✨ KHÁM PHÁ THÚ VỊ:"
    else:
        bg_color = HEX_CREAM_SAND
        border_color = HEX_FOREST_GREEN
        title_color = RGB_FOREST_GREEN
        icon = "📌 HƯỚNG DẪN BỔ TRỢ:"

    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    cell = table.cell(0, 0)
    cell.width = Inches(6.5)
    set_cell_background(cell, bg_color)
    set_cell_margins(cell, top=140, bottom=140, left=200, right=200)
    set_cell_border(cell, left={"sz": 28, "val": "single", "color": border_color})

    p0 = cell.paragraphs[0]
    p0.paragraph_format.space_before = Pt(2)
    p0.paragraph_format.space_after = Pt(3)
    r0 = p0.add_run(f"{icon} {title}")
    r0.font.name = FONT_PRIMARY
    r0.font.size = Pt(10.5)
    r0.bold = True
    r0.font.color.rgb = title_color

    for line in content_lines:
        p = cell.add_paragraph()
        p.paragraph_format.space_before = Pt(1)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = 1.18
        r = p.add_run(line)
        r.font.name = FONT_PRIMARY
        r.font.size = Pt(9.5)
        r.font.color.rgb = RGB_BODY_DARK

    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_before = Pt(0)
    p_sp.paragraph_format.space_after = Pt(4)

def add_figure(doc, img_path, caption, width_inches=5.8):
    if not os.path.exists(img_path):
        print(f"Bỏ qua ảnh chưa tồn tại: {img_path}")
        return

    p_img = doc.add_paragraph()
    p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_img.paragraph_format.space_before = Pt(6)
    p_img.paragraph_format.space_after = Pt(3)
    p_img.paragraph_format.keep_with_next = True

    run_img = p_img.add_run()
    run_img.add_picture(img_path, width=Inches(width_inches))

    p_cap = doc.add_paragraph()
    p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap.paragraph_format.space_before = Pt(0)
    p_cap.paragraph_format.space_after = Pt(8)
    p_cap.paragraph_format.keep_with_next = False

    r_cap = p_cap.add_run(f"Hình: {caption}")
    r_cap.font.name = FONT_PRIMARY
    r_cap.font.size = Pt(9)
    r_cap.italic = True
    r_cap.font.color.rgb = RGB_MUTED_GRAY

def add_two_column_figures(doc, img1_path, cap1, img2_path, cap2, width_inches=2.9):
    if not (os.path.exists(img1_path) and os.path.exists(img2_path)):
        return

    table = doc.add_table(rows=1, cols=2)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    for idx, (img_p, cap) in enumerate([(img1_path, cap1), (img2_path, cap2)]):
        cell = table.cell(0, idx)
        cell.width = Inches(3.2)
        set_cell_margins(cell, top=60, bottom=60, left=60, right=60)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        r = p.add_run()
        r.add_picture(img_p, width=Inches(width_inches))

        p_cap = cell.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_before = Pt(2)
        p_cap.paragraph_format.space_after = Pt(4)
        r_cap = p_cap.add_run(f"Hình: {cap}")
        r_cap.font.name = FONT_PRIMARY
        r_cap.font.size = Pt(8.5)
        r_cap.italic = True
        r_cap.font.color.rgb = RGB_MUTED_GRAY

    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_before = Pt(0)
    p_sp.paragraph_format.space_after = Pt(4)

print("Core generator script initialized.")
