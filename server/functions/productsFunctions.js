// ==========================================
// Products Functions
// ==========================================

const products = require("../localData/products.json");


// ==========================================
// Get Product
// ==========================================

function getProduct(productId) {

  console.log("Executing getProduct:", productId);

  const product = products.find(
    product => product.id === Number(productId)
  );

  if (!product) {

    return {
      success: false,
      message: `Product ${productId} was not found.`
    };

  }

  return {
    success: true,
    product: product
  };

}


// ==========================================
// Search Products
// ==========================================

function searchProducts(query) {

  console.log("Executing searchProducts:", query);

  const searchTerm = String(query ?? "").trim().toLowerCase();
  const matchingProducts = searchTerm
    ? products.filter(product =>
        Object.values(product).some(value =>
          String(value).toLowerCase().includes(searchTerm)
        )
      )
    : [];

  return {
    success: true,
    products: matchingProducts
  };

}


// ==========================================
// Get Products By Category
// ==========================================

function getProductsByCategory(category) {

  console.log("Executing getProductsByCategory:", category);

  const normalizedCategory = String(category ?? "").trim().toLowerCase();
  const matchingProducts = products.filter(
    product => product.category.toLowerCase() === normalizedCategory
  );

  return {
    success: true,
    products: matchingProducts
  };

}


// ==========================================
// Get Products By Price
// ==========================================

function getProductsByPrice(minPrice, maxPrice) {

  console.log("Executing getProductsByPrice:", minPrice, maxPrice);

  const minimum = minPrice === undefined ? 0 : Number(minPrice);
  const maximum = maxPrice === undefined
    ? Number.POSITIVE_INFINITY
    : Number(maxPrice);

  if (
    !Number.isFinite(minimum) ||
    (!Number.isFinite(maximum) && maximum !== Number.POSITIVE_INFINITY) ||
    minimum < 0 ||
    maximum < minimum
  ) {
    return {
      success: false,
      message: "Provide a valid price range with a non-negative minimum."
    };
  }

  const matchingProducts = products.filter(
    product => product.price >= minimum && product.price <= maximum
  );

  return {
    success: true,
    products: matchingProducts
  };

}


// ==========================================
// Get Product List
// ==========================================

function getProductList() {

  console.log("Executing getProductList");

  return {
    success: true,
    products: products
  };

}


// ==========================================
// Get Product By Name
// ==========================================

function getProductByName(name) {

  console.log("Executing getProductByName:", name);

  const normalizedName = String(name ?? "").trim().toLowerCase();
  const product = products.find(
    product => product.name.toLowerCase() === normalizedName
  );

  if (!product) {
    return {
      success: false,
      message: `Product ${name} was not found.`
    };
  }

  return {
    success: true,
    product: product
  };

}


// ==========================================
// Export
// ==========================================

module.exports = {
  getProduct,
  searchProducts,
  getProductsByCategory,
  getProductsByPrice,
  getProductList,
  getProductByName
};