const assert = require("node:assert/strict");
const repository = require("./database/conversationRepository");

let conversationId;

try {
  // Create a temporary conversation for this smoke test.
  const conversation = repository.createConversation("Repository smoke test");
  conversationId = conversation.id;

  assert.ok(conversationId, "Conversation should have an ID");

  const userMessage = repository.addMessage(
    conversationId,
    "user",
    "Hello from the repository test"
  );

  const assistantMessage = repository.addMessage(
    conversationId,
    "assistant",
    "Repository is working"
  );

  assert.equal(userMessage.role, "user");
  assert.equal(assistantMessage.role, "assistant");

  const savedConversation = repository.getConversationById(conversationId);

  assert.equal(savedConversation.messages.length, 2);
  assert.equal(savedConversation.messages[0].content, "Hello from the repository test");
  assert.equal(savedConversation.messages[1].content, "Repository is working");

  const listedConversation = repository
    .listConversations()
    .find((item) => item.id === conversationId);

  assert.ok(listedConversation, "Conversation should appear in the list");
  assert.equal(listedConversation.message_count, 2);

  console.log("Conversation repository test passed.");
  console.log({
    conversationId,
    messageCount: savedConversation.messages.length,
    title: savedConversation.title
  });
} finally {
  // Keep the test database clean, even if an assertion fails.
  if (conversationId) {
    repository.deleteConversation(conversationId);
  }
}
