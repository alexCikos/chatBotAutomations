// Import LowDB adapter and database engine for file-based JSON storage
import { JSONFile } from "lowdb/node";
import { Low } from "lowdb";

// Import SvelteKit's JSON response utility
import { json } from "@sveltejs/kit";

// Import types and validation schema for message structure
import type { RequestHandler } from "./$types";
import { ChatSchema, type Chat, type ChatData } from "$lib/types";

/**
 * Initializes and returns the database instance.
 * Reads from db.json and ensures the default structure is set.
 */
const getDb = async () => {
  const adapter = new JSONFile<ChatData>("chats.json");
  const db = new Low(adapter, { chats: [] });
  await db.read();
  db.data ||= { chats: [] }; // fallback to empty array if no data
  return db;
};

// GET /chats/user/[userID]
// Returns all messages belonging to the specified chat ID
export const GET: RequestHandler = async ({ params }) => {
  if (!params.userID) {
    return json({ error: "Missing userID" }, { status: 400 });
  }

  const db = await getDb();

  // Filter messages by useerId
  const chats = db.data.chats.filter((m) => m.userId === params.userID);

  return json({ chats });
};

// POST /chats/user/[userID]
// Adds a new message to the specified chat ID
export const POST: RequestHandler = async ({ request, params }) => {
  if (!params.userID) {
    return json({ error: "Missing chatID" }, { status: 400 });
  }

  const db = await getDb();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = ChatSchema.safeParse(body);
  if (!result.success) {
    return json(
      { error: "Invalid chat format", issues: result.error.issues },
      { status: 400 }
    );
  }

  const newChat = result.data;

  if (newChat.userId !== params.userID) {
    return json(
      {
        error: "chatId mismatch",
        expected: params.userID,
        received: newChat.userId,
      },
      { status: 400 }
    );
  }

  db.data.chats.push(newChat);
  await db.write();

  return json({ chat: newChat }); // ✅ just return the created chat
};
