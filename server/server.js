const express = require("express");
const cors = require("cors");

require("dotenv").config();


const {
    runAgent
} = require("./agents/agenticService");


const {
    initializeKnowledge,
    searchKnowledge
} = require("./services/ragService");


const app = express();


// ==================================================
// Middleware
// ==================================================

app.use(
    cors()
);

app.use(
    express.json()
);


// ==================================================
// Health Check
// ==================================================

app.get(
    "/api/health",
    (req, res) => {

        res.json({

            success: true,

            message:
                "Server is running",

            provider:
                process.env.AI_PROVIDER ||
                "gemini"

        });

    }
);


// ==================================================
// RAG Search
// ==================================================

app.get(
    "/api/rag/search",
    async (req, res) => {

        try {

            const query =
                req.query.q;


            console.log(
                "\nRAG Search Query:",
                query
            );


            // ------------------------------------------
            // Validate query
            // ------------------------------------------

            if (
                !query ||
                typeof query !== "string"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Please provide a search query."

                });

            }


            // ------------------------------------------
            // Search knowledge
            // ------------------------------------------

            const results =
                await searchKnowledge(
                    query,
                    3
                );


            console.log(
                "RAG Search Results:",
                results
            );


            // ------------------------------------------
            // Response
            // ------------------------------------------

            return res.json({

                success: true,

                query:

                    query,

                results:

                    results

            });

        } catch (error) {

            console.error(
                "\nRAG Search Error:"
            );

            console.error(
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "RAG search failed.",

                error:
                    error.message

            });

        }

    }
);


// ==================================================
// AI Chat
// ==================================================

app.post(
    "/api/chat",
    async (req, res) => {

        try {

            const {
                message
            } = req.body;


            // ------------------------------------------
            // Validate request
            // ------------------------------------------

            if (
                !message ||
                typeof message !== "string" ||
                message.trim().length === 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Please provide a valid message."

                });

            }


            // ------------------------------------------
            // Run AI Agent
            // ------------------------------------------

            const result =
                await runAgent(
                    message.trim()
                );


            // ------------------------------------------
            // Response
            // ------------------------------------------

            return res.json({

                success: true,

                answer:
                    result.answer,

                toolUsed:
                    result.toolUsed,

                provider:
                    result.provider,

                model:
                    result.model

            });

        } catch (error) {

            console.error(
                "\nAgent Error:"
            );

            console.error(
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "AI Agent failed.",

                error:
                    error.message

            });

        }

    }
);


// ==================================================
// 404 Handler
// ==================================================

app.use(
    (req, res) => {

        res.status(404).json({

            success: false,

            message:
                "API endpoint not found."

        });

    }
);


// ==================================================
// Error Handler
// ==================================================

app.use(
    (
        error,
        req,
        res,
        next
    ) => {

        console.error(
            "Server Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Internal server error."

        });

    }
);


// ==================================================
// Start Server
// ==================================================

const PORT =
    process.env.PORT || 3000;


app.listen(
    PORT,
    async () => {

        console.log(
            "\n================================="
        );

        console.log(
            "ElectroAgent Server"
        );

        console.log(
            `http://localhost:${PORT}`
        );

        console.log(
            `AI Provider: ${
                process.env.AI_PROVIDER ||
                "gemini"
            }`
        );

        console.log(
            "================================="
        );


        // ------------------------------------------
        // Initialize RAG
        // ------------------------------------------

        try {

            await initializeKnowledge();

        } catch (error) {

            console.error(
                "\nRAG initialization failed:"
            );

            console.error(
                error
            );

        }

    }
);