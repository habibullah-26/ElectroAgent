const assert = require("node:assert/strict");

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(
      `Request failed (${response.status}): ${JSON.stringify(body)}`
    );
  }

  return body;
}

async function runTest() {
  let conversationId;

  try {
    // 1. Create a conversation.
    const created = await request("/conversations", {
      method: "POST",
      body: JSON.stringify({ title: "API integration test" })
    });

    conversationId = created.conversation.id;
    assert.ok(conversationId, "Create endpoint should return an ID");

    // 2. Save a user message.
    const savedUserMessage = await request(
      `/conversations/${conversationId}/messages`,
      {
        method: "POST",
        body: JSON.stringify({
          role: "user",
          content: "Hello from API test"
        })
      }
    );

    assert.equal(savedUserMessage.message.role, "user");

    // 3. Save an assistant message.
    await request(`/conversations/${conversationId}/messages`, {
      method: "POST",
      body: JSON.stringify({
        role: "assistant",
        content: "The conversation API is working"
      })
    });

    // 4. Read the conversation and verify both messages.
    const fetched = await request(`/conversations/${conversationId}`);
    assert.equal(fetched.conversation.messages.length, 2);

    // 5. Verify it appears in the conversation list.
    const listed = await request("/conversations");
    assert.ok(
      listed.conversations.some((item) => item.id === conversationId),
      "Conversation should appear in list endpoint"
    );

    console.log("Conversation API test passed.");
    console.log({
      conversationId,
      messages: fetched.conversation.messages.length
    });
  } finally {
    // Clean up the test conversation.
    if (conversationId) {
      const deleted = await request(`/conversations/${conversationId}`, {
        method: "DELETE"
      });

      assert.equal(deleted.success, true);
    }
  }
}

runTest().catch((error) => {
  console.error("Conversation API test failed:", error.message);
  process.exitCode = 1;
});
