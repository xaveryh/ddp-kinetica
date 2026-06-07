import { useEffect, useRef } from "react";
import type { Message } from "../lib/api";
import ChatMessage from "./ChatMessage";

type Props = {
  messages: Message[];
  pending: boolean;
  error: string | null;
};

export default function ChatThread({ messages, pending, error }: Props) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, pending]);

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-blue-50 to-yellow-50">
      <div className="mx-auto max-w-3xl px-6 py-6 flex flex-col gap-4">
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}
        {pending && (
          <div className="flex justify-start">
            <div className="bg-blue-100 border-2 border-blue-300 text-blue-700 text-sm px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
              <span className="inline-flex gap-1 font-medium">
                <span className="animate-pulse">●</span>
                <span className="animate-pulse [animation-delay:150ms]">●</span>
                <span className="animate-pulse [animation-delay:300ms]">●</span>
              </span>
            </div>
          </div>
        )}
        {error && (
          <div className="text-sm text-red-600 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
            <span className="font-semibold">Error:</span> {error}
          </div>
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}
