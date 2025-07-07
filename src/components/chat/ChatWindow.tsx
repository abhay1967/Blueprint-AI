import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { cleanAgentOutput } from "./cleanAgentOutput";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import { Menu, Send, Sparkles, User } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { Message } from "@/pages/App";
import { TypingIndicator } from "./TypingIndicator";
import { motion } from "framer-motion";
import { StopCircleIcon } from "@heroicons/react/24/solid";

type Chat = {
  id: string;
  messages: Message[];
  createdAt: Date;
  title: string;
};

interface ChatWindowProps {
  chat?: Chat;
  isTyping: boolean;
  onSendMessage: (content: string) => void;
  onStopStreaming: () => void;
  onNewChat: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isStreaming: boolean;
}

export function ChatWindow({
  chat,
  isTyping,
  onSendMessage,
  onStopStreaming,
  onNewChat,
  sidebarOpen,
  setSidebarOpen,
  isStreaming,
}: ChatWindowProps) {
  console.log('[ChatWindow] render: isStreaming', isStreaming, 'isTyping', isTyping);
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat?.messages, isTyping]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isTyping || isStreaming) return;
    onSendMessage(input.trim());
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleStop = () => {
    console.log('[ChatWindow] handleStop called');
    onStopStreaming();
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <div className="flex flex-col justify-between w-full h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between w-full px-0 py-2 border-b border-border">
        <div className="flex items-center gap-2 flex-shrink-0 pl-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-0 mr-2"
            aria-label="Open sidebar"
          >
            <Menu className="w-6 h-6" />
          </Button>
          <span className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full w-9 h-9 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <span className="font-semibold text-lg">Blueprint AI</span>
          </span>
        </div>
        <div className="flex-grow" />
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full flex-shrink-0 mr-4"
          aria-label="User Profile"
        >
          <User className="w-6 h-6" />
        </Button>
      </div>

      {/* Chat content */}
      <div className="flex-1 overflow-y-auto px-4" ref={scrollAreaRef}>
        <div className="max-w-2xl mx-auto py-4">
          {!chat || chat.messages.length === 0 ? (
            <div className="flex flex-1 items-center justify-center min-h-[60vh] h-full">
              <motion.div
                className="text-center max-w-md mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Welcome to Blueprint AI
                </h3>
                <p className="text-muted-foreground">
                  Describe your product or feature idea, and I'll help you
                  create a scalable system architecture.
                </p>
              </motion.div>
            </div>
          ) : (
            <>
              {chat.messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isTyping && (
                <div className="flex justify-start w-full mt-2">
                  <TypingIndicator />
                </div>
              )}
              <div ref={scrollRef} />
            </>
          )}
        </div>
      </div>

      {/* Input bar */}
      <div className="sticky bottom-0 z-10 w-full bg-background border-t border-border pt-2 pb-4 px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl mx-auto flex items-center gap-2"
        >
          <div className="w-full shadow-lg rounded-2xl bg-white dark:bg-muted border border-border flex items-center px-4 py-2 transition-all focus-within:ring-2 focus-within:ring-primary">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full text-base min-h-[48px] max-h-32 resize-none rounded-xl pr-20 focus:outline-none bg-transparent"
              rows={1}
            />
            {isTyping || isStreaming ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleStop}
                className="text-red-500 hover:bg-red-100 hover:text-red-700"
              >
                <StopCircleIcon className="h-6 w-6" />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="default"
                size="icon"
                disabled={!input.trim()}
                className="ml-2"
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
