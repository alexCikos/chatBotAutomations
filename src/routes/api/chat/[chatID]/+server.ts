import { JSONFile } from "lowdb/node";
import { Low } from "lowdb";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

import { MessageSchema, type Message, type MessageData } from "$lib/types";

const getDb = async () => {
  const adapter = new JSONFile<MessageData>("db.json");
  const db = new Low(adapter, { messages: [] });
  await db.read();
  db.data ||= { messages: [] };
  return db;
};

// GET /api/chat/[chatID]
export const GET: RequestHandler = async ({ params }) => {
  if (!params.chatID) {
    return json({ error: "Missing chatID" }, { status: 400 });
  }

  const db = await getDb();
  const messages = db.data.messages.filter((m) => m.chatId === params.chatID);
  return json({ messages });
};

// POST /api/chat/[chatID]
export const POST: RequestHandler = async ({ request, params }) => {
  if (!params.chatID) {
    return json({ error: "Missing chatID" }, { status: 400 });
  }

  const db = await getDb();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = MessageSchema.safeParse(body);
  if (!result.success) {
    return json(
      { error: "Invalid message format", issues: result.error.issues },
      { status: 400 }
    );
  }

  const newMessage = result.data;

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

  db.data.messages.push(newMessage);
  await db.write();

  const updated = db.data.messages.filter((m) => m.chatId === params.chatID);
  return json({ messages: updated });
};
