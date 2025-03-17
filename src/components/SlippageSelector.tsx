
import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { CustomSlippageInput } from "./CustomSlippageInput";
import { SlippageOption } from "@/types/token";

interface SlippageSelectorProps {
  showMenu: boolean;
  selectedSlippage: string;
  onToggleMenu: () => void;
  onSelectSlippage: (value: string) => void;
}

export function SlippageSelector({ 
  showMenu, 
  selectedSlippage, 
  onToggleMenu, 
  onSelectSlippage 
}: SlippageSelectorProps) {
  const slippageOptions: SlippageOption[] = [
    { value: "0.1", label: "0.1%" },
    { value: "0.5", label: "0.5%" },
    { value: "1.0", label: "1.0%" }
  ];
  
  const [showCustomInput, setShowCustomInput] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onToggleMenu();
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu, onToggleMenu]);

  const isCustomValue = !slippageOptions.some(option => option.value === selectedSlippage);

  return (
    <div className="relative">
      <button
        className="flex relative gap-2 items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        onClick={onToggleMenu}
      >
        <span>Slippage: </span>
        <span className="text-foreground font-medium">{selectedSlippage + "%"}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          className={cn("transition-transform duration-300", {
            "rotate-180": showMenu
          })}
        >
          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      </button>
      
      <AnimatePresence>
        {showMenu && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 z-30 p-4 mt-2 bg-popover rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.5)] backdrop-blur-sm"
          >
            <div className="flex gap-2">
              {slippageOptions.map(option => (
                <motion.button
                  key={option.value}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-lg transition-colors duration-200",
                    selectedSlippage === option.value
                      ? "bg-purple-600 text-white"
                      : "bg-muted text-foreground hover:bg-accent"
                  )}
                  onClick={() => {
                    onSelectSlippage(option.value);
                    setShowCustomInput(false);
                  }}
                >
                  {option.label}
                </motion.button>
              ))}
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-lg transition-colors duration-200",
                  isCustomValue || showCustomInput
                    ? "bg-purple-600 text-white"
                    : "bg-muted text-foreground hover:bg-accent"
                )}
                onClick={() => setShowCustomInput(!showCustomInput)}
              >
                Custom
              </motion.button>
            </div>
            
            {showCustomInput && (
              <CustomSlippageInput
                value={isCustomValue ? selectedSlippage : ""}
                onChange={onSelectSlippage}
                onClose={() => setShowCustomInput(false)}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
