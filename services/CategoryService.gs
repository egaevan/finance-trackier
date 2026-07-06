/**
 * Category Service
 * Provides category data for transactions.
 */

function getCategories(type) {
  try {
    const categories = readCategories();
    const filtered = type
      ? categories.filter(function (c) { return c.type === type; })
      : categories;
    return successResponse(filtered);
  } catch (e) {
    return errorResponse(e.message);
  }
}

function categoryExists_(type, category) {
  const categories = readCategories();
  return categories.some(function (c) {
    return c.type === type && c.category === category;
  });
}
