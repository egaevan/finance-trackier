/**
 * Dashboard Service
 * Provides aggregated financial summary for the dashboard.
 */

function getBalance() {
  try {
    const transactions = readTransactions();
    const balance = sumByType_(transactions);
    return successResponse({ balance: balance.net });
  } catch (e) {
    return errorResponse(e.message);
  }
}

function getMonthlyIncome(year, month) {
  try {
    const period = resolveMonthPeriod_(year, month);
    const transactions = readTransactions().filter(function (t) {
      return isInMonth_(t.date, period.year, period.month);
    });
    const totals = sumByType_(transactions);
    return successResponse({ income: totals.income });
  } catch (e) {
    return errorResponse(e.message);
  }
}

function getMonthlyExpense(year, month) {
  try {
    const period = resolveMonthPeriod_(year, month);
    const transactions = readTransactions().filter(function (t) {
      return isInMonth_(t.date, period.year, period.month);
    });
    const totals = sumByType_(transactions);
    return successResponse({ expense: totals.expense });
  } catch (e) {
    return errorResponse(e.message);
  }
}

function getDashboard() {
  try {
    const transactions = readTransactions();
    const period = getCurrentPeriod_();

    const periodTransactions = transactions.filter(function (t) {
      return isInDateRange_(t.date, period.start, period.end);
    });
    const periodTotals = sumByType_(periodTransactions);
    const allTotals = sumByType_(transactions);

    const sorted = sortTransactionsByDateDesc_(transactions);
    const recent = sorted.slice(0, 5);

    return successResponse({
      balance: allTotals.net,
      periodIncome: periodTotals.income,
      periodExpense: periodTotals.expense,
      periodStart: period.start,
      periodEnd: period.end,
      recentTransactions: recent
    });
  } catch (e) {
    return errorResponse(e.message);
  }
}

function getCurrentPeriod_() {
  const now = new Date();
  const day = now.getDate();
  let start, end;

  if (day >= 28) {
    start = new Date(now.getFullYear(), now.getMonth(), 28);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 27);
  } else {
    start = new Date(now.getFullYear(), now.getMonth() - 1, 28);
    end = new Date(now.getFullYear(), now.getMonth(), 27);
  }

  return {
    start: toDateString(start),
    end: toDateString(end)
  };
}

function resolveMonthPeriod_(year, month) {
  const now = new Date();
  return {
    year: year ? Number(year) : now.getFullYear(),
    month: month ? Number(month) : now.getMonth() + 1
  };
}
