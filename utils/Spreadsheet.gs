/**
 * Spreadsheet Utility
 * Handles all read/write operations against Google Sheets.
 */

const TRANSACTION_FIELDS = ['id', 'date', 'type', 'category', 'description', 'amount', 'createdAt'];
const CATEGORY_FIELDS = ['type', 'category'];

function getSpreadsheet_() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty('SPREADSHEET_ID');
  if (id) {
    try {
      return SpreadsheetApp.openById(id);
    } catch (e) {
      props.deleteProperty('SPREADSHEET_ID');
    }
  }
  const ss = SpreadsheetApp.create('Finance Tracker');
  props.setProperty('SPREADSHEET_ID', ss.getId());
  createSheet_(ss, SHEET_TRANSACTIONS, TRANSACTIONS_HEADERS);
  const categoriesSheet = createSheet_(ss, SHEET_CATEGORIES, CATEGORIES_HEADERS);
  seedCategories_(categoriesSheet);
  Logger.log('Auto-created spreadsheet: ' + ss.getUrl());
  return ss;
}

function setSpreadsheetId(id) {
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', id);
}

function getSheet_(name) {
  const ss = getSpreadsheet_();
  const sheet = ss.getSheetByName(name);
  if (!sheet) {
    throw new Error('Sheet not found: ' + name);
  }
  return sheet;
}

function getRowsAsObjects_(sheet, fields) {
  if (!sheet) return [];
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  const values = sheet.getRange(2, 1, lastRow - 1, fields.length).getValues();
  return values.map(function (row) {
    const obj = {};
    for (let i = 0; i < fields.length; i++) {
      obj[fields[i]] = row[i];
    }
    return obj;
  });
}

function getTransactionsSheet() {
  return getSheet_(SHEET_TRANSACTIONS);
}

function getCategoriesSheet() {
  return getSheet_(SHEET_CATEGORIES);
}

function readTransactions() {
  return getRowsAsObjects_(getTransactionsSheet(), TRANSACTION_FIELDS);
}

function readCategories() {
  return getRowsAsObjects_(getCategoriesSheet(), CATEGORY_FIELDS);
}

function appendTransactionRow(values) {
  getTransactionsSheet().appendRow(values);
}

function getNextTransactionId() {
  const sheet = getTransactionsSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 1;
  const lastId = sheet.getRange(lastRow, 1).getValue();
  return (lastId || 0) + 1;
}

function toDateString(value) {
  if (!value) return '';
  if (value instanceof Date) {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, '0');
    const d = String(value.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + d;
  }
  return String(value);
}

function toTimestamp(value) {
  if (value instanceof Date) return value.toISOString();
  if (!value) return '';
  return String(value);
}

/**
 * Aggregation helpers shared by Dashboard and Report services.
 */

function sumByType_(transactions) {
  let income = 0;
  let expense = 0;
  for (let i = 0; i < transactions.length; i++) {
    const t = transactions[i];
    const amount = Number(t.amount) || 0;
    if (t.type === 'Income') {
      income += amount;
    } else if (t.type === 'Expense') {
      expense += amount;
    }
  }
  return { income: income, expense: expense, net: income - expense };
}

function parseDate_(value) {
  if (value instanceof Date) return value;
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
}

function isInMonth_(dateValue, year, month) {
  const d = parseDate_(dateValue);
  if (!d) return false;
  return d.getFullYear() === Number(year) && (d.getMonth() + 1) === Number(month);
}

function isInDateRange_(dateValue, startDate, endDate) {
  const d = parseDate_(dateValue);
  if (!d) return false;
  const start = parseDate_(startDate);
  const end = parseDate_(endDate);
  if (start && d < start) return false;
  if (end && d > end) return false;
  return true;
}

function isSameDay_(dateValue, dayValue) {
  const d = parseDate_(dateValue);
  const day = parseDate_(dayValue);
  if (!d || !day) return false;
  return d.getFullYear() === day.getFullYear()
    && d.getMonth() === day.getMonth()
    && d.getDate() === day.getDate();
}
