
import React from "react";
import { motion } from "framer-motion";
import { SlippageSelector } from "@/components/SlippageSelector";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";

interface SwapHeaderProps {
  showSlippageMenu: boolean;
  slippage: string;
  onToggleSlippageMenu: () => void;
  onSelectSlippage: (value: string) => void;
}

export function SwapHeader({
  showSlippageMenu,
  slippage,
  onToggleSlippageMenu,
  onSelectSlippage
}: SwapHeaderProps) {
  const { theme } = useTheme();
  
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 10
    },
    visible: {
      opacity: 1,
      y: 0
    }
  };
  
  return (
    <motion.div variants={itemVariants} className="flex justify-between items-center mb-6">
      <h1 className={cn("text-2xl tracking-tighter font-medium font-['Satoshi']", theme === "dark" ? "text-white dark:text-purple-200" : "text-purple-800")}>
        AMM Swap
      </h1>
      <SlippageSelector 
        showMenu={showSlippageMenu} 
        selectedSlippage={slippage} 
        onToggleMenu={onToggleSlippageMenu} 
        onSelectSlippage={onSelectSlippage} 
      />
    </motion.div>
  );
}
