# Simple Personal Finance Tracker

Aplikasi pencatatan keuangan pribadi berbasis **Google Sheets** dan **Google Apps Script**.

---

## Overview

```
Browser
      │
      ▼
Google Apps Script
      │
      ▼
Google Sheets
```

---

## Tech Stack

| Layer | Technology |
|--------|------------|
| Database | Google Sheets |
| Backend | Google Apps Script |
| Frontend | HTML Service + Vanilla JavaScript |
| Styling | CSS |
| Hosting | Google Apps Script Web App |

---

## Folder Structure

```
finance-tracker/
├── Code.gs
├── appsscript.json
├── .clasp.json
├── services/
│   ├── TransactionService.gs
│   ├── CategoryService.gs
│   ├── DashboardService.gs
│   └── ReportService.gs
├── utils/
│   ├── Spreadsheet.gs
│   ├── Validation.gs
│   └── Response.gs
└── views_index.html
```

---

## Components

### Frontend (HTML Service)

Pages

- Dashboard
- Transaction
- Report

Responsibilities

- Render UI
- Input Validation
- Call Backend

### Backend (Google Apps Script)

Responsibilities

- Read Spreadsheet
- Write Spreadsheet
- Aggregate Data
- Return JSON

### Database (Google Sheets)

Sheets

- Transactions
- Categories

---

## Data Flow

### Save Transaction

```
UI → Validation → google.script.run → TransactionService → Google Sheet → Success
```

### Dashboard

```
Dashboard → DashboardService → Read Transactions → Aggregate → Return JSON
```

### Report

```
Report Page → ReportService → Filter Data → Aggregate → Return JSON
```

---

## Backend Functions

| Service | Function |
|---------|----------|
| Dashboard | `getDashboard()` - Returns period-based summary (28th-27th cycle) |
| Category | `getCategories(type)` |
| Transaction | `saveTransaction(data)` |
| Report | `getPeriodReport()`, `getDailyReport(date)`, `getMonthlyReport(month, year)`, `getRangeReport(startDate, endDate)` |

---

## Period System

Dashboard dan Report menggunakan siklus periode gajian (28-27):

- **Periode**: 28 bulan sebelumnya → 27 bulan ini
- Contoh: Hari ini 6 Juli 2026 → Periode: **28 Jun - 27 Jul 2026**
- Contoh: Hari ini 28 Juli 2026 → Periode: **28 Jul - 27 Ags 2026**

Logika:
- Jika tanggal >= 28: periode = 28 bulan ini → 27 bulan depan
- Jika tanggal < 28: periode = 28 bulan lalu → 27 bulan ini

---

## Spreadsheet Structure

### Sheet: Transactions

| Column |
|---------|
| ID |
| Date |
| Type |
| Category |
| Description |
| Amount |
| CreatedAt |

Example:

| ID | Date | Type | Category | Description | Amount |
|----|------|------|----------|-------------|--------|
| 1 | 2026-07-06 | Income | Salary | Gaji Juli | 8500000 |
| 2 | 2026-07-06 | Expense | Food | Makan Siang | 35000 |

### Sheet: Categories

| Type | Category |
|------|----------|
| Income | Salary |
| Income | Bonus |
| Income | Gift |
| Expense | Food |
| Expense | Transport |
| Expense | Shopping |
| Expense | Internet |
| Expense | Entertainment |
| Expense | Bills |

---

## Validation Rules

- Semua field wajib diisi
- Nominal harus berupa angka > 0
- Jenis harus Income atau Expense
- Kategori harus tersedia

---

## UI Guidelines

- Mobile First, Responsive
- Material-like design
- Green primary color
- Rounded cards with light shadow
- Large buttons for mobile

---

## Principles

- Keep Simple
- No Framework
- No Authentication
- No Database selain Google Sheets
- Reusable Services
- Consistent JSON Responses
- Graceful Error Handling

---

## Coding Convention

| Type | Convention |
|------|------------|
| Function | `camelCase` |
| File | `PascalCase.gs` |
| HTML | Single file (`views_index.html`) |

---

## Out of Scope

- Edit/Hapus transaksi
- Upload foto struk
- Export PDF/Excel
- Grafik
- Budget bulanan
- Target tabungan
- Reminder
- Multi User
- Login
- Sinkronisasi rekening bank
