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

  if (messages.length === 0 && !pending) {
    return (
      <div className="flex-1 flex items-center justify-center text-[var(--color-muted)] text-sm px-6 text-center">
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl px-6 py-6 flex flex-col gap-4">
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}
        {pending && (
          <div className="flex justify-start">
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-muted)] text-sm px-4 py-2.5 rounded-2xl rounded-bl-md">
              <span className="inline-flex gap-1">
                <span className="animate-pulse">·</span>
                <span className="animate-pulse [animation-delay:150ms]">·</span>
                <span className="animate-pulse [animation-delay:300ms]">·</span>
              </span>
            </div>
          </div>
        )}
        {error && (
          <div className="text-xs text-red-600 px-1">{error}</div>
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}
