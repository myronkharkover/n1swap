
"use client"

import React, { useRef, useEffect, useState } from "react"
import { useTheme } from "@/components/ThemeProvider"

type Performance = "low" | "medium" | "high"

interface FractalDotGridProps {
  dotSize?: number
  dotSpacing?: number
  dotOpacity?: number
  waveIntensity?: number
  waveRadius?: number
  dotColor?: string
  glowColor?: string
  enableNoise?: boolean
  noiseOpacity?: number
  enableMouseGlow?: boolean
  initialPerformance?: Performance
}

export function FractalDotGrid({
  dotSize = 4,
  dotSpacing = 20,
  dotOpacity = 0.7,
  waveIntensity = 80,
  waveRadius = 200,
  dotColor = "rgba(100, 100, 255, 1)",
  glowColor = "rgba(100, 100, 255, 1)",
  enableNoise = false,
  noiseOpacity = 0.03,
  enableMouseGlow = false,
  initialPerformance = "medium",
}: FractalDotGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const mousePosition = useRef({ x: -1000, y: -1000 }) // Start with mouse far away
  const animationFrameId = useRef<number>(0)
  const startTime = useRef<number>(Date.now())
  const { theme } = useTheme()
  const isHovering = useRef(false)
  
  const [performance, setPerformance] = useState<Performance>(initialPerformance)

  // Adjust for dark mode
  const getDotColor = () => {
    // Default purple with opacity adjustment
    return theme === "dark" 
      ? "rgba(180, 140, 255, 1)" // Lighter purple in dark mode
      : dotColor
  }

  const getGlowColor = () => {
    return theme === "dark" 
      ? "rgba(180, 140, 255, 1)" // Lighter purple in dark mode
      : glowColor
  }

  // Performance settings
  const getPerformanceSettings = (performanceLevel: Performance) => {
    switch (performanceLevel) {
      case "low":
        return { skipFactor: 3, frameSkip: 2 }
      case "medium":
        return { skipFactor: 2, frameSkip: 1 }
      case "high":
        return { skipFactor: 1, frameSkip: 0 }
      default:
        return { skipFactor: 2, frameSkip: 1 }
    }
  }

  // Handles mouse movement and hover state
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      mousePosition.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
      isHovering.current = true
    }

    const handleMouseLeave = () => {
      isHovering.current = false
      // Move mouse position far away when not hovering
      mousePosition.current = { x: -1000, y: -1000 }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("mousemove", handleMouseMove)
      container.addEventListener("mouseleave", handleMouseLeave)
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove)
        container.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [])

  // Main animation effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const performanceSettings = getPerformanceSettings(performance)
    let frameCount = 0

    const resizeCanvas = () => {
      if (!canvas || !containerRef.current) return
      const { width, height } = containerRef.current.getBoundingClientRect()
      canvas.width = width
      canvas.height = height
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Generate noise
    const generateNoise = (ctx: CanvasRenderingContext2D, opacity: number) => {
      const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
      const data = imageData.data
      
      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 255
        data[i] = data[i + 1] = data[i + 2] = noise
        data[i + 3] = opacity * 255
      }
      
      ctx.putImageData(imageData, 0, 0)
    }

    // Animation loop
    const animate = () => {
      if (!canvas || !ctx) return
      
      frameCount++
      if (frameCount % (performanceSettings.frameSkip + 1) !== 0) {
        animationFrameId.current = requestAnimationFrame(animate)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      if (enableNoise) {
        ctx.save()
        generateNoise(ctx, noiseOpacity)
        ctx.globalCompositeOperation = "lighter"
        ctx.restore()
      }

      const currentTime = Date.now()
      const elapsed = (currentTime - startTime.current) / 1000
      
      // Calculate grid dimensions based on dot spacing
      const cols = Math.ceil(canvas.width / dotSpacing) + 1
      const rows = Math.ceil(canvas.height / dotSpacing) + 1
      
      // Draw dots
      for (let i = 0; i < cols; i += performanceSettings.skipFactor) {
        for (let j = 0; j < rows; j += performanceSettings.skipFactor) {
          const x = i * dotSpacing
          const y = j * dotSpacing
          
          // Calculate distance from mouse position
          const distX = mousePosition.current.x - x
          const distY = mousePosition.current.y - y
          const distance = Math.sqrt(distX * distX + distY * distY)
          
          // Base dot size with minimal animation when not hovering
          let dotSizeFinal = dotSize
          
          // Only apply wave effects when hovering
          if (isHovering.current && distance < waveRadius) {
            const waveEffect = (1 - distance / waveRadius) * waveIntensity / 10
            const hoverMultiplier = isHovering.current ? 1 : 0
            
            // Apply wave effects only when hovering
            dotSizeFinal += waveEffect * hoverMultiplier
          }
          
          // Apply glow for mouse position
          if (isHovering.current && enableMouseGlow && distance < waveRadius) {
            ctx.shadowBlur = 15 * (1 - distance / waveRadius)
            ctx.shadowColor = getGlowColor()
          } else {
            ctx.shadowBlur = 0
          }
          
          // Draw the dot
          ctx.fillStyle = getDotColor()
          ctx.globalAlpha = dotOpacity
          
          ctx.beginPath()
          ctx.arc(x, y, Math.max(0, dotSizeFinal / 2), 0, Math.PI * 2)
          ctx.fill()
        }
      }

      animationFrameId.current = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId.current)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [
    dotSize, 
    dotSpacing, 
    dotOpacity, 
    waveIntensity, 
    waveRadius, 
    enableNoise, 
    noiseOpacity, 
    enableMouseGlow, 
    performance,
    theme
  ])

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 overflow-hidden z-0"
    >
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  )
}
