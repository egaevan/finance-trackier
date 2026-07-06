/**
 * Report Service
 * Generates filtered transaction reports (daily, monthly, date range).
 */

function getDailyReport(date) {
  try {
    if (!date) {
      return errorResponse('Date is required');
    }
    const transactions = readTransactions().filter(function (t) {
      return isSameDay_(t.date, date);
    });
    return successResponse(buildReport_(transactions));
  } catch (e) {
    return errorResponse(e.message);
  }
}

function getMonthlyReport(month, year) {
  try {
    if (!month || !year) {
      return errorResponse('Month and year are required');
    }
    const transactions = readTransactions().filter(function (t) {
      return isInMonth_(t.date, year, month);
    });
    return successResponse(buildReport_(transactions));
  } catch (e) {
    return errorResponse(e.message);
  }
}

function getRangeReport(startDate, endDate) {
  try {
    if (!startDate || !endDate) {
      return errorResponse('Start date and end date are required');
    }
    const transactions = readTransactions().filter(function (t) {
      return isInDateRange_(t.date, startDate, endDate);
    });
    return successResponse(buildReport_(transactions));
  } catch (e) {
    return errorResponse(e.message);
  }
}

function getPeriodReport() {
  try {
    const period = getCurrentPeriod_();
    const transactions = readTransactions().filter(function (t) {
      return isInDateRange_(t.date, period.start, period.end);
    });
    return successResponse(buildReport_(transactions, period.start, period.end));
  } catch (e) {
    return errorResponse(e.message);
  }
}

function buildReport_(transactions, periodStart, periodEnd) {
  const totals = sumByType_(transactions);
  const result = {
    income: totals.income,
    expense: totals.expense,
    balance: totals.net,
    transactions: transactions
  };
  if (periodStart) result.periodStart = periodStart;
  if (periodEnd) result.periodEnd = periodEnd;
  return result;
}
