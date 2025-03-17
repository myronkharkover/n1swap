
import { useState, useEffect } from 'react';
import { Token, SwapDetails } from '@/types/token';

export const useSwapCalculation = (
  fromAmount: string,
  fromToken: string,
  toToken: string,
  tokens: Token[]
) => {
  const [toAmount, setToAmount] = useState<string>("");
  const [fromAmountUsd, setFromAmountUsd] = useState<string>("");
  const [toAmountUsd, setToAmountUsd] = useState<string>("");
  const [swapDetails, setSwapDetails] = useState<SwapDetails>({
    networkFee: "~$5.23",
    priceImpact: "0.05%",
    exchangeRate: "1 ETH = 1913 USDC"
  });

  // Effect to calculate simulated exchange rate
  useEffect(() => {
    if (fromAmount && fromAmount !== "0") {
      // Calculate exchange rate based on token pairs - updated for BTC
      let rate = 1.2; // default rate
      
      if (fromToken === "ETH" && toToken === "USDC") {
        rate = 1913;
      } else if (fromToken === "BTC" && toToken === "USDC") {
        rate = 83451; // Updated Bitcoin rate
      } else if (fromToken === "ETH" && toToken === "BTC") {
        rate = 0.023; // ETH to BTC rate
      } else if (fromToken === "BTC" && toToken === "ETH") {
        rate = 43.36; // BTC to ETH rate
      }
      
      const calculated = parseFloat(fromAmount) * rate;
      setToAmount(calculated.toFixed(4));
      
      const fromTokenData = tokens.find(t => t.symbol === fromToken);
      const toTokenData = tokens.find(t => t.symbol === toToken);
      
      if (fromTokenData && fromTokenData.usdValue) {
        const usdPerUnit = parseFloat(fromTokenData.usdValue.replace(/,/g, "")) / parseFloat(fromTokenData.balance.replace(/,/g, ""));
        setFromAmountUsd((parseFloat(fromAmount) * usdPerUnit).toFixed(2));
      }
      
      if (calculated && toTokenData && toTokenData.usdValue) {
        const usdPerUnit = parseFloat(toTokenData.usdValue.replace(/,/g, "")) / parseFloat(toTokenData.balance.replace(/,/g, ""));
        setToAmountUsd((calculated * usdPerUnit).toFixed(2));
      }
      
      setSwapDetails({
        networkFee: "~$5.23",
        priceImpact: parseFloat(fromAmount) > 10 ? "0.32%" : "0.05%",
        exchangeRate: `1 ${fromToken} = ${rate} ${toToken}`
      });
    } else {
      setToAmount("");
      setFromAmountUsd("");
      setToAmountUsd("");
    }
  }, [fromAmount, fromToken, toToken, tokens]);

  return {
    toAmount,
    setToAmount,
    fromAmountUsd,
    toAmountUsd,
    swapDetails
  };
};
