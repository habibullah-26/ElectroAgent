// ==========================================
// Order Functions
// ==========================================

const orders = require("../localData/orders.json");
const orderStatuses = require("../localData/orderStatuses.json");
const orderItems = require("../localData/orderItems.json");
const users = require("../localData/users.json");
const products = require("../localData/products.json");
const transactions = require("../localData/transactions.json");

function includeOrderRelations(order) {

  const orderStatus = orderStatuses.find(
    status => status.id === order.statusId
  ) ?? null;

  return {
    ...order,
    orderStatus,
    customer: users.find(user => user.id === order.customerId) ?? null,
    items: orderItems
      .filter(item => item.orderId === order.orderId)
      .map(item => ({
        ...item,
        product: products.find(product => product.id === item.productId) ?? null
      })),
    transaction: transactions.find(
      transaction => transaction.orderId === order.orderId
    ) ?? null
  };

}

function findOrderStatus(status) {

  const normalizedStatus = String(status ?? "").trim().toLowerCase();
  const statusId = Number(status);

  return orderStatuses.find(
    orderStatus =>
      orderStatus.id === statusId ||
      orderStatus.name.toLowerCase() === normalizedStatus
  );

}

function sortOrdersByDate(ordersToSort) {

  return [...ordersToSort].sort((firstOrder, secondOrder) => {
    const firstDateTime = `${firstOrder.orderDate}T${firstOrder.orderTime}`;
    const secondDateTime = `${secondOrder.orderDate}T${secondOrder.orderTime}`;

    return secondDateTime.localeCompare(firstDateTime);
  });

}


// ==========================================
// Get Order
// ==========================================

function getOrder(orderId) {

  console.log("Executing getOrder:", orderId);

  const order = orders.find(
    order => order.orderId === Number(orderId)
  );

  if (!order) {

    return {
      success: false,
      message: `Order ${orderId} was not found.`
    };

  }

  return {
    success: true,
    order: includeOrderRelations(order)
  };

}


// ==========================================
// Get Orders By Customer
// ==========================================

function getOrdersByCustomer(customerId) {

  console.log("Executing getOrdersByCustomer:", customerId);

  const matchingOrders = orders.filter(
    order => order.customerId === Number(customerId)
  );

  return {
    success: true,
    orders: sortOrdersByDate(matchingOrders).map(includeOrderRelations)
  };

}


// ==========================================
// Get Orders By Status
// ==========================================

function getOrdersByStatus(status) {

  console.log("Executing getOrdersByStatus:", status);

  const matchingStatus = findOrderStatus(status);
  const matchingOrders = matchingStatus
    ? orders.filter(order => order.statusId === matchingStatus.id)
    : [];

  return {
    success: true,
    orders: sortOrdersByDate(matchingOrders).map(includeOrderRelations)
  };

}


// ==========================================
// Get Customer Orders By Status
// ==========================================

function getCustomerOrdersByStatus(customerId, status) {

  console.log("Executing getCustomerOrdersByStatus:", customerId, status);

  const matchingStatus = findOrderStatus(status);
  const matchingOrders = matchingStatus
    ? orders.filter(
        order =>
          order.customerId === Number(customerId) &&
          order.statusId === matchingStatus.id
      )
    : [];

  return {
    success: true,
    orders: sortOrdersByDate(matchingOrders).map(includeOrderRelations)
  };

}


// ==========================================
// Get Recent Orders
// ==========================================

function getRecentOrders(limit = 5) {

  console.log("Executing getRecentOrders:", limit);

  const parsedLimit = Number(limit);
  const resultLimit = Number.isFinite(parsedLimit)
    ? Math.max(0, Math.floor(parsedLimit))
    : 5;
  const recentOrders = sortOrdersByDate(orders).slice(0, resultLimit);

  return {
    success: true,
    orders: recentOrders.map(includeOrderRelations)
  };

}


// ==========================================
// Search Orders
// ==========================================

function searchOrders(query) {

  console.log("Executing searchOrders:", query);

  const searchTerm = String(query ?? "").trim().toLowerCase();
  const matchingOrders = searchTerm
    ? orders.filter(order => {
        const orderStatus = orderStatuses.find(
          status => status.id === order.statusId
        );
        return [...Object.values(order), orderStatus?.name ?? ""].some(value =>
          String(value).toLowerCase().includes(searchTerm)
        );
      })
    : [];

  return {
    success: true,
    orders: sortOrdersByDate(matchingOrders).map(includeOrderRelations)
  };

}


// ==========================================
// Export
// ==========================================

module.exports = {
  getOrder,
  getOrdersByCustomer,
  getOrdersByStatus,
  getCustomerOrdersByStatus,
  getRecentOrders,
  searchOrders
};