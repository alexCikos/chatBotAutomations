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
  description: z.string().optional(), // Optional description of the chat
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

// Tool schema definition for runtime validation and TypeScript inference
export const ToolSchema = z.object({
  userId: z.string(), // ID of the user who owns the tool
  toolId: z.string(), // Unique identifier for the tool
  toolName: z.string(), // Name of the tool
  toolDescription: z.string(), // Short description of what the tool does
  azureLogicAppEndpoint: z.string(), // Endpoint URL for the associated Azure Logic App
});

// Inferred TypeScript type based on schema
export type Tool = z.infer<typeof ToolSchema>;

// Top-level data shape used in local JSON DB (lowdb)
export type ToolData = {
  tools: Tool[]; // Array of tools
};

// API request/response schemas for tool execution
export const ToolExecuteRequestSchema = z.object({
  userId: z.string(),
  toolId: z.string(),
  input: z.string(),
});

export const ToolExecuteResponseSchema = z.object({
  success: z.boolean(),
  result: z.any().optional(),
  toolName: z.string().optional(),
  error: z.string().optional(),
});

export type ToolExecuteRequest = z.infer<typeof ToolExecuteRequestSchema>;
export type ToolExecuteResponse = z.infer<typeof ToolExecuteResponseSchema>;
