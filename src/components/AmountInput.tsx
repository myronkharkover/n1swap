
import React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";
import { AlertCircle } from "lucide-react";

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  usdValue?: string;
  balance?: string;
  showBalanceWarning?: boolean;
}

export function AmountInput({ 
  value, 
  onChange, 
  placeholder = "0.0", 
  usdValue,
  balance,
  showBalanceWarning = false
}: AmountInputProps) {
  const { theme } = useTheme();

  return (
    <div className="flex-1 flex flex-col">
      <input
        type="text"
        placeholder={placeholder}
        className={cn(
          "w-full text-2xl bg-transparent focus:outline-none font-['Satoshi']",
          "text-foreground placeholder:text-muted-foreground",
          value ? "text-foreground font-medium" : "",
          theme === "dark" ? "text-white placeholder:text-neutral-500" : "text-neutral-900 placeholder:text-neutral-400",
          showBalanceWarning ? "focus:ring-red-500 focus:ring-opacity-50" : "focus:ring-purple-500 focus:ring-opacity-50"
        )}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
      {usdValue && (
        <span className={cn(
          "text-xs font-['Satoshi']",
          theme === "dark" ? "text-neutral-400" : "text-neutral-500"
        )}>
          ≈ ${usdValue}
        </span>
      )}
      
      {showBalanceWarning && (
        <div className={cn(
          "flex items-center gap-1 mt-1 text-xs font-['Satoshi']",
          "text-red-500 dark:text-red-400"
        )}>
          <AlertCircle size={12} />
          <span>Insufficient balance</span>
        </div>
      )}
    </div>
  );
}
