const llmService =
    require("../services/llmService");


const {
    getUser,
    searchUsers,
    getUserTransactions,
    getUserByName
} = require("../functions/userFunctions");


const {
    getOrder,
    getOrdersByCustomer,
    getOrdersByStatus,
    getCustomerOrdersByStatus,
    getRecentOrders,
    searchOrders
} = require("../functions/orderFunctions");


const {
    getProduct,
    searchProducts,
    getProductsByCategory,
    getProductsByPrice,
    getProductList,
    getProductByName
} = require("../functions/productsFunctions");


const {
    getTransactionStatus
} = require("../functions/transactionFunctions");


// ==================================================
// Agent configuration
// ==================================================

const MAX_ITERATIONS = 5;


// ==================================================
// Execute application tools
// ==================================================

function executeTool(
    functionName,
    args
) {

    console.log(
        "\nExecuting tool:"
    );

    console.log(
        "Function:",
        functionName
    );

    console.log(
        "Arguments:",
        args
    );


    switch (functionName) {


        // ------------------------------------------
        // Get User
        // ------------------------------------------

        case "getUser":

            return getUser(
                args?.userId
            );

        case "searchUsers":

            return searchUsers(
                args?.query
            );

        case "getUserTransactions":

            return getUserTransactions(
                args?.userId
            );

        case "getUserByName":

            return getUserByName(
                args?.name
            );


        // ------------------------------------------
        // Get Order
        // ------------------------------------------

        case "getOrder":

            return getOrder(
                args?.orderId
            );

        case "getOrdersByCustomer":

            return getOrdersByCustomer(
                args?.customerId
            );

        case "getOrdersByStatus":

            return getOrdersByStatus(
                args?.status
            );

        case "getCustomerOrdersByStatus":

            return getCustomerOrdersByStatus(
                args?.customerId,
                args?.status
            );

        case "getRecentOrders":

            return getRecentOrders(
                args?.limit
            );

        case "searchOrders":

            return searchOrders(
                args?.query
            );


        // ------------------------------------------
        // Get Product
        // ------------------------------------------

        case "getProduct":

            return getProduct(
                args?.productId
            );

        case "searchProducts":

            return searchProducts(
                args?.query
            );

        case "getProductsByCategory":

            return getProductsByCategory(
                args?.category
            );

        case "getProductsByPrice":

            return getProductsByPrice(
                args?.minPrice,
                args?.maxPrice
            );

        case "getProductList":

            return getProductList();

        case "getProductByName":

            return getProductByName(
                args?.name
            );


        // ------------------------------------------
        // Get Transaction Status
        // ------------------------------------------

        case "getTransactionStatus":

            return getTransactionStatus(
                args?.transactionId
            );


        // ------------------------------------------
        // Unknown tool
        // ------------------------------------------

        default:

            return {

                success: false,

                message:
                    `Unknown function: ${functionName}`

            };

    }

}


// ==================================================
// Normalize tool call
// ==================================================
//
// Gemini and Ollama can return tool calls
// in different formats.
//
// We convert them into:
//
// {
//     name: "getUser",
//     args: {
//         userId: "101"
//     }
// }
//
// ==================================================

function normalizeFunctionCall(
    functionCall
) {

    if (!functionCall) {

        return null;

    }


    // ------------------------------------------
    // Gemini format
    // ------------------------------------------

    if (
        functionCall.name
    ) {

        return {

            name:
                functionCall.name,

            args:
                functionCall.args || {}

        };

    }


    // ------------------------------------------
    // Ollama format
    // ------------------------------------------

    if (
        functionCall.function
    ) {

        const fn =
            functionCall.function;


        let args =
            fn.arguments || {};


        // Some models may return arguments
        // as JSON string.

        if (
            typeof args === "string"
        ) {

            try {

                args =
                    JSON.parse(args);

            } catch (error) {

                console.error(
                    "Could not parse tool arguments:",
                    args
                );

                args = {};

            }

        }


        return {

            name:
                fn.name,

            args

        };

    }


    return null;

}


// ==================================================
// Run Agent
// ==================================================

async function runAgent(
    message
) {

    // ------------------------------------------
    // Initial conversation
    // ------------------------------------------

    let contents = [

        {

            role: "user",

            parts: [

                {

                    text:
                        message

                }

            ]

        }

    ];


    // ------------------------------------------
    // System instruction
    // ------------------------------------------

    const systemInstruction = `

You are a helpful AI assistant.

You have access to tools for retrieving:

- users
- orders
- products
- transaction information

Use tools whenever application data is required.

Never invent application data.

If the user asks for application data,
use the appropriate tool.

You may call multiple tools if necessary.

After receiving a tool result,
decide whether another tool is required.

When all required information is available,
provide a clear natural-language answer.

Do not repeatedly call the same tool
with the same arguments unless necessary.

`;


    // ------------------------------------------
    // Track tools used
    // ------------------------------------------

    const toolsUsed = [];


    // ------------------------------------------
    // Agent loop
    // ------------------------------------------

    for (
        let iteration = 1;
        iteration <= MAX_ITERATIONS;
        iteration++
    ) {

        console.log(
            `\n========== AGENT ITERATION ${iteration}/${MAX_ITERATIONS} ==========`
        );


        // --------------------------------------
        // Ask LLM
        // --------------------------------------

        console.log(
            "Sending request to:",
            llmService.getProvider()
        );


        const response =
            await llmService.generate({

                contents,

                systemInstruction

            });


        console.log(
            "Provider:",
            response.provider
        );


        console.log(
            "Model:",
            response.model
        );


        console.log(
            "LLM response:",
            response.text
        );


        // --------------------------------------
        // Get tool calls
        // --------------------------------------

        const functionCalls =
            response.functionCalls || [];


        console.log(
            "Tool calls:",
            functionCalls
        );


        // --------------------------------------
        // No tool required
        // --------------------------------------

        if (
            functionCalls.length === 0
        ) {

            console.log(
                "No more tools required."
            );


            return {

                answer:
                    response.text || "",

                toolUsed:
                    toolsUsed.length > 0
                        ? toolsUsed
                        : null,

                provider:
                    response.provider,

                model:
                    response.model

            };

        }


        // --------------------------------------
        // Process model response
        // --------------------------------------

        /*
         * IMPORTANT:
         *
         * Gemini and Ollama represent the
         * assistant/tool messages differently.
         *
         * The provider service should return
         * candidateContent when possible.
         */

        if (
            response.candidateContent
        ) {

            contents.push(
                response.candidateContent
            );

        }


        // --------------------------------------
        // Execute every requested tool
        // --------------------------------------

        const toolResults = [];


        for (
            const functionCall
            of functionCalls
        ) {

            const normalized =
                normalizeFunctionCall(
                    functionCall
                );


            // ----------------------------------
            // Invalid tool call
            // ----------------------------------

            if (!normalized) {

                console.error(
                    "Invalid tool call:",
                    functionCall
                );

                continue;

            }


            const functionName =
                normalized.name;


            const functionArgs =
                normalized.args;


            console.log(
                "\nTool requested:"
            );


            console.log(
                "Name:",
                functionName
            );


            console.log(
                "Arguments:",
                functionArgs
            );


            // ----------------------------------
            // Execute
            // ----------------------------------

            const result =
                await executeTool(
                    functionName,
                    functionArgs
                );


            console.log(
                "Tool result:",
                result
            );


            // ----------------------------------
            // Track tool
            // ----------------------------------

            toolsUsed.push(
                functionName
            );


            // ----------------------------------
            // Store result
            // ----------------------------------

            toolResults.push({

                functionName,

                functionArgs,

                result

            });

        }


        // --------------------------------------
        // Safety check
        // --------------------------------------

        if (
            toolResults.length === 0
        ) {

            throw new Error(
                "LLM requested tools, but no valid tools could be executed."
            );

        }


        // --------------------------------------
        // Add tool results
        // --------------------------------------

        /*
         * This is the common representation.
         *
         * Your provider service can convert
         * this to Gemini/Ollama format.
         */

        contents.push({

            role: "tool",

            parts: [

                {

                    text:
                        JSON.stringify(
                            toolResults
                        )

                }

            ]

        });


        console.log(
            "Tool results added to conversation."
        );

    }


    // ==================================================
    // Maximum iterations reached
    // ==================================================

    throw new Error(

        `Agent stopped after ${MAX_ITERATIONS} ` +
        `iterations to prevent an infinite loop.`

    );

}


module.exports = {

    runAgent

};