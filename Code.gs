/**
 * Simple Personal Finance Tracker
 * Phase 1 - Project Setup
 * Phase 3 - Frontend
 */

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
  const template = HtmlService.createTemplateFromFile('views/index');
  return template.evaluate()
    .setTitle('Finance Tracker')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  createSheet_(ss, SHEET_TRANSACTIONS, TRANSACTIONS_HEADERS);
  const categoriesSheet = createSheet_(ss, SHEET_CATEGORIES, CATEGORIES_HEADERS);

  seedCategories_(categoriesSheet);

  ss.toast('Finance Tracker setup complete', 'Setup', 5);
  return 'Setup complete';
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
