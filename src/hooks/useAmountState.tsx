
import { useState } from "react";
import { Token } from "@/types/token";

export function useAmountState(
  fromToken: string,
  tokens: Token[],
  setFromAmount: (amount: string) => void
) {
  const [selectedPercentage, setSelectedPercentage] = useState<number | null>(null);

  const handlePercentageSelect = (percentage: number) => {
    setSelectedPercentage(percentage);
    const fromTokenData = tokens.find(t => t.symbol === fromToken);
    if (fromTokenData) {
      const balance = parseFloat(fromTokenData.balance.replace(/,/g, ""));
      const amount = (balance * percentage / 100).toFixed(fromToken === "ETH" || fromToken === "BTC" ? 4 : 2);
      setFromAmount(amount);
    }
  };

  return {
    selectedPercentage,
    setSelectedPercentage,
    handlePercentageSelect
  };
}
