const express = require("express");
const cors = require("cors");
require("dotenv").config();

const {
    runAgent
} = require("./agents/agenticService");


const app = express();


// ------------------------------------
// Middleware
// ------------------------------------

app.use(cors());

app.use(express.json());


// ------------------------------------
// Health check
// ------------------------------------

app.get("/api/health", (req, res) => {

    res.json({

        success: true,

        message: "Server is running",

        provider:
            process.env.AI_PROVIDER || "gemini"

    });

});


// ------------------------------------
// AI Chat
// ------------------------------------

app.post(
    "/api/chat",
    async (req, res) => {

        try {

            const {
                message
            } = req.body;


            // -----------------------------
            // Validate request
            // -----------------------------

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
            // -----------------------------
            // Run AI Agent
            // -----------------------------

            const result =
                await runAgent(
                    message.trim()
                );


            // -----------------------------
            // Send response
            // -----------------------------

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


// ------------------------------------
// 404
// ------------------------------------

app.use(
    (req, res) => {

        res.status(404).json({

            success: false,

            message:
                "API endpoint not found."

        });

    }
);


// ------------------------------------
// Error handler
// ------------------------------------

app.use(
    (error, req, res, next) => {

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


// ------------------------------------
// Start server
// ------------------------------------

const PORT =
    process.env.PORT || 3000;


app.listen(
    PORT,
    () => {

        console.log(
            "\n================================"
        );

        console.log(
            `Server running on http://localhost:${PORT}`
        );

        console.log(
            `AI Provider: ${
                process.env.AI_PROVIDER || "gemini"
            }`
        );

        console.log(
            "================================\n"
        );

    }
);