
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-4"
    >
      <div className="bg-primary/10 p-2 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
        <Sparkles className="w-4 h-4 text-primary" />
      </div>
      
      <div className="bg-white dark:bg-slate-800 border p-4 rounded-2xl shadow-sm">
        <div className="flex gap-1 items-center">
          <div className="text-muted-foreground text-sm mr-2">Blueprint AI is thinking</div>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
