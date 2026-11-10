const express = require("express");
const conversationRepository = require("../database/conversationRepository");

const router = express.Router();

// POST /api/conversations
// Create a new conversation.
router.post("/", (req, res) => {
  const { title } = req.body || {};

  if (
    title !== undefined &&
    (typeof title !== "string" || title.trim().length === 0)
  ) {
    return res.status(400).json({
      success: false,
      error: {
        code: "INVALID_CONVERSATION_TITLE",
        message: "Title must be a non-empty string."
      }
    });
  }

  if (typeof title === "string" && title.length > 120) {
    return res.status(400).json({
      success: false,
      error: {
        code: "CONVERSATION_TITLE_TOO_LONG",
        message: "Title cannot exceed 120 characters."
      }
    });
  }

  const conversation = conversationRepository.createConversation(
    title === undefined ? "New conversation" : title
  );

  return res.status(201).json({
    success: true,
    conversation
  });
});

// GET /api/conversations
// Return conversations, newest activity first.
router.get("/", (req, res) => {
  const conversations = conversationRepository.listConversations();

  return res.status(200).json({
    success: true,
    conversations
  });
});

// GET /api/conversations/:id
// Return one conversation and its complete message history.
router.get("/:id", (req, res) => {
  const conversation = conversationRepository.getConversationById(
    req.params.id
  );

  if (!conversation) {
    return res.status(404).json({
      success: false,
      error: {
        code: "CONVERSATION_NOT_FOUND",
        message: "The requested conversation was not found."
      }
    });
  }

  return res.status(200).json({
    success: true,
    conversation
  });
});

// POST /api/conversations/:id/messages
// Persist a user or assistant message.
// This endpoint does not call the AI agent yet.
router.post("/:id/messages", (req, res) => {
  const { role, content } = req.body || {};

  if (role !== "user" && role !== "assistant") {
    return res.status(400).json({
      success: false,
      error: {
        code: "INVALID_MESSAGE_ROLE",
        message: "Role must be either 'user' or 'assistant'."
      }
    });
  }

  if (typeof content !== "string" || content.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: {
        code: "INVALID_MESSAGE_CONTENT",
        message: "Message content must be a non-empty string."
      }
    });
  }

  if (content.length > 8000) {
    return res.status(413).json({
      success: false,
      error: {
        code: "MESSAGE_TOO_LONG",
        message: "Message cannot exceed 8000 characters."
      }
    });
  }

  // Check first so a missing conversation returns a clear 404.
  const conversation = conversationRepository.getConversationById(
    req.params.id
  );

  if (!conversation) {
    return res.status(404).json({
      success: false,
      error: {
        code: "CONVERSATION_NOT_FOUND",
        message: "The requested conversation was not found."
      }
    });
  }

  const message = conversationRepository.addMessage(
    req.params.id,
    role,
    content
  );

  return res.status(201).json({
    success: true,
    message
  });
});

// DELETE /api/conversations/:id
// Delete a conversation and its messages.
router.delete("/:id", (req, res) => {
  const deleted = conversationRepository.deleteConversation(req.params.id);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      error: {
        code: "CONVERSATION_NOT_FOUND",
        message: "The requested conversation was not found."
      }
    });
  }

  return res.status(200).json({
    success: true,
    message: "Conversation deleted successfully."
  });
});

module.exports = router;
