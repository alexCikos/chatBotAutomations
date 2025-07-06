// Import LowDB adapter and database engine for file-based JSON storage
import { JSONFile } from "lowdb/node";
import { Low } from "lowdb";

// Import SvelteKit's JSON response utility
import { json } from "@sveltejs/kit";

// Import types and validation schema for message structure
import type { RequestHandler } from "./$types";
import { MessageSchema, type Message, type MessageData } from "$lib/types";

/**
 * Initializes and returns the database instance.
 * Reads from db.json and ensures the default structure is set.
 */
const getDb = async () => {
  const adapter = new JSONFile<MessageData>("messages.json");
  const db = new Low(adapter, { messages: [] });
  await db.read();
  db.data ||= { messages: [] }; // fallback to empty array if no data
  return db;
};

// GET /api/chat/[chatID]
// Returns all messages belonging to the specified chat ID
export const GET: RequestHandler = async ({ params }) => {
  if (!params.chatID) {
    return json({ error: "Missing chatID" }, { status: 400 });
  }

  const db = await getDb();

  // Filter messages by chatId
  const messages = db.data.messages.filter((m) => m.chatId === params.chatID);

  return json({ messages });
};

// POST /api/chat/[chatID]
// Adds a new message to the specified chat ID
export const POST: RequestHandler = async ({ request, params }) => {
  if (!params.chatID) {
    return json({ error: "Missing chatID" }, { status: 400 });
  }

  const db = await getDb();

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

  // Store the new message and persist to disk
  db.data.messages.push(newMessage);
  await db.write();

  // Return updated messages for this chat
  const updated = db.data.messages.filter((m) => m.chatId === params.chatID);
  return json({ messages: updated });
};
