"""Build the Biashara Records Kit Excel workbook (M-Pesa & eTIMS Starter Kit).

Run:  python3 scripts/build_workbook.py
Output: product/Biashara-Records-Kit-Tracker.xlsx

The workbook works in Microsoft Excel and Google Sheets (File > Import).
"""
from pathlib import Path

from openpyxl import Workbook
from openpyxl.formatting.rule import FormulaRule
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

OUT = Path(__file__).resolve().parent.parent / "product" / "Biashara-Records-Kit-Tracker.xlsx"
ROWS = 1000  # data rows available on each log sheet

GREEN = "1B5E20"
LIGHT = "E8F5E9"
HEAD = PatternFill("solid", fgColor=GREEN)
INPUT = PatternFill("solid", fgColor="FFFDE7")
CALC = PatternFill("solid", fgColor="F1F8E9")
RED = PatternFill("solid", fgColor="FFCDD2")
AMBER = PatternFill("solid", fgColor="FFE0B2")
OKFILL = PatternFill("solid", fgColor="C8E6C9")
WHITE_BOLD = Font(bold=True, color="FFFFFF")
TITLE = Font(bold=True, size=16, color=GREEN)
THIN = Side(style="thin", color="BDBDBD")
BOX = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)
MONEY = '#,##0.00'

PAYMENT_METHODS = "M-Pesa Till,M-Pesa Paybill,M-Pesa Send Money,Pochi la Biashara,Cash,Bank,Card,Credit (pay later)"
EXPENSE_CATS = [
    "Stock / Purchases", "Rent", "Electricity & Water", "Transport & Fuel",
    "Airtime & Internet", "Wages & Casuals", "Packaging", "Repairs & Maintenance",
    "Licences & Permits", "Bank & M-Pesa Charges", "Marketing", "Owner Drawings",
    "Other",
]


def header(ws, row, titles, widths):
    for i, (t, w) in enumerate(zip(titles, widths), start=1):
        c = ws.cell(row=row, column=i, value=t)
        c.fill, c.font, c.border = HEAD, WHITE_BOLD, BOX
        c.alignment = Alignment(wrap_text=True, vertical="center", horizontal="center")
        ws.column_dimensions[get_column_letter(i)].width = w
    ws.row_dimensions[row].height = 32
    ws.freeze_panes = ws.cell(row=row + 1, column=1)


def title(ws, text, sub):
    ws["A1"] = text
    ws["A1"].font = TITLE
    ws["A2"] = sub
    ws["A2"].font = Font(italic=True, color="616161")


def style_range(ws, first, last, cols, fill=None, fmt=None):
    for col in cols:
        for r in range(first, last + 1):
            c = ws[f"{col}{r}"]
            if fill:
                c.fill = fill
            if fmt:
                c.number_format = fmt
            c.border = BOX


def add_list(ws, ref, formula1, prompt=None):
    dv = DataValidation(type="list", formula1=formula1, allow_blank=True)
    if prompt:
        dv.prompt, dv.showInputMessage = prompt, True
    ws.add_data_validation(dv)
    dv.add(ref)


wb = Workbook()

# ---------------------------------------------------------------- Start Here
ws = wb.active
ws.title = "Start Here"
title(ws, "Biashara Records Kit — M-Pesa & eTIMS Tracker",
      "Simple daily records for Kenyan small businesses. Yellow cells = you type. Green cells = calculated for you.")
ws.column_dimensions["A"].width = 4
ws.column_dimensions["B"].width = 110
steps = [
    ("STEP 1", "Open 'Settings' and type your business name, KRA PIN, phone and your tax rate (see the guide)."),
    ("STEP 2", "Every day: record each sale in 'Sales' and each payment you make in 'Expenses'. 10 minutes a day is enough."),
    ("STEP 3", "Always type the M-Pesa transaction code (e.g. SKL4ABC123). It is your proof and lets the sheet match payments."),
    ("STEP 4", "For every business expense, ask the supplier for an eTIMS invoice. The 'Expenses' sheet flags red any expense without one."),
    ("STEP 5", "Customers who pay later go in 'Debtors'. The sheet shows who owes you and who is overdue."),
    ("STEP 6", "Once a week: download your M-Pesa statement and paste it into 'M-Pesa Check'. Unmatched payments turn orange."),
    ("STEP 7", "End of month: open 'Monthly Summary'. It shows sales, costs, profit, eTIMS coverage and an estimated tax figure."),
    ("STEP 8", "Need a quick invoice or receipt for a customer? Fill in 'Invoice' and print or save as PDF."),
    ("", ""),
    ("TIP", "The first rows on Sales, Expenses and Debtors are EXAMPLES. Delete them before you start."),
    ("TIP", "Google Sheets: go to sheets.google.com > File > Import > Upload this file. Everything keeps working."),
    ("TIP", "Keep business and personal money separate: use a Till, Paybill or Pochi la Biashara for the business."),
    ("", ""),
    ("NOTE", "This tracker helps you keep records. It is not tax or legal advice and does not file anything with KRA. "
             "Tax rates and rules change: confirm current figures on kra.go.ke or with a tax professional."),
    ("NOTE", "Not affiliated with, or endorsed by, Kenya Revenue Authority or Safaricom. M-Pesa is a trademark of Safaricom PLC."),
]
for i, (k, v) in enumerate(steps, start=4):
    ws.cell(row=i, column=1, value=k).font = Font(bold=True, color=GREEN)
    c = ws.cell(row=i, column=2, value=v)
    c.alignment = Alignment(wrap_text=True, vertical="top")
    ws.row_dimensions[i].height = 30

# ---------------------------------------------------------------- Settings
st = wb.create_sheet("Settings")
title(st, "Settings", "Fill these once. They appear on your invoice and summary.")
st.column_dimensions["A"].width = 38
st.column_dimensions["B"].width = 40
st.column_dimensions["C"].width = 70
settings = [
    ("Business name", "Mama Wanjiru Shop", ""),
    ("Owner name", "", ""),
    ("KRA PIN", "", "Find it on your KRA PIN certificate or iTax."),
    ("Phone", "", ""),
    ("Location / address", "", ""),
    ("M-Pesa Till / Paybill / Pochi number", "", "The number customers pay to."),
    ("Tax regime", "Turnover Tax (TOT)", "Choose from the list. See the guide, section 6."),
    ("Estimated tax rate on sales (%)", 1.5, "Example only: TOT has been 1.5% of gross sales. CONFIRM the current rate on kra.go.ke."),
    ("Currency", "KSh", ""),
]
for i, (k, v, n) in enumerate(settings, start=4):
    st.cell(row=i, column=1, value=k).font = Font(bold=True)
    c = st.cell(row=i, column=2, value=v)
    c.fill, c.border = INPUT, BOX
    st.cell(row=i, column=3, value=n).font = Font(italic=True, color="616161")
add_list(st, "B10", '"Turnover Tax (TOT),Income Tax (resident individual),VAT registered,Not sure yet"')
st["B11"].number_format = "0.00"
# Category list used by the Expenses dropdown
st["E3"] = "Expense categories (edit if you like)"
st["E3"].font = Font(bold=True)
st.column_dimensions["E"].width = 30
for i, cat in enumerate(EXPENSE_CATS, start=4):
    c = st.cell(row=i, column=5, value=cat)
    c.fill, c.border = INPUT, BOX
CAT_REF = f"Settings!$E$4:$E${3 + len(EXPENSE_CATS) + 5}"  # 5 spare rows for user categories

# ---------------------------------------------------------------- Sales
s = wb.create_sheet("Sales")
title(s, "Sales Log", "One row per sale. Type the M-Pesa code for every M-Pesa payment.")
cols = ["Date", "Receipt / Invoice No.", "Customer name", "Customer phone", "Item / service", "Qty",
        "Unit price", "Total (auto)", "Payment method", "M-Pesa code", "eTIMS invoice issued?",
        "eTIMS invoice no.", "Month (auto)", "Notes"]
header(s, 4, cols, [12, 14, 22, 15, 26, 7, 12, 14, 18, 15, 12, 18, 11, 24])
first, last = 5, 4 + ROWS
for r in range(first, last + 1):
    s[f"H{r}"] = f'=IF(AND(F{r}="",G{r}=""),"",N(F{r})*N(G{r}))'
    s[f"M{r}"] = f'=IF(A{r}="","",TEXT(A{r},"yyyy-mm"))'
style_range(s, first, last, "ABCDEFGIJKLN", INPUT)
style_range(s, first, last, "HM", CALC)
style_range(s, first, last, "A", fmt="dd/mm/yyyy")
style_range(s, first, last, "GH", fmt=MONEY)
add_list(s, f"I{first}:I{last}", f'"{PAYMENT_METHODS}"')
add_list(s, f"K{first}:K{last}", '"Yes,No,Not needed"')
s.conditional_formatting.add(
    f"J{first}:J{last}",
    FormulaRule(formula=[f'AND(LEFT($I{first},6)="M-Pesa",$J{first}="")'], fill=AMBER))
samples = [
    ("2026-11-03", "S-001", "John K.", "0712 000 000", "Unga 2kg", 3, 210, "M-Pesa Till", "SKL4ABC123", "Yes", "Example"),
    ("2026-11-03", "S-002", "Walk-in", "", "Sugar 1kg", 2, 180, "Cash", "", "Not needed", "Example"),
    ("2026-11-04", "S-003", "Hotel Baraka", "0722 000 000", "Cooking oil 5L", 4, 1150, "Credit (pay later)", "", "Yes", "Example — also in Debtors"),
]
from datetime import date
for i, row in enumerate(samples, start=first):
    d, rec, cust, ph, item, q, p, pm, code, et, note = row
    s[f"A{i}"] = date.fromisoformat(d)
    s[f"B{i}"], s[f"C{i}"], s[f"D{i}"], s[f"E{i}"] = rec, cust, ph, item
    s[f"F{i}"], s[f"G{i}"], s[f"I{i}"], s[f"J{i}"], s[f"K{i}"], s[f"N{i}"] = q, p, pm, code, et, note

# ---------------------------------------------------------------- Expenses
e = wb.create_sheet("Expenses")
title(e, "Expenses Log", "One row per payment. Red row = no eTIMS invoice: KRA may not allow this cost when checking your income tax.")
cols = ["Date", "Supplier name", "Supplier KRA PIN", "Category", "Description", "Amount",
        "Payment method", "M-Pesa code", "eTIMS invoice received?", "eTIMS invoice no.",
        "Status (auto)", "Month (auto)", "Notes"]
header(e, 4, cols, [12, 22, 15, 20, 26, 13, 18, 15, 13, 18, 22, 11, 24])
for r in range(first, last + 1):
    e[f"K{r}"] = (f'=IF(F{r}="","",IF(D{r}="Owner Drawings","Not a business cost",'
                 f'IF(I{r}="Yes","OK — eTIMS invoice",IF(I{r}="Not needed","OK — not needed","CHECK: get eTIMS invoice"))))')
    e[f"L{r}"] = f'=IF(A{r}="","",TEXT(A{r},"yyyy-mm"))'
style_range(e, first, last, "ABCDEGHIJM", INPUT)
style_range(e, first, last, "KL", CALC)
style_range(e, first, last, "A", fmt="dd/mm/yyyy")
style_range(e, first, last, "F", fmt=MONEY)
add_list(e, f"D{first}:D{last}", f"={CAT_REF}")
add_list(e, f"G{first}:G{last}", f'"{PAYMENT_METHODS}"')
add_list(e, f"I{first}:I{last}", '"Yes,No,Not needed"',
         "Ask: 'Please send me an eTIMS invoice with my KRA PIN.'")
e.conditional_formatting.add(f"A{first}:M{last}",
                             FormulaRule(formula=[f'LEFT($K{first},5)="CHECK"'], fill=RED))
e.conditional_formatting.add(f"K{first}:K{last}",
                             FormulaRule(formula=[f'LEFT($K{first},2)="OK"'], fill=OKFILL))
samples = [
    ("2026-11-02", "Jumla Wholesalers", "P051234567X", "Stock / Purchases", "Unga & sugar restock", 12500, "M-Pesa Paybill", "SKJ9XYZ789", "Yes", "INV-88120"),
    ("2026-11-02", "Boda rider", "", "Transport & Fuel", "Delivery of stock", 300, "M-Pesa Send Money", "SKJ1QWE456", "No", ""),
    ("2026-11-05", "Landlord", "", "Rent", "November rent", 8000, "M-Pesa Send Money", "SKN2RTY321", "No", ""),
]
for i, row in enumerate(samples, start=first):
    d, sup, pin, cat, desc, amt, pm, code, et, inv = row
    e[f"A{i}"] = date.fromisoformat(d)
    for col, val in zip("BCDEFGHIJ", (sup, pin, cat, desc, amt, pm, code, et, inv)):
        e[f"{col}{i}"] = val
    e[f"M{i}"] = "Example"

# ---------------------------------------------------------------- Debtors
dbt = wb.create_sheet("Debtors")
title(dbt, "Debtors — who owes you", "Record credit sales and every part-payment. Overdue balances turn red.")
cols = ["Date of sale", "Customer name", "Phone", "What they took", "Amount owed",
        "Amount paid so far", "Balance (auto)", "Due date", "Status (auto)", "Last reminder sent", "Notes"]
header(dbt, 4, cols, [12, 22, 15, 26, 14, 16, 14, 12, 16, 16, 24])
for r in range(first, last + 1):
    dbt[f"G{r}"] = f'=IF(E{r}="","",N(E{r})-N(F{r}))'
    dbt[f"I{r}"] = (f'=IF(E{r}="","",IF(G{r}<=0,"Paid",IF(AND(H{r}<>"",H{r}<TODAY()),"OVERDUE","Not yet due")))')
style_range(dbt, first, last, "ABCDEFHJK", INPUT)
style_range(dbt, first, last, "GI", CALC)
style_range(dbt, first, last, "AHJ", fmt="dd/mm/yyyy")
style_range(dbt, first, last, "EFG", fmt=MONEY)
dbt.conditional_formatting.add(f"A{first}:K{last}",
                               FormulaRule(formula=[f'$I{first}="OVERDUE"'], fill=RED))
dbt.conditional_formatting.add(f"I{first}:I{last}",
                               FormulaRule(formula=[f'$I{first}="Paid"'], fill=OKFILL))
dbt["A5"] = date(2026, 11, 4)
dbt["B5"], dbt["C5"], dbt["D5"] = "Hotel Baraka", "0722 000 000", "Cooking oil 5L x4"
dbt["E5"], dbt["F5"], dbt["H5"], dbt["K5"] = 4600, 2000, date(2026, 11, 18), "Example"

# ---------------------------------------------------------------- M-Pesa Check
m = wb.create_sheet("M-Pesa Check")
title(m, "M-Pesa Statement Check",
      "Paste rows from your M-Pesa statement here (Receipt No., Completion Time, Details, Paid In, Withdrawn). The sheet checks each code against Sales and Expenses.")
cols = ["Receipt No. (M-Pesa code)", "Completion time", "Details", "Paid in", "Withdrawn",
        "Found in my records? (auto)"]
header(m, 4, cols, [22, 20, 44, 13, 13, 30])
for r in range(first, last + 1):
    m[f"F{r}"] = (f'=IF(A{r}="","",IF(COUNTIF(Sales!$J$5:$J${last},A{r})+COUNTIF(Expenses!$H$5:$H${last},A{r})>0,'
                 f'"Yes — recorded","MISSING — add to Sales or Expenses"))')
style_range(m, first, last, "ABCDE", INPUT)
style_range(m, first, last, "F", CALC)
style_range(m, first, last, "DE", fmt=MONEY)
m.conditional_formatting.add(f"A{first}:F{last}",
                             FormulaRule(formula=[f'LEFT($F{first},7)="MISSING"'], fill=AMBER))
m["A5"], m["B5"], m["C5"], m["D5"] = "SKL4ABC123", "03/11/2026 10:15", "Example: payment from customer", 630
m["A6"], m["B6"], m["C6"], m["D6"] = "SKL7NOT000", "03/11/2026 14:02", "Example: payment never recorded", 450

# ---------------------------------------------------------------- Monthly Summary
ms = wb.create_sheet("Monthly Summary")
title(ms, "Monthly Summary", "Type the months you want to see in column A (format yyyy-mm, e.g. 2026-11). Everything else is automatic.")
cols = ["Month (yyyy-mm)", "Total sales", "Sales via M-Pesa", "Sales in cash", "Credit sales",
        "Total expenses", "Expenses WITH eTIMS invoice", "Expenses at RISK (no eTIMS)",
        "% of expenses covered by eTIMS", "Profit (sales − expenses)", "Estimated tax on sales*"]
header(ms, 4, cols, [14, 14, 14, 14, 14, 14, 16, 16, 14, 16, 16])
S, E = "Sales", "Expenses"
for i in range(12):
    r = 5 + i
    y, mth = 2026 + (10 + i) // 12, (10 + i) % 12 + 1  # Nov 2026 onward
    ms[f"A{r}"] = f"{y}-{mth:02d}"
    ms[f"B{r}"] = f'=SUMIF({S}!$M$5:$M${last},$A{r},{S}!$H$5:$H${last})'
    ms[f"C{r}"] = (f'=SUMIFS({S}!$H$5:$H${last},{S}!$M$5:$M${last},$A{r},{S}!$I$5:$I${last},"M-Pesa*")'
                   f'+SUMIFS({S}!$H$5:$H${last},{S}!$M$5:$M${last},$A{r},{S}!$I$5:$I${last},"Pochi*")')
    ms[f"D{r}"] = f'=SUMIFS({S}!$H$5:$H${last},{S}!$M$5:$M${last},$A{r},{S}!$I$5:$I${last},"Cash")'
    ms[f"E{r}"] = f'=SUMIFS({S}!$H$5:$H${last},{S}!$M$5:$M${last},$A{r},{S}!$I$5:$I${last},"Credit*")'
    ms[f"F{r}"] = (f'=SUMIF({E}!$L$5:$L${last},$A{r},{E}!$F$5:$F${last})'
                   f'-SUMIFS({E}!$F$5:$F${last},{E}!$L$5:$L${last},$A{r},{E}!$D$5:$D${last},"Owner Drawings")')
    ms[f"G{r}"] = (f'=SUMIFS({E}!$F$5:$F${last},{E}!$L$5:$L${last},$A{r},{E}!$K$5:$K${last},"OK*")'
                   f'-SUMIFS({E}!$F$5:$F${last},{E}!$L$5:$L${last},$A{r},{E}!$D$5:$D${last},"Owner Drawings",{E}!$K$5:$K${last},"OK*")')
    ms[f"H{r}"] = f'=SUMIFS({E}!$F$5:$F${last},{E}!$L$5:$L${last},$A{r},{E}!$K$5:$K${last},"CHECK*")'
    ms[f"I{r}"] = f'=IF(F{r}=0,"",G{r}/F{r})'
    ms[f"J{r}"] = f'=B{r}-F{r}'
    ms[f"K{r}"] = f'=IF(Settings!$B$10="Turnover Tax (TOT)",B{r}*Settings!$B$11/100,"See guide")'
style_range(ms, 5, 16, "A", INPUT)
style_range(ms, 5, 16, "BCDEFGHJK", CALC, MONEY)
style_range(ms, 5, 16, "I", CALC, "0%")
ms.conditional_formatting.add("H5:H16", FormulaRule(formula=["H5>0"], fill=RED))
ms["A18"] = ("* Estimate only, using the rate in Settings and only when Tax regime = Turnover Tax. "
             "It is NOT a tax assessment. File and pay on iTax / eCitizen; confirm current rates and due dates with KRA.")
ms["A18"].font = Font(italic=True, color="B71C1C")
ms["A19"] = "Owner Drawings (money you take for yourself) are excluded from expenses and profit."
ms["A19"].font = Font(italic=True, color="616161")

# ---------------------------------------------------------------- Invoice
inv = wb.create_sheet("Invoice")
inv.column_dimensions["A"].width = 6
inv.column_dimensions["B"].width = 40
for col, w in zip("CDE", (10, 14, 16)):
    inv.column_dimensions[col].width = w
inv["A1"] = "=Settings!B4"
inv["A1"].font = Font(bold=True, size=18, color=GREEN)
inv["A2"] = '="KRA PIN: "&Settings!B6&"   |   Tel: "&Settings!B7'
inv["A3"] = '="Pay via M-Pesa: "&Settings!B9&"   |   "&Settings!B8'
inv["D1"] = "INVOICE / RECEIPT"
inv["D1"].font = Font(bold=True, size=14)
fields = [("Invoice no.", "D3"), ("Date", "D4"), ("Customer", "D5"), ("Customer phone", "D6")]
for i, (lab, _) in enumerate(fields, start=3):
    inv[f"C{i}"] = lab
    inv[f"C{i}"].font = Font(bold=True)
    inv[f"D{i}"].fill, inv[f"D{i}"].border = INPUT, BOX
inv.merge_cells("D5:E5")
inv.merge_cells("D6:E6")
inv["D4"].number_format = "dd/mm/yyyy"
for i, t in enumerate(["#", "Item / service", "Qty", "Unit price", "Amount"], start=1):
    c = inv.cell(row=8, column=i, value=t)
    c.fill, c.font, c.border = HEAD, WHITE_BOLD, BOX
for r in range(9, 21):
    inv[f"A{r}"] = r - 8
    inv[f"E{r}"] = f'=IF(AND(C{r}="",D{r}=""),"",N(C{r})*N(D{r}))'
    for col in "BCD":
        inv[f"{col}{r}"].fill = INPUT
    for col in "ABCDE":
        inv[f"{col}{r}"].border = BOX
    inv[f"D{r}"].number_format = inv[f"E{r}"].number_format = MONEY
inv["D21"], inv["E21"] = "TOTAL", "=SUM(E9:E20)"
inv["D21"].font = inv["E21"].font = Font(bold=True)
inv["E21"].number_format = MONEY
inv["B23"] = "M-Pesa code (if paid):"
inv["C23"].fill = INPUT
inv["B25"] = ("This is a business invoice/receipt from your own records. If your customer needs an official "
              "eTIMS invoice, generate it on eTIMS (eCitizen, *222# or the eTIMS app) and write its number here:")
inv["B25"].alignment = Alignment(wrap_text=True)
inv.row_dimensions[25].height = 45
inv["B26"] = "eTIMS invoice no.:"
inv["C26"].fill = INPUT
inv["B28"] = "Asante kwa biashara yako! / Thank you for your business!"
inv["B28"].font = Font(italic=True, color=GREEN)
inv.print_area = "A1:E28"

for sheet in wb.worksheets:
    sheet.sheet_view.showGridLines = sheet.title in ("Sales", "Expenses", "Debtors", "M-Pesa Check")
    sheet.page_setup.orientation = "portrait" if sheet.title == "Invoice" else "landscape"
    sheet.page_setup.fitToWidth = 1
wb["Settings"].sheet_properties.tabColor = "FBC02D"
for name in ("Sales", "Expenses", "Debtors", "M-Pesa Check"):
    wb[name].sheet_properties.tabColor = "43A047"
wb["Monthly Summary"].sheet_properties.tabColor = "1E88E5"

OUT.parent.mkdir(parents=True, exist_ok=True)
wb.save(OUT)
print("saved", OUT)
