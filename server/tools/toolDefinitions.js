const toolDefinitions = [

    {
        name: "getUser",

        description:
            "Get user information using the user ID.",

        parameters: {

            type: "object",

            properties: {

                userId: {
                    type: "string",
                    description:
                        "The ID of the user."
                }

            },

            required: [
                "userId"
            ]

        }
    },

    {
        name: "searchUsers",
        description: "Search users by name, role, ID, or experience.",
        parameters: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "Text to search for in user details."
                }
            },
            required: ["query"]
        }
    },

    {
        name: "getUserTransactions",
        description: "Get all transactions for a user using the user ID.",
        parameters: {
            type: "object",
            properties: {
                userId: {
                    type: "string",
                    description: "The ID of the user."
                }
            },
            required: ["userId"]
        }
    },

    {
        name: "getUserByName",
        description: "Get user information using the user's full name.",
        parameters: {
            type: "object",
            properties: {
                name: {
                    type: "string",
                    description: "The user's full name."
                }
            },
            required: ["name"]
        }
    },


    {
        name: "getOrder",

        description:
            "Get order information using the order ID.",

        parameters: {

            type: "object",

            properties: {

                orderId: {
                    type: "string",
                    description:
                        "The ID of the order."
                }

            },

            required: [
                "orderId"
            ]

        }
    },

    {
        name: "getOrdersByCustomer",
        description: "Get all orders for a customer using the customer ID.",
        parameters: {
            type: "object",
            properties: {
                customerId: {
                    type: "string",
                    description: "The ID of the customer."
                }
            },
            required: ["customerId"]
        }
    },

    {
        name: "getOrdersByStatus",
        description: "Get all orders with the specified status.",
        parameters: {
            type: "object",
            properties: {
                status: {
                    type: "string",
                    description: "The order status to find."
                }
            },
            required: ["status"]
        }
    },

    {
        name: "getCustomerOrdersByStatus",
        description: "Get a customer's orders with the specified status.",
        parameters: {
            type: "object",
            properties: {
                customerId: {
                    type: "string",
                    description: "The ID of the customer."
                },
                status: {
                    type: "string",
                    description: "The order status to find."
                }
            },
            required: ["customerId", "status"]
        }
    },

    {
        name: "getRecentOrders",
        description: "Get the most recently added orders, optionally limited by count.",
        parameters: {
            type: "object",
            properties: {
                limit: {
                    type: "number",
                    description: "Maximum number of orders to return."
                }
            }
        }
    },

    {
        name: "searchOrders",
        description: "Search orders by order ID, customer ID, product, amount, or status.",
        parameters: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "Text to search for in order details."
                }
            },
            required: ["query"]
        }
    },


    {
        name: "getProduct",

        description:
            "Get product information using the product ID.",

        parameters: {

            type: "object",

            properties: {

                productId: {
                    type: "string",
                    description:
                        "The ID of the product."
                }

            },

            required: [
                "productId"
            ]

        }
    },

    {
        name: "searchProducts",
        description: "Search products by name, category, ID, or price.",
        parameters: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "Text to search for in product details."
                }
            },
            required: ["query"]
        }
    },

    {
        name: "getProductsByCategory",
        description: "Get products in a specific category.",
        parameters: {
            type: "object",
            properties: {
                category: {
                    type: "string",
                    description: "The product category."
                }
            },
            required: ["category"]
        }
    },

    {
        name: "getProductsByPrice",
        description: "Get products within an optional minimum and maximum price range.",
        parameters: {
            type: "object",
            properties: {
                minPrice: {
                    type: "number",
                    description: "Inclusive minimum product price."
                },
                maxPrice: {
                    type: "number",
                    description: "Inclusive maximum product price."
                }
            }
        }
    },

    {
        name: "getProductList",
        description: "Get the full product catalog.",
        parameters: {
            type: "object",
            properties: {}
        }
    },

    {
        name: "getProductByName",
        description: "Get product information using its exact name.",
        parameters: {
            type: "object",
            properties: {
                name: {
                    type: "string",
                    description: "The exact product name."
                }
            },
            required: ["name"]
        }
    },


    {
        name: "getTransactionStatus",

        description:
            "Get transaction status using transaction ID.",

        parameters: {

            type: "object",

            properties: {

                transactionId: {
                    type: "string",
                    description:
                        "The transaction ID."
                }

            },

            required: [
                "transactionId"
            ]

        }
    }

];


module.exports = toolDefinitions;