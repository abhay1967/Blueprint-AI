
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Building, Plus, MessageSquare, Trash2, LogOut, Moon, Sun } from "lucide-react";
import { Chat } from "@/pages/App";
import { useTheme } from "@/components/theme-provider";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  chats: Chat[];
  currentChatId: string | null;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  isOpen: boolean;
}

export function Sidebar({ 
  chats, 
  currentChatId, 
  onChatSelect, 
  onNewChat, 
  onDeleteChat,
  isOpen 
}: SidebarProps) {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [hoveredChat, setHoveredChat] = useState<string | null>(null);

  const handleLogout = () => {
    navigate('/');
  };

  if (!isOpen) return null;

  return (
    <div className="w-72 bg-sidebar border-r border-sidebar-border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-black dark:bg-white p-2 rounded-lg">
            <Building className="w-5 h-5 text-white dark:text-black" />
          </div>
          <span className="font-serif font-semibold text-lg text-sidebar-foreground">
            Blueprint AI
          </span>
        </div>
        
        <Button 
          onClick={onNewChat}
          className="w-full justify-start gap-2 bg-black hover:bg-gray-800 text-white"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1 p-2">
        <AnimatePresence>
          {chats.map((chat) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="relative group mb-1"
              onMouseEnter={() => setHoveredChat(chat.id)}
              onMouseLeave={() => setHoveredChat(null)}
            >
              <Button
                variant={currentChatId === chat.id ? "secondary" : "ghost"}
                className="w-full justify-start text-left p-3 h-auto group"
                onClick={() => onChatSelect(chat.id)}
              >
                <MessageSquare className="w-4 h-4 mr-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-medium">
                    {chat.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {chat.createdAt.toLocaleDateString()}
                  </div>
                </div>
              </Button>
              
              {hoveredChat === chat.id && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-destructive hover:bg-destructive/80 text-destructive-foreground rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chat.id);
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </motion.button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="w-full justify-start gap-2"
        >
          {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-2 text-destructive hover:text-destructive"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
