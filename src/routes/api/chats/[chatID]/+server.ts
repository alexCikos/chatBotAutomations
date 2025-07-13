import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

// Import Cosmos DB functions
import { getChatById, updateChat, deleteChat, getMessagesByChatId, deleteMessage } from "$lib/server/cosmos";

export const PUT: RequestHandler = async ({ params, request }) => {
  const chatID = params.chatID;
  if (!chatID) return json({ error: "Missing chatID" }, { status: 400 });

  const body = await request.json();
  const { title, description, userId } = body;

  if (!title || typeof title !== "string" || !title.trim()) {
    return json({ error: "Title is required and must be a non-empty string" }, { status: 400 });
  }

  if (!userId || typeof userId !== "string") {
    return json({ error: "UserId is required" }, { status: 400 });
  }

  try {
    // Get the existing chat
    const existingChat = await getChatById(chatID, userId);
    
    if (!existingChat) {
      return json({ error: "Chat not found" }, { status: 404 });
    }

    // Update the chat with new title and description
    const updatedChat = {
      ...existingChat,
      title: title.trim(),
      description: description?.trim() || undefined,
      updatedAt: new Date().toISOString()
    };
    
    const result = await updateChat(updatedChat);

    return json({
      success: true,
      chat: result,
    });
  } catch (error) {
    console.error("Error updating chat:", error);
    return json({ error: "Failed to update chat" }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ params, url }) => {
  const chatID = params.chatID;
  if (!chatID) return json({ error: "Missing chatID" }, { status: 400 });

  const userId = url.searchParams.get("userId");
  if (!userId) return json({ error: "Missing userId parameter" }, { status: 400 });

  try {
    // First verify the chat exists
    const existingChat = await getChatById(chatID, userId);
    if (!existingChat) {
      return json({ error: "Chat not found" }, { status: 404 });
    }

    // Get all messages for this chat to delete them
    const messages = await getMessagesByChatId(chatID);
    let deletedMessages = 0;

    // Delete all messages for this chat
    for (const message of messages) {
      try {
        await deleteMessage(message.id, chatID);
        deletedMessages++;
      } catch (error) {
        console.error(`Failed to delete message ${message.id}:`, error);
      }
    }

    // Delete the chat
    await deleteChat(chatID, userId);

    return json({
      success: true,
      deletedChatId: chatID,
      deletedMessages,
    });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return json({ error: "Failed to delete chat" }, { status: 500 });
  }
};
