import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TokenSelector } from "@/components/TokenSelector";
import { SwapArrow } from "@/components/SwapArrow";
import { AmountInput } from "@/components/AmountInput";
import { PercentageSelector } from "@/components/PercentageSelector";
import { useToast } from "@/hooks/use-toast";
import { Token, SwapDetails } from "@/types/token";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";
interface SwapFormProps {
  tokens: Token[];
  fromToken: string;
  toToken: string;
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
  swapDetails: SwapDetails;
  onSwapClick: () => void;
  onTokenSelect: (side: "from" | "to") => void;
}
export function SwapForm({
  tokens,
  fromToken,
  toToken,
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
  onSwapClick,
  onTokenSelect
}: SwapFormProps) {
  const {
    toast
  } = useToast();
  const {
    theme
  } = useTheme();
  const [exceedsBalance, setExceedsBalance] = useState(false);
  useEffect(() => {
    if (!fromAmount) {
      setExceedsBalance(false);
      return;
    }
    const fromTokenData = tokens.find(t => t.symbol === fromToken);
    if (fromTokenData) {
      const balance = parseFloat(fromTokenData.balance.replace(/,/g, ""));
      const amount = parseFloat(fromAmount);
      setExceedsBalance(amount > balance);
    }
  }, [fromAmount, fromToken, tokens]);
  const handleSwapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
    setSelectedPercentage(null);
  };
  const handlePercentageSelect = (percentage: number) => {
    setSelectedPercentage(percentage);
    const fromTokenData = tokens.find(t => t.symbol === fromToken);
    if (fromTokenData) {
      const balance = parseFloat(fromTokenData.balance.replace(/,/g, ""));
      const amount = (balance * percentage / 100).toFixed(fromToken === "ETH" || fromToken === "BTC" ? 4 : 2);
      setFromAmount(amount);
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
  const selectedFromToken = tokens.find(t => t.symbol === fromToken);
  const selectedToToken = tokens.find(t => t.symbol === toToken);
  return <>
      <motion.div variants={itemVariants} className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-muted-foreground font-medium tracking-wide font-['Satoshi']">Spend</span>
          {tokens.find(t => t.symbol === fromToken) && <span className="text-sm text-muted-foreground font-['Satoshi']">
              <span>Balance: </span>
              <span className="text-foreground font-medium">
                {tokens.find(t => t.symbol === fromToken)?.balance}
              </span>
            </span>}
        </div>
        <div className={cn("p-4 rounded-2xl bg-muted focus-within:ring-2 focus-within:ring-opacity-50 transition-all duration-300", exceedsBalance ? "ring-2 ring-red-500 ring-opacity-50 focus-within:ring-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]" : "focus-within:ring-purple-500 hover:shadow-[0_0_15px_rgba(147,51,234,0.2)]")}>
          <div className="flex gap-4 items-center">
            <button className="flex gap-2 items-center px-3 py-2 bg-card rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)] transition-all duration-300 hover:shadow-[0_2px_12px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_2px_12px_rgba(0,0,0,0.3)]" onClick={() => onTokenSelect("from")}>
              {selectedFromToken?.icon ? <img src={selectedFromToken.icon} alt={fromToken} className="w-5 h-5 rounded-full" /> : <div className={cn("w-5 h-5 rounded-full flex items-center justify-center mr-1", theme === "dark" ? "bg-neutral-700 text-white" : "bg-neutral-200 text-neutral-800")}>
                  <span className="text-xs font-medium">{fromToken.substring(0, 1)}</span>
                </div>}
              <span className="text-base font-medium font-['Satoshi']">{fromToken}</span>
              <svg width="12" height="12" viewBox="0 0 12 12">
                <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            </button>
            <AmountInput value={fromAmount} onChange={setFromAmount} usdValue={fromAmountUsd} showBalanceWarning={exceedsBalance} balance={selectedFromToken?.balance} />
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="my-4">
        <PercentageSelector selectedPercentage={selectedPercentage} onSelect={handlePercentageSelect} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <SwapArrow onClick={handleSwapTokens} />
      </motion.div>

      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-muted-foreground font-medium tracking-wide font-['Satoshi']">Receive</span>
          {tokens.find(t => t.symbol === toToken) && <span className="text-sm text-muted-foreground font-['Satoshi']">
              <span>Balance: </span>
              <span className="text-foreground font-medium">
                {tokens.find(t => t.symbol === toToken)?.balance}
              </span>
            </span>}
        </div>
        <div className="p-4 rounded-2xl bg-muted focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-opacity-50 hover:shadow-[0_0_15px_rgba(147,51,234,0.2)] transition-all duration-300">
          <div className="flex gap-4 items-center">
            <button className="flex gap-2 items-center px-3 py-2 bg-card rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)] transition-all duration-300 hover:shadow-[0_2px_12px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_2px_12px_rgba(0,0,0,0.3)]" onClick={() => onTokenSelect("to")}>
              {selectedToToken?.icon ? <img src={selectedToToken.icon} alt={toToken} className="w-5 h-5 rounded-full" /> : <div className={cn("w-5 h-5 rounded-full flex items-center justify-center mr-1", theme === "dark" ? "bg-neutral-700 text-white" : "bg-neutral-200 text-neutral-800")}>
                  <span className="text-xs font-medium">{toToken.substring(0, 1)}</span>
                </div>}
              <span className="text-base font-medium font-['Satoshi']">{toToken}</span>
              <svg width="12" height="12" viewBox="0 0 12 12">
                <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            </button>
            <AmountInput value={toAmount} onChange={setToAmount} usdValue={toAmountUsd} />
          </div>
        </div>
      </motion.div>

      {fromAmount && <motion.div variants={itemVariants} className="mb-6 p-4 rounded-xl bg-accent/50 text-sm">
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground font-['Satoshi']">Network Fee:</span>
            <span className="text-foreground font-medium font-['Satoshi']">{swapDetails.networkFee}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground font-['Satoshi']">Price Impact:</span>
            <span className="text-foreground font-medium font-['Satoshi']">{swapDetails.priceImpact}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground font-['Satoshi']">Exchange Rate:</span>
            <span className="text-foreground font-medium font-['Satoshi']">{swapDetails.exchangeRate}</span>
          </div>
        </motion.div>}

      <motion.button variants={itemVariants} whileHover={{
      scale: 1.03
    }} whileTap={{
      scale: 0.98
    }} className={cn("py-4 w-full text-base font-medium text-white rounded-2xl transition-all duration-300 font-['Satoshi']", exceedsBalance ? "bg-red-500 dark:bg-red-600 cursor-not-allowed opacity-80 hover:shadow-[0_8px_16px_rgba(239,68,68,0.3)]" : "bg-purple-600 dark:bg-purple-700 hover:shadow-[0_8px_16px_rgba(147,51,234,0.3)] dark:hover:shadow-[0_8px_16px_rgba(147,51,234,0.2)]", "mb-6")} onClick={onSwapClick} disabled={!fromAmount || parseFloat(fromAmount) === 0 || exceedsBalance}>
        {exceedsBalance ? "Insufficient Balance" : "Swap"}
      </motion.button>
    </>;
}