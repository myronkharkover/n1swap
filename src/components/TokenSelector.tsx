
import React, { useState } from "react";
import { Token } from "@/types/token";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { AddressDisplay } from "./AddressDisplay";

interface TokenSelectorProps {
  selectedToken: string;
  tokens: Token[];
  showTokens: boolean;
  onTokenSelect: (symbol: string) => void;
  onToggleTokens: () => void;
  balanceLabel?: string;
}

export function TokenSelector({
  selectedToken,
  tokens,
  showTokens,
  onTokenSelect,
  onToggleTokens,
  balanceLabel = "Balance"
}: TokenSelectorProps) {
  const selectedTokenData = tokens?.find(t => t.symbol === selectedToken);

  return (
    <div className="relative">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-stone-500 font-medium tracking-wide">[ {balanceLabel} ]</span>
        {selectedTokenData && (
          <span className="text-sm text-stone-500">
            <span>{balanceLabel}: </span>
            <span className="text-neutral-900 font-medium">{selectedTokenData.balance}</span>
          </span>
        )}
      </div>
      <div className="flex gap-3 p-4 rounded-2xl bg-neutral-100">
        <button
          className="flex gap-2 items-center px-3 py-2 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
          onClick={onToggleTokens}
        >
          {selectedTokenData?.icon ? (
            <img src={selectedTokenData.icon} alt={selectedToken} className="w-6 h-6 rounded-full mr-1" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center mr-1">
              <span className="text-xs font-medium">{selectedToken.substring(0, 1)}</span>
            </div>
          )}
          <span className="text-base font-medium">{selectedToken}</span>
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 12 12"
            className={cn("transition-transform duration-300", {
              "rotate-180": showTokens
            })}
          >
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </button>
        
        <AnimatePresence>
          {showTokens && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-20 p-2 mt-12 w-full bg-white rounded-xl left-0 shadow-[0_4px_16px_rgba(0,0,0,0.12)] backdrop-blur-sm bg-white/95"
            >
              {tokens?.map((token) => (
                <motion.div
                  key={token.symbol}
                  className="flex flex-col w-full"
                >
                  <motion.button
                    whileHover={{ backgroundColor: "#f5f5f5" }}
                    className={cn(
                      "flex items-center p-3 w-full rounded-lg transition-colors", 
                      selectedToken === token.symbol ? "bg-neutral-100" : "bg-transparent"
                    )}
                    onClick={() => onTokenSelect(token.symbol)}
                  >
                    <div className="flex flex-col items-start flex-1 min-w-0">
                      <div className="flex items-center">
                        {token.icon ? (
                          <img src={token.icon} alt={token.symbol} className="w-6 h-6 rounded-full mr-2" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center mr-2">
                            <span className="text-xs font-medium">{token.symbol.substring(0, 1)}</span>
                          </div>
                        )}
                        <span className="text-base font-medium">{token.symbol}</span>
                        <span className="text-sm text-stone-500 ml-2">{token.name}</span>
                      </div>
                      {token.contractAddress && (
                        <div className="ml-8">
                          <AddressDisplay 
                            address={token.contractAddress} 
                            className="mt-0.5" 
                          />
                        </div>
                      )}
                    </div>
                    
                    <span className="text-sm text-neutral-900">{token.balance}</span>
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
