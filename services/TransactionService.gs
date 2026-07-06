/**
 * Transaction Service
 * Handles saving and retrieving transactions.
 */

function saveTransaction(data) {
  try {
    const error = validateTransaction(data);
    if (error) {
      return errorResponse(error);
    }

    if (!categoryExists_(data.type, data.category)) {
      return errorResponse('Category not found: ' + data.category);
    }

    const id = getNextTransactionId();
    const row = [
      id,
      toDateString(data.date),
      data.type,
      data.category,
      data.description || '',
      Number(data.amount),
      toTimestamp(new Date())
    ];
    appendTransactionRow(row);

    return successResponse({ id: id });
  } catch (e) {
    return errorResponse(e.message);
  }
}

function getRecentTransactions(limit) {
  try {
    const transactions = readTransactions();
    const sorted = sortTransactionsByDateDesc_(transactions);
    const n = limit || 5;
    return successResponse(sorted.slice(0, n));
  } catch (e) {
    return errorResponse(e.message);
  }
}

function getAllTransactions() {
  try {
    const transactions = readTransactions();
    const sorted = sortTransactionsByDateDesc_(transactions);
    return successResponse(sorted);
  } catch (e) {
    return errorResponse(e.message);
  }
}

function sortTransactionsByDateDesc_(transactions) {
  return transactions.slice().sort(function (a, b) {
    return String(b.date).localeCompare(String(a.date));
  });
}
