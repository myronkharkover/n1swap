
"use client"

import { useEffect, useState } from "react"
import { useTheme } from "@/components/ThemeProvider"

interface AnimatedGradientBackgroundProps {
  className?: string
  duration?: number
}

export function AnimatedGradientBackground({ className = "", duration = 20 }: AnimatedGradientBackgroundProps) {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  
  // Only run animations after component is mounted to prevent hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Adjust colors based on theme
  const colors = theme === "dark" 
    ? {
        primary: "#121218",
        secondary: "#202038", 
        accent: "#353570"
      }
    : {
        primary: "white",
        secondary: "#F0F0FF",
        accent: "#8A8AFF"
      }

  useEffect(() => {
    // Add keyframes to document head
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @keyframes gradient-shift-1 {
        0% {
          opacity: 1;
        }
        33% {
          opacity: 0;
        }
        66% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
      @keyframes gradient-shift-2 {
        0% {
          opacity: 0;
        }
        33% {
          opacity: 1;
        }
        66% {
          opacity: 0;
        }
        100% {
          opacity: 0;
        }
      }
      @keyframes gradient-shift-3 {
        0% {
          opacity: 0;
        }
        33% {
          opacity: 0;
        }
        66% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      // Clean up style element on unmount
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      <div
        className={`absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-1000 ${
          mounted ? "opacity-100" : ""
        }`}
        style={{
          backgroundImage: `linear-gradient(to bottom right, ${colors.primary}, ${colors.secondary}, ${colors.accent})`
        }}
      />
      {mounted && (
        <>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(to bottom right, ${colors.primary}, ${colors.secondary}, ${colors.accent})`,
              animation: `gradient-shift-1 ${duration}s ease-in-out infinite alternate`,
            }}
          />
          <div
            className="absolute inset-0 opacity-0"
            style={{
              backgroundImage: `linear-gradient(to top right, ${colors.primary}, ${colors.secondary}, ${colors.accent})`,
              animation: `gradient-shift-2 ${duration}s ease-in-out infinite alternate`,
            }}
          />
          <div
            className="absolute inset-0 opacity-0"
            style={{
              backgroundImage: `linear-gradient(to bottom left, ${colors.primary}, ${colors.secondary}, ${colors.accent})`,
              animation: `gradient-shift-3 ${duration}s ease-in-out infinite alternate`,
            }}
          />
        </>
      )}
    </div>
  )
}
