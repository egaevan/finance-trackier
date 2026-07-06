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
    const now = new Date();
    const period = { year: now.getFullYear(), month: now.getMonth() + 1 };

    const monthTransactions = transactions.filter(function (t) {
      return isInMonth_(t.date, period.year, period.month);
    });
    const monthTotals = sumByType_(monthTransactions);
    const allTotals = sumByType_(transactions);

    const sorted = sortTransactionsByDateDesc_(transactions);
    const recent = sorted.slice(0, 5);

    return successResponse({
      balance: allTotals.net,
      monthlyIncome: monthTotals.income,
      monthlyExpense: monthTotals.expense,
      recentTransactions: recent
    });
  } catch (e) {
    return errorResponse(e.message);
  }
}

function resolveMonthPeriod_(year, month) {
  const now = new Date();
  return {
    year: year ? Number(year) : now.getFullYear(),
    month: month ? Number(month) : now.getMonth() + 1
  };
}
