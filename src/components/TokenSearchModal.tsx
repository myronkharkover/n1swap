
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Token } from "@/types/token";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";
import { AddressDisplay } from "./AddressDisplay";

interface TokenSearchModalProps {
  tokens: Token[];
  onTokenSelect: (symbol: string) => void;
  onClose: () => void;
  recentTokens?: string[];
}

export function TokenSearchModal({
  tokens,
  onTokenSelect,
  onClose,
  recentTokens = []
}: TokenSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    searchInputRef.current?.focus();
    
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const filteredTokens = tokens.filter(token => 
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentFilteredTokens = tokens.filter(token => 
    recentTokens.includes(token.symbol)
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-card rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col"
      >
        <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <h3 className="text-lg font-medium font-['Satoshi']">Select Token</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by name or symbol"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 pr-10 bg-muted rounded-xl focus:outline-none font-['Satoshi']"
            />
            {searchQuery && (
              <button 
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setSearchQuery("")}
              >
                <X size={16} className="text-neutral-400" />
              </button>
            )}
          </div>
        </div>
        
        <div className="overflow-y-auto flex-1">
          {recentTokens.length > 0 && searchQuery === "" && (
            <div className="p-4 border-b border-neutral-100 dark:border-neutral-800">
              <h4 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2 font-['Satoshi']">Recently Used</h4>
              <div className="grid grid-cols-3 gap-2">
                {recentFilteredTokens.map(token => (
                  <button
                    key={`recent-${token.symbol}`}
                    className="flex flex-col items-center p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    onClick={() => {
                      onTokenSelect(token.symbol);
                      onClose();
                    }}
                  >
                    {token.icon ? (
                      <img src={token.icon} alt={token.symbol} className="w-8 h-8 mb-1 rounded-full" />
                    ) : (
                      <div className={cn(
                        "w-8 h-8 mb-1 rounded-full flex items-center justify-center",
                        theme === "dark" ? "bg-neutral-700 text-white" : "bg-neutral-200"
                      )}>
                        <span className="text-sm font-medium font-['Satoshi']">{token.symbol.substring(0, 1)}</span>
                      </div>
                    )}
                    <span className="text-xs font-medium font-['Satoshi']">{token.symbol}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="p-4">
            <h4 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2 font-['Satoshi']">All Tokens</h4>
            {filteredTokens.length === 0 ? (
              <div className="text-center py-8 text-neutral-500 font-['Satoshi']">No tokens found</div>
            ) : (
              filteredTokens.map(token => (
                <div 
                  key={token.symbol}
                  className="border-b border-neutral-100 dark:border-neutral-800 last:border-b-0"
                >
                  <button
                    className="flex items-center p-3 w-full hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    onClick={() => {
                      onTokenSelect(token.symbol);
                      onClose();
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start">
                        {token.icon ? (
                          <img src={token.icon} alt={token.symbol} className="w-8 h-8 rounded-full mr-3" />
                        ) : (
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                            theme === "dark" ? "bg-neutral-700 text-white" : "bg-neutral-200"
                          )}>
                            <span className="text-sm font-medium font-['Satoshi']">{token.symbol.substring(0, 1)}</span>
                          </div>
                        )}
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <span className="font-medium font-['Satoshi']">{token.symbol}</span>
                            <span className="text-sm text-neutral-500 dark:text-neutral-400 font-['Satoshi'] ml-2">{token.name}</span>
                          </div>
                          {token.contractAddress && (
                            <AddressDisplay
                              address={token.contractAddress}
                              truncateLength={6}
                              className="mt-0.5"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-3">
                      <div className="flex flex-col">
                        <span className="font-['Satoshi']">{token.balance}</span>
                        {token.usdValue && (
                          <div className="text-sm text-neutral-500 dark:text-neutral-400 font-['Satoshi']">${token.usdValue}</div>
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
