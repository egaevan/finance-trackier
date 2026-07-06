/**
 * Simple Personal Finance Tracker
 * Phase 1 - Project Setup
 * Phase 3 - Frontend
 */

const SPREADSHEET_ID = '1m9PMkSD2AOre6GCP1CzlhM_JuqWP3CcTY1wWBTbfD1I';
const SHEET_TRANSACTIONS = 'Transactions';
const SHEET_CATEGORIES = 'Categories';

const TRANSACTIONS_HEADERS = ['ID', 'Date', 'Type', 'Category', 'Description', 'Amount', 'CreatedAt'];
const CATEGORIES_HEADERS = ['Type', 'Category'];

const DEFAULT_CATEGORIES = [
  ['Income', 'Salary'],
  ['Income', 'Bonus'],
  ['Income', 'Gift'],
  ['Expense', 'Food'],
  ['Expense', 'Transport'],
  ['Expense', 'Shopping'],
  ['Expense', 'Internet'],
  ['Expense', 'Entertainment'],
  ['Expense', 'Bills']
];

function doGet() {
  return HtmlService.createHtmlOutputFromFile('views_index')
    .setTitle('Finance Tracker')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function debug() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheets = ss.getSheets().map(function (s) { return s.getName(); });
    return successResponse({ spreadsheetUrl: ss.getUrl(), sheets: sheets });
  } catch (e) {
    return errorResponse(e.message);
  }
}

function setup() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  createSheet_(ss, SHEET_TRANSACTIONS, TRANSACTIONS_HEADERS);
  const categoriesSheet = createSheet_(ss, SHEET_CATEGORIES, CATEGORIES_HEADERS);

  seedCategories_(categoriesSheet);

  const url = ss.getUrl();
  Logger.log('Spreadsheet URL: ' + url);
  return 'Setup complete. Spreadsheet: ' + url;
}

function createSheet_(ss, sheetName, headers) {
  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
  sheet.setFrozenRows(1);
  return sheet;
}

function seedCategories_(sheet) {
  if (sheet.getLastRow() > 1) {
    return;
  }
  sheet.getRange(2, 1, DEFAULT_CATEGORIES.length, DEFAULT_CATEGORIES[0].length).setValues(DEFAULT_CATEGORIES);
}
