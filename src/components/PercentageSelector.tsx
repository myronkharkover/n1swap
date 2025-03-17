
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PercentageSelectorProps {
  selectedPercentage: number | null;
  onSelect: (percentage: number) => void;
}

export function PercentageSelector({ selectedPercentage, onSelect }: PercentageSelectorProps) {
  const percentages = [
    { value: 25, label: "25%" },
    { value: 50, label: "50%" },
    { value: 75, label: "75%" },
    { value: 100, label: "MAX" }
  ];

  return (
    <div className="flex gap-2 mb-6">
      {percentages.map((percentage) => (
        <motion.button
          key={percentage.value}
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
          className={cn(
            "flex-1 px-4 py-2 text-sm rounded-xl transition-colors duration-200",
            selectedPercentage === percentage.value
              ? "bg-purple-600 text-white"
              : "bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
          )}
          onClick={() => onSelect(percentage.value)}
        >
          {percentage.label}
        </motion.button>
      ))}
    </div>
  );
}
