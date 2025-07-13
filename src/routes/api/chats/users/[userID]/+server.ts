// Import SvelteKit's JSON response utility
import { json } from "@sveltejs/kit";

// Import types and validation schema for chat structure
import type { RequestHandler } from "./$types";
import { ChatSchema, type Chat } from "$lib/types";

// Import Cosmos DB functions
import { getChatsByUserId, createChat } from "$lib/server/cosmos";

// GET /chats/user/[userID]
// Returns all chats belonging to the specified user ID
export const GET: RequestHandler = async ({ params }) => {
  if (!params.userID) {
    return json({ error: "Missing userID" }, { status: 400 });
  }

  try {
    const chats = await getChatsByUserId(params.userID);
    return json({ chats });
  } catch (error) {
    console.error("Error fetching chats:", error);
    return json({ error: "Failed to fetch chats" }, { status: 500 });
  }
};

// POST /chats/user/[userID]
// Creates a new chat for the specified user ID
export const POST: RequestHandler = async ({ request, params }) => {
  if (!params.userID) {
    return json({ error: "Missing userID" }, { status: 400 });
  }

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
        error: "userId mismatch",
        expected: params.userID,
        received: newChat.userId,
      },
      { status: 400 }
    );
  }

  try {
    const createdChat = await createChat(newChat);
    return json({ chat: createdChat });
  } catch (error) {
    console.error("Error creating chat:", error);
    return json({ error: "Failed to create chat" }, { status: 500 });
  }
};
