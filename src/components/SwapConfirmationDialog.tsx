
import React from "react";
import { 
  AlertDialog, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { SwapDetails } from "@/types/token";

interface SwapConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fromToken: string;
  toToken: string;
  fromTokenFullName: string;
  toTokenFullName: string;
  fromAmount: string;
  toAmount: string;
  fromAmountUsd: string;
  toAmountUsd: string;
  slippage: string;
  swapDetails: SwapDetails;
  onConfirm: () => void;
  tokens: any[];
}

export function SwapConfirmationDialog({
  open,
  onOpenChange,
  fromToken,
  toToken,
  fromTokenFullName,
  toTokenFullName,
  fromAmount,
  toAmount,
  fromAmountUsd,
  toAmountUsd,
  slippage,
  swapDetails,
  onConfirm,
  tokens
}: SwapConfirmationDialogProps) {
  
  const fromTokenIcon = tokens.find(t => t.symbol === fromToken)?.icon || '';
  const toTokenIcon = tokens.find(t => t.symbol === toToken)?.icon || '';

  // Handle safe confirmation to prevent state race conditions
  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Call onConfirm but do not close the dialog directly
    // Let the parent component manage dialog visibility
    onConfirm();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md border border-border bg-background z-[9999]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-lg font-medium text-foreground font-['Satoshi']">
            Confirm Swap
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center font-['Satoshi']">
            You are about to swap tokens. Please review the details below.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="bg-muted/50 p-4 rounded-xl">
            <div className="text-center mb-2 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-1">
                {fromTokenIcon && (
                  <img src={fromTokenIcon} alt={fromToken} className="w-6 h-6" />
                )}
                <span className="text-base font-medium text-foreground font-['Satoshi']">
                  {fromAmount} {fromToken}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-['Satoshi']">
                ({fromTokenFullName}) ≈ ${fromAmountUsd}
              </div>
            </div>
            
            <div className="flex justify-center my-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 7L7 17M7 7L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            
            <div className="text-center flex flex-col items-center">
              <div className="flex items-center gap-2 mb-1">
                {toTokenIcon && (
                  <img src={toTokenIcon} alt={toToken} className="w-6 h-6" />
                )}
                <span className="text-base font-medium text-foreground font-['Satoshi']">
                  {toAmount} {toToken}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-['Satoshi']">
                ({toTokenFullName}) ≈ ${toAmountUsd}
              </div>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground font-['Satoshi']">Network Fee:</span>
              <span className="font-medium text-foreground font-['Satoshi']">{swapDetails.networkFee}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground font-['Satoshi']">Price Impact:</span>
              <span className="font-medium text-foreground font-['Satoshi']">{swapDetails.priceImpact}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground font-['Satoshi']">Slippage Tolerance:</span>
              <span className="font-medium text-foreground font-['Satoshi']">{slippage}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground font-['Satoshi']">Exchange Rate:</span>
              <span className="font-medium text-foreground font-['Satoshi']">{swapDetails.exchangeRate}</span>
            </div>
          </div>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel className="w-full font-['Satoshi']">
            Cancel
          </AlertDialogCancel>
          
          <Button
            type="button"
            className="w-full bg-purple-600 text-white dark:bg-purple-700 dark:text-white hover:bg-purple-700 dark:hover:bg-purple-800 font-['Satoshi']" 
            onClick={handleConfirm}
          >
            Confirm Swap
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
