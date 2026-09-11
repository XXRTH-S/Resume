import { createChatHandler } from '../../../server/chat-handler.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

let handler: ReturnType<typeof createChatHandler> | undefined;
export async function POST(request: Request) {
  handler ??= createChatHandler();
  return handler(request);
}
