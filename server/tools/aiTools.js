// ==========================================
// Gemini AI Tool Definitions
// ==========================================

const tools = [

  {
    functionDeclarations: [

      // ======================================
      // getUser
      // ======================================

      {
        name: "getUser",

        description:
          "Gets information about a user using their user ID.",

        parameters: {

          type: "OBJECT",

          properties: {

            userId: {

              type: "NUMBER",

              description:
                "The unique ID of the user."

            }

          },

          required: [
            "userId"
          ]

        }

      },

      {
        name: "searchUsers",
        description: "Searches users by name, role, ID, or experience.",
        parameters: {
          type: "OBJECT",
          properties: {
            query: {
              type: "STRING",
              description: "Text to search for in user details."
            }
          },
          required: ["query"]
        }
      },

      {
        name: "getUserTransactions",
        description: "Gets all transactions for a user using the user ID.",
        parameters: {
          type: "OBJECT",
          properties: {
            userId: {
              type: "NUMBER",
              description: "The unique ID of the user."
            }
          },
          required: ["userId"]
        }
      },

      {
        name: "getUserByName",
        description: "Gets user information using the user's full name.",
        parameters: {
          type: "OBJECT",
          properties: {
            name: {
              type: "STRING",
              description: "The user's full name."
            }
          },
          required: ["name"]
        }
      },


      // ======================================
      // getOrder
      // ======================================

      {
        name: "getOrder",

        description:
          "Gets order information using an order ID.",

        parameters: {

          type: "OBJECT",

          properties: {

            orderId: {

              type: "NUMBER",

              description:
                "The unique ID of the order."

            }

          },

          required: [
            "orderId"
          ]

        }

      },

      {
        name: "getOrdersByCustomer",
        description: "Gets all orders for a customer using the customer ID.",
        parameters: {
          type: "OBJECT",
          properties: {
            customerId: {
              type: "NUMBER",
              description: "The unique ID of the customer."
            }
          },
          required: ["customerId"]
        }
      },

      {
        name: "getOrdersByStatus",
        description: "Gets all orders with the specified status.",
        parameters: {
          type: "OBJECT",
          properties: {
            status: {
              type: "STRING",
              description: "The order status to find."
            }
          },
          required: ["status"]
        }
      },

      {
        name: "getCustomerOrdersByStatus",
        description: "Gets a customer's orders with the specified status.",
        parameters: {
          type: "OBJECT",
          properties: {
            customerId: {
              type: "NUMBER",
              description: "The unique ID of the customer."
            },
            status: {
              type: "STRING",
              description: "The order status to find."
            }
          },
          required: ["customerId", "status"]
        }
      },

      {
        name: "getRecentOrders",
        description: "Gets the most recently added orders, optionally limited by count.",
        parameters: {
          type: "OBJECT",
          properties: {
            limit: {
              type: "NUMBER",
              description: "Maximum number of orders to return."
            }
          }
        }
      },

      {
        name: "searchOrders",
        description: "Searches orders by order ID, customer ID, product, amount, or status.",
        parameters: {
          type: "OBJECT",
          properties: {
            query: {
              type: "STRING",
              description: "Text to search for in order details."
            }
          },
          required: ["query"]
        }
      },


      // ======================================
      // getTransactionStatus
      // ======================================

      {
        name: "getTransactionStatus",

        description:
          "Gets the current status, amount and date of a payment transaction using its transaction ID.",

        parameters: {

          type: "OBJECT",

          properties: {

            transactionId: {

              type: "STRING",

              description:
                "The unique ID of the transaction."

            }

          },

          required: [
            "transactionId"
          ]

        }

      },

       // ======================================
      // Get Product
      // ======================================

      {
        name: "getProduct",

        description:
          "Gets information about a product using its product ID.",

        parameters: {

          type: "OBJECT",

          properties: {

            productId: {

              type: "NUMBER",

              description:
                "The unique ID of the product."

            }

          },

          required: [
            "productId"
          ]

        }

      },
      {
        name: "searchProducts",
        description: "Searches products by name, category, ID, or price.",
        parameters: {
          type: "OBJECT",
          properties: {
            query: {
              type: "STRING",
              description: "Text to search for in product details."
            }
          },
          required: ["query"]
        }
      },
      {
        name: "getProductsByCategory",
        description: "Gets products in a specific category.",
        parameters: {
          type: "OBJECT",
          properties: {
            category: {
              type: "STRING",
              description: "The product category."
            }
          },
          required: ["category"]
        }
      },
      {
        name: "getProductsByPrice",
        description: "Gets products within an optional minimum and maximum price range.",
        parameters: {
          type: "OBJECT",
          properties: {
            minPrice: {
              type: "NUMBER",
              description: "Inclusive minimum product price."
            },
            maxPrice: {
              type: "NUMBER",
              description: "Inclusive maximum product price."
            }
          }
        }
      },
      {
        name: "getProductList",
        description: "Gets the full product catalog.",
        parameters: {
          type: "OBJECT",
          properties: {}
        }
      },
      {
        name: "getProductByName",
        description: "Gets product information using its exact name.",
        parameters: {
          type: "OBJECT",
          properties: {
            name: {
              type: "STRING",
              description: "The exact product name."
            }
          },
          required: ["name"]
        }
      }

    ]
  }

];


// ==========================================
// Export
// ==========================================

module.exports = tools;