import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn
import os

doc = docx.Document()
section = doc.sections[0]
section.top_margin = Inches(0.8)
section.bottom_margin = Inches(0.8)
section.left_margin = Inches(0.9)
section.right_margin = Inches(0.9)

# Test callout box
table = doc.add_table(rows=1, cols=1)
table.alignment = WD_TABLE_ALIGNMENT.CENTER
cell = table.cell(0, 0)
tcPr = cell._tc.get_or_add_tcPr()
shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="F4EFE6"/>')
tcPr.append(shd)

borders = parse_xml(f'''
    <w:tcBorders {nsdecls("w")}>
        <w:top w:val="none"/>
        <w:left w:val="single" w:sz="28" w:space="0" w:color="1E3A2B"/>
        <w:bottom w:val="none"/>
        <w:right w:val="none"/>
    </w:tcBorders>
''')
tcPr.append(borders)

p = cell.paragraphs[0]
p.paragraph_format.space_before = Pt(4)
p.paragraph_format.space_after = Pt(4)
r = p.add_run("Mẹo nhỏ cho học sinh:")
r.bold = True
r.font.name = "Arial"
r.font.size = Pt(10.5)
r.font.color.rgb = RGBColor(0x1E, 0x3A, 0x2B)

p2 = cell.add_paragraph()
p2.paragraph_format.space_before = Pt(2)
p2.paragraph_format.space_after = Pt(4)
r2 = p2.add_run("Đây là nội dung thử nghiệm hộp thông báo thân thiện.")
r2.font.name = "Arial"
r2.font.size = Pt(10)
r2.font.color.rgb = RGBColor(0x33, 0x33, 0x33)

doc.save("test_output.docx")
print("Saved test_output.docx successfully!")

def add_page_number(run):
    fldChar1 = parse_xml(r'<w:fldChar %s w:fldCharType="begin"/>' % nsdecls('w'))
    instrText = parse_xml(r'<w:instrText %s xml:space="preserve"> PAGE </w:instrText>' % nsdecls('w'))
    fldChar2 = parse_xml(r'<w:fldChar %s w:fldCharType="separate"/>' % nsdecls('w'))
    fldChar3 = parse_xml(r'<w:fldChar %s w:fldCharType="end"/>' % nsdecls('w'))
    r = run._r
    r.append(fldChar1)
    r.append(instrText)
    r.append(fldChar2)
    r.append(fldChar3)

footer = section.footer
p_foot = footer.paragraphs[0]
p_foot.text = "Trang "
run = p_foot.add_run()
add_page_number(run)

doc.save("test_output2.docx")
print("Saved test_output2.docx with page number successfully!")
