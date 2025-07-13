// Import SvelteKit's JSON response utility
import { json } from "@sveltejs/kit";

// Import types and validation schema for message structure
import type { RequestHandler } from "./$types";
import { MessageSchema, type Message } from "$lib/types";

// Import Cosmos DB utilities
import { getMessagesByChatId, createMessage, initializeCosmosDB } from "$lib/server/cosmos";

// Initialize Cosmos DB connection on module load
initializeCosmosDB().catch(console.error);

// GET /api/messages/[chatID]
// Returns all messages belonging to the specified chat ID
export const GET: RequestHandler = async ({ params }) => {
  if (!params.chatID) {
    return json({ error: "Missing chatID" }, { status: 400 });
  }

  try {
    const messages = await getMessagesByChatId(params.chatID);
    return json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return json({ error: "Failed to fetch messages" }, { status: 500 });
  }
};

// POST /api/messages/[chatID]
// Adds a new message to the specified chat ID
export const POST: RequestHandler = async ({ request, params }) => {
  if (!params.chatID) {
    return json({ error: "Missing chatID" }, { status: 400 });
  }

  // Parse and validate incoming JSON payload
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Validate message structure using Zod schema
  const result = MessageSchema.safeParse(body);
  if (!result.success) {
    return json(
      { error: "Invalid message format", issues: result.error.issues },
      { status: 400 }
    );
  }

  const newMessage = result.data;

  // Ensure chatId in message matches the one in the route
  if (newMessage.chatId !== params.chatID) {
    return json(
      {
        error: "chatId mismatch",
        expected: params.chatID,
        received: newMessage.chatId,
      },
      { status: 400 }
    );
  }

  try {
    // Create message in Cosmos DB
    const createdMessage = await createMessage(newMessage);
    
    // Return the created message
    return json({ message: createdMessage }, { status: 201 });
  } catch (error) {
    console.error("Error creating message:", error);
    return json({ error: "Failed to create message" }, { status: 500 });
  }
};
