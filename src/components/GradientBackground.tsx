
"use client"

import React, { useEffect, useRef } from "react";
import { useTheme } from "@/components/ThemeProvider";

interface GradientBackgroundProps {
  baseColor?: string;
}

export function GradientBackground({ baseColor = "#F0F0FF" }: GradientBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let startTime = Date.now();
    
    const resizeCanvas = () => {
      const { innerWidth: width, innerHeight: height } = window;
      canvas.width = width;
      canvas.height = height;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Convert hex to rgb for manipulation
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 240, g: 240, b: 255 }; // Default to #F0F0FF
    };
    
    const baseRgb = hexToRgb(baseColor);
    
    // Set up gradient colors based on theme
    const getGradientColors = () => {
      if (theme === 'dark') {
        return [
          { r: baseRgb.r * 0.5, g: baseRgb.g * 0.5, b: baseRgb.b * 0.6 },
          { r: baseRgb.r * 0.4, g: baseRgb.g * 0.4, b: baseRgb.b * 0.8 }
        ];
      }
      return [
        { r: baseRgb.r, g: baseRgb.g, b: baseRgb.b },
        { r: baseRgb.r * 0.8, g: baseRgb.g * 0.8, b: baseRgb.b * 1.2 }
      ];
    };
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const colors = getGradientColors();
      
      // Slowly shifting gradient
      const gradient = ctx.createLinearGradient(
        Math.sin(elapsed * 0.1) * canvas.width + canvas.width / 2,
        0,
        Math.cos(elapsed * 0.1) * canvas.width + canvas.width / 2,
        canvas.height
      );
      
      // First color with subtle pulse
      const pulseIntensity = Math.sin(elapsed * 0.2) * 0.1 + 0.9;
      gradient.addColorStop(0, `rgba(${colors[0].r * pulseIntensity}, ${colors[0].g * pulseIntensity}, ${colors[0].b * pulseIntensity}, 1)`);
      
      // Second color
      gradient.addColorStop(1, `rgba(${colors[1].r}, ${colors[1].g}, ${colors[1].b}, 1)`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [baseColor, theme]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ opacity: 0.8 }}
    />
  );
}
