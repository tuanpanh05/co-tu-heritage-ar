#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script xây dựng hoàn chỉnh file Word:
HUONG_DAN_SU_DUNG_CO_TU_HERITAGE_AR.docx
"""

import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

# Định nghĩa màu sắc
HEX_FOREST_GREEN = "1E3A2B"
HEX_OCHRE_GOLD   = "C68A4C"
HEX_WOOD_BROWN   = "5A381E"
HEX_CREAM_SAND   = "F8F6F0"
HEX_TIP_AMBER    = "FEF7EC"
HEX_BODY_DARK    = "2A2E2B"
HEX_BORDER_MUTED = "D5DCD7"
HEX_WHITE        = "FFFFFF"

RGB_FOREST_GREEN = RGBColor(0x1E, 0x3A, 0x2B)
RGB_OCHRE_GOLD   = RGBColor(0xC6, 0x8A, 0x4C)
RGB_WOOD_BROWN   = RGBColor(0x5A, 0x38, 0x1E)
RGB_BODY_DARK    = RGBColor(0x2A, 0x2E, 0x2B)
RGB_MUTED_GRAY   = RGBColor(0x66, 0x70, 0x6A)

FONT_PRIMARY = "Arial"

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

def add_header_paragraph(doc, text, level=1):
    p = doc.add_paragraph()
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = FONT_PRIMARY
    run.bold = True

    if level == 1:
        p.paragraph_format.space_before = Pt(22)
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
        p.paragraph_format.space_after = Pt(5)
        run.font.size = Pt(12.5)
        run.font.color.rgb = RGB_OCHRE_GOLD
    elif level == 3:
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(3)
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
    r0.font.size = Pt(10)
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

def add_two_column_figures(doc, img1_path, cap1, img2_path, cap2, width_inches=2.85):
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

print("Base setup ready.")

def build_complete_manual():
    doc = docx.Document()

    # 1. THIẾT LẬP TRANG IN
    sec = doc.sections[0]
    sec.top_margin = Inches(0.85)
    sec.bottom_margin = Inches(0.85)
    sec.left_margin = Inches(0.9)
    sec.right_margin = Inches(0.9)

    # Đầu trang
    hdr = sec.header
    p_hdr = hdr.paragraphs[0]
    p_hdr.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_hdr = p_hdr.add_run("TÀI LIỆU HƯỚNG DẪN SỬ DỤNG · PHẦN MỀM CƠ-TU HERITAGE AR")
    r_hdr.font.name = FONT_PRIMARY
    r_hdr.font.size = Pt(8.5)
    r_hdr.font.color.rgb = RGB_MUTED_GRAY

    # Chân trang
    ftr = sec.footer
    p_ftr = ftr.paragraphs[0]
    p_ftr.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    r_ftr_l = p_ftr.add_run("Bảo tàng số Tây Giang · Lưu hành phục vụ giáo dục và trải nghiệm di sản   |   ")
    r_ftr_l.font.name = FONT_PRIMARY
    r_ftr_l.font.size = Pt(8.5)
    r_ftr_l.font.color.rgb = RGB_MUTED_GRAY

    r_page_lbl = p_ftr.add_run("Trang ")
    r_page_lbl.font.name = FONT_PRIMARY
    r_page_lbl.font.size = Pt(8.5)
    r_page_lbl.font.color.rgb = RGB_MUTED_GRAY

    run_pg = p_ftr.add_run()
    fldChar1 = parse_xml(r'<w:fldChar %s w:fldCharType="begin"/>' % nsdecls('w'))
    instrText = parse_xml(r'<w:instrText %s xml:space="preserve"> PAGE </w:instrText>' % nsdecls('w'))
    fldChar2 = parse_xml(r'<w:fldChar %s w:fldCharType="separate"/>' % nsdecls('w'))
    fldChar3 = parse_xml(r'<w:fldChar %s w:fldCharType="end"/>' % nsdecls('w'))
    run_pg._r.append(fldChar1)
    run_pg._r.append(instrText)
    run_pg._r.append(fldChar2)
    run_pg._r.append(fldChar3)

    # =========================================================================
    # TRANG BÌA (COVER PAGE)
    # =========================================================================
    p_cov_sp1 = doc.add_paragraph()
    p_cov_sp1.paragraph_format.space_before = Pt(10)
    p_cov_sp1.paragraph_format.space_after = Pt(4)

    # Kicker
    p_kicker = doc.add_paragraph()
    p_kicker.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_kicker.paragraph_format.space_after = Pt(12)
    r_kicker = p_kicker.add_run("KHÔNG GIAN SỐ BẢO TỒN DI SẢN VĂN HÓA TRUYỀN THỐNG VIỆT NAM")
    r_kicker.font.name = FONT_PRIMARY
    r_kicker.font.size = Pt(10)
    r_kicker.bold = True
    r_kicker.font.color.rgb = RGB_OCHRE_GOLD

    # Logo chính giữa
    logo_path = os.path.abspath("public/images/logo-emblem.png")
    if os.path.exists(logo_path):
        p_logo = doc.add_paragraph()
        p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_logo.paragraph_format.space_before = Pt(6)
        p_logo.paragraph_format.space_after = Pt(14)
        r_logo = p_logo.add_run()
        r_logo.add_picture(logo_path, width=Inches(1.8))

    # Tên tài liệu
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(8)
    p_title.paragraph_format.space_after = Pt(6)
    r_t1 = p_title.add_run("TÀI LIỆU GIỚI THIỆU VÀ HƯỚNG DẪN SỬ DỤNG\nPHẦN MỀM CƠ-TU HERITAGE AR")
    r_t1.font.name = FONT_PRIMARY
    r_t1.font.size = Pt(21)
    r_t1.bold = True
    r_t1.font.color.rgb = RGB_FOREST_GREEN

    # Phụ đề
    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(2)
    p_sub.paragraph_format.space_after = Pt(20)
    r_sub = p_sub.add_run("Khám phá di sản văn hóa Cơ Tu qua công nghệ thực tế tăng cường")
    r_sub.font.name = FONT_PRIMARY
    r_sub.font.size = Pt(12.5)
    r_sub.italic = True
    r_sub.bold = True
    r_sub.font.color.rgb = RGB_OCHRE_GOLD

    # Khung trích dẫn thông điệp bìa
    add_callout_box(
        doc,
        "SỨ MỆNH KẾT NỐI DI SẢN ĐẠI NGÀN",
        [
            "\"Phần mềm Cơ-Tu Heritage AR là nhịp cầu công nghệ đưa mái nhà Gươl linh thiêng, tiếng trống chiêng trầm hùng và sắc chàm thổ cẩm của đồng bào Cơ Tu vùng cao Tây Giang đến gần hơn với các bạn học sinh, biến việc tìm hiểu lịch sử - văn hóa thành một hành trình phiêu lưu trực quan, hào hứng và đậm đà bản sắc dân tộc.\""
        ],
        box_type="discovery"
    )

    p_cov_sp2 = doc.add_paragraph()
    p_cov_sp2.paragraph_format.space_before = Pt(15)

    # Bảng thông tin xuất bản ở chân bìa
    tbl_cov = doc.add_table(rows=4, cols=2)
    tbl_cov.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_cov.autofit = False

    cov_info = [
        ("Đối tượng bạn đọc:", "Học sinh THPT, Thầy Cô giáo và người yêu mến văn hóa truyền thống"),
        ("Mục tiêu hướng dẫn:", "Hướng dẫn trực quan, dễ hiểu từng bước, không sử dụng thuật ngữ kỹ thuật"),
        ("Đơn vị thực hiện:", "Dự án Không gian Bảo tàng Số Di sản Văn hóa Cơ Tu — Tây Giang, Quảng Nam"),
        ("Phiên bản tài liệu:", "Phiên bản 1.0 (Phát hành chính thức phục vụ trải nghiệm học đường)")
    ]

    for idx, (label, val) in enumerate(cov_info):
        c_lbl = tbl_cov.cell(idx, 0)
        c_val = tbl_cov.cell(idx, 1)
        c_lbl.width = Inches(2.2)
        c_val.width = Inches(4.3)
        set_cell_background(c_lbl, HEX_CREAM_SAND)
        set_cell_background(c_val, HEX_WHITE)
        set_cell_margins(c_lbl, top=80, bottom=80, left=120, right=120)
        set_cell_margins(c_val, top=80, bottom=80, left=120, right=120)
        set_cell_border(c_lbl, bottom={"sz": 4, "val": "single", "color": HEX_BORDER_MUTED})
        set_cell_border(c_val, bottom={"sz": 4, "val": "single", "color": HEX_BORDER_MUTED})

        p_l = c_lbl.paragraphs[0]
        p_l.paragraph_format.space_after = Pt(2)
        r_l = p_l.add_run(label)
        r_l.font.name = FONT_PRIMARY
        r_l.font.size = Pt(9.5)
        r_l.bold = True
        r_l.font.color.rgb = RGB_WOOD_BROWN

        p_v = c_val.paragraphs[0]
        p_v.paragraph_format.space_after = Pt(2)
        r_v = p_v.add_run(val)
        r_v.font.name = FONT_PRIMARY
        r_v.font.size = Pt(9.5)
        r_v.font.color.rgb = RGB_BODY_DARK

    doc.add_page_break()

    # =========================================================================
    # MỤC LỤC TÀI LIỆU
    # =========================================================================
    add_header_paragraph(doc, "MỤC LỤC TỔNG THỂ TÀI LIỆU", level=1)
    add_body_paragraph(
        doc,
        "Tài liệu này được biên soạn đặc biệt dành cho các bạn học sinh THPT và quý thầy cô giáo. Để tiện tra cứu nhanh, các phần nội dung được phân chia rõ ràng theo từng chủ đề:"
    )

    toc_items = [
        ("PHẦN I. GIỚI THIỆU CHUNG VỀ PHẦN MỀM CƠ-TU HERITAGE AR", "1. Tên gọi; 2. Giới thiệu tổng quan; 3. Mục đích xây dựng; 4. Đối tượng sử dụng; 5. Giá trị văn hóa; 6. Thiết bị hỗ trợ"),
        ("PHẦN II. LÀM QUEN VỚI GIAO DIỆN PHẦN MỀM", "1. Bố cục tổng thể; 2. Khu vực âm thanh rừng xanh; 3. Lựa chọn ngôn ngữ; 4. Sân khấu 3D trung tâm; 5. Bản đồ làng buôn; 6. Tour chỉ dẫn"),
        ("PHẦN III. HƯỚNG DẪN SỬ DỤNG TỪNG CHỨC NĂNG (TRỌNG TÂM)", "10 chức năng chi tiết từ truy cập, xem 3D, chiếu AR, nghe thuyết minh, tra cứu song ngữ đến làm Quiz và in nhãn QR"),
        ("PHẦN IV. MỘT SỐ TÌNH HUỐNG THƯỜNG GẶP VÀ CÁCH XỬ LÝ", "8 tình huống thường gặp khi sử dụng phần mềm (mạng chậm, lỗi 3D, âm thanh, quét mã...) và cách khắc phục từng bước"),
        ("PHẦN V. GỢI Ý CÁC HOẠT ĐỘNG HỌC TẬP VÀ TRẢI NGHIỆM THÚ VỊ", "Quy trình 6 bước tự học di sản, làm hướng dẫn viên nhí, tổ chức triển lãm ảo tại lớp học kèm ví dụ mẫu Nhà Gươl"),
        ("PHẦN VI. LƯU Ý QUAN TRỌNG KHI SỬ DỤNG", "Khuyến nghị kết nối Internet, trình duyệt tối ưu, tôn trọng tri thức bản địa và quy tắc ứng xử văn hóa số"),
        ("PHẦN VII. LỜI KẾT VÀ SỨ MỆNH LAN TỎA DI SẢN", "Thông điệp gửi gắm tới thế hệ trẻ về niềm tự hào dân tộc và trách nhiệm gìn giữ cội nguồn qua công nghệ"),
        ("PHỤ LỤC THAM KHẢO HỮU ÍCH", "Bảng tra cứu nhanh 7 hiện vật số hóa & Bảng 15 từ vựng tiếng Anh văn hóa Cơ Tu kèm phiên âm IPA chuẩn xác")
    ]

    tbl_toc = doc.add_table(rows=len(toc_items), cols=2)
    tbl_toc.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_toc.autofit = False

    for idx, (sec_title, sec_desc) in enumerate(toc_items):
        c1 = tbl_toc.cell(idx, 0)
        c2 = tbl_toc.cell(idx, 1)
        c1.width = Inches(3.2)
        c2.width = Inches(3.3)
        bg = HEX_CREAM_SAND if idx % 2 == 0 else HEX_WHITE
        set_cell_background(c1, bg)
        set_cell_background(c2, bg)
        set_cell_margins(c1, top=80, bottom=80, left=100, right=100)
        set_cell_margins(c2, top=80, bottom=80, left=100, right=100)
        set_cell_border(c1, bottom={"sz": 4, "val": "single", "color": HEX_BORDER_MUTED})
        set_cell_border(c2, bottom={"sz": 4, "val": "single", "color": HEX_BORDER_MUTED})

        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_after = Pt(2)
        r1 = p1.add_run(sec_title)
        r1.font.name = FONT_PRIMARY
        r1.font.size = Pt(9.5)
        r1.bold = True
        r1.font.color.rgb = RGB_FOREST_GREEN

        p2 = c2.paragraphs[0]
        p2.paragraph_format.space_after = Pt(2)
        r2 = p2.add_run(sec_desc)
        r2.font.name = FONT_PRIMARY
        r2.font.size = Pt(9)
        r2.font.color.rgb = RGB_BODY_DARK

    doc.add_page_break()

    # =========================================================================
    # PHẦN I. GIỚI THIỆU CHUNG VỀ PHẦN MỀM
    # =========================================================================
    add_header_paragraph(doc, "PHẦN I. GIỚI THIỆU CHUNG VỀ PHẦN MỀM CƠ-TU HERITAGE AR", level=1)

    add_header_paragraph(doc, "1. Tên phần mềm và biểu trưng văn hóa", level=2)
    add_body_paragraph(
        doc,
        "Phần mềm có tên gọi chính thức là ",
        bold_prefix="Tên chính thức: "
    )
    p_brand = doc.paragraphs[-1]
    r_b = p_brand.add_run("Cơ-Tu Heritage AR")
    r_b.bold = True
    r_b.font.color.rgb = RGB_FOREST_GREEN
    p_brand.add_run(" (Không gian Bảo tàng số Văn hóa Cơ Tu Tây Giang).")

    add_body_paragraph(
        doc,
        "Biểu trưng (Logo) của phần mềm là sự kết hợp hài hòa giữa đỉnh núi Ngọc Linh hùng vĩ mờ sương và các đường nét chạm khắc hình thoi, mũi tên thổ cẩm truyền thống của người Cơ Tu. Biểu trưng mang thông điệp về sự giao hòa giữa vẻ đẹp thiên nhiên đại ngàn và chiều sâu tâm hồn của một tộc người kiên cường, đôn hậu nơi vùng cao xứ Quảng."
    )

    add_header_paragraph(doc, "2. Giới thiệu tổng quan về phần mềm", level=2)
    add_body_paragraph(
        doc,
        "Cơ-Tu Heritage AR là một ứng dụng bảo tàng số hiện đại, được xây dựng như một cánh cửa mở ra thế giới văn hóa truyền thống của đồng bào dân tộc Cơ Tu sinh sống tại huyện miền núi Tây Giang, tỉnh Quảng Nam. Khác với những trang sách giáo khoa chỉ có hình ảnh tĩnh, phần mềm mang lại một không gian tương tác sống động: người dùng có thể cầm, nắm, xoay tròn các hiện vật trên màn hình 3D, thậm chí chiếu trực tiếp các báu vật văn hóa vào ngay phòng khách hoặc lớp học của mình qua công nghệ Thực tế Tăng cường (AR)."
    )

    add_header_paragraph(doc, "3. Mục đích xây dựng phần mềm", level=2)
    add_body_paragraph(doc, "Phần mềm được kiến tạo nhằm thực hiện các mục tiêu nhân văn và giáo dục sau:")
    add_bullet_point(
        doc,
        "giúp học sinh THPT, giáo viên và du khách ở bất kỳ nơi nào trên cả nước (hay thế giới) đều có thể tận mắt ngắm nhìn hiện vật Cơ Tu mà không bị cản trở bởi khoảng cách địa lý hay đèo dốc xa xôi.",
        bold_prefix="• Xóa nhòa khoảng cách địa lý: "
    )
    add_bullet_point(
        doc,
        "biến những bài học Lịch sử, Địa lý, Giáo dục địa phương và Tiếng Anh vốn dĩ khô khan trở thành một chuyến tham quan thực địa hào hứng, chạm tay vào từng thớ gỗ, sợi mây và lắng nghe âm thanh núi rừng.",
        bold_prefix="• Đổi mới phương pháp học tập trải nghiệm: "
    )
    add_bullet_point(
        doc,
        "tạo dựng một kho tư liệu số chính xác, chân thực từ các hiện vật gốc tại Tây Giang, lưu giữ vĩnh viễn hình hài và linh hồn của di sản trước nguy cơ mai một theo thời gian.",
        bold_prefix="• Bảo tồn ký ức đại ngàn: "
    )

    add_header_paragraph(doc, "4. Những ai có thể sử dụng phần mềm?", level=2)
    add_body_paragraph(
        doc,
        "Phần mềm được thiết kế với giao diện thân thiện, nút bấm to rõ, thao tác chạm vuốt tự nhiên nên phù hợp với mọi đối tượng:"
    )
    add_bullet_point(doc, "sử dụng để tự học, nghiên cứu làm bài tập dự án, rèn luyện kỹ năng thuyết trình tiếng Anh và trải nghiệm mô hình 3D.", bold_prefix="• Các bạn học sinh THPT: ")
    add_bullet_point(doc, "sử dụng làm học liệu trực quan phục vụ bài giảng trên lớp, tổ chức các hoạt động ngoại khóa, hội thảo chuyên đề giáo dục di sản.", bold_prefix="• Quý Thầy Cô giáo: ")
    add_bullet_point(doc, "và những ai mong muốn tìm hiểu nét đẹp kiến trúc, trang phục và âm nhạc của đồng bào vùng cao.", bold_prefix="• Du khách, nhà nghiên cứu trẻ: ")

    add_header_paragraph(doc, "5. Phần mềm giúp ích gì cho việc tìm hiểu và quảng bá văn hóa Cơ Tu?", level=2)
    add_body_paragraph(
        doc,
        "Không chỉ dừng lại ở việc ngắm nhìn, phần mềm giải thích cặn kẽ ý nghĩa văn hóa của từng chi tiết chạm khắc (như vì sao cột nhà Gươl lại chạm chim trĩ và kỳ đà, chiếc cọc đâm trâu thể hiện niềm tin gì với thần linh). Đặc biệt, hệ thống nội dung song ngữ Việt – Anh chuẩn xác giúp các bạn trẻ tự tin giới thiệu bản sắc văn hóa dân tộc mình với bạn bè năm châu."
    )

    add_header_paragraph(doc, "6. Những thiết bị có thể sử dụng phần mềm", level=2)
    add_body_paragraph(
        doc,
        "Phần mềm hoạt động mượt mà trên nền tảng web hiện đại mà không bắt buộc bạn phải cài đặt ứng dụng phức tạp. Bạn có thể sử dụng linh hoạt trên:"
    )
    add_bullet_point(doc, "xem mô hình 3D mượt mà, chạm vuốt để xoay lật, và đặc biệt hỗ trợ bật camera để đưa hiện vật 3D ra ngoài đời thực thông qua chế độ AR.", bold_prefix="1. Điện thoại thông minh (iPhone, Samsung, Xiaomi, Oppo...): ")
    add_bullet_point(doc, "màn hình rộng rãi, rất phù hợp khi học nhóm, quan sát tỉ mỉ từng chi tiết hoa văn, hoặc trình chiếu lên máy chiếu lớp học.", bold_prefix="2. Máy tính xách tay (Laptop) & Máy tính để bàn (PC): ")
    add_bullet_point(doc, "màn hình cảm ứng lớn, là công cụ tuyệt vời cho các buổi triển lãm tương tác tại thư viện hoặc phòng truyền thống nhà trường.", bold_prefix="3. Máy tính bảng (iPad, Android Tablet): ")

    add_callout_box(
        doc,
        "TIỆN LỢI CHO MỌI TIẾT HỌC",
        [
            "Bạn không cần tải tệp nặng về máy hay tạo tài khoản đăng nhập phức tạp.",
            "Chỉ cần mở trình duyệt quen thuộc (Google Chrome, Safari, Microsoft Edge) là có thể bước ngay vào thế giới di sản Cơ Tu kỳ vĩ."
        ],
        box_type="tip"
    )

    # Ảnh minh họa Trang chủ Desktop & Mobile
    add_two_column_figures(
        doc,
        "manual_images/01_trang_chu.png", "Giao diện Trang chủ trên máy tính để bàn",
        "manual_images/09_mobile_trang_chu.png", "Giao diện Trang chủ trên điện thoại thông minh"
    )

    doc.add_page_break()

    # =========================================================================
    # PHẦN II. LÀM QUEN VỚI GIAO DIỆN PHẦN MỀM
    # =========================================================================
    add_header_paragraph(doc, "PHẦN II. LÀM QUEN VỚI GIAO DIỆN PHẦN MỀM", level=1)

    add_body_paragraph(
        doc,
        "Giao diện của phần mềm được lấy cảm hứng từ gam màu xanh bạt ngàn của rừng nguyên sinh Tây Giang kết hợp cùng màu nâu ấm của gỗ rừng và sắc vàng đất đặc trưng của trang phục thổ cẩm. Mọi khu vực đều được bố trí khoa học, giúp bạn dễ dàng thao tác ngay từ lần đầu tiên chạm vào màn hình."
    )

    add_header_paragraph(doc, "1. Thanh điều hướng chính (Menu điều hướng)", level=2)
    add_body_paragraph(
        doc,
        "Thanh menu luôn nằm cố định ở phần trên cùng màn hình (trên máy tính) hoặc thanh công cụ đáy (trên điện thoại di động), gồm các mục chức năng chính sau:"
    )

    nav_items = [
        ("Khám phá (Biểu tượng Chiếc la bàn):", "Trang chủ của phần mềm, nơi mở ra sân khấu 3D trung tâm, bản đồ làng buôn Tây Giang và những câu chuyện mở đầu."),
        ("Hiện vật 3D (Biểu tượng Các tầng lớp):", "Kho trưng bày đầy đủ 7 báu vật văn hóa với bộ lọc phân loại theo chủ đề kiến trúc, nhạc cụ, đan lát và điêu khắc."),
        ("Học tập & Quiz (Biểu tượng Mũ cử nhân):", "Khu vực rèn luyện kiến thức với Thẻ ghi nhớ Flashcard từ vựng tiếng Anh và trò chơi đố vui tương tác hấp dẫn."),
        ("Nhãn QR (Biểu tượng Mã QR):", "Trang tạo và in các tem nhãn bảo tàng có mã QR để dán cạnh hiện vật thật trong trường học."),
        ("Thống kê (Biểu tượng Biểu đồ cột):", "Bảng theo dõi nhật ký học tập, ghi nhận số hiện vật bạn đã khám phá và huy hiệu danh dự đạt được.")
    ]
    for lbl, desc in nav_items:
        add_bullet_point(doc, desc, bold_prefix=lbl + " ")

    add_header_paragraph(doc, "2. Khu vực âm thanh đại ngàn (Giai điệu rừng xanh)", level=2)
    add_body_paragraph(
        doc,
        "Ở góc phải trên thanh điều hướng, bạn sẽ nhìn thấy một cụm điều khiển âm thanh nhỏ nhắn:"
    )
    add_bullet_point(doc, "khi mở phần mềm, tiếng đàn piano êm dịu kết hợp cùng tiếng sáo mộc Tây Giang sẽ tự động cất lên, tạo cảm giác thư thái như đang đứng giữa rừng già Tây Giang. Bạn bấm vào nút chiếc loa để tắt tiếng nếu muốn tập trung đọc bài.", bold_prefix="• Nút Bật/Tắt âm thanh (Biểu tượng Chiếc loa): ")
    add_bullet_point(doc, "phần mềm tích hợp sẵn nhiều giai điệu dân ca và độc tấu sáo mộc; bấm nút này để đổi sang bài hát tiếp theo.", bold_prefix="• Nút Chuyển bản nhạc (Biểu tượng Mũi tên kép): ")

    add_header_paragraph(doc, "3. Khu vực lựa chọn ngôn ngữ (Tiếng Việt & English)", level=2)
    add_body_paragraph(
        doc,
        "Ngay cạnh nút âm thanh là nút chuyển đổi ngôn ngữ ",
        bold_prefix="Công tắc ngôn ngữ: "
    )
    p_lang = doc.paragraphs[-1]
    p_lang.add_run("với hai lựa chọn ")
    r_vi = p_lang.add_run("VI")
    r_vi.bold = True
    r_vi.font.color.rgb = RGB_FOREST_GREEN
    p_lang.add_run(" (Tiếng Việt) và ")
    r_en = p_lang.add_run("EN")
    r_en.bold = True
    r_en.font.color.rgb = RGB_OCHRE_GOLD
    p_lang.add_run(". Chỉ với một cú chạm, toàn bộ tiêu đề, bài viết giới thiệu, tên gọi hiện vật sẽ lập tức chuyển đổi sang ngôn ngữ bạn mong muốn.")

    add_header_paragraph(doc, "4. Sân khấu mô hình 3D trung tâm tại Trang chủ", level=2)
    add_body_paragraph(
        doc,
        "Tại vị trí trang trọng nhất của Trang chủ là một sân khấu 3D trực tiếp. Hiện vật đại diện (mặc định là Nhà Gươl truyền thống) sẽ tự động quay chậm 360 độ trên nền ảnh rừng núi hùng vĩ mờ ảo. Ngay bên dưới sân khấu là dãy nút bấm nhỏ cho phép bạn chuyển đổi nhanh giữa các hiện vật tiêu biểu khác như Trống K'tu, Gùi Ba-hieng, Chiêng đồng, Áo thổ cẩm..."
    )

    add_header_paragraph(doc, "5. Chuyến tham quan chỉ dẫn nhanh (Spotlight Tour)", level=2)
    add_body_paragraph(
        doc,
        "Nếu bạn là người lần đầu ghé thăm, hãy bấm vào nút biểu tượng ",
        bold_prefix="Dấu hỏi trợ giúp (?): "
    )
    p_tour = doc.paragraphs[-1]
    p_tour.add_run("trên thanh menu. Một chuyến hướng dẫn tương tác từng bước sẽ xuất hiện, khoanh vùng sáng vào từng nút bấm trên màn hình và giải thích công dụng của từng khu vực một cách ngắn gọn, súc tích.")

    add_figure(
        doc,
        "manual_images/02_danh_muc_hien_vat.png",
        "Trang Bộ sưu tập Hiện vật 3D với bộ lọc 4 chủ đề văn hóa rõ ràng"
    )

    doc.add_page_break()

    # =========================================================================
    # PHẦN III. HƯỚNG DẪN SỬ DỤNG TỪNG CHỨC NĂNG (TRỌNG TÂM)
    # =========================================================================
    add_header_paragraph(doc, "PHẦN III. HƯỚNG DẪN SỬ DỤNG TỪNG CHỨC NĂNG", level=1)

    add_body_paragraph(
        doc,
        "Đây là phần hướng dẫn quan trọng nhất của tài liệu. Mỗi chức năng dưới đây đều được trình bày rõ ràng: công dụng, thời điểm nên dùng, các bước thao tác thực tế và một số mẹo nhỏ hữu ích."
    )

    # ----------------- CHỨC NĂNG 1 -----------------
    add_header_paragraph(doc, "Chức năng 1: Truy cập phần mềm", level=2)
    add_body_paragraph(doc, "Mở phần mềm để bắt đầu hành trình tìm hiểu di sản văn hóa Cơ Tu trên thiết bị cá nhân.", bold_prefix="1. Chức năng này dùng để làm gì? ")
    add_body_paragraph(doc, "Mỗi khi bạn muốn tự học tại nhà, chuẩn bị bài thuyết trình tại lớp, hoặc khi tham gia các buổi ngoại khóa tham quan bảo tàng.", bold_prefix="2. Khi nào nên sử dụng? ")
    add_body_paragraph(doc, "Bạn có thể lựa chọn 1 trong 2 cách sau:", bold_prefix="3. Các bước thực hiện: ")

    add_numbered_step(doc, 1, "Truy cập bằng liên kết trực tiếp", "Mở trình duyệt web (Chrome, Safari hoặc Edge) trên điện thoại hoặc máy tính, gõ hoặc bấm vào đường link được thầy cô chia sẻ.")
    add_numbered_step(doc, 2, "Truy cập bằng mã QR", "Nếu bạn đang đứng trước bảng tin trường học, sách tài liệu hoặc nhãn trưng bày có in mã QR, hãy mở ứng dụng Camera (hoặc Zalo) trên điện thoại, hướng máy ảnh về phía mã QR và chạm vào thông báo hiện lên trên màn hình.")

    add_body_paragraph(doc, "Giao diện Trang chủ của Cơ-Tu Heritage AR sẽ mở ra ngay lập tức với tiếng nhạc rừng êm dịu và mô hình 3D Nhà Gươl đang xoay nhẹ nhàng đón chào bạn.", bold_prefix="4. Kết quả nhận được: ")

    add_callout_box(
        doc,
        "MẸO TRUY CẬP NHANH TRÊN ĐIỆN THOẠI",
        [
            "Trên trình duyệt Safari (iPhone): Bạn bấm vào nút Chia sẻ (hình vuông có mũi tên lên), chọn \"Thêm vào Màn hình chính\" (Add to Home Screen).",
            "Trên Chrome (Android): Bấm vào dấu ba chấm ở góc phải trên, chọn \"Cài đặt ứng dụng\" hoặc \"Thêm vào Màn hình chính\".",
            "Lúc này, biểu tượng của Cơ-Tu Heritage AR sẽ xuất hiện trên màn hình điện thoại như một ứng dụng thật, lần sau chỉ cần chạm vào là mở ngay!"
        ],
        box_type="tip"
    )

    # ----------------- CHỨC NĂNG 2 -----------------
    add_header_paragraph(doc, "Chức năng 2: Tìm hiểu và lựa chọn hiện vật văn hóa", level=2)
    add_body_paragraph(doc, "Khám phá danh sách 7 báu vật tiêu biểu của người Cơ Tu, lọc theo từng nhóm thể loại và mở trang thông tin chi tiết của hiện vật bạn muốn tìm hiểu.", bold_prefix="1. Chức năng này dùng để làm gì? ")
    add_body_paragraph(doc, "Khi bạn cần tìm một hiện vật cụ thể theo yêu cầu bài học (ví dụ: tìm hiểu về nhạc cụ đồng hoặc trang phục truyền thống).", bold_prefix="2. Khi nào nên sử dụng? ")
    add_body_paragraph(doc, "Thực hiện theo các bước đơn giản sau:", bold_prefix="3. Các bước thực hiện: ")

    add_numbered_step(doc, 1, "Mở trang Bộ sưu tập", "Chạm hoặc bấm vào mục \"Hiện vật 3D\" trên thanh điều hướng.")
    add_numbered_step(doc, 2, "Chọn bộ lọc thể loại", "Phía trên danh sách có 5 nút chọn: \"Tất cả\", \"Kiến trúc truyền thống\", \"Nhạc cụ dân tộc\", \"Nghề dệt & đan lát\" và \"Điêu khắc tâm linh\". Hãy chạm vào thể loại bạn quan tâm.")
    add_numbered_step(doc, 3, "Chọn hiện vật", "Các thẻ hiện vật sẽ hiển thị kèm ảnh chụp thực địa, tên gọi song ngữ và một đoạn giới thiệu ngắn. Chạm vào nút \"Khám phá 3D\" hoặc hình ảnh hiện vật để vào trang chi tiết.")

    add_body_paragraph(doc, "Trang chi tiết hiện vật sẽ hiện ra toàn bộ: sân khấu mô hình 3D, bài viết lịch sử, âm thanh thuyết minh, bảng phân tích cấu tạo và trò chơi thử thách.", bold_prefix="4. Kết quả nhận được: ")

    add_figure(
        doc,
        "manual_images/03_chi_tiet_nha_guol.png",
        "Trang chi tiết Nhà Gươl với sân khấu 3D tương tác và nút Xem AR Thực tế"
    )

    # ----------------- CHỨC NĂNG 3 -----------------
    add_header_paragraph(doc, "Chức năng 3: Khám phá mô hình hiện vật 3D", level=2)
    add_body_paragraph(doc, "Quan sát hiện vật ở mọi góc độ trong không gian 3 chiều (360 độ), phóng to để soi rõ từng đường chạm khắc hoa văn gỗ hay từng mũi đan mây.", bold_prefix="1. Chức năng này dùng để làm gì? ")
    add_body_paragraph(doc, "Khi bạn muốn quan sát hình dáng bên ngoài, mặt trước, mặt sau, nóc mái hoặc đáy của hiện vật mà ảnh chụp thông thường không thể hiện hết.", bold_prefix="2. Khi nào nên sử dụng? ")
    add_body_paragraph(doc, "Thao tác trực quan trên màn hình cảm ứng hoặc chuột máy tính:", bold_prefix="3. Các bước thực hiện: ")

    add_bullet_point(doc, "Đặt 1 ngón tay lên mô hình và vuốt sang trái, sang phải, lên trên hoặc xuống dưới. Mô hình sẽ xoay theo đúng hướng ngón tay của bạn.", bold_prefix="• Xoay mô hình (trên điện thoại): ")
    add_bullet_point(doc, "Nhấp giữ chuột trái vào mô hình và kéo rê chuột theo hướng mong muốn.", bold_prefix="• Xoay mô hình (trên máy tính): ")
    add_bullet_point(doc, "Dùng 2 ngón tay đặt lên mô hình và kéo mở rộng ra để phóng to, hoặc chụm lại để thu nhỏ.", bold_prefix="• Phóng to / Thu nhỏ (trên điện thoại): ")
    add_bullet_point(doc, "Lăn con lăn chuột tới trước hoặc lùi sau (hoặc bấm vào nút hình dấu cộng \"+\" và dấu trừ \"-\" ở góc dưới khung nhìn 3D).", bold_prefix="• Phóng to / Thu nhỏ (trên máy tính): ")
    add_bullet_point(doc, "Nếu bạn xoay mô hình bị lệch quá xa, hãy chạm vào nút mũi tên tròn xoay (Đặt lại góc nhìn) ở góc khung để mô hình trở về vị trí cân đối ban đầu.", bold_prefix="• Đặt lại góc nhìn ban đầu: ")
    add_bullet_point(doc, "Bấm vào nút bốn góc mũi tên (Phóng to toàn màn hình) để đưa mô hình tràn ngập toàn bộ màn hình thiết bị.", bold_prefix="• Chế độ toàn màn hình: ")

    add_body_paragraph(doc, "Bạn có thể ngắm nhìn trọn vẹn hiện vật như thể đang cầm một món bảo vật thật trên đôi tay của mình.", bold_prefix="4. Kết quả nhận được: ")

    # ----------------- CHỨC NĂNG 4 -----------------
    add_header_paragraph(doc, "Chức năng 4: Trải nghiệm Thực tế Tăng cường (AR) — Chiếu hiện vật vào đời thực", level=2)
    add_body_paragraph(doc, "Sử dụng camera của thiết bị để đặt mô hình 3D ảo vào không gian thật (trên bàn học, sàn nhà hoặc sân trường), giúp bạn so sánh kích thước và ngắm nhìn hiện vật đứng vững trong đời thực.", bold_prefix="1. Chức năng này dùng để làm gì? ")
    add_body_paragraph(doc, "Khi bạn muốn trải nghiệm cảm giác như đang đứng trước một ngôi nhà Gươl thực sự tại vùng cao Tây Giang, hoặc muốn chụp ảnh kỷ niệm với hiện vật trong phòng học.", bold_prefix="2. Khi nào nên sử dụng? ")
    add_body_paragraph(doc, "Thực hiện theo hướng dẫn tương ứng với thiết bị bạn đang dùng:", bold_prefix="3. Các bước thực hiện: ")

    add_numbered_step(doc, 1, "Trải nghiệm trực tiếp trên điện thoại thông minh", "Tại trang chi tiết hiện vật, bấm vào nút màu vàng nổi bật có dòng chữ \"Xem AR Thực Tế\" (có biểu tượng chiếc hộp và điện thoại).")
    add_numbered_step(doc, 2, "Cấp quyền camera và lia máy", "Khi trình duyệt hỏi quyền sử dụng camera, bạn bấm \"Cho phép\" (Allow). Sau đó, cầm điện thoại hướng nhẹ xuống sàn nhà hoặc mặt bàn phẳng, di chuyển nhẹ nhàng vài giây để thiết bị nhận diện mặt phẳng.")
    add_numbered_step(doc, 3, "Đặt hiện vật vào phòng", "Mô hình hiện vật sẽ xuất hiện ngay trên sàn nhà của bạn! Bạn có thể dùng 1 ngón tay để kéo di chuyển hiện vật, dùng 2 ngón tay để xoay hướng hoặc kéo to nhỏ theo tỷ lệ thật.")
    add_numbered_step(doc, 4, "Trường hợp bạn đang dùng máy tính", "Khi bạn bấm nút \"Xem AR\" trên máy tính, màn hình sẽ hiện lên một khung cửa sổ có chứa mã QR. Bạn chỉ cần cầm điện thoại lên quét mã QR này, điện thoại sẽ tự động mở trang AR để bạn trải nghiệm ngay trong phòng!")

    add_body_paragraph(doc, "Hiện vật văn hóa Cơ Tu sẽ sừng sững xuất hiện ngay giữa căn phòng của bạn với độ chân thực đáng kinh ngạc.", bold_prefix="4. Kết quả nhận được: ")

    add_callout_box(
        doc,
        "ĐIỀU KIỆN ĐỂ TRẢI NGHIỆM AR MƯỢT MÀ NHẤT",
        [
            "Hãy đảm bảo căn phòng có đủ ánh sáng và mặt bàn hoặc sàn nhà có hoa văn rõ ràng (không quá trơn bóng hoặc tối đen).",
            "Nếu bạn dùng iPhone/iPad: Máy chạy iOS 12 trở lên sẽ tự động mở chế độ AR xem nhanh (Quick Look) rất mượt.",
            "Nếu bạn dùng điện thoại Android: Hãy đảm bảo điện thoại có cài sẵn dịch vụ Google Play Services for AR (hầu hết các dòng máy đời mới đều có sẵn)."
        ],
        box_type="tip"
    )

    add_two_column_figures(
        doc,
        "manual_images/04_chi_tiet_trong_ktu.png", "Mô hình Trống K'tu truyền thống bằng gỗ và da trâu",
        "manual_images/05_chi_tiet_gui_cotu.png", "Mô hình Gùi Ba-hieng đan lát bằng mây rừng"
    )

    # ----------------- CHỨC NĂNG 5 -----------------
    add_header_paragraph(doc, "Chức năng 5: Khám phá giải phẫu cấu tạo chi tiết hiện vật", level=2)
    add_body_paragraph(doc, "Tìm hiểu cấu trúc bên trong và ý nghĩa của từng bộ phận riêng lẻ cấu thành nên hiện vật (ví dụ: Cột cái Ki'lơm, Mái hình mai rùa, Cầu thang gỗ, Xà ngang...).", bold_prefix="1. Chức năng này dùng để làm gì? ")
    add_body_paragraph(doc, "Khi bạn cần làm bài thu hoạch chi tiết về kỹ thuật chế tác dân gian của người Cơ Tu.", bold_prefix="2. Khi nào nên sử dụng? ")
    add_body_paragraph(doc, "Cách thao tác vô cùng thú vị:", bold_prefix="3. Các bước thực hiện: ")

    add_numbered_step(doc, 1, "Cuộn trang xuống mục Giải phẫu cấu tạo", "Dưới khung nhìn 3D, bạn sẽ thấy khu vực có tiêu đề \"Giải Phẫu & Cấu Trúc Hiện Vật\".")
    add_numbered_step(doc, 2, "Bấm vào các thẻ bộ phận", "Danh sách các bộ phận được liệt kê thành từng ô rõ ràng (ví dụ: Cột cái Ki'lơm, Mái mai rùa...). Chạm vào bộ phận bạn muốn tìm hiểu.")
    add_numbered_step(doc, 3, "Quan sát camera 3D tự động lia góc", "Ngay khi bạn bấm chọn, mô hình 3D phía trên sẽ tự động xoay và phóng to đúng vị trí bộ phận đó, đồng thời hiển thị thông tin giải thích về vật liệu chế tác và ý nghĩa tâm linh.")

    add_body_paragraph(doc, "Bạn nắm được kiến thức sâu sắc về nghệ thuật kiến trúc và điêu khắc Cơ Tu mà không cần đọc những cuốn sách dày cộp.", bold_prefix="4. Kết quả nhận được: ")

    # ----------------- CHỨC NĂNG 6 -----------------
    add_header_paragraph(doc, "Chức năng 6: Đọc nội dung song ngữ Việt – Anh & Tra cứu tư liệu điền dã", level=2)
    add_body_paragraph(doc, "Cung cấp toàn bộ câu chuyện văn hóa, hồ sơ bảo tàng dưới hai ngôn ngữ Tiếng Việt và Tiếng Anh chuẩn mực.", bold_prefix="1. Chức năng này dùng để làm gì? ")
    add_body_paragraph(doc, "Khi bạn muốn tra cứu tư liệu lịch sử hoặc muốn học cách diễn đạt các khái niệm văn hóa truyền thống bằng tiếng Anh.", bold_prefix="2. Khi nào nên sử dụng? ")
    add_body_paragraph(doc, "Thao tác trên thanh chuyển đổi chế độ xem:", bold_prefix="3. Các bước thực hiện: ")

    add_numbered_step(doc, 1, "Tìm bảng công tắc ngôn ngữ", "Tại đầu trang chi tiết hiện vật có 3 nút: \"Tiếng Việt\", \"Song ngữ\", \"English\".")
    add_numbered_step(doc, 2, "Bật chế độ Song ngữ", "Hãy chọn nút \"Song ngữ\". Lúc này bài viết sẽ được chia làm hai cột song song: cột bên trái là tiếng Việt, cột bên phải là tiếng Anh tương ứng từng đoạn.")
    add_numbered_step(doc, 3, "Tra cứu hồ sơ điền dã", "Cuộn xuống thẻ \"Hồ sơ nhân học điền dã\" để đọc thông tin về: chất liệu tự nhiên, kích thước, xuất xứ bản làng Tây Giang, niên đại và cách người Cơ Tu gìn giữ báu vật.")

    add_body_paragraph(doc, "Giúp bạn dễ dàng đối chiếu hai thứ tiếng, mở rộng vốn từ vựng học thuật quốc tế một cách tự nhiên.", bold_prefix="4. Kết quả nhận được: ")

    add_figure(
        doc,
        "manual_images/03b_chi_tiet_nha_guol_cuon_trang.png",
        "Khu vực giải phẫu cấu tạo (Anatomy) và Hồ sơ nhân học điền dã chi tiết"
    )

    # ----------------- CHỨC NĂNG 7 -----------------
    add_header_paragraph(doc, "Chức năng 7: Lắng nghe thuyết minh tự động (Audio Guide)", level=2)
    add_body_paragraph(doc, "Phát giọng đọc truyền cảm giới thiệu về hiện vật, đóng vai trò như một người hướng dẫn viên bảo tàng số đồng hành cùng bạn.", bold_prefix="1. Chức năng này dùng để làm gì? ")
    add_body_paragraph(doc, "Khi bạn muốn vừa ngắm nhìn mô hình 3D vừa lắng nghe câu chuyện mà không cần phải mỏi mắt đọc từng dòng chữ dài.", bold_prefix="2. Khi nào nên sử dụng? ")
    add_body_paragraph(doc, "Thao tác vô cùng tiện lợi:", bold_prefix="3. Các bước thực hiện: ")

    add_numbered_step(doc, 1, "Tìm thanh Audio Guide", "Thanh nghe thuyết minh nằm ngay bên dưới phần tóm tắt ngắn của hiện vật.")
    add_numbered_step(doc, 2, "Bấm nút Phát (Play)", "Chạm vào biểu tượng nút tam giác (Phát âm thanh). Giọng đọc thuyết minh chuẩn sẽ bắt đầu đọc bài giới thiệu.")
    add_numbered_step(doc, 3, "Tạm dừng hoặc đổi ngôn ngữ đọc", "Bạn có thể bấm Tạm dừng bất kỳ lúc nào. Nếu giao diện đang ở chế độ Tiếng Anh, hệ thống sẽ tự động đọc thuyết minh bằng tiếng Anh giọng bản ngữ chuẩn xác.")

    add_body_paragraph(doc, "Mang lại trải nghiệm nghe nhìn sống động, nâng cao khả năng nghe hiểu tiếng Anh cho học sinh.", bold_prefix="4. Kết quả nhận được: ")

    # ----------------- CHỨC NĂNG 8 -----------------
    add_header_paragraph(doc, "Chức năng 8: Học từ vựng qua Thẻ ghi nhớ (Flashcard) & Thử thách Quiz", level=2)
    add_body_paragraph(doc, "Cung cấp kho từ vựng tiếng Anh chuyên đề văn hóa Cơ Tu kèm phiên âm quốc tế IPA và các câu hỏi trắc nghiệm đố vui vui nhộn.", bold_prefix="1. Chức năng này dùng để làm gì? ")
    add_body_paragraph(doc, "Sau khi đã tham quan các hiện vật, bạn dùng chức năng này để ôn tập từ mới và kiểm tra kiến thức của mình.", bold_prefix="2. Khi nào nên sử dụng? ")
    add_body_paragraph(doc, "Thực hiện theo các bước sau:", bold_prefix="3. Các bước thực hiện: ")

    add_numbered_step(doc, 1, "Mở trang Học tập & Quiz", "Chạm vào mục \"Học tập & Quiz\" trên thanh menu chính.")
    add_numbered_step(doc, 2, "Lật thẻ Flashcard học từ mới", "Bấm vào thẻ từ vựng để lật mặt sau: mặt trước có từ tiếng Anh và phiên âm; mặt sau có nghĩa tiếng Việt, giải nghĩa chi tiết và câu ví dụ. Chạm vào biểu tượng chiếc loa cạnh từ vựng để nghe máy phát âm mẫu.")
    add_numbered_step(doc, 3, "Tham gia Đố vui kiến thức (Quiz)", "Chuyển sang tab \"Thử thách Quiz\", chọn chủ đề bạn muốn thi và bấm chọn đáp án A, B, C hoặc D. Hệ thống sẽ chấm điểm tức thì và chúc mừng khi bạn trả lời đúng!")

    add_body_paragraph(doc, "Bạn vừa ghi nhớ sâu sắc nét đẹp văn hóa quê hương, vừa nâng cao điểm số và vốn từ vựng môn Tiếng Anh.", bold_prefix="4. Kết quả nhận được: ")

    add_two_column_figures(
        doc,
        "manual_images/06_trung_tam_hoc_tap.png", "Học từ vựng văn hóa qua Thẻ ghi nhớ Flashcard",
        "manual_images/06b_hoc_tap_quiz_cuon_trang.png", "Trò chơi Đố vui tương tác (Quiz) củng cố kiến thức"
    )

    # ----------------- CHỨC NĂNG 9 -----------------
    add_header_paragraph(doc, "Chức năng 9: Tạo và in nhãn mã QR bảo tàng số", level=2)
    add_body_paragraph(doc, "Tạo ra các tem nhãn trưng bày đẹp mắt có chứa hình ảnh, tên gọi song ngữ và mã QR dẫn thẳng tới từng hiện vật.", bold_prefix="1. Chức năng này dùng để làm gì? ")
    add_body_paragraph(doc, "Dành cho thầy cô giáo và các nhóm học sinh khi tổ chức triển lãm văn hóa tại lớp học, thư viện, hoặc làm dự án STEM/khoa học kỹ thuật.", bold_prefix="2. Khi nào nên sử dụng? ")
    add_body_paragraph(doc, "Thao tác in ấn vô cùng thuận tiện:", bold_prefix="3. Các bước thực hiện: ")

    add_numbered_step(doc, 1, "Vào trang Nhãn QR", "Chạm vào mục \"Nhãn QR\" trên menu.")
    add_numbered_step(doc, 2, "Xem trước các mẫu nhãn", "Màn hình sẽ hiển thị sẵn các nhãn trưng bày của 7 hiện vật được thiết kế trang nhã theo tỷ lệ thẻ bảo tàng quốc tế.")
    add_numbered_step(doc, 3, "Bấm nút In toàn bộ", "Bấm vào nút màu vàng \"In toàn bộ nhãn trưng bày\" ở góc trên. Máy tính sẽ tự động mở hộp thoại in của máy in, bạn chỉ cần nạp giấy (hoặc bìa cứng) và bấm In.")

    add_body_paragraph(doc, "Bạn có ngay một bộ tem nhãn chuyên nghiệp để dán cạnh mô hình hoặc tranh ảnh hiện vật trong lớp học.", bold_prefix="4. Kết quả nhận được: ")

    add_figure(
        doc,
        "manual_images/07_nhan_qr_trung_bay.png",
        "Trang Trình tạo & In Nhãn mã QR trưng bày phục vụ lớp học"
    )

    # ----------------- CHỨC NĂNG 10 -----------------
    add_header_paragraph(doc, "Chức năng 10: Theo dõi hành trình và thành tích học tập (Dashboard)", level=2)
    add_body_paragraph(doc, "Ghi nhận toàn bộ tiến trình khám phá của bạn: số hiện vật đã xem, số lần mở 3D/AR, số từ vựng đã tích lũy và bộ huy hiệu danh dự.", bold_prefix="1. Chức năng này dùng để làm gì? ")
    add_body_paragraph(doc, "Khi bạn muốn xem lại thành tích của mình hoặc chụp lại màn hình gửi thầy cô làm minh chứng hoàn thành bài tập trải nghiệm.", bold_prefix="2. Khi nào nên sử dụng? ")
    add_body_paragraph(doc, "Cách xem và xuất kết quả:", bold_prefix="3. Các bước thực hiện: ")

    add_numbered_step(doc, 1, "Mở trang Thống kê", "Chạm vào mục \"Thống kê\" trên thanh menu.")
    add_numbered_step(doc, 2, "Xem các chỉ số học tập", "Quan sát các thẻ con số: Số hiện vật đã khám phá, Số lần trải nghiệm 3D/AR, Số bài Quiz đã vượt qua.")
    add_numbered_step(doc, 3, "Xem huy hiệu đạt được", "Kiểm tra các danh hiệu bạn đã mở khóa, ví dụ: \"Nhà thám hiểm Tây Giang\", \"Chuyên gia ngôn ngữ Cơ Tu\", \"Bậc thầy giải phẫu kiến trúc\".")

    add_body_paragraph(doc, "Bạn có cái nhìn rõ ràng về lộ trình tự học của bản thân và cảm thấy hào hứng hơn khi chinh phục các mốc học tập mới.", bold_prefix="4. Kết quả nhận được: ")

    add_figure(
        doc,
        "manual_images/08_thong_ke_hoc_tap.png",
        "Bảng theo dõi tiến độ học tập và thành tích cá nhân (Dashboard)"
    )

    doc.add_page_break()

    # =========================================================================
    # PHẦN IV. MỘT SỐ TÌNH HUỐNG THƯỜNG GẶP VÀ CÁCH XỬ LÝ
    # =========================================================================
    add_header_paragraph(doc, "PHẦN IV. MỘT SỐ TÌNH HUỐNG THƯỜNG GẶP VÀ CÁCH XỬ LÝ", level=1)

    add_body_paragraph(
        doc,
        "Trong quá trình trải nghiệm trên các dòng điện thoại hoặc máy tính khác nhau, đôi khi bạn có thể gặp một vài trục trặc nhỏ. Dưới đây là cách xử lý cực kỳ đơn giản mà bất kỳ học sinh nào cũng có thể tự làm được:"
    )

    troubles = [
        (
            "Tình huống 1: Mở đường dẫn nhưng màn hình trắng hoặc báo không có kết nối mạng",
            "Nguyên nhân:", "Kết nối Wi-Fi hoặc 4G của điện thoại bị chập chờn, hoặc bạn gõ sai địa chỉ liên kết.",
            "Cách xử lý:", "1. Kiểm tra lại cột sóng Wi-Fi hoặc dữ liệu di động trên máy; 2. Bấm nút Tải lại trang (hình mũi tên vòng tròn trên trình duyệt); 3. Kiểm tra lại đường dẫn chính xác được cung cấp."
        ),
        (
            "Tình huống 2: Quét mã QR bằng máy ảnh điện thoại nhưng không thấy trang web hiện ra",
            "Nguyên nhân:", "Camera để quá xa hoặc quá gần, hoặc ống kính máy ảnh bị mờ bụi, hoặc ánh sáng phòng quá tối.",
            "Cách xử lý:", "1. Dùng khăn mềm lau sạch ống kính camera; 2. Giữ yên điện thoại cách mã QR khoảng 15 - 20 cm để máy bắt nét; 3. Nếu máy ảnh không tự nhận, hãy mở ứng dụng Zalo và dùng tính năng quét mã QR có sẵn trong Zalo."
        ),
        (
            "Tình huống 3: Mô hình 3D xuất hiện vòng tròn xoay lâu hoặc tải chậm",
            "Nguyên nhân:", "Mô hình 3D được quét từ hiện vật thực tế nên có độ chi tiết cao; khi mạng yếu sẽ mất vài giây để nạp xong hình ảnh.",
            "Cách xử lý:", "Bạn chỉ cần kiên nhẫn đợi khoảng 3 - 5 giây. Khi vòng tròn nạp đạt 100%, mô hình sẽ hiện ra sắc nét. Sau khi đã tải xong lần đầu, các lần mở sau sẽ chạy rất nhanh."
        ),
        (
            "Tình huống 4: Bấm nút \"Xem AR Thực tế\" trên máy tính nhưng không hiện camera chiếu sàn",
            "Nguyên nhân:", "Máy tính để bàn và laptop không có cảm biến nhận diện mặt sàn thực tế như điện thoại thông minh.",
            "Cách xử lý:", "Đây là cơ chế hoàn toàn bình thường! Trên máy tính, hệ thống sẽ hiện ra một chiếc mã QR trên màn hình. Bạn chỉ cần lấy điện thoại quét mã QR này để tiếp tục chiếu AR vào phòng học của mình."
        ),
        (
            "Tình huống 5: Không nghe thấy giọng đọc thuyết minh hoặc tiếng nhạc đại ngàn",
            "Nguyên nhân:", "Điện thoại đang ở chế độ im lặng (gạt nút im lặng trên iPhone), hoặc âm lượng máy đang để mức 0, hoặc bạn đã vô tình bấm tắt nút chiếc loa trên web.",
            "Cách xử lý:", "1. Bấm nút tăng âm lượng trên thân máy; 2. Kiểm tra biểu tượng chiếc loa ở góc phải trên màn hình web, nếu có dấu gạch chéo thì chạm vào để bật lại tiếng; 3. Gắn tai nghe để lắng nghe âm thanh rõ ràng và truyền cảm nhất."
        ),
        (
            "Tình huống 6: Khi xoay ngang điện thoại, hình ảnh bị che khuất hoặc thanh menu bị tràn viền",
            "Nguyên nhân:", "Tỷ lệ màn hình khi xoay ngang bị hẹp chiều dọc.",
            "Cách xử lý:", "Phần mềm được tối ưu tốt nhất khi bạn cầm dọc điện thoại. Nếu muốn xem mô hình to hơn khi xoay ngang, hãy bấm vào nút \"Toàn màn hình\" (biểu tượng 4 mũi tên ở góc khung 3D)."
        ),
        (
            "Tình huống 7: Bị mất tiếng Việt và toàn bộ chữ chuyển sang tiếng Anh",
            "Nguyên nhân:", "Bạn đã vô tình chạm vào nút \"EN\" trên thanh công cụ.",
            "Cách xử lý:", "Rất đơn giản, bạn chỉ cần chạm lại vào nút chữ \"VI\" ở góc trên bên phải màn hình để đưa toàn bộ giao diện về tiếng Việt thân quen."
        ),
        (
            "Tình huống 8: Muốn xóa điểm bài làm Quiz để thi lại từ đầu",
            "Nguyên nhân:", "Bạn muốn làm lại bài đố vui để đạt điểm tuyệt đối 100%.",
            "Cách xử lý:", "Tại cuối bài Quiz, luôn có nút \"Làm lại thử thách\" (hình mũi tên tròn). Bấm vào đó, các câu hỏi sẽ được xáo trộn ngẫu nhiên để bạn thử sức lại lần nữa."
        )
    ]

    for title, cause_lbl, cause_val, fix_lbl, fix_val in troubles:
        add_header_paragraph(doc, title, level=3)
        add_body_paragraph(doc, cause_val, bold_prefix=cause_lbl + " ")
        add_body_paragraph(doc, fix_val, bold_prefix=fix_lbl + " ")

    doc.add_page_break()

    # =========================================================================
    # PHẦN V. GỢI Ý CÁC HOẠT ĐỘNG HỌC TẬP THỰC TẾ
    # =========================================================================
    add_header_paragraph(doc, "PHẦN V. GỢI Ý SỬ DỤNG PHẦN MỀM TRONG HỌC TẬP", level=1)

    add_body_paragraph(
        doc,
        "Để việc học tập đạt hiệu quả cao nhất, các bạn học sinh và quý thầy cô có thể tham khảo một số mô hình hoạt động thú vị dưới đây:"
    )

    add_header_paragraph(doc, "1. Quy trình 6 bước tự học di sản Cơ Tu dành cho học sinh", level=2)
    add_body_paragraph(doc, "Một quy trình học tập khoa học, tự nhiên giúp bạn nắm vững kiến thức chỉ trong 20 phút:")

    add_numbered_step(doc, 1, "Chọn một hiện vật yêu thích", "Mở bộ sưu tập 3D và chọn 1 hiện vật bạn cảm thấy tò mò nhất (ví dụ: Nhà Gươl hoặc Điêu khắc con Tê Tê).")
    add_numbered_step(doc, 2, "Quan sát mô hình 3D và mô tả hình dáng", "Dùng ngón tay xoay 360 độ, quan sát từ nóc xuống đáy, xem hiện vật được làm bằng chất liệu gì, có hoa văn gì đặc biệt.")
    add_numbered_step(doc, 3, "Đọc hiểu ý nghĩa bằng tiếng Việt", "Đọc các đoạn giới thiệu ngắn và phần giải phẫu cấu tạo để hiểu hiện vật đó gắn liền với phong tục, lễ hội nào của người Cơ Tu.")
    add_numbered_step(doc, 4, "Chuyển sang tiếng Anh để học từ vựng", "Bật chế độ Song ngữ, xem các từ vựng nổi bật (như Communal house, Bas-relief...), bấm nghe phát âm chuẩn và ghi chép vào vở.")
    add_numbered_step(doc, 5, "Thử sức với bài Quiz đố vui", "Trả lời 3 - 5 câu hỏi trắc nghiệm liên quan đến hiện vật để kiểm tra trí nhớ của mình.")
    add_numbered_step(doc, 6, "Chia sẻ cùng bạn bè", "Kể lại cho bạn bè nghe một chi tiết thú vị mà bạn vừa khám phá được (ví dụ: vì sao nhà Gươl lại làm mái hình mai rùa).")

    add_header_paragraph(doc, "2. Hoạt động \"Tập làm Hướng dẫn viên du lịch nhí bằng tiếng Anh\"", level=2)
    add_body_paragraph(
        doc,
        "Các bạn học sinh có thể lập nhóm 2 - 3 bạn. Một bạn mở mô hình 3D trên màn hình máy tính hoặc chiếu AR xuống bàn, một bạn đóng vai du khách quốc tế hỏi han, bạn còn lại đóng vai hướng dẫn viên giới thiệu bằng tiếng Anh dựa trên các câu văn mẫu có sẵn trong phần mềm. Hoạt động này giúp bạn vừa giỏi tiếng Anh giao tiếp vừa tự tin trước đám đông!"
    )

    add_header_paragraph(doc, "3. Hoạt động \"Ngày hội bảo tàng số tại lớp học\"", level=2)
    add_body_paragraph(
        doc,
        "Thầy cô hoặc ban cán sự lớp in bộ mã QR từ trang \"Nhãn QR\", dán xung quanh các góc lớp học thành 7 trạm di sản. Mỗi trạm trưng bày một bức tranh hoặc mô hình tượng trưng. Học sinh cầm điện thoại đi quanh lớp quét mã để khám phá từng trạm và hoàn thành phiếu học tập."
    )

    add_header_paragraph(doc, "4. Ví dụ minh họa thực hành cụ thể: Khám phá \"Nhà Gươl Truyền Thống\"", level=2)
    add_body_paragraph(
        doc,
        "Dưới đây là một bài thực hành mẫu để bạn dễ hình dung cách tự học với hiện vật Nhà Gươl:",
        bold_prefix="Ví dụ trải nghiệm mẫu: "
    )

    example_steps = [
        ("Bước 1: Quan sát 3D:", "Bạn xoay mô hình Nhà Gươl và nhận ra mái nhà có hình tròn cong cong rất đặc biệt giống như mai của một con rùa khổng lồ. Toàn bộ nhà được nâng đỡ bởi các cột gỗ mà không dùng đinh sắt."),
        ("Bước 2: Tìm hiểu cấu tạo:", "Bạn chạm vào thẻ \"Cột cái Ki'lơm\". Camera 3D phóng to vào thân cột gỗ chính giữa nhà, nơi có khắc chạm nổi hình ảnh các dũng sĩ múa khiên đao và đàn chim trĩ tung cánh."),
        ("Bước 3: Đọc ý nghĩa văn hóa:", "Bạn biết được rằng Gươl là nơi linh thiêng nhất của buôn làng Cơ Tu, nơi tổ chức lễ hội đâm trâu (Cha-ha-roo-tmee) và là chốn bàn bạc việc làng của các già làng thông thái."),
        ("Bước 4: Tích lũy từ vựng tiếng Anh:", "Bạn học được các từ đắt giá: \"Communal house\" (Nhà cộng đồng), \"Sacred pillar\" (Cột cái linh thiêng), \"Bas-relief carving\" (Nghệ thuật chạm nổi)."),
        ("Bước 5: Thử thách:", "Bạn trả lời đúng câu hỏi trắc nghiệm: \"Loài chim nào thường được chạm trên cột nhà Gươl?\" -> Đáp án: Chim trĩ (Pheasant).")
    ]
    for st_title, st_txt in example_steps:
        add_bullet_point(doc, st_txt, bold_prefix=st_title + " ")

    doc.add_page_break()

    # =========================================================================
    # PHẦN VI. LƯU Ý KHI SỬ DỤNG VÀ THÔNG ĐIỆP VĂN HÓA
    # =========================================================================
    add_header_paragraph(doc, "PHẦN VI. LƯU Ý KHI SỬ DỤNG VÀ NGUYÊN TẮC VĂN HÓA", level=1)

    add_body_paragraph(
        doc,
        "Để bảo đảm tính văn minh, an toàn và phát huy tối đa giá trị giáo dục của phần mềm, các bạn học sinh và người dùng cần lưu ý một số điểm sau:"
    )

    notes = [
        ("Khuyến nghị về mạng và trình duyệt:", "Nên kết nối mạng Wi-Fi ổn định hoặc mạng 4G/5G khi xem mô hình 3D và AR lần đầu tiên. Khuyến khích sử dụng trình duyệt Google Chrome hoặc Safari phiên bản mới nhất để có tốc độ mượt mà nhất."),
        ("Tôn trọng tri thức bản địa:", "Mọi hình ảnh, tên gọi tiếng Cơ Tu và câu chuyện văn hóa trong phần mềm đều là tài sản tinh thần thiêng liêng của đồng bào Cơ Tu Tây Giang đã được các già làng và nghệ nhân truyền dạy. Chúng ta cần đón nhận với thái độ trân trọng, nghiêm túc và kính phục."),
        ("Sử dụng đúng mục đích:", "Tài liệu và hình ảnh trong phần mềm được cung cấp hoàn toàn phi thương mại, phục vụ mục đích học tập, nghiên cứu và quảng bá nét đẹp văn hóa dân tộc. Nghiêm cấm mọi hành vi sao chép nhằm mục đích trục lợi cá nhân."),
        ("Lan tỏa thông điệp tích cực:", "Khi chia sẻ hình ảnh trải nghiệm AR lên mạng xã hội hoặc nhóm lớp, hãy kèm theo những lời giới thiệu chuẩn xác, tôn vinh nét đẹp văn hóa và niềm tự hào đối với các dân tộc thiểu số anh em trên dải đất Việt Nam.")
    ]
    for n_title, n_desc in notes:
        add_bullet_point(doc, n_desc, bold_prefix="• " + n_title + " ")

    # =========================================================================
    # PHẦN VII. TỔNG KẾT VÀ SỨ MỆNH LAN TỎA DI SẢN
    # =========================================================================
    add_header_paragraph(doc, "PHẦN VII. TỔNG KẾT VÀ SỨ MỆNH LAN TỎA DI SẢN", level=1)

    add_body_paragraph(
        doc,
        "Phần mềm Cơ-Tu Heritage AR không đơn thuần là một công cụ công nghệ số, mà là một nhịp cầu nối liền quá khứ hào hùng nơi đại ngàn Trường Sơn với thế hệ trẻ hôm nay. Đằng sau mỗi mô hình 3D, mỗi thớ gỗ của nhà Gươl hay từng nhịp vang của tiếng trống K'tu là giọt mồ hôi, tài hoa và linh hồn của bao thế hệ đồng bào Cơ Tu Tây Giang."
    )

    add_body_paragraph(
        doc,
        "Hy vọng rằng qua tài liệu hướng dẫn này, các bạn học sinh THPT sẽ cảm thấy việc tìm hiểu lịch sử và văn hóa dân tộc trở nên gần gũi, cuốn hút và tràn ngập niềm vui khám phá. Hãy tự tin mở máy ảnh, xoay tròn từng hiện vật, cất cao lời giới thiệu bằng cả tiếng Việt lẫn tiếng Anh để nét đẹp văn hóa Cơ Tu mãi mãi trường tồn và bay xa cùng năm tháng!"
    )

    add_callout_box(
        doc,
        "LỜI CHÚC DÀNH CHO CÁC BẠN HỌC SINH",
        [
            "\"Chúc các bạn có những giờ học trải nghiệm thật nhiều niềm vui, khám phá được những điều kỳ diệu về văn hóa Cơ Tu và trở thành những đại sứ trẻ tuổi lan tỏa di sản Việt Nam ra thế giới!\""
        ],
        box_type="discovery"
    )

    doc.add_page_break()

    # =========================================================================
    # PHỤ LỤC THAM KHẢO
    # =========================================================================
    add_header_paragraph(doc, "PHỤ LỤC: BẢNG TRA CỨU HIỆN VẬT & TỪ VỰNG TIÊU BIỂU", level=1)

    add_header_paragraph(doc, "1. Bảng danh mục 7 hiện vật số hóa trong phần mềm", level=2)
    add_body_paragraph(
        doc,
        "Dưới đây là thông tin tóm tắt của 7 báu vật văn hóa Cơ Tu hiện đang được trưng bày 3D hoàn chỉnh trong phần mềm:"
    )

    artifacts_table_data = [
        ("Nhà Gươl Truyền Thống", "Gươl Communal House", "Kiến trúc truyền thống", "Trái tim buôn làng, nơi sinh hoạt cộng đồng và trú ngụ của các thần linh (Giàng).", "Mái mai rùa lợp lá nón, cột cái Ki'lơm chạm khắc chim trĩ và kỳ đà nguyên khối."),
        ("Trống K'tu Truyền Thống", "K'tu Traditional Drum", "Nhạc cụ dân tộc", "Âm thanh linh thiêng dẫn dắt nhịp điệu múa Tung tung Da dá trong ngày hội.", "Thân đẽo từ thân cây rừng nguyên khúc, hai đầu bịt da trâu rừng căng bằng dây mây."),
        ("Gùi Ba-hieng Cơ Tu", "Ba-hieng Carrying Basket", "Nghề dệt & đan lát", "Vật dụng gắn bó thủy chung với người Cơ Tu trên nương rẫy và đường săn.", "Kỹ thuật đan mây ba lớp kín khít chống thấm nước, quai đeo bền chắc bằng vỏ cây."),
        ("Chiêng Đồng (Chiing)", "Sacred Bronze Gong", "Nhạc cụ dân tộc", "Báu vật gia bảo của buôn làng, tiếng chiêng kết nối con người với trời đất.", "Đúc bằng hợp kim đồng cổ, âm vực trầm vang ngân nga vọng khắp các dãy núi."),
        ("Áo Nam Thổ Cẩm", "Men's Brocade Tunic", "Nghề dệt & trang phục", "Trang phục kiêu hãnh của đàn ông Cơ Tu trong các nghi lễ lớn của làng.", "Dệt từ sợi bông rừng nhuộm vỏ cây tự nhiên, phối màu chàm, đỏ và hạt cườm chì."),
        ("Váy Áo Nữ Thổ Cẩm", "Women's Brocade Costume", "Nghề dệt & trang phục", "Biểu trưng cho sự dịu dàng, khéo léo của người phụ nữ Cơ Tu trong điệu múa Da dá.", "Dệt hoa văn hạt cườm trắng li ti xếp thành hình sóng nước, chim muông và hoa rừng."),
        ("Điêu Khắc Con Tê Tê", "Pangolin Wood Sculpture", "Điêu khắc tâm linh", "Tác phẩm điêu khắc gỗ dân gian thể hiện sự hòa hợp giữa con người và muông thú.", "Đẽo gọt mộc mạc bằng rìu tay từ thân gỗ rừng, vảy tê tê xếp lớp sinh động.")
    ]

    tbl_art = doc.add_table(rows=len(artifacts_table_data) + 1, cols=5)
    tbl_art.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_art.autofit = False

    headers_art = ["Tên Tiếng Việt", "Tên Tiếng Anh", "Thể loại", "Ý nghĩa văn hóa", "Điểm nhấn 3D"]
    col_widths_art = [Inches(1.4), Inches(1.3), Inches(1.1), Inches(1.4), Inches(1.4)]

    # Header row
    for c_idx, h_text in enumerate(headers_art):
        c = tbl_art.cell(0, c_idx)
        c.width = col_widths_art[c_idx]
        set_cell_background(c, HEX_FOREST_GREEN)
        set_cell_margins(c, top=80, bottom=80, left=80, right=80)
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(2)
        r = p.add_run(h_text)
        r.font.name = FONT_PRIMARY
        r.font.size = Pt(9)
        r.bold = True
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    # Data rows
    for r_idx, row_data in enumerate(artifacts_table_data):
        bg = HEX_CREAM_SAND if r_idx % 2 == 0 else HEX_WHITE
        for c_idx, val in enumerate(row_data):
            c = tbl_art.cell(r_idx + 1, c_idx)
            c.width = col_widths_art[c_idx]
            set_cell_background(c, bg)
            set_cell_margins(c, top=70, bottom=70, left=80, right=80)
            set_cell_border(c, bottom={"sz": 4, "val": "single", "color": HEX_BORDER_MUTED})
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.line_spacing = 1.15
            r = p.add_run(val)
            r.font.name = FONT_PRIMARY
            r.font.size = Pt(8.5)
            r.font.color.rgb = RGB_BODY_DARK
            if c_idx == 0:
                r.bold = True
                r.font.color.rgb = RGB_FOREST_GREEN

    p_sp_art = doc.add_paragraph()
    p_sp_art.paragraph_format.space_before = Pt(8)

    add_header_paragraph(doc, "2. Bảng 15 từ vựng tiếng Anh văn hóa Cơ Tu tiêu biểu", level=2)
    add_body_paragraph(
        doc,
        "Bộ từ vựng được trích từ Trung tâm học tập của phần mềm, giúp bạn trau dồi vốn tiếng Anh chuyên đề di sản:"
    )

    vocab_data = [
        ("Communal house", "/kəˈmjuːnl haʊs/", "Nhà cộng đồng / Nhà Gươl", "Villagers gather at the communal house for sacred ceremonies."),
        ("Sacred pillar", "/ˈseɪkrɪd ˈpɪlər/", "Cột cái linh thiêng (Ki'lơm)", "The sacred pillar is carved with wild pheasant motifs."),
        ("Bas-relief carving", "/ˌbɑː rɪˈliːf ˈkɑːvɪŋ/", "Nghệ thuật chạm nổi gỗ", "Intricate bas-relief carvings depict scenes of ancient harvest celebrations."),
        ("Traditional drum", "/trəˈdɪʃənl drʌm/", "Trống truyền thống", "The deep rhythm of the traditional drum echoes across the forest."),
        ("Buffalo hide", "/ˈbʌfələʊ haɪd/", "Da trâu (bịt mặt trống)", "The drumhead is crafted from tightly stretched buffalo hide."),
        ("Carrying basket", "/ˈkæriɪŋ ˈbɑːskɪt/", "Gùi mang trên lưng (Ba-hieng)", "The three-tier carrying basket is woven from mountain rattan."),
        ("Rattan weaving", "/ræˈtæn ˈwiːvɪŋ/", "Nghệ thuật đan lát mây tre", "Rattan weaving requires exceptional skill and patience."),
        ("Bronze gong", "/brɒnz ɡɒŋ/", "Chiêng đồng linh thiêng", "The bronze gong is a treasured heirloom in every Cơ Tu village."),
        ("Brocade tunic", "/brəˈkeɪd ˈtjuːnɪk/", "Áo thổ cẩm truyền thống", "Men wear the brocade tunic during annual tribal festivals."),
        ("Glass beadwork", "/ɡlɑːs ˈbiːdwɜːk/", "Nghệ thuật đính hạt cườm", "Exquisite glass beadwork forms patterns of water and stars."),
        ("Village chieftain", "/ˈvɪlɪdʒ ˈtʃiːftən/", "Già làng uy tín", "The village chieftain guides youths in preserving customary law."),
        ("Woodcarving art", "/ˈwʊdkɑːvɪŋ ɑːt/", "Nghệ thuật điêu khắc gỗ", "Woodcarving art expresses deep harmony with wilderness."),
        ("Sacrificial post", "/ˌsækrɪˈfɪʃl pəʊst/", "Cột đâm trâu (X'nur)", "The sacrificial post is brightly painted with natural dyes."),
        ("Harvest festival", "/ˈhɑːvɪst ˈfestɪvl/", "Lễ hội mừng lúa mới", "Villagers dance together during the festive harvest celebration."),
        ("Oral tradition", "/ˈɔːrəl trəˈdɪʃn/", "Truyền thống truyền khẩu", "Ancient legends are kept alive through heartfelt oral tradition.")
    ]

    tbl_voc = doc.add_table(rows=len(vocab_data) + 1, cols=4)
    tbl_voc.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_voc.autofit = False

    headers_voc = ["Thuật ngữ tiếng Anh", "Phiên âm IPA", "Ý nghĩa tiếng Việt", "Ví dụ thực tế"]
    col_widths_voc = [Inches(1.6), Inches(1.3), Inches(1.7), Inches(2.0)]

    for c_idx, h_text in enumerate(headers_voc):
        c = tbl_voc.cell(0, c_idx)
        c.width = col_widths_voc[c_idx]
        set_cell_background(c, HEX_OCHRE_GOLD)
        set_cell_margins(c, top=80, bottom=80, left=80, right=80)
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(2)
        r = p.add_run(h_text)
        r.font.name = FONT_PRIMARY
        r.font.size = Pt(9)
        r.bold = True
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    for r_idx, (term, ipa, vn_meaning, ex) in enumerate(vocab_data):
        bg = HEX_CREAM_SAND if r_idx % 2 == 0 else HEX_WHITE
        c0 = tbl_voc.cell(r_idx + 1, 0)
        c1 = tbl_voc.cell(r_idx + 1, 1)
        c2 = tbl_voc.cell(r_idx + 1, 2)
        c3 = tbl_voc.cell(r_idx + 1, 3)

        for c_idx, c in enumerate([c0, c1, c2, c3]):
            c.width = col_widths_voc[c_idx]
            set_cell_background(c, bg)
            set_cell_margins(c, top=65, bottom=65, left=70, right=70)
            set_cell_border(c, bottom={"sz": 4, "val": "single", "color": HEX_BORDER_MUTED})

        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_after = Pt(2)
        r0 = p0.add_run(term)
        r0.font.name = FONT_PRIMARY
        r0.font.size = Pt(8.5)
        r0.bold = True
        r0.font.color.rgb = RGB_FOREST_GREEN

        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_after = Pt(2)
        r1 = p1.add_run(ipa)
        r1.font.name = FONT_PRIMARY
        r1.font.size = Pt(8.5)
        r1.font.color.rgb = RGB_MUTED_GRAY

        p2 = c2.paragraphs[0]
        p2.paragraph_format.space_after = Pt(2)
        r2 = p2.add_run(vn_meaning)
        r2.font.name = FONT_PRIMARY
        r2.font.size = Pt(8.5)
        r2.font.color.rgb = RGB_BODY_DARK

        p3 = c3.paragraphs[0]
        p3.paragraph_format.space_after = Pt(2)
        p3.paragraph_format.line_spacing = 1.15
        r3 = p3.add_run(ex)
        r3.font.name = FONT_PRIMARY
        r3.font.size = Pt(8)
        r3.italic = True
        r3.font.color.rgb = RGB_WOOD_BROWN

    # Lưu tài liệu Word ra thư mục gốc dự án
    output_filename = "HUONG_DAN_SU_DUNG_CO_TU_HERITAGE_AR.docx"
    doc.save(output_filename)
    print(f"\n=======================================================")
    print(f"XUẤT TÀI LIỆU THÀNH CÔNG: {os.path.abspath(output_filename)}")
    print(f"Dung lượng tệp: {os.path.getsize(output_filename)} bytes")
    print(f"=======================================================\n")

if __name__ == "__main__":
    build_complete_manual()
