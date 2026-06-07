import { useRef, useState, type KeyboardEvent } from "react";

type Props = {
  disabled: boolean;
  onSubmit: (content: string) => void;
};

export default function ChatComposer({ disabled, onSubmit }: Props) {
  const [value, setValue] = useState("");
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  function resize() {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
  }

  function submit() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue("");
    requestAnimationFrame(resize);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="border-t border-blue-200 bg-gradient-to-r from-blue-50 to-yellow-50 shadow-lg">
      <div className="mx-auto max-w-3xl px-6 py-4">
        <div className="flex items-end gap-3 rounded-xl border-2 border-blue-300 bg-white focus-within:border-blue-500 focus-within:shadow-lg transition-all px-4 py-3">
          <textarea
            ref={taRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              resize();
            }}
            onKeyDown={onKeyDown}
            placeholder="Ask me anything about your data…"
            rows={1}
            className="flex-1 resize-none bg-transparent outline-none text-sm leading-relaxed py-1.5 placeholder:text-gray-400 text-gray-800"
          />
          <button
            type="button"
            onClick={submit}
            disabled={disabled || value.trim().length === 0}
            className="shrink-0 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold px-4 py-2.5 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-500 disabled:cursor-not-allowed transition-all hover:shadow-md active:scale-95"
          >
            Send
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
