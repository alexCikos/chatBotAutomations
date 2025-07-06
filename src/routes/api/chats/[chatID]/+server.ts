import { JSONFile } from "lowdb/node";
import { Low } from "lowdb";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import type { ChatData, MessageData } from "$lib/types";

// Load chats.json
const getChatDb = async () => {
  const adapter = new JSONFile<ChatData>("chats.json");
  const db = new Low(adapter, { chats: [] });
  await db.read();
  db.data ||= { chats: [] };
  return db;
};

// Optionally delete related messages
const getMessageDb = async () => {
  const adapter = new JSONFile<MessageData>("messages.json");
  const db = new Low(adapter, { messages: [] });
  await db.read();
  db.data ||= { messages: [] };
  return db;
};

export const DELETE: RequestHandler = async ({ params }) => {
  const chatID = params.chatID;
  if (!chatID) return json({ error: "Missing chatID" }, { status: 400 });

  const chatDb = await getChatDb();
  const msgDb = await getMessageDb();

  // Remove chat from chats.json
  const beforeCount = chatDb.data.chats.length;
  chatDb.data.chats = chatDb.data.chats.filter((c) => c.id !== chatID);
  const afterCount = chatDb.data.chats.length;

  if (beforeCount === afterCount) {
    return json({ error: "Chat not found" }, { status: 404 });
  }

  // Optional: also delete messages
  const beforeMessages = msgDb.data.messages.length;
  msgDb.data.messages = msgDb.data.messages.filter((m) => m.chatId !== chatID);
  const deletedMessages = beforeMessages - msgDb.data.messages.length;

  await chatDb.write();
  await msgDb.write();

  return json({
    success: true,
    deletedChatId: chatID,
    deletedMessages,
  });
};
