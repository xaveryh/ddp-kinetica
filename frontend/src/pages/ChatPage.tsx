import { useState } from "react";
import ChatThread from "../components/ChatThread";
import ChatComposer from "../components/ChatComposer";
import { postChat, type Message } from "../lib/api";

const guides = [
  {
    icon: "📊",
    title: "Analyze Data",
    description: "Ask questions about your data and get instant insights",
  },
  {
    icon: "🔍",
    title: "Search Records",
    description: "Find specific information in your database",
  },
  {
    icon: "📈",
    title: "Get Trends",
    description: "Discover patterns and trends in your data",
  },
  {
    icon: "💡",
    title: "Smart Suggestions",
    description: "Receive intelligent recommendations and advice",
  },
];

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
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-yellow-50">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-yellow-400 animate-pulse"></div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent">
            Smart Chat Assistant
          </h1>
        </div>
      </header>
      
      {messages.length === 0 && !pending && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome to Your AI Assistant
            </h2>
            <p className="text-gray-500 text-lg">
              Start a conversation to explore your data
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mb-8">
            {guides.map((guide, idx) => (
              <div
                key={idx}
                className="guide-card p-4 rounded-2xl border border-blue-200 bg-white hover:shadow-lg hover:border-blue-400 transition-all duration-300 cursor-pointer group"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className="guide-icon bg-gradient-to-br from-blue-100 to-yellow-100 group-hover:from-blue-200 group-hover:to-yellow-200 transition-colors">
                    {guide.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {guide.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {guide.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              💡 <span className="font-medium">Pro tip:</span> Be specific with your questions for better results
            </p>
          </div>
        </div>
      )}
      
      {messages.length > 0 && (
        <ChatThread messages={messages} pending={pending} error={error} />
      )}
      
      <ChatComposer disabled={pending} onSubmit={send} />
    </div>
  );
}
