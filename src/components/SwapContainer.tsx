
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";
import { SwapHeader } from "@/components/SwapHeader";
import { SwapForm } from "@/components/SwapForm";
import { PriceChart } from "@/components/PriceChart";

interface SwapContainerProps {
  fromToken: string;
  toToken: string;
  tokens: any[];
  setFromToken: (token: string) => void;
  setToToken: (token: string) => void;
  fromAmount: string;
  toAmount: string;
  fromAmountUsd: string;
  toAmountUsd: string;
  setFromAmount: (amount: string) => void;
  setToAmount: (amount: string) => void;
  selectedPercentage: number | null;
  setSelectedPercentage: (percentage: number | null) => void;
  swapDetails: any;
  handleSwapClick: () => void;
  handleTokenSelectForSide: (side: "from" | "to") => void;
  showSlippageMenu: boolean;
  slippage: string;
  onToggleSlippageMenu: () => void;
  onSelectSlippage: (value: string) => void;
}

export function SwapContainer({
  fromToken,
  toToken,
  tokens,
  setFromToken,
  setToToken,
  fromAmount,
  toAmount,
  fromAmountUsd,
  toAmountUsd,
  setFromAmount,
  setToAmount,
  selectedPercentage,
  setSelectedPercentage,
  swapDetails,
  handleSwapClick,
  handleTokenSelectForSide,
  showSlippageMenu,
  slippage,
  onToggleSlippageMenu,
  onSelectSlippage
}: SwapContainerProps) {
  const { theme } = useTheme();
  
  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

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
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible" 
      className={cn(
        "p-8 mb-6 bg-card text-card-foreground rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] w-[480px] max-sm:w-[92%] relative z-10 mx-auto",
        theme === "dark" 
          ? "border border-neutral-800 dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)]" 
          : "border border-neutral-200"
      )}
    >
      <SwapHeader 
        showSlippageMenu={showSlippageMenu}
        slippage={slippage}
        onToggleSlippageMenu={onToggleSlippageMenu}
        onSelectSlippage={onSelectSlippage}
      />

      <SwapForm 
        tokens={tokens}
        fromToken={fromToken}
        toToken={toToken}
        setFromToken={setFromToken}
        setToToken={setToToken}
        fromAmount={fromAmount}
        toAmount={toAmount}
        fromAmountUsd={fromAmountUsd}
        toAmountUsd={toAmountUsd}
        setFromAmount={setFromAmount}
        setToAmount={setToAmount}
        selectedPercentage={selectedPercentage}
        setSelectedPercentage={setSelectedPercentage}
        swapDetails={swapDetails}
        onSwapClick={handleSwapClick}
        onTokenSelect={handleTokenSelectForSide}
      />

      <motion.div variants={itemVariants} className="mb-6">
        <PriceChart fromToken={fromToken} toToken={toToken} />
      </motion.div>
    </motion.div>
  );
}
