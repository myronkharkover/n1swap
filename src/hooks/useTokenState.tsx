
import { useState } from "react";
import { Token } from "@/types/token";

export function useTokenState() {
  const [tokens, setTokens] = useState<Token[]>([{
    symbol: "ETH",
    name: "ETHEREUM",
    balance: "1.234",
    usdValue: "3,702.00",
    contractAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    icon: "/uploads/c9c3cfe4-41c5-4e3f-9fc1-dc8372333926.png"
  }, {
    symbol: "USDC",
    name: "USD COIN",
    balance: "1,234.56",
    usdValue: "1,234.56",
    contractAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    icon: "/uploads/8dba80d0-63ca-4de4-af0a-f8039854bc69.png"
  }, {
    symbol: "BTC",
    name: "BITCOIN",
    balance: "0.0123",
    usdValue: "820.47",
    contractAddress: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    icon: "/uploads/20698f61-3be2-44e2-ae79-09f7333a18d6.png"
  }, {
    symbol: "DAI",
    name: "DAI STABLECOIN",
    balance: "1,456.78",
    usdValue: "1,456.78",
    contractAddress: "0x6B175474E89094C44Da98b954EedeAC49cDb9B32"
  }, {
    symbol: "SOL",
    name: "SOLANA",
    balance: "12.345",
    usdValue: "1,357.95",
    contractAddress: "0x7dF95028a82B2f2029CE4eFDf2E8EbA49cDb9B32",
    icon: "/uploads/5ae0fc2a-5b65-4f94-b5f4-7da984a30740.png"
  }]);

  const [fromToken, setFromToken] = useState<string>("ETH");
  const [toToken, setToToken] = useState<string>("USDC");
  const [showTokenSearchModal, setShowTokenSearchModal] = useState<boolean>(false);
  const [activeTokenSide, setActiveTokenSide] = useState<"from" | "to" | null>(null);
  const [recentTokens, setRecentTokens] = useState<string[]>(["ETH", "USDC"]);

  const getTokenFullName = (symbol: string): string => {
    const token = tokens.find(t => t.symbol === symbol);
    return token ? token.name : symbol;
  };

  const handleTokenSelectForSide = (side: "from" | "to") => {
    setActiveTokenSide(side);
    setShowTokenSearchModal(true);
  };

  const handleTokenSelect = (symbol: string) => {
    if (activeTokenSide === "from") {
      setFromToken(symbol);
    } else if (activeTokenSide === "to") {
      setToToken(symbol);
    }
    
    if (!recentTokens.includes(symbol)) {
      setRecentTokens(prev => [symbol, ...prev.slice(0, 2)]);
    }
    
    setShowTokenSearchModal(false);
    setActiveTokenSide(null);
  };

  return {
    tokens,
    fromToken,
    toToken,
    setFromToken,
    setToToken,
    showTokenSearchModal,
    setShowTokenSearchModal,
    activeTokenSide,
    recentTokens,
    getTokenFullName,
    handleTokenSelectForSide,
    handleTokenSelect
  };
}
