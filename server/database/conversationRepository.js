const { randomUUID } = require("node:crypto");
const db = require("./database");

// Prepared statements are created once and reused for each operation.
const insertConversation = db.prepare(`
  INSERT INTO conversations (id, title)
  VALUES (@id, @title)
`);

const selectConversation = db.prepare(`
  SELECT id, title, created_at, updated_at
  FROM conversations
  WHERE id = ?
`);

const selectConversations = db.prepare(`
  SELECT
    c.id,
    c.title,
    c.created_at,
    c.updated_at,
    COUNT(m.id) AS message_count
  FROM conversations AS c
  LEFT JOIN messages AS m ON m.conversation_id = c.id
  GROUP BY c.id
  ORDER BY c.updated_at DESC, c.created_at DESC
`);

const insertMessage = db.prepare(`
  INSERT INTO messages (conversation_id, role, content)
  VALUES (@conversationId, @role, @content)
`);

const selectMessages = db.prepare(`
  SELECT id, conversation_id, role, content, created_at
  FROM messages
  WHERE conversation_id = ?
  ORDER BY id ASC
`);

const deleteConversationStatement = db.prepare(`
  DELETE FROM conversations
  WHERE id = ?
`);

const touchConversation = db.prepare(`
  UPDATE conversations
  SET updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
`);

function createConversation(title = "New conversation") {
  if (typeof title !== "string" || !title.trim()) {
    throw new TypeError("Conversation title must be a non-empty string.");
  }

  const conversation = {
    id: randomUUID(),
    title: title.trim().slice(0, 120)
  };

  insertConversation.run(conversation);
  return selectConversation.get(conversation.id);
}

function listConversations() {
  return selectConversations.all();
}

function getConversationById(conversationId) {
  if (typeof conversationId !== "string" || !conversationId.trim()) {
    return null;
  }

  const conversation = selectConversation.get(conversationId);
  if (!conversation) {
    return null;
  }

  return {
    ...conversation,
    messages: selectMessages.all(conversationId)
  };
}

function addMessage(conversationId, role, content) {
  if (typeof conversationId !== "string" || !conversationId.trim()) {
    throw new TypeError("A valid conversation ID is required.");
  }

  if (role !== "user" && role !== "assistant") {
    throw new TypeError("Message role must be 'user' or 'assistant'.");
  }

  if (typeof content !== "string" || !content.trim()) {
    throw new TypeError("Message content must be a non-empty string.");
  }

  const addMessageAndUpdateConversation = db.transaction(() => {
    const result = insertMessage.run({
      conversationId,
      role,
      content: content.trim()
    });

    touchConversation.run(conversationId);

    return db.prepare(`
      SELECT id, conversation_id, role, content, created_at
      FROM messages
      WHERE id = ?
    `).get(result.lastInsertRowid);
  });

  return addMessageAndUpdateConversation();
}

function deleteConversation(conversationId) {
  if (typeof conversationId !== "string" || !conversationId.trim()) {
    return false;
  }

  const result = deleteConversationStatement.run(conversationId);
  // The messages are removed automatically by the foreign-key cascade.
  return result.changes > 0;
}

module.exports = {
  createConversation,
  listConversations,
  getConversationById,
  addMessage,
  deleteConversation
};
