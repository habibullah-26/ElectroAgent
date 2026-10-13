
function validateChat(req, res, next) {
    const { message } = req.body || {};

    if (typeof message !== "string" || message.trim().length === 0) {
        return res.status(400).json({
            success: false,
            error: {
                code: "INVALID_MESSAGE",
                message: "Please provide a non-empty message."
            },
            requestId: req.id
        });
    }

    if (message.length > 8000) {
        return res.status(413).json({
            success: false,
            error: {
                code: "MESSAGE_TOO_LONG",
                message: "Message cannot exceed 8000 characters."
            },
            requestId: req.id
        });
    }

    next();
}

module.exports = validateChat;
