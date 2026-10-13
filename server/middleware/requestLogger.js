
const { randomUUID } = require("node:crypto");
const pino = require("pino");
const pinoHttp = require("pino-http");

const logger = pino({
    level: process.env.LOG_LEVEL || "info",
    redact: {
        paths: [
            "req.headers.authorization",
            "req.headers.cookie",
            "apiKey",
            "token",
            "password",
            "req.body.password",
            "req.body.apiKey"
        ],
        censor: "[REDACTED]"
    }
});

const requestLogger = pinoHttp({
    logger,

    genReqId(req, res) {
        const requestId = randomUUID();
        res.setHeader("X-Request-ID", requestId);
        return requestId;
    },

    customLogLevel(req, res, error) {
        if (error || res.statusCode >= 500) return "error";
        if (res.statusCode >= 400) return "warn";
        return "info";
    },

    // Avoid logging request bodies or user messages.
    customProps(req) {
        return {
            requestId: req.id
        };
    }
});

module.exports = {
    logger,
    requestLogger
};
