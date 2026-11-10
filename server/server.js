
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { runAgent } = require("./agents/agenticService");
const { requestLogger, logger } = require("./middleware/requestLogger");
const validateChat = require("./middleware/validateChat");
const conversationRoutes = require("./routes/conversationRoutes");
const conversationRepository = require("./database/conversationRepository");

const app = express();

// ------------------------------------
// Middleware
// ------------------------------------

app.use(requestLogger);

// Preserve your existing CORS policy if you have one.
// For deployment, restrict origin to your actual frontend URL.
app.use(cors());

app.use(express.json({ limit: "32kb" }));

// ------------------------------------
// Conversation persistence API
// ------------------------------------

app.use("/api/conversations", conversationRoutes);

// ------------------------------------
// Health check
// ------------------------------------

app.get("/api/health", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Server is running",
        provider: process.env.AI_PROVIDER || "gemini",
        requestId: req.id
    });
});

// ------------------------------------
// AI Chat
// ------------------------------------

app.post("/api/chat", validateChat, async (req, res) => {
    const startedAt = Date.now();

    try {
        const message = req.body.message.trim();
        const { conversationId } = req.body;

        let conversationHistory = [];

        // Conversation persistence is opt-in until the Angular client is
        // migrated in the next step. Requests without an ID keep old behavior.
        if (conversationId !== undefined) {
            if (
                typeof conversationId !== "string" ||
                conversationId.trim().length === 0
            ) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: "INVALID_CONVERSATION_ID",
                        message: "conversationId must be a non-empty string."
                    },
                    requestId: req.id
                });
            }

            const conversation = conversationRepository.getConversationById(
                conversationId
            );

            if (!conversation) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: "CONVERSATION_NOT_FOUND",
                        message: "The requested conversation was not found."
                    },
                    requestId: req.id
                });
            }

            // Read previous turns before inserting the current user message.
            conversationHistory = conversation.messages;
            conversationRepository.addMessage(
                conversationId,
                "user",
                message
            );
        }

        // Pass prior turns to the existing provider-neutral agent.
        const result = await runAgent(message, conversationHistory);

        // Guard against unexpected agent output.
        if (!result || typeof result.answer !== "string") {
            logger.error({
                requestId: req.id,
                durationMs: Date.now() - startedAt
            }, "Agent returned an invalid response");

            return res.status(502).json({
                success: false,
                error: {
                    code: "INVALID_AI_RESPONSE",
                    message: "The AI assistant returned an invalid response. Please try again."
                },
                requestId: req.id
            });
        }

        // Persist the assistant response only after the agent succeeds.
        if (conversationId) {
            conversationRepository.addMessage(
                conversationId,
                "assistant",
                result.answer
            );
        }

        logger.info({
            requestId: req.id,
            durationMs: Date.now() - startedAt,
            provider: result.provider || process.env.AI_PROVIDER || "gemini",
            success: true
        }, "Agent request completed");

        return res.status(200).json({
            success: true,
            answer: result.answer,
            toolUsed: result.toolUsed ?? null,
            provider: result.provider,
            model: result.model,
            requestId: req.id
        });
    } catch (error) {
        logger.error({
            requestId: req.id,
            durationMs: Date.now() - startedAt,
            errorName: error?.name || "Error"
        }, "Agent request failed");

        return res.status(502).json({
            success: false,
            error: {
                code: "AI_AGENT_FAILED",
                message: "The AI assistant could not complete your request. Please try again."
            },
            requestId: req.id
        });
    }
});

// ------------------------------------
// 404 — must come after API routes
// ------------------------------------

app.use((req, res) => {
    return res.status(404).json({
        success: false,
        error: {
            code: "ROUTE_NOT_FOUND",
            message: "The requested API endpoint was not found."
        },
        requestId: req.id
    });
});

// ------------------------------------
// Global error handler — must be last
// ------------------------------------

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    if (
        error instanceof SyntaxError &&
        error.status === 400 &&
        Object.prototype.hasOwnProperty.call(error, "body")
    ) {
        return res.status(400).json({
            success: false,
            error: {
                code: "INVALID_JSON",
                message: "Request body must contain valid JSON."
            },
            requestId: req.id
        });
    }

    if (error.type === "entity.too.large") {
        return res.status(413).json({
            success: false,
            error: {
                code: "REQUEST_TOO_LARGE",
                message: "Request body is too large."
            },
            requestId: req.id
        });
    }

    logger.error({
        requestId: req.id,
        errorName: error?.name || "Error"
    }, "Unhandled server error");

    return res.status(500).json({
        success: false,
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected server error occurred."
        },
        requestId: req.id
    });
});

// ------------------------------------
// Start server
// ------------------------------------

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger.info({
        port: PORT,
        provider: process.env.AI_PROVIDER || "gemini",
        environment: process.env.NODE_ENV || "development"
    }, `ElectroAgent server running on port ${PORT}`);
});
