import type { Message } from "../lib/api";

export default function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words shadow-md",
          isUser
            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md font-medium"
            : "bg-white border-2 border-blue-200 text-gray-800 rounded-bl-md hover:shadow-lg transition-shadow",
        ].join(" ")}
      >
        {message.content}
      </div>
    </div>
  );
}
