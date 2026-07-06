/**
 * Validation Utility
 * Validates transaction input per business rules.
 */

const VALID_TYPES = ['Income', 'Expense'];
const REQUIRED_TRANSACTION_FIELDS = ['date', 'type', 'category', 'amount'];

function validateTransaction(data) {
  if (!data || typeof data !== 'object') {
    return 'Input data is required';
  }

  for (let i = 0; i < REQUIRED_TRANSACTION_FIELDS.length; i++) {
    const field = REQUIRED_TRANSACTION_FIELDS[i];
    if (isEmpty_(data[field])) {
      return field + ' is required';
    }
  }

  if (VALID_TYPES.indexOf(data.type) === -1) {
    return 'Type must be Income or Expense';
  }

  const amount = Number(data.amount);
  if (isNaN(amount) || amount <= 0) {
    return 'Amount must be a number greater than 0';
  }

  return null;
}

function isEmpty_(value) {
  if (value === null || value === undefined) {
    return true;
  }
  if (typeof value === 'string' && value.trim() === '') {
    return true;
  }
  return false;
}
