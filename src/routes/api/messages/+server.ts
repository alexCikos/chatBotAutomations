import { json, type RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';

const MessageSchema = z.object({
  id: z.string(),
  chatId: z.string(),
  userId: z.string(),
  role: z.enum(['user', 'assistant']),
  content: z.string(),
  createdAt: z.string(),
});

export type Message = z.infer<typeof MessageSchema>;

export const POST: RequestHandler = async ({ request }) => {
  let data: unknown;
  try {
    data = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const result = MessageSchema.safeParse(data);
  if (!result.success) {
    return json({ error: 'Invalid message', details: result.error.flatten() }, { status: 400 });
  }

  const message: Message = result.data;
  // TODO: store `message` in Cosmos DB

  return json({ message: 'testing' });
};
