
"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "./ThemeProvider";
 
export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  const { theme } = useTheme();
  const [initialized, setInitialized] = useState(false);
  const rows = new Array(150).fill(1);
  const cols = new Array(100).fill(1);
  
  // Purple-focused color palette with light/dark mode variants
  const lightModeColors = [
    "#c4b5fd", // lavender
    "#a78bfa", // purple
    "#8b5cf6", // violet
    "#7c3aed", // indigo
    "#6d28d9", // dark purple
    "#ddd6fe", // light lavender
    "#ede9fe", // very light lavender
    "#e9d5ff", // light purple
    "#d8b4fe", // medium purple
  ];
  
  const darkModeColors = [
    "#7c3aed", // indigo
    "#8b5cf6", // violet
    "#9333ea", // purple
    "#a855f7", // medium purple
    "#c084fc", // light purple
    "#6d28d9", // dark purple
    "#5b21b6", // darker purple
    "#4c1d95", // very dark purple
    "#6b46c1", // slate purple
  ];
  
  const colors = theme === "dark" ? darkModeColors : lightModeColors;
  
  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Use effect to initialize properly
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialized(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
 
  return (
    <div
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
      }}
      className={cn(
        "absolute -top-1/4 left-1/4 z-0 flex h-full w-full -translate-x-1/2 -translate-y-1/2 p-4",
        className,
      )}
      {...rest}
    >
      {initialized && rows.map((_, i) => (
        <motion.div
          key={`row` + i}
          className={`relative h-8 w-16 ${theme === "dark" ? "border-l border-white/20" : "border-l border-slate-700/30"}`}
        >
          {cols.map((_, j) => (
            <motion.div
              whileHover={{
                backgroundColor: getRandomColor(),
                transition: { duration: 0 },
              }}
              animate={{
                transition: { duration: 2 },
              }}
              key={`col` + j}
              className={`relative h-8 w-16 ${theme === "dark" ? "border-t border-r border-white/20" : "border-t border-r border-slate-700/30"}`}
            >
              {j % 2 === 0 && i % 2 === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className={`pointer-events-none absolute -top-[14px] -left-[22px] h-6 w-10 stroke-[1px] ${theme === "dark" ? "text-white/20" : "text-slate-700/30"}`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </svg>
              ) : null}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};
 
export const BackgroundBoxes = React.memo(BoxesCore);
