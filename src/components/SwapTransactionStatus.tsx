
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TransactionStatus } from "@/types/token";

interface SwapTransactionStatusProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: TransactionStatus;
  fromToken: string;
  toToken: string;
  fromTokenFullName: string;
  toTokenFullName: string;
  fromAmount?: string;
  toAmount?: string;
  transactionHash?: string;
  errorMessage?: string;
  tokens: any[];
}

const AUTO_CLOSE_DURATION = 3000;

export function SwapTransactionStatus({
  open,
  onOpenChange,
  status,
  fromToken,
  toToken,
  fromTokenFullName,
  toTokenFullName,
  fromAmount = "0",
  toAmount = "0",
  transactionHash,
  errorMessage,
  tokens
}: SwapTransactionStatusProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [autoCloseProgress, setAutoCloseProgress] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  
  const autoCloseIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const fromTokenIcon = tokens.find(t => t.symbol === fromToken)?.icon || '';
  const toTokenIcon = tokens.find(t => t.symbol === toToken)?.icon || '';
  
  // Reset all animation and timer states when dialog opens/closes
  useEffect(() => {
    const cleanup = () => {
      if (autoCloseIntervalRef.current) {
        clearInterval(autoCloseIntervalRef.current);
        autoCloseIntervalRef.current = null;
      }
    };

    if (open) {
      // Reset states when dialog opens
      setIsFlipped(false);
      setShowParticles(false);
      setAutoCloseProgress(0);
      setAnimationComplete(false);
      
      // Small delay to ensure animation sequence starts properly
      setTimeout(() => {
        setIsFlipped(true);
      }, 200);
    } else {
      // Clean up any timers when the dialog closes
      cleanup();
    }
    
    // Ensure cleanup on both mount/unmount and open state changes
    return cleanup;
  }, [open]);
  
  // Handle animation states based on transaction status
  useEffect(() => {
    if (status === 'confirmed') {
      // Show particles with a slight delay for better animation effect
      setTimeout(() => {
        setShowParticles(true);
      }, 150);
      
      // Clean up any existing auto-close interval
      if (autoCloseIntervalRef.current) {
        clearInterval(autoCloseIntervalRef.current);
        autoCloseIntervalRef.current = null;
      }
      
      // Set up auto-close timer
      const startTime = Date.now();
      autoCloseIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progressValue = (elapsed / AUTO_CLOSE_DURATION) * 100;
        
        if (progressValue >= 100) {
          clearInterval(autoCloseIntervalRef.current!);
          autoCloseIntervalRef.current = null;
          onOpenChange(false);
        } else {
          setAutoCloseProgress(progressValue);
        }
      }, 16);
    }
    
    // Clean up all intervals on unmount or status change
    return () => {
      if (autoCloseIntervalRef.current) {
        clearInterval(autoCloseIntervalRef.current);
        autoCloseIntervalRef.current = null;
      }
    };
  }, [status, onOpenChange]);
  
  // Clean up all timers on component unmount
  useEffect(() => {
    return () => {
      if (autoCloseIntervalRef.current) {
        clearInterval(autoCloseIntervalRef.current);
        autoCloseIntervalRef.current = null;
      }
    };
  }, []);
  
  const getCardBackground = () => {
    if (status === 'confirmed') return 'bg-gradient-to-br from-green-400 to-emerald-600';
    if (status === 'failed') return 'bg-gradient-to-br from-neutral-500 to-neutral-700';
    return 'bg-card';
  };
  
  const getViewUrl = () => {
    return `https://solscan.io/tx/${transactionHash || "0x0"}`;
  };

  // Handle dialog open state changes safely
  const handleDialogOpenChange = (newOpenState: boolean) => {
    // Allow closing when transaction is complete or failed
    if (!newOpenState && (status === 'confirmed' || status === 'failed')) {
      if (autoCloseIntervalRef.current) {
        clearInterval(autoCloseIntervalRef.current);
        autoCloseIntervalRef.current = null;
      }
      onOpenChange(false);
    } else if (!newOpenState && status === 'loading') {
      // Prevent closing during loading state
      return;
    } else {
      onOpenChange(newOpenState);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent 
        className="max-w-md p-0 overflow-hidden bg-transparent border-none shadow-2xl sm:w-[90%]"
        aria-describedby={status === 'loading' ? "preventing-close" : undefined}
      >
        <DialogTitle className="sr-only">Transaction Status</DialogTitle>
        
        {status === 'confirmed' && (
          <Progress 
            value={autoCloseProgress} 
            className="absolute top-0 left-0 right-0 h-1 z-50 w-full bg-white/10 rounded-none"
            indicatorClassName="bg-white/90"
          />
        )}
        
        <div className="relative perspective-1000">
          <AnimatePresence mode="wait">
            {!isFlipped && (
              <motion.div
                key="front"
                initial={{ opacity: 1 }}
                exit={{ 
                  opacity: 0,
                  rotateY: 90,
                  transition: { duration: 0.2 }
                }}
                className="absolute inset-0 w-full p-6 bg-card rounded-xl shadow-xl backface-hidden"
              >
                <div className="flex flex-col items-center space-y-4">
                  <h3 className="text-xl font-bold">Confirming Swap</h3>
                  <p className="text-center text-muted-foreground">
                    Please confirm the transaction in your wallet
                  </p>
                </div>
              </motion.div>
            )}
            
            {isFlipped && status === 'loading' && (
              <motion.div
                key="loading"
                initial={{ 
                  opacity: 0,
                  rotateY: -90
                }}
                animate={{ 
                  opacity: 1,
                  rotateY: 0,
                  transition: { duration: 0.25 }
                }}
                exit={{ 
                  opacity: 0,
                  rotateY: 90,
                  transition: { duration: 0.2 }
                }}
                className="w-full p-6 bg-card rounded-xl shadow-xl backface-hidden"
              >
                <div className="flex flex-col items-center space-y-6 py-8">
                  <h3 className="text-xl font-bold text-center">Processing Swap</h3>
                  
                  <div className="flex items-center justify-center w-full h-24 relative">
                    {/* From token (initially visible in center) */}
                    <motion.div 
                      key="fromToken"
                      initial={{ x: 0, opacity: 1, zIndex: 20 }}
                      animate={{ 
                        x: animationComplete ? -120 : 0,
                        opacity: animationComplete ? 0 : 1,
                        zIndex: animationComplete ? 10 : 20,
                        transition: { 
                          duration: 0.4, 
                          ease: "easeOut",
                          delay: 1.9
                        }
                      }}
                      className="flex items-center justify-center w-16 h-16 bg-accent rounded-full overflow-hidden absolute"
                    >
                      {fromTokenIcon ? (
                        <img src={fromTokenIcon} alt={fromToken} className="w-10 h-10" />
                      ) : (
                        <div className="text-lg font-bold">{fromToken}</div>
                      )}
                    </motion.div>
                    
                    {/* To token (starts small behind from token, then pops out and scales up) */}
                    <motion.div
                      key="toToken"
                      initial={{ 
                        x: -5, 
                        opacity: 0.7, 
                        scale: 0.6, 
                        zIndex: 10,
                        y: 0
                      }}
                      animate={{ 
                        x: [0, 15, 0], 
                        y: [0, -15, 0],
                        opacity: [0.9, 1, 1],
                        scale: [0.6, 1.2, 1],
                        zIndex: [10, 30, 25],
                        transition: {
                          duration: 0.8,
                          times: [0, 0.5, 1],
                          delay: 1.2,
                          ease: "easeInOut"
                        }
                      }}
                      onAnimationComplete={() => {
                        if (!animationComplete) {
                          setAnimationComplete(true);
                        }
                      }}
                      className="flex items-center justify-center w-16 h-16 bg-accent rounded-full overflow-hidden absolute shadow-lg"
                    >
                      {toTokenIcon ? (
                        <img src={toTokenIcon} alt={toToken} className="w-10 h-10" />
                      ) : (
                        <div className="text-lg font-bold">{toToken}</div>
                      )}
                    </motion.div>
                  </div>
                  
                  <div className="w-full pt-2">
                    <p className="text-center text-sm text-muted-foreground">
                      Swapping <span className="font-medium">{fromAmount} {fromToken}</span> for <span className="font-medium">{toAmount} {toToken}</span>
                    </p>
                    <p className="text-center text-xs text-muted-foreground mt-1">
                      This may take a moment, please don't close this window
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
            
            {isFlipped && status === 'confirmed' && (
              <motion.div
                key="success"
                initial={{ 
                  opacity: 0,
                  rotateY: -90
                }}
                animate={{ 
                  opacity: 1,
                  rotateY: 0,
                  scale: [0.9, 1],
                  transition: { duration: 0.4, ease: "easeOut" }
                }}
                className={`w-full p-6 rounded-xl shadow-xl backface-hidden ${getCardBackground()}`}
              >
                <div className="flex flex-col items-center space-y-6 py-4 relative overflow-hidden">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Check className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className="text-center z-10">
                    <h3 className="text-2xl font-bold text-white mb-2">Success!</h3>
                    <motion.div 
                      className="flex items-center justify-center gap-2"
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 0.8, times: [0, 0.5, 1] }}
                    >
                      <span className="text-xl font-medium text-white/90">{toAmount}</span>
                      {toTokenIcon ? (
                        <img src={toTokenIcon} alt={toToken} className="w-8 h-8" />
                      ) : (
                        <span className="text-xl font-medium text-white/90">{toToken}</span>
                      )}
                      <span className="text-xl font-medium text-white/90">is yours!</span>
                    </motion.div>
                  </div>
                  
                  {showParticles && (
                    <div className="absolute inset-0 z-0 overflow-hidden">
                      {Array.from({ length: 120 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-6 h-6 object-contain"
                          initial={{ 
                            x: Math.random() * 400, 
                            y: -20,
                            opacity: 1,
                            scale: Math.random() * 0.5 + 0.5
                          }}
                          animate={{ 
                            y: 400,
                            opacity: [1, 1, 0],
                            rotate: Math.random() * 180
                          }}
                          transition={{ 
                            duration: Math.random() * 0.8 + 0.7,
                            delay: Math.random() * 0.2,
                            ease: "easeIn"
                          }}
                        >
                          {toTokenIcon ? (
                            <img src={toTokenIcon} alt={toToken} className="w-full h-full" />
                          ) : (
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs">{toToken}</div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-2 z-10">
                    <Button 
                      variant="secondary" 
                      className="gap-2 bg-white/20 text-white hover:bg-white/30"
                      onClick={() => window.open(getViewUrl(), '_blank')}
                    >
                      View Details
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="secondary"
                      className="bg-white/20 text-white hover:bg-white/30"
                      onClick={() => onOpenChange(false)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
            
            {isFlipped && status === 'failed' && (
              <motion.div
                key="failed"
                initial={{ 
                  opacity: 0,
                  rotateY: -90
                }}
                animate={{ 
                  opacity: 1,
                  rotateY: 0,
                  transition: { 
                    duration: 0.3,
                    ease: "easeOut" 
                  }
                }}
                className={`w-full p-6 rounded-xl shadow-xl backface-hidden ${getCardBackground()}`}
              >
                <div className="flex flex-col items-center space-y-6 py-4">
                  <motion.div 
                    className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <X className="h-8 w-8 text-white" />
                  </motion.div>
                  
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">Transaction Failed</h3>
                    <p className="text-white/90 text-sm mb-1">
                      {errorMessage || "Your transaction couldn't be processed"}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="secondary" 
                      className="gap-2 bg-white/20 text-white hover:bg-white/30"
                      onClick={() => window.open(getViewUrl(), '_blank')}
                    >
                      View Details
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="secondary"
                      className="gap-2 bg-white/20 text-white hover:bg-white/30"
                      onClick={() => onOpenChange(false)}
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
      
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .perspective-1000 {
              perspective: 1000px;
              transform-style: preserve-3d;
            }
            .backface-hidden {
              backface-visibility: hidden;
              transform-style: preserve-3d;
            }
          `
        }}
      />
    </Dialog>
  );
}
