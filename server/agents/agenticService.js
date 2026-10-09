const llmService =
    require("../services/llmService");


const {
    searchKnowledge
} = require("../services/ragService");


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
// RAG configuration
// ==================================================

const RAG_TOP_K = 3;


// ==================================================
// Execute application tools
// ==================================================

async function executeTool(
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
        // User
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
        // Orders
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
        // Products
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
        // Transactions
        // ------------------------------------------

        case "getTransactionStatus":

            return getTransactionStatus(
                args?.transactionId
            );
        
        case "searchKnowledge":
            return await searchKnowledge(
                args?.query,
                3
            );

        // ------------------------------------------
        // Unknown
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
    // Ollama / Llama format
    // ------------------------------------------

    if (
        functionCall.function
    ) {

        const fn =
            functionCall.function;


        let args =
            fn.arguments || {};


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
// Determine whether RAG should be used
// ==================================================

function shouldSearchKnowledge(
    message
) {

    const keywords = [

        "return",
        "refund",
        "warranty",
        "shipping",
        "delivery",
        "support",
        "policy",
        "store",
        "company",
        "working hours",
        "business hours"

    ];


    const text =
        message.toLowerCase();


    return keywords.some(
        keyword =>
            text.includes(keyword)
    );

}


// ==================================================
// Search RAG Knowledge
// ==================================================

async function getKnowledgeContext(
    question
) {

    console.log(
        "\n================================="
    );

    console.log(
        "Searching RAG Knowledge"
    );

    console.log(
        "================================="
    );


    const results =
        await searchKnowledge(
            question,
            RAG_TOP_K
        );


    if (
        !results ||
        results.length === 0
    ) {

        console.log(
            "No RAG results found."
        );

        return "";

    }


    console.log(
        "\nRAG Results:"
    );


    results.forEach(
        result => {

            console.log(
                `Chunk ${result.id} - Score: ${result.score.toFixed(3)}`
            );

            console.log(
                result.text
            );

        }
    );


    return results
        .map(
            result =>
                result.text
        )
        .join("\n\n");

}


// ==================================================
// Run Agent
// ==================================================

async function runAgent(
    message
) {

    // ==================================================
    // RAG
    // ==================================================

    // let knowledgeContext = "";


    // if (
    //     shouldSearchKnowledge(
    //         message
    //     )
    // ) {

    //     try {

    //         knowledgeContext =
    //             await getKnowledgeContext(
    //                 message
    //             );

    //     } catch (error) {

    //         console.error(
    //             "RAG search failed:",
    //             error
    //         );

    //         knowledgeContext = "";

    //     }

    // }


    // ==================================================
    // Initial conversation
    // ==================================================

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


    // ==================================================
    // Add RAG context
    // ==================================================

//     if (
//         knowledgeContext
//     ) {

//         contents.push({

//             role: "user",

//             parts: [

//                 {

//                     text:
//                         `
// Relevant information from the
// ElectroAgent knowledge base:

// ${knowledgeContext}

// Use this information when answering
// the user's question.

// IMPORTANT:
// Do not invent information that is not
// present in the provided knowledge.
// `

//                 }

//             ]

//         });

//     }


    // ==================================================
    // System instruction
    // ==================================================

  const systemInstruction = `
You are ElectroAgent, an AI assistant for an
electronics store.

You can use tools to retrieve user, order,
product, transaction, and knowledge-base data.

Rules:

1. Use searchKnowledge for store policies,
   warranties, returns, refunds, shipping,
   delivery, and support questions.

2. Use product tools for specific product details.

3. Use order tools for order information.

4. You may call multiple tools when a question
   requires multiple sources of information.

5. Use retrieved tool results as evidence.
   Do not invent policies, prices, warranties,
   or product details.

6. If the available information does not answer
   the question, clearly say that you could not
   verify the information.

7. Keep answers concise and helpful.
`;


    // ==================================================
    // Track tools
    // ==================================================

    const toolsUsed = [];


    // ==================================================
    // Agent loop
    // ==================================================

    for (
        let iteration = 1;
        iteration <= MAX_ITERATIONS;
        iteration++
    ) {

        console.log(
            `\n========== AGENT ITERATION ${iteration}/${MAX_ITERATIONS} ==========`
        );


        console.log(
            "Sending request to:",
            llmService.getProvider()
        );


        // ------------------------------------------
        // Ask LLM
        // ------------------------------------------

        const response =
            await llmService.generate({

                contents,

                systemInstruction

            });


        // ------------------------------------------
        // Get tool calls
        // ------------------------------------------

        const functionCalls =
            response.functionCalls || [];


        console.log(
            "Tool calls:",
            functionCalls
        );


        // ------------------------------------------
        // No tool required
        // ------------------------------------------

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


        // ------------------------------------------
        // Process model response
        // ------------------------------------------

        /*
         * Gemini may return candidateContent.
         *
         * Llama/Ollama currently returns tool
         * calls separately, so candidateContent
         * may not exist.
         */

        if (
            response.candidateContent
        ) {

            contents.push(
                response.candidateContent
            );

        }


        // ------------------------------------------
        // Execute requested tools
        // ------------------------------------------

        const toolResults = [];


        for (
            const functionCall
            of functionCalls
        ) {

            const normalized =
                normalizeFunctionCall(
                    functionCall
                );


            // --------------------------------------
            // Invalid tool call
            // --------------------------------------

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


            // --------------------------------------
            // Execute tool
            // --------------------------------------

            const result =
                await executeTool(
                    functionName,
                    functionArgs
                );


            console.log(
                "Tool result:",
                result
            );


            // --------------------------------------
            // Track tool
            // --------------------------------------

            toolsUsed.push(
                functionName
            );


            // --------------------------------------
            // Store result
            // --------------------------------------

            toolResults.push({

                functionName,

                functionArgs,

                result

            });

        }


        // ------------------------------------------
        // Safety check
        // ------------------------------------------

        if (
            toolResults.length === 0
        ) {

            throw new Error(
                "LLM requested tools, but no valid tools could be executed."
            );

        }


        // ------------------------------------------
        // Add tool results
        // ------------------------------------------

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
    // Maximum iterations
    // ==================================================

    throw new Error(

        `Agent stopped after ${MAX_ITERATIONS} ` +
        `iterations to prevent an infinite loop.`

    );

}


// ==================================================
// Export
// ==================================================

module.exports = {

    runAgent

};