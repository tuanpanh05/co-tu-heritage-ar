#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Chương trình tạo file Word ngắn gọn, thực chất, súc tích:
HUONG_DAN_SU_DUNG_CO_TU_HERITAGE_AR.docx
Bỏ toàn bộ văn phong dài dòng, tập trung 100% vào thao tác sử dụng thực tế.
"""

import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

# Bảng màu
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

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
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

def add_header(doc, text, level=1):
    p = doc.add_paragraph()
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = FONT_PRIMARY
    run.bold = True

    if level == 1:
        p.paragraph_format.space_before = Pt(16)
        p.paragraph_format.space_after = Pt(6)
        run.font.size = Pt(14)
        run.font.color.rgb = RGB_FOREST_GREEN
        pBdr = parse_xml(f'''
            <w:pBdr {nsdecls("w")}>
                <w:bottom w:val="single" w:sz="12" w:space="4" w:color="{HEX_OCHRE_GOLD}"/>
            </w:pBdr>
        ''')
        p._p.get_or_add_pPr().append(pBdr)
    elif level == 2:
        p.paragraph_format.space_before = Pt(12)
        p.paragraph_format.space_after = Pt(4)
        run.font.size = Pt(12)
        run.font.color.rgb = RGB_OCHRE_GOLD
    elif level == 3:
        p.paragraph_format.space_before = Pt(8)
        p.paragraph_format.space_after = Pt(3)
        run.font.size = Pt(10.5)
        run.font.color.rgb = RGB_WOOD_BROWN
    return p

def add_text(doc, text, bold_prefix="", italic=False):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.2

    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = FONT_PRIMARY
        r_pre.font.size = Pt(10)
        r_pre.bold = True
        r_pre.font.color.rgb = RGB_BODY_DARK

    run = p.add_run(text)
    run.font.name = FONT_PRIMARY
    run.font.size = Pt(10)
    run.italic = italic
    run.font.color.rgb = RGB_BODY_DARK
    return p

def add_step(doc, num, title, detail):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.line_spacing = 1.18

    r_num = p.add_run(f"Bước {num}: ")
    r_num.font.name = FONT_PRIMARY
    r_num.font.size = Pt(10)
    r_num.bold = True
    r_num.font.color.rgb = RGB_OCHRE_GOLD

    r_t = p.add_run(f"{title} — ")
    r_t.font.name = FONT_PRIMARY
    r_t.font.size = Pt(10)
    r_t.bold = True
    r_t.font.color.rgb = RGB_FOREST_GREEN

    r_d = p.add_run(detail)
    r_d.font.name = FONT_PRIMARY
    r_d.font.size = Pt(10)
    r_d.font.color.rgb = RGB_BODY_DARK
    return p

def add_bullet(doc, text, bold_prefix=""):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_before = Pt(1)
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.line_spacing = 1.15

    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = FONT_PRIMARY
        r_pre.font.size = Pt(10)
        r_pre.bold = True
        r_pre.font.color.rgb = RGB_BODY_DARK

    run = p.add_run(text)
    run.font.name = FONT_PRIMARY
    run.font.size = Pt(10)
    run.font.color.rgb = RGB_BODY_DARK
    return p

def add_tip(doc, title, lines):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    cell = tbl.cell(0, 0)
    cell.width = Inches(6.5)
    set_cell_background(cell, HEX_TIP_AMBER)
    set_cell_margins(cell, top=100, bottom=100, left=150, right=150)
    set_cell_border(cell, left={"sz": 24, "val": "single", "color": HEX_OCHRE_GOLD})

    p0 = cell.paragraphs[0]
    p0.paragraph_format.space_before = Pt(1)
    p0.paragraph_format.space_after = Pt(2)
    r0 = p0.add_run(f"💡 {title}")
    r0.font.name = FONT_PRIMARY
    r0.font.size = Pt(9.5)
    r0.bold = True
    r0.font.color.rgb = RGB_OCHRE_GOLD

    for line in lines:
        p = cell.add_paragraph()
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = 1.15
        r = p.add_run(line)
        r.font.name = FONT_PRIMARY
        r.font.size = Pt(9)
        r.font.color.rgb = RGB_BODY_DARK

    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_before = Pt(0)
    p_sp.paragraph_format.space_after = Pt(3)

def add_img(doc, path, cap, width=5.2):
    if not os.path.exists(path):
        return
    p_img = doc.add_paragraph()
    p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_img.paragraph_format.space_before = Pt(4)
    p_img.paragraph_format.space_after = Pt(2)
    p_img.paragraph_format.keep_with_next = True
    r = p_img.add_run()
    r.add_picture(path, width=Inches(width))

    p_cap = doc.add_paragraph()
    p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap.paragraph_format.space_before = Pt(0)
    p_cap.paragraph_format.space_after = Pt(6)
    rc = p_cap.add_run(f"Hình: {cap}")
    rc.font.name = FONT_PRIMARY
    rc.font.size = Pt(8.5)
    rc.italic = True
    rc.font.color.rgb = RGB_MUTED_GRAY

def add_two_imgs(doc, p1, c1, p2, c2, width=2.8):
    if not (os.path.exists(p1) and os.path.exists(p2)):
        return
    tbl = doc.add_table(rows=1, cols=2)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    for idx, (p, c) in enumerate([(p1, c1), (p2, c2)]):
        cell = tbl.cell(0, idx)
        cell.width = Inches(3.2)
        set_cell_margins(cell, top=40, bottom=40, left=40, right=40)
        p_c = cell.paragraphs[0]
        p_c.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_c.paragraph_format.space_after = Pt(2)
        r = p_c.add_run()
        r.add_picture(p, width=Inches(width))

        p_cap = cell.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_after = Pt(4)
        rc = p_cap.add_run(f"Hình: {c}")
        rc.font.name = FONT_PRIMARY
        rc.font.size = Pt(8)
        rc.italic = True
        rc.font.color.rgb = RGB_MUTED_GRAY
    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_before = Pt(0)
    p_sp.paragraph_format.space_after = Pt(3)

def build_concise_manual():
    doc = docx.Document()

    # Thiết lập trang in gọn gàng
    sec = doc.sections[0]
    sec.top_margin = Inches(0.7)
    sec.bottom_margin = Inches(0.7)
    sec.left_margin = Inches(0.8)
    sec.right_margin = Inches(0.8)

    # Header / Footer
    hdr = sec.header.paragraphs[0]
    hdr.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_h = hdr.add_run("HƯỚNG DẪN SỬ DỤNG NHANH · CƠ-TU HERITAGE AR")
    r_h.font.name = FONT_PRIMARY
    r_h.font.size = Pt(8)
    r_h.font.color.rgb = RGB_MUTED_GRAY

    ftr = sec.footer.paragraphs[0]
    ftr.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_f = ftr.add_run("Trang ")
    r_f.font.name = FONT_PRIMARY
    r_f.font.size = Pt(8)
    r_f.font.color.rgb = RGB_MUTED_GRAY
    # Trang tự động
    r_pg = ftr.add_run()
    fld1 = parse_xml(r'<w:fldChar %s w:fldCharType="begin"/>' % nsdecls('w'))
    instr = parse_xml(r'<w:instrText %s xml:space="preserve"> PAGE </w:instrText>' % nsdecls('w'))
    fld2 = parse_xml(r'<w:fldChar %s w:fldCharType="separate"/>' % nsdecls('w'))
    fld3 = parse_xml(r'<w:fldChar %s w:fldCharType="end"/>' % nsdecls('w'))
    r_pg._r.append(fld1)
    r_pg._r.append(instr)
    r_pg._r.append(fld2)
    r_pg._r.append(fld3)

    # ==================== TRANG TIÊU ĐỀ NGẮN GỌN ====================
    logo_path = os.path.abspath("public/images/logo-emblem.png")
    if os.path.exists(logo_path):
        p_logo = doc.add_paragraph()
        p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_logo.paragraph_format.space_before = Pt(4)
        p_logo.paragraph_format.space_after = Pt(6)
        p_logo.add_run().add_picture(logo_path, width=Inches(1.2))

    p_t = doc.add_paragraph()
    p_t.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_t.paragraph_format.space_after = Pt(2)
    rt = p_t.add_run("HƯỚNG DẪN SỬ DỤNG PHẦN MỀM CƠ-TU HERITAGE AR")
    rt.font.name = FONT_PRIMARY
    rt.font.size = Pt(17)
    rt.bold = True
    rt.font.color.rgb = RGB_FOREST_GREEN

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(10)
    rs = p_sub.add_run("Khám phá hiện vật văn hóa Cơ Tu qua mô hình 3D & Thực tế tăng cường (AR)")
    rs.font.name = FONT_PRIMARY
    rs.font.size = Pt(11)
    rs.italic = True
    rs.font.color.rgb = RGB_OCHRE_GOLD

    # Tóm tắt 3 câu cốt lõi
    add_text(
        doc,
        "Cơ-Tu Heritage AR là phần mềm bảo tàng số trực quan trên web, giúp học sinh và giáo viên khám phá 7 hiện vật văn hóa truyền thống của đồng bào Cơ Tu (Tây Giang, Quảng Nam). Phần mềm hỗ trợ xoay lật 3D 360 độ, chiếu mô hình vào không gian thực (AR), nghe giọng đọc thuyết minh và học từ vựng tiếng Anh theo chủ đề. Hoạt động trực tiếp trên điện thoại, máy tính và máy tính bảng qua trình duyệt web mà không cần cài đặt.",
        bold_prefix="Tóm tắt nhanh: "
    )

    add_two_imgs(
        doc,
        "manual_images/01_trang_chu.png", "Giao diện máy tính",
        "manual_images/09_mobile_trang_chu.png", "Giao diện điện thoại"
    )

    # ==================== PHẦN 1: BỐ CỤC CHÍNH ====================
    add_header(doc, "1. Giao diện & Các khu vực chính", level=1)
    add_bullet(doc, "Trang chủ, xem nhanh mô hình 3D Nhà Gươl và bản đồ buôn làng.", bold_prefix="• Khám phá: ")
    add_bullet(doc, "Danh sách 7 hiện vật văn hóa (Nhà Gươl, Trống, Gùi, Chiêng, Áo nam, Váy nữ, Điêu khắc Tê Tê).", bold_prefix="• Hiện vật 3D: ")
    add_bullet(doc, "Thẻ ghi nhớ từ vựng tiếng Anh (Flashcards) và đố vui trắc nghiệm kiến thức.", bold_prefix="• Học tập & Quiz: ")
    add_bullet(doc, "Trình in mã QR để dán cạnh hiện vật thật trong lớp học.", bold_prefix="• Nhãn QR: ")
    add_bullet(doc, "Xem số hiện vật đã học, số lần mở 3D/AR và huy hiệu đạt được.", bold_prefix="• Thống kê: ")
    add_bullet(doc, "Bấm để Tắt/Bật nhạc nền sáo & piano đại ngàn Tây Giang.", bold_prefix="• Nút chiếc loa (góc phải trên): ")
    add_bullet(doc, "Chuyển nhanh toàn bộ nội dung sang tiếng Việt hoặc tiếng Anh.", bold_prefix="• Nút đổi ngôn ngữ (VI / EN): ")

    # ==================== PHẦN 2: THAO TÁC CÁC CHỨC NĂNG CHÍNH ====================
    add_header(doc, "2. Hướng dẫn các thao tác sử dụng chính", level=1)

    # Chức năng 1: Mở phần mềm
    add_header(doc, "Thao tác 1: Cách mở phần mềm", level=2)
    add_bullet(doc, "Mở trình duyệt (Chrome, Safari hoặc Edge) gõ hoặc bấm đường link được chia sẻ.", bold_prefix="• Cách 1 (Mở bằng link): ")
    add_bullet(doc, "Bật máy ảnh điện thoại (hoặc quét mã qua Zalo), hướng ống kính vào mã QR trên nhãn in để vào thẳng hiện vật.", bold_prefix="• Cách 2 (Quét mã QR): ")

    # Chức năng 2: Chọn hiện vật & Xoay 3D
    add_header(doc, "Thao tác 2: Chọn hiện vật & Khám phá mô hình 3D", level=2)
    add_step(doc, 1, "Chọn hiện vật", "Vào mục \"Hiện vật 3D\" -> Bấm chọn hiện vật bạn muốn xem (ví dụ: Nhà Gươl hoặc Trống K'tu).")
    add_step(doc, 2, "Xoay mô hình", "Trên điện thoại: Dùng 1 ngón tay vuốt ngang/dọc để xoay 360 độ. Trên máy tính: Giữ chuột trái và rê chuột.")
    add_step(doc, 3, "Phóng to / Thu nhỏ", "Trên điện thoại: Dùng 2 ngón tay chụm lại hoặc kéo mở ra. Trên máy tính: Lăn con lăn chuột (hoặc bấm nút + / -).")
    add_step(doc, 4, "Đặt lại góc nhìn / Toàn màn hình", "Bấm nút mũi tên tròn để căn lại giữa màn hình; bấm nút 4 góc mũi tên để xem tràn màn hình.")

    add_img(doc, "manual_images/03_chi_tiet_nha_guol.png", "Trang xem mô hình 3D tương tác của Nhà Gươl")

    # Chức năng 3: Chiếu AR
    add_header(doc, "Thao tác 3: Chiếu hiện vật vào phòng thực tế (Chế độ AR)", level=2)
    add_step(doc, 1, "Bấm nút AR", "Tại trang hiện vật, chạm vào nút màu vàng \"Xem AR Thực Tế\".")
    add_step(doc, 2, "Cấp quyền & Quét mặt sàn", "Bấm \"Cho phép\" khi trình duyệt hỏi mở Camera. Cầm điện thoại lia chậm xuống sàn nhà hoặc mặt bàn phẳng để máy nhận diện.")
    add_step(doc, 3, "Tương tác ngoài đời thật", "Mô hình hiện vật xuất hiện ngay trên sàn nhà. Bạn có thể kéo di chuyển, xoay hoặc bước chân lại gần để ngắm chi tiết.")
    add_step(doc, 4, "Nếu đang dùng máy tính", "Màn hình máy tính sẽ hiện mã QR -> Lấy điện thoại quét mã này để mở AR ngay trong phòng.")

    add_two_imgs(
        doc,
        "manual_images/04_chi_tiet_trong_ktu.png", "Mô hình 3D Trống K'tu",
        "manual_images/05_chi_tiet_gui_cotu.png", "Mô hình 3D Gùi Ba-hieng"
    )

    # Chức năng 4: Xem giải phẫu & Nghe thuyết minh
    add_header(doc, "Thao tác 4: Xem cấu tạo chi tiết & Nghe thuyết minh tự động", level=2)
    add_step(doc, 1, "Xem cấu tạo (Anatomy)", "Cuộn trang xuống mục \"Giải Phẫu & Cấu Trúc Hiện Vật\" -> Chạm vào tên bộ phận (như Cột cái Ki'lơm, Mái mai rùa...). Camera 3D sẽ tự động phóng to đúng vị trí và hiển thị lời giải thích ý nghĩa văn hóa.")
    add_step(doc, 2, "Nghe thuyết minh (Audio Guide)", "Bấm nút tam giác Phát (Play) tại thanh Audio Guide để nghe giọng đọc truyền cảm giới thiệu hiện vật (chuyển ngôn ngữ EN để nghe giọng tiếng Anh).")
    add_step(doc, 3, "Bật chế độ Song ngữ", "Bấm chọn tab \"Song ngữ\" trên bài viết để xem song song hai cột tiếng Việt và tiếng Anh.")

    add_img(doc, "manual_images/03b_chi_tiet_nha_guol_cuon_trang.png", "Khu vực giải phẫu cấu tạo và hồ sơ điền dã chi tiết")

    # Chức năng 5: Học từ vựng & Làm Quiz
    add_header(doc, "Thao tác 5: Học từ vựng tiếng Anh & Thử thách Quiz", level=2)
    add_step(doc, 1, "Học từ vựng Flashcard", "Vào mục \"Học tập & Quiz\" -> Chạm vào thẻ từ vựng để lật mặt trước/mặt sau. Bấm vào hình chiếc loa để nghe phát âm chuẩn quốc tế IPA.")
    add_step(doc, 2, "Làm bài đố vui Quiz", "Chuyển sang tab \"Quiz\", chọn đáp án đúng A, B, C hoặc D để kiểm tra kiến thức và nhận huy hiệu khen thưởng.")

    add_two_imgs(
        doc,
        "manual_images/06_trung_tam_hoc_tap.png", "Thẻ học từ vựng Flashcard",
        "manual_images/06b_hoc_tap_quiz_cuon_trang.png", "Trò chơi đố vui Quiz văn hóa"
    )

    # Chức năng 6: In nhãn QR phục vụ học tập
    add_header(doc, "Thao tác 6: In nhãn mã QR triển lãm lớp học", level=2)
    add_step(doc, 1, "Mở trang Nhãn QR", "Bấm vào mục \"Nhãn QR\" trên menu.")
    add_step(doc, 2, "In nhãn", "Bấm nút vàng \"In toàn bộ nhãn trưng bày\" để in tem ra giấy hoặc bìa cứng, dán cạnh hiện vật hoặc ảnh chụp trong lớp học.")

    add_img(doc, "manual_images/07_nhan_qr_trung_bay.png", "Giao diện in nhãn QR trưng bày")

    # ==================== PHẦN 3: XỬ LÝ SỰ CỐ NHANH ====================
    add_header(doc, "3. Xử lý sự cố thường gặp (Troubleshooting)", level=1)

    troubles_concise = [
        ("Mô hình 3D tải chậm, hiện vòng xoay", "Do mạng Wi-Fi/4G yếu hoặc lần đầu tải mô hình chi tiết. Cách xử lý: Đợi 3 - 5 giây để máy tải xong 100%, những lần sau sẽ mở tức thì."),
        ("Bấm nút AR trên máy tính không thấy camera", "Máy tính không có camera chiếu sàn như điện thoại. Cách xử lý: Quét mã QR hiện trên máy tính bằng điện thoại để xem AR."),
        ("Không nghe thấy tiếng thuyết minh hoặc nhạc", "Điện thoại đang bật chế độ im lặng hoặc âm lượng bằng 0. Cách xử lý: Bật gạt âm thanh, tăng âm lượng máy và kiểm tra nút chiếc loa trên trang web."),
        ("Chữ bị đổi sang tiếng Anh", "Vô tình bấm nút EN. Cách xử lý: Chạm lại nút chữ \"VI\" ở góc phải trên để về tiếng Việt."),
        ("Hình 3D bị che khi xoay ngang điện thoại", "Tỷ lệ màn hình ngang bị hẹp dọc. Cách xử lý: Dùng điện thoại ở tư thế đứng (dọc), hoặc bấm nút \"Toàn màn hình\" ở góc khung nhìn 3D.")
    ]

    for err_t, err_sol in troubles_concise:
        add_text(doc, err_sol, bold_prefix=f"• {err_t}: ")

    # ==================== PHẦN 4: BẢNG TRA CỨU NHANH ====================
    add_header(doc, "4. Bảng tra cứu 7 hiện vật & Từ vựng cốt lõi", level=1)

    add_header(doc, "Danh mục 7 hiện vật số hóa trong phần mềm", level=2)

    quick_art_table = [
        ("Nhà Gươl Truyền Thống", "Gươl Communal House", "Kiến trúc", "Trái tim của làng buôn, nơi bàn việc lớn và sinh hoạt lễ hội."),
        ("Trống K'tu Truyền Thống", "K'tu Traditional Drum", "Nhạc cụ", "Thân đẽo từ thân gỗ nguyên khúc, hai mặt bịt da trâu rừng."),
        ("Gùi Ba-hieng Cơ Tu", "Ba-hieng Carrying Basket", "Đan lát", "Gùi đan mây ba lớp kín khít chống thấm nước khi đi rừng."),
        ("Chiêng Đồng (Chiing)", "Sacred Bronze Gong", "Nhạc cụ", "Báu vật thiêng liêng kết nối buôn làng với thần linh (Giàng)."),
        ("Áo Nam Thổ Cẩm", "Men's Brocade Tunic", "Dệt may", "Dệt từ sợi bông rừng, phối hoa văn dải màu và hạt cườm chì."),
        ("Váy Áo Nữ Thổ Cẩm", "Women's Brocade Costume", "Dệt may", "Dệt hoa văn hạt cườm trắng hình sóng nước dùng trong điệu múa Da dá."),
        ("Điêu Khắc Con Tê Tê", "Pangolin Wood Sculpture", "Điêu khắc", "Tác phẩm đẽo gỗ dân gian thể hiện sự gắn bó với muông thú.")
    ]

    tbl_q = doc.add_table(rows=len(quick_art_table) + 1, cols=4)
    tbl_q.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_q.autofit = False

    q_headers = ["Hiện vật (Tiếng Việt)", "Tên Tiếng Anh", "Thể loại", "Điểm nổi bật"]
    q_widths = [Inches(1.8), Inches(1.6), Inches(1.1), Inches(2.2)]

    for c_i, h_txt in enumerate(q_headers):
        c = tbl_q.cell(0, c_i)
        c.width = q_widths[c_i]
        set_cell_background(c, HEX_FOREST_GREEN)
        set_cell_margins(c, top=60, bottom=60, left=70, right=70)
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(2)
        r = p.add_run(h_txt)
        r.font.name = FONT_PRIMARY
        r.font.size = Pt(8.5)
        r.bold = True
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    for r_i, (v_name, e_name, cat, highlight) in enumerate(quick_art_table):
        bg = HEX_CREAM_SAND if r_i % 2 == 0 else HEX_WHITE
        for c_i, val in enumerate([v_name, e_name, cat, highlight]):
            c = tbl_q.cell(r_i + 1, c_i)
            c.width = q_widths[c_i]
            set_cell_background(c, bg)
            set_cell_margins(c, top=50, bottom=50, left=70, right=70)
            set_cell_border(c, bottom={"sz": 4, "val": "single", "color": HEX_BORDER_MUTED})
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(1)
            p.paragraph_format.line_spacing = 1.15
            r = p.add_run(val)
            r.font.name = FONT_PRIMARY
            r.font.size = Pt(8.5)
            r.font.color.rgb = RGB_BODY_DARK
            if c_i == 0:
                r.bold = True
                r.font.color.rgb = RGB_FOREST_GREEN

    p_sp_end = doc.add_paragraph()
    p_sp_end.paragraph_format.space_before = Pt(6)

    # 10 từ vựng cốt lõi nhất
    add_header(doc, "10 từ vựng tiếng Anh văn hóa cần nhớ", level=2)
    core_vocabs = [
        ("Communal house", "/kəˈmjuːnl haʊs/", "Nhà cộng đồng / Nhà Gươl"),
        ("Sacred pillar", "/ˈseɪkrɪd ˈpɪlər/", "Cột cái linh thiêng (Ki'lơm)"),
        ("Bas-relief carving", "/ˌbɑː rɪˈliːf ˈkɑːvɪŋ/", "Nghệ thuật chạm nổi gỗ"),
        ("Traditional drum", "/trəˈdɪʃənl drʌm/", "Trống truyền thống"),
        ("Buffalo hide", "/ˈbʌfələʊ haɪd/", "Da trâu (bịt mặt trống)"),
        ("Carrying basket", "/ˈkæriɪŋ ˈbɑːskɪt/", "Gùi mang trên lưng (Ba-hieng)"),
        ("Bronze gong", "/brɒnz ɡɒŋ/", "Chiêng đồng linh thiêng"),
        ("Brocade tunic", "/brəˈkeɪd ˈtjuːnɪk/", "Áo thổ cẩm truyền thống"),
        ("Glass beadwork", "/ɡlɑːs ˈbiːdwɜːk/", "Nghệ thuật đính hạt cườm"),
        ("Harvest festival", "/ˈhɑːvɪst ˈfestɪvl/", "Lễ hội mừng lúa mới")
    ]

    tbl_v = doc.add_table(rows=len(core_vocabs) + 1, cols=3)
    tbl_v.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl_v.autofit = False
    v_headers = ["Từ vựng tiếng Anh", "Phiên âm chuẩn IPA", "Nghĩa tiếng Việt"]
    v_widths = [Inches(2.2), Inches(2.0), Inches(2.5)]

    for c_i, h_txt in enumerate(v_headers):
        c = tbl_v.cell(0, c_i)
        c.width = v_widths[c_i]
        set_cell_background(c, HEX_OCHRE_GOLD)
        set_cell_margins(c, top=60, bottom=60, left=70, right=70)
        p = c.paragraphs[0]
        p.paragraph_format.space_after = Pt(2)
        r = p.add_run(h_txt)
        r.font.name = FONT_PRIMARY
        r.font.size = Pt(8.5)
        r.bold = True
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    for r_i, (term, ipa, vn) in enumerate(core_vocabs):
        bg = HEX_CREAM_SAND if r_i % 2 == 0 else HEX_WHITE
        for c_i, val in enumerate([term, ipa, vn]):
            c = tbl_v.cell(r_i + 1, c_i)
            c.width = v_widths[c_i]
            set_cell_background(c, bg)
            set_cell_margins(c, top=50, bottom=50, left=70, right=70)
            set_cell_border(c, bottom={"sz": 4, "val": "single", "color": HEX_BORDER_MUTED})
            p = c.paragraphs[0]
            p.paragraph_format.space_after = Pt(1)
            r = p.add_run(val)
            r.font.name = FONT_PRIMARY
            r.font.size = Pt(8.5)
            r.font.color.rgb = RGB_BODY_DARK
            if c_i == 0:
                r.bold = True
                r.font.color.rgb = RGB_FOREST_GREEN

    # Lưu tài liệu
    output_path = "HUONG_DAN_SU_DUNG_CO_TU_HERITAGE_AR.docx"
    doc.save(output_path)
    print(f"\n=======================================================")
    print(f"XUẤT BẢN THÀNH CÔNG TÀI LIỆU RÚT GỌN: {os.path.abspath(output_path)}")
    print(f"Dung lượng tệp: {os.path.getsize(output_path)} bytes")
    print(f"=======================================================\n")

if __name__ == "__main__":
    build_concise_manual()
