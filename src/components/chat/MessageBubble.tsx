// MessageBubble.tsx
import * as React from "react";
import { Message } from "@/pages/App";
import { Bot, User, ClipboardCheck, Check } from "lucide-react";
import { useState } from "react";
import { decodeUnicode, extractOutput } from "@/utils/decodeUnicode";
import { formatMessage } from "./formatMessage";

function CopyButton({
  content,
  position,
}: {
  content: string;
  position?: "top" | "bottom";
}) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  const posClass =
    position === "bottom"
      ? "absolute bottom-2 right-2"
      : "absolute top-2 right-2";
  return (
    <button
      type="button"
      aria-label="Copy message"
      onClick={handleCopy}
      className={`${posClass} opacity-70 group-hover:opacity-100 focus:opacity-100 transition-opacity bg-white/80 dark:bg-slate-800/80 rounded-full p-1 shadow hover:bg-white dark:hover:bg-slate-700`}
      tabIndex={0}
      style={{ zIndex: 2 }}
    >
      {copied ? (
        <Check size={16} className="text-green-500" />
      ) : (
        <ClipboardCheck size={16} />
      )}
    </button>
  );
}

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const { role, content } = message;
  const isUser = role === "user";

  let displayContent = isUser ? content : decodeUnicode(extractOutput(content));

  // Filter out lines that are just 'data:' or 'data' or empty
  if (
    !displayContent ||
    displayContent.trim() === "data:" ||
    displayContent.trim() === "data"
  ) {
    return null;
  }

  // If assistant message is JSON with agent_name and output, render both
  if (!isUser) {
    try {
      const maybeObj = JSON.parse(content);
      if (
        maybeObj &&
        typeof maybeObj === "object" &&
        maybeObj.agent_name &&
        maybeObj.output
      ) {
        return (
          <div className="w-full flex my-4 px-4 justify-start">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-2">
              <Bot size={20} />
            </div>
            <div className="relative group rounded-2xl px-4 py-3 pr-8 shadow-md border text-base whitespace-pre-wrap break-words min-w-0 bg-muted/60 text-foreground mr-auto w-full">
              <div className="mb-1 text-base font-bold text-blue-700">
                {maybeObj.agent_name}
              </div>
              <div className="mt-2 whitespace-pre-line">{maybeObj.output}</div>
            </div>
          </div>
        );
      }
    } catch {}
    // fallback: show plain string if not JSON
    if (typeof content === "string" && content.trim() !== "") {
      return (
        <div className="w-full flex my-4 px-4 justify-start">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-2">
            <Bot size={20} />
          </div>
          <div className="relative group rounded-2xl px-4 py-3 pr-8 shadow-md border text-base whitespace-pre-wrap break-words min-w-0 bg-muted/60 text-foreground mr-auto w-full">
            <div className="mb-1 text-base font-bold text-blue-700">
              {content}
            </div>
          </div>
        </div>
      );
    }
  }

  const isError =
    displayContent.startsWith("FATAL_ERROR") ||
    displayContent.startsWith("STREAM_ERROR");

  return (
    <div
      className={`w-full flex my-4 px-4 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-2">
          <Bot size={20} />
        </div>
      )}
      {/* Message Bubble */}
      <div
        className={`relative group rounded-2xl px-4 py-3 pr-8 shadow-md border text-base whitespace-pre-wrap break-words min-w-0
          ${
            isUser
              ? "bg-primary text-primary-foreground ml-auto max-w-[75%]"
              : "bg-muted/60 text-foreground mr-auto w-full"
          }
        `}
        style={{ wordBreak: "break-word" }}
      >
        {/* Copy Button */}
        {!isUser && <CopyButton content={displayContent} position="bottom" />}

        {/* Message Content */}
        {isError ? (
          <div className="text-red-600 font-semibold flex items-center gap-2">
            <span>⚠️</span>
            <span>{displayContent}</span>
          </div>
        ) : (
          formatMessage(displayContent).map((part, idx) => (
            <React.Fragment key={idx}>{part}</React.Fragment>
          ))
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center ml-2">
          <User size={20} />
        </div>
      )}
    </div>
  );
};
