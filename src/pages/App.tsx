import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { Sidebar } from "@/components/chat/Sidebar";
import { auth } from "../firebase";
import { toast } from "@/hooks/use-toast";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type Chat = {
  id: string;
  messages: Message[];
  createdAt: Date;
  title: string;
};

export default function App() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const [user, setUser] = useState<any>(null); // Track authenticated user
  const abortControllerRef = useRef<AbortController | null>(null);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // Debug: log isTyping state changes
  useEffect(() => {
    console.log("[App] isTyping changed:", isTyping);
  }, [isTyping]);
  // Debug: log isStreaming state changes
  useEffect(() => {
    console.log("[App] isStreaming changed:", isStreaming);
  }, [isStreaming]);

  console.log("[App] render: isStreaming", isStreaming, "isTyping", isTyping);

  // Fetch chats from backend on mount
  useEffect(() => {
    const fetchChats = async () => {
      if (!user) {
        toast({ title: "Not authenticated", description: "Please log in first.", variant: "destructive" });
        return;
      }
      try {
        setIsTyping(true);
        const token = await user.getIdToken();
        console.log("[fetchChats] JWT token:", token);
        const res = await fetch("/chats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch chats");
        const data = await res.json();
        setChats(
          data.map((chat: any) => ({
            ...chat,
            createdAt: chat.created_at ? new Date(chat.created_at) : new Date(),
            messages: chat.messages || [],
          }))
        );
        toast({ title: "Chats loaded", variant: "default" });
      } catch (e: any) {
        toast({ title: "Failed to load chats", description: e.message, variant: "destructive" });
      } finally {
        setIsTyping(false);
      }
    };
    fetchChats();
    // eslint-disable-next-line
  }, [user]);

  // Optionally keep localStorage for offline, but main source is backend now
  useEffect(() => {
    localStorage.setItem("streamed-chats", JSON.stringify(chats));
  }, [chats]);

  const currentChat = chats.find((c) => c.id === currentChatId);

  const onSendMessage = async (content: string) => {
    console.log("[App] onSendMessage called, content:", content);
    let chatId = currentChatId;
    const isNewChat = !chatId;

    if (isNewChat) {
      chatId = uuidv4();
      const newChat: Chat = {
        id: chatId,
        messages: [],
        createdAt: new Date(),
        title: content.slice(0, 30) || "New Chat",
      };
      setChats((prev) => [newChat, ...prev]);
      setCurrentChatId(chatId);
    }

    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content,
    };

    const assistantId = uuidv4();

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                userMessage,
                { id: assistantId, role: "assistant", content: "" },
              ],
            }
          : chat
      )
    );

    console.log("[App] setIsTyping(true)");
    setIsTyping(true);

    try {
      abortControllerRef.current = new AbortController();
      const response = await fetch("/api/generate-architecture-stream/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_idea: content }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split(/\r?\n/);
        buffer = lines.pop() || "";

        // Track how many agent packets we've received
        if (typeof agentCount === "undefined") {
          var agentCount = 0;
        }

        for (const line of lines) {
          const trimmed = line.trim();

          // ⛔️ Skip noise or ping
          if (
            !trimmed ||
            trimmed === "data:" ||
            trimmed === "data: ping" ||
            trimmed.startsWith(": ping")
          ) {
            continue;
          }

          // ✅ Handle STREAM_END
          if (trimmed === "data: STREAM_END") {
            setIsTyping(false);
            setIsStreaming(false);
            console.log(
              "STREAM_END: setIsTyping(false), setIsStreaming(false)"
            );
            break;
          }

          const jsonStr = trimmed
            .replace(/^data:\s*/, "")
            .replace(/^data:/, "");
          // Only parse if it looks like JSON
          if (jsonStr === "STREAM_END" || !jsonStr.trim().startsWith("{")) {
            continue;
          }
          try {
            const parsed = JSON.parse(jsonStr);
            const agentName = parsed.agent_name?.trim();
            const output = parsed.output?.trim();
            console.log("Received agentName:", agentName, parsed); // Debug log
            if (agentName && output && output.length > 0) {
              setChats((prev) =>
                prev.map((chat) =>
                  chat.id === chatId
                    ? {
                        ...chat,
                        messages: [
                          ...chat.messages,
                          {
                            id: uuidv4(),
                            role: "assistant",
                            content: JSON.stringify({
                              agent_name: agentName,
                              output,
                            }),
                          },
                        ],
                      }
                    : chat
                )
              );
              agentCount++;
              if (agentCount === 7) {
                console.log("Received 7 agent packets, stopping stream");
                setIsTyping(false);
                setIsStreaming(false);
                if (abortControllerRef.current) {
                  abortControllerRef.current.abort();
                  abortControllerRef.current = null;
                }
                break;
              }
            }
          } catch (e) {
            console.log("Failed to parse chunk:", jsonStr, e); // Debug log
          }
        }
      }
    } catch (err) {
      console.error("Stream error:", err);
      if (
        err &&
        typeof err === "object" &&
        (err as any).name === "AbortError"
      ) {
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: [
                    ...chat.messages,
                    {
                      id: uuidv4(),
                      role: "assistant",
                      content: "⏹️ Streaming Ended",
                    },
                  ],
                }
              : chat
          )
        );
      } else {
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: [
                    ...chat.messages,
                    {
                      id: uuidv4(),
                      role: "assistant",
                      content:
                        "❌ **Error:** Something went wrong while streaming response.",
                    },
                  ],
                }
              : chat
          )
        );
      }
    } finally {
      setIsTyping(false);
      setIsStreaming(false);
      abortControllerRef.current = null;
      console.log("FINALLY: setIsTyping(false), setIsStreaming(false)");
      // Save chat to backend after message is sent
      try {
        if (user) {
          const token = await user.getIdToken();
          console.log("[onSendMessage] JWT token:", token);
          const chatToSave = chats.find((c) => c.id === chatId);
          if (chatToSave) {
            const res = await fetch("/chat/save", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                chat_id: chatToSave.id,
                title: chatToSave.title,
                messages: chatToSave.messages,
              }),
            });
            if (!res.ok) throw new Error("Failed to save chat");
            toast({ title: "Chat saved!", variant: "default" });
          }
        }
      } catch (e: any) {
        toast({ title: "Failed to save chat", description: e.message, variant: "destructive" });
      }
    }
  };



  const onStopStreaming = () => {
    console.log("[App] onStopStreaming called");
    setIsTyping(false);
    setIsStreaming(false);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const onNewChat = () => {
    const newChatId = uuidv4();
    const newChat: Chat = {
      id: newChatId,
      messages: [],
      createdAt: new Date(),
      title: "New Chat",
    };
    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(newChatId);
    setIsTyping(false);
  };

  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const onDeleteChat = async (id: string) => {
    if (!auth.currentUser) return;
    setIsDeleting(id);
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(`/chat/${id}/delete`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete chat");
      setChats((prev) => prev.filter((chat) => chat.id !== id));
      if (currentChatId === id) setCurrentChatId(null);
      toast({ title: "Chat deleted", variant: "default" });
    } catch (e: any) {
      toast({ title: "Failed to delete chat", description: e.message, variant: "destructive" });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-background text-foreground">
      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        onChatSelect={setCurrentChatId}
        onNewChat={onNewChat}
        onDeleteChat={onDeleteChat}
        isOpen={sidebarOpen}
      />
      <div className="flex-1 overflow-hidden">
        <ChatWindow
          chat={currentChat}
          isTyping={isTyping}
          onSendMessage={onSendMessage}
          onStopStreaming={onStopStreaming}
          onNewChat={onNewChat}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isStreaming={isStreaming}
        />
      </div>
    </div>
  );
}
