import { writable } from 'svelte/store';
import { z } from 'zod';

export const MessageSchema = z.object({
  id: z.string(),
  chatId: z.string(),
  userId: z.string(),
  role: z.enum(['user', 'assistant']),
  content: z.string(),
  createdAt: z.string(),
});

export type Message = z.infer<typeof MessageSchema>;

export const messages = writable<Message[]>([]);

export async function sendMessage(input: string, chatId: string, userId: string) {
  const userMessage = MessageSchema.parse({
    id: crypto.randomUUID(),
    chatId,
    userId,
    role: 'user' as const,
    content: input,
    createdAt: new Date().toISOString(),
  });

  const response = await fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userMessage),
  });

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    data = { message: '' };
  }

  const assistantContent = (data as { message?: string }).message ?? '';
  const assistantMessage = MessageSchema.parse({
    id: crypto.randomUUID(),
    chatId,
    userId,
    role: 'assistant' as const,
    content: assistantContent,
    createdAt: new Date().toISOString(),
  });

  messages.update((m) => [...m, userMessage, assistantMessage]);
}

