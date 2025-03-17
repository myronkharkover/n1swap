
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface CustomSlippageInputProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
}

export function CustomSlippageInput({ value, onChange, onClose }: CustomSlippageInputProps) {
  const [inputValue, setInputValue] = useState(value || "0.5");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue && !isNaN(parseFloat(inputValue))) {
      onChange(inputValue);
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "" || /^\d*\.?\d*$/.test(val)) {
              setInputValue(val);
            }
          }}
          className="w-full pl-3 pr-9 py-1.5 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          placeholder="Custom slippage"
        />
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-neutral-500">
          %
        </span>
      </div>
      <motion.button
        whileHover={{ y: -2 }}
        whileTap={{ y: 0 }}
        type="submit"
        className="mt-2 w-full px-3 py-1.5 text-sm rounded-lg bg-purple-600 text-white"
      >
        Apply
      </motion.button>
    </form>
  );
}
