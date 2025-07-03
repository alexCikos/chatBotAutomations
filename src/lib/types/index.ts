import { z } from "zod";

// 💬 Message
export const MessageSchema = z.object({
  id: z.string(),
  chatId: z.string(),
  userId: z.string(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  createdAt: z.string(),
});

export type Message = z.infer<typeof MessageSchema>;
export type MessageData = { messages: Message[] };
