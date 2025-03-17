
import { useState } from "react";
import { useTokenState } from "@/hooks/useTokenState";
import { useAmountState } from "@/hooks/useAmountState";
import { useSlippageSettings } from "@/hooks/useSlippageSettings";
import { useTransactionState } from "@/hooks/useTransactionState";
import { useSwapCalculation } from "@/hooks/useSwapCalculation";

export function useSwapState() {
  const [fromAmount, setFromAmount] = useState<string>("");
  
  const tokenState = useTokenState();
  const { fromToken, toToken, tokens } = tokenState;
  
  const { 
    toAmount, 
    setToAmount, 
    fromAmountUsd, 
    toAmountUsd, 
    swapDetails 
  } = useSwapCalculation(fromAmount, fromToken, toToken, tokens);
  
  const amountState = useAmountState(fromToken, tokens, setFromAmount);
  const slippageSettings = useSlippageSettings();
  const transactionState = useTransactionState(
    fromAmount,
    toAmount,
    fromToken,
    toToken,
    setFromAmount,
    setToAmount,
    amountState.setSelectedPercentage
  );

  const fromTokenFullName = tokens.find(t => t.symbol === fromToken)?.name || fromToken;
  const toTokenFullName = tokens.find(t => t.symbol === toToken)?.name || toToken;

  return {
    ...tokenState,
    fromAmount,
    toAmount,
    fromAmountUsd,
    toAmountUsd,
    setFromAmount,
    setToAmount,
    ...amountState,
    ...slippageSettings,
    ...transactionState,
    swapDetails,
    fromTokenFullName,
    toTokenFullName
  };
}
