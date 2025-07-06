import { z } from "zod";

// 💬 Message schema definition for runtime validation and TypeScript inference
export const MessageSchema = z.object({
  id: z.string(), // Unique identifier for the message
  chatId: z.string(), // Associated chat session ID
  userId: z.string(), // ID of the user who sent the message
  role: z.enum(["user", "assistant"]), // Role of sender (user or assistant)
  content: z.string(), // Message content as plain text
  createdAt: z.string(), // ISO 8601 timestamp of message creation
});

// Inferred TypeScript type based on schema
export type Message = z.infer<typeof MessageSchema>;

// Top-level data shape used in local JSON DB (lowdb)
export type MessageData = {
  messages: Message[]; // Array of messages
};

// Chat schema definition for runtime validation and TypeScript inference
export const ChatSchema = z.object({
  id: z.string(), // Unique identifier for the chat
  userId: z.string(), // ID of the user who owns the chat
  title: z.string(), // Title of the chat session
  createdAt: z.string(), // ISO 8601 timestamp of chat creation
});

// Inferred TypeScript type based on schema
export type Chat = z.infer<typeof ChatSchema>;

// Top-level data shape used in local JSON DB (lowdb)
export type ChatData = {
  chats: Chat[]; // Array of chats
};

// Chat schema definition for runtime validation and TypeScript inference
export const UserSchema = z.object({
  id: z.string(), // Unique identifier for the chat
  name: z.string(), // ID of the user who owns the chat
  createdAt: z.string(), // ISO 8601 timestamp of chat creation
});

// Inferred TypeScript type based on schema
export type User = z.infer<typeof UserSchema>;

// Top-level data shape used in local JSON DB (lowdb)
export type UsersData = {
  users: User[]; // Array of chats
};
