import { chatEmitter } from "@/app/lib/chat-events";
import { NextRequest, NextResponse } from "next/server";
export async function GET(request:NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const user_id = searchParams.get("user_id")
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const onMessage = (data: any) => {
        const message = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };
      chatEmitter.on("newMessage"+user_id, onMessage);
      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(": heartbeat\n\n"));
      },1000);
      const cleanup = () => {
        clearInterval(heartbeat);
        chatEmitter.off("newMessage"+user_id, onMessage);
      };
      request.signal.addEventListener("abort", () => {
        console.log(`User ${user_id} disconnected`);
        cleanup();
      });
    },
  });
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
