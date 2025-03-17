
import React from "react";
import { motion } from "framer-motion";

interface SwapArrowProps {
  onClick: () => void;
}

export function SwapArrow({ onClick }: SwapArrowProps) {
  return (
    <div className="flex justify-center my-4">
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(147, 51, 234, 0.5)" }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center w-10 h-10 bg-card text-foreground rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-all hover:shadow-[0_4px_16px_rgba(147,51,234,0.25)]"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M3 11L9 17L15 11" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M9 1V17" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </motion.button>
    </div>
  );
}
