
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn(
        "rounded-full shadow-md",
        "dark:bg-black dark:border-purple-900/50 dark:hover:bg-purple-950/30",
        "bg-white/90 backdrop-blur-sm border border-purple-200 hover:bg-purple-50/70",
        className
      )}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.2 }}
        key={theme === "dark" ? "moon" : "sun"}
      >
        {theme === "dark" ? (
          <Sun className="h-[1.2rem] w-[1.2rem] text-purple-300" />
        ) : (
          <Moon className="h-[1.2rem] w-[1.2rem] text-purple-700" />
        )}
      </motion.div>
    </Button>
  );
}
