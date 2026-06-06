import { useState } from "react";
import ChatThread from "../components/ChatThread";
import ChatComposer from "../components/ChatComposer";
import { postChat, type Message } from "../lib/api";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send(content: string) {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setPending(true);
    setError(null);
    try {
      const reply = await postChat(content);
      setMessages((prev) => [...prev, reply]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3">
        <h1 className="text-sm font-semibold">Chat</h1>
      </header>
      <ChatThread messages={messages} pending={pending} error={error} />
      <ChatComposer disabled={pending} onSubmit={send} />
    </>
  );
}
