// Frontend prompt suggestions for the read-only AI agent.
// The frontend can render `prompt` values directly in suggestion buttons.

const promptSuggestions = [
  {
    category: "Users",
    tool: "getUser",
    prompt: "Show me the details for user 101.",
    description: "Look up a user by numeric ID."
  },
  {
    category: "Users",
    tool: "getUserByName",
    prompt: "Find the user named Habib Ullah.",
    description: "Look up a user by exact full name."
  },
  {
    category: "Users",
    tool: "searchUsers",
    prompt: "Search for users who are Software Developers.",
    description: "Search user names, roles, IDs, and experience."
  },
  {
    category: "Users",
    tool: "searchUsers",
    prompt: "Find users with more than 8 years of experience.",
    description: "Search user records by experience text."
  },
  {
    category: "Users",
    tool: "getUserTransactions",
    prompt: "Show all transactions for user 101.",
    description: "List transactions associated with a user ID."
  },
  {
    category: "Users",
    tool: "getUserTransactions",
    prompt: "What transactions belong to Ali Khan? Find the user first if needed.",
    description: "Find a user and then retrieve their transactions."
  },

  {
    category: "Orders",
    tool: "getOrder",
    prompt: "Show me the complete details for order 5001.",
    description: "Get an order with its status, customer, items, product, and transaction details."
  },
  {
    category: "Orders",
    tool: "getOrdersByCustomer",
    prompt: "List all orders for customer 101.",
    description: "List every order belonging to a customer ID."
  },
  {
    category: "Orders",
    tool: "getOrdersByCustomer",
    prompt: "Show all orders for Habib Ullah. Find the customer ID first if needed.",
    description: "Find a customer and then list their orders."
  },
  {
    category: "Orders",
    tool: "getOrdersByStatus",
    prompt: "Which orders are currently Processing?",
    description: "Filter orders by Processing, Shipped, or Delivered status."
  },
  {
    category: "Orders",
    tool: "getCustomerOrdersByStatus",
    prompt: "Show customer 101's Delivered orders.",
    description: "Filter one customer's orders by status."
  },
  {
    category: "Orders",
    tool: "getRecentOrders",
    prompt: "Show me the 5 most recent orders.",
    description: "Return the newest orders, optionally with a requested count."
  },
  {
    category: "Orders",
    tool: "getRecentOrders",
    prompt: "What are the 10 latest orders and their statuses?",
    description: "Return a larger recent-order list with a concise summary."
  },
  {
    category: "Orders",
    tool: "searchOrders",
    prompt: "Search orders related to customer 102.",
    description: "Search order IDs, customer IDs, products, amounts, and statuses."
  },
  {
    category: "Orders",
    tool: "searchOrders",
    prompt: "Find the order with transaction ID 12345.",
    description: "Search order data using a transaction ID or another known value."
  },

  {
    category: "Products",
    tool: "getProduct",
    prompt: "Show me product 2001.",
    description: "Look up a product by numeric ID."
  },
  {
    category: "Products",
    tool: "getProductByName",
    prompt: "Show the details and price of the Laptop.",
    description: "Look up a product by exact name."
  },
  {
    category: "Products",
    tool: "searchProducts",
    prompt: "Search for products related to cameras.",
    description: "Search product names, categories, IDs, and prices."
  },
  {
    category: "Products",
    tool: "searchProducts",
    prompt: "Find all products priced at 9500.",
    description: "Search products using a price value."
  },
  {
    category: "Products",
    tool: "getProductsByCategory",
    prompt: "List all products in the Accessories category.",
    description: "Filter products by exact category."
  },
  {
    category: "Products",
    tool: "getProductsByCategory",
    prompt: "Which products are available in the Audio category?",
    description: "Return products from another exact category."
  },
  {
    category: "Products",
    tool: "getProductsByPrice",
    prompt: "Show products between 5000 and 15000.",
    description: "Filter products using an inclusive minimum and maximum price."
  },
  {
    category: "Products",
    tool: "getProductsByPrice",
    prompt: "Which products cost less than 3000?",
    description: "Use a maximum-price filter without a minimum."
  },
  {
    category: "Products",
    tool: "getProductsByPrice",
    prompt: "Show products costing at least 100000.",
    description: "Use a minimum-price filter without a maximum."
  },
  {
    category: "Products",
    tool: "getProductList",
    prompt: "Show me the complete product catalog.",
    description: "Return the full product list."
  },
  {
    category: "Products",
    tool: "getProductList",
    prompt: "Give me a concise summary of all available product categories.",
    description: "Load the catalog and summarize it in the answer."
  },

  {
    category: "Transactions",
    tool: "getTransactionStatus",
    prompt: "What is the status of transaction 12345?",
    description: "Look up transaction status, amount, and date."
  },
  {
    category: "Transactions",
    tool: "getTransactionStatus",
    prompt: "Check transaction 12347 and tell me whether the payment is still pending.",
    description: "Check a transaction and explain its payment status."
  },

  {
    category: "Multi-step",
    tool: "agent",
    prompt: "Find Habib Ullah, list his orders, and summarize their statuses.",
    description: "Combine user lookup and order lookup in one question."
  },
  {
    category: "Multi-step",
    tool: "agent",
    prompt: "Find order 5001 and explain its customer, product, order status, and payment status.",
    description: "Ask for a readable summary of the related order records."
  },
  {
    category: "Multi-step",
    tool: "agent",
    prompt: "Find products in Accessories priced between 2000 and 10000.",
    description: "Combine category and price information in a product request."
  },

  {
    category: "Templates",
    tool: "agent",
    prompt: "Show the details for user {userId}.",
    description: "Replace {userId} with a numeric user ID."
  },
  {
    category: "Templates",
    tool: "agent",
    prompt: "List {limit} recent orders.",
    description: "Replace {limit} with a positive number."
  },
  {
    category: "Templates",
    tool: "agent",
    prompt: "Find products between {minPrice} and {maxPrice}.",
    description: "Replace both placeholders with non-negative prices."
  },
  {
    category: "Templates",
    tool: "agent",
    prompt: "Check transaction {transactionId}.",
    description: "Replace {transactionId} with a transaction ID such as 12345."
  },
  {
    category: "Templates",
    tool: "agent",
    prompt: "Check transaction {transactionId}.",
    description: "Replace {transactionId} with a transaction ID such as 12345."
  }
];

module.exports = promptSuggestions;
