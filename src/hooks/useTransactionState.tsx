
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { TransactionStatus } from "@/types/token";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export function useTransactionState(
  fromAmount: string,
  toAmount: string,
  fromToken: string,
  toToken: string,
  setFromAmount: (amount: string) => void,
  setToAmount: (amount: string) => void,
  setSelectedPercentage: (percentage: number | null) => void
) {
  const { toast } = useToast();
  
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [showTransactionStatus, setShowTransactionStatus] = useState<boolean>(false);
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>('idle');
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSwapping, setIsSwapping] = useState(false);
  
  // Ref to track mounted state to prevent state updates after unmount
  const isMounted = useRef(true);
  const transactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const processingSwapRef = useRef<boolean>(false);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Important: Mark component as unmounted
      isMounted.current = false;
      
      // Clear all timers to prevent memory leaks
      if (transactionTimeoutRef.current) {
        clearTimeout(transactionTimeoutRef.current);
        transactionTimeoutRef.current = null;
      }
      if (autoCloseTimeoutRef.current) {
        clearTimeout(autoCloseTimeoutRef.current);
        autoCloseTimeoutRef.current = null;
      }
      
      // Force reset all modals on unmount to prevent zombie dialogs
      setShowConfirmation(false);
      setShowTransactionStatus(false);
      setIsSwapping(false);
      processingSwapRef.current = false;
    };
  }, []);

  // Reset transaction-specific state when transaction modal is closed
  useEffect(() => {
    if (!showTransactionStatus && isMounted.current) {
      // First ensure any running timers are cleared
      if (transactionTimeoutRef.current) {
        clearTimeout(transactionTimeoutRef.current);
        transactionTimeoutRef.current = null;
      }
      if (autoCloseTimeoutRef.current) {
        clearTimeout(autoCloseTimeoutRef.current);
        autoCloseTimeoutRef.current = null;
      }
      
      // Then reset the transaction state
      setTransactionStatus('idle');
      setIsSwapping(false);
      processingSwapRef.current = false;
    }
  }, [showTransactionStatus]);

  const handleSwapClick = () => {
    if (!fromAmount || parseFloat(fromAmount) === 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to swap",
        variant: "destructive",
      });
      return;
    }
    
    // Force reset of any stale state
    setTransactionStatus('idle');
    setIsSwapping(false);
    processingSwapRef.current = false;
    
    console.log("Opening confirmation dialog");
    setShowConfirmation(true);
  };

  const handleSwapConfirm = () => {
    console.log("Swap confirm called, current processing state:", processingSwapRef.current);
    
    // Guard against duplicate execution
    if (isSwapping || processingSwapRef.current) {
      console.log("Already processing swap, ignoring duplicate call");
      return;
    }
    
    // Set both flags to prevent race conditions
    processingSwapRef.current = true;
    setIsSwapping(true);
    
    // First, close the confirmation dialog
    setShowConfirmation(false);
    
    // Short delay before showing transaction status
    setTimeout(() => {
      if (!isMounted.current) return;
      
      // Then show the transaction status modal
      setShowTransactionStatus(true);
      
      // Then set transaction status to loading
      console.log("Starting swap process, setting transaction status to loading");
      setTransactionStatus('loading');
      
      // Clear any existing timeout
      if (transactionTimeoutRef.current) {
        clearTimeout(transactionTimeoutRef.current);
      }
      
      // Simulate transaction processing with a timeout
      transactionTimeoutRef.current = setTimeout(() => {
        if (!isMounted.current) return;
        
        const randomSuccess = Math.random() > 0.2;
        
        if (randomSuccess) {
          const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
          setTransactionStatus('confirmed');
          setTransactionHash(txHash);
          
          // Reset form only after transaction is completed
          setFromAmount("");
          setToAmount("");
          setSelectedPercentage(null);
          
          toast({
            title: "Swap Successful",
            description: `Successfully swapped ${fromAmount} ${fromToken} to ${toAmount} ${toToken}`,
            action: (
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1 border-neutral-200 hover:bg-neutral-100 mt-2 dark:border-neutral-800 dark:hover:bg-neutral-800" 
                onClick={() => window.open(`https://solscan.io/tx/${txHash}`, '_blank')}
              >
                View Details
                <ExternalLink className="h-3 w-3" />
              </Button>
            ),
          });
          
          // Auto-close the transaction status modal after a reasonable delay
          if (autoCloseTimeoutRef.current) {
            clearTimeout(autoCloseTimeoutRef.current);
          }
          
          autoCloseTimeoutRef.current = setTimeout(() => {
            if (isMounted.current && showTransactionStatus) {
              setShowTransactionStatus(false);
            }
            autoCloseTimeoutRef.current = null;
            
            // Important: Reset the processing flags AFTER the modal is closed
            if (isMounted.current) {
              setIsSwapping(false);
              processingSwapRef.current = false;
            }
          }, 3000);
        } else {
          setTransactionStatus('failed');
          setErrorMessage("Transaction rejected by the network. Please try again.");
          
          toast({
            title: "Swap Failed",
            description: "Transaction rejected by the network. Please try again.",
            variant: "destructive",
          });
          
          // Allow new swaps after transaction finishes
          if (isMounted.current) {
            setIsSwapping(false);
            processingSwapRef.current = false;
          }
        }
        
        // Clear the timeout reference
        transactionTimeoutRef.current = null;
        
      }, 3000); // Simulate processing for 3 seconds
    }, 100);
  };
  
  const closeConfirmation = (closeRequested: boolean) => {
    console.log("Close confirmation requested:", closeRequested, "isSwapping:", isSwapping, "processingSwap:", processingSwapRef.current);
    
    // Only allow closing if we're not in the middle of a swap operation
    if (!isSwapping && !processingSwapRef.current) {
      setShowConfirmation(closeRequested);
    } else if (!closeRequested) {
      // If we're requesting to open the dialog, always allow it
      setShowConfirmation(closeRequested);
    } else {
      console.log("Preventing confirmation dialog close during swap");
    }
  };
  
  const closeTransactionStatus = (closeRequested: boolean) => {
    console.log("Close transaction status requested:", closeRequested, "status:", transactionStatus);
    
    // Prevent closing during 'loading' state
    if (transactionStatus === 'loading' && closeRequested === false) {
      console.log("Preventing transaction status close during loading state");
      return;
    }
    
    // Cancel any pending auto-close
    if (autoCloseTimeoutRef.current) {
      clearTimeout(autoCloseTimeoutRef.current);
      autoCloseTimeoutRef.current = null;
    }
    
    // Allow closing the transaction status dialog when completed
    if (transactionStatus === 'confirmed' || transactionStatus === 'failed') {
      setShowTransactionStatus(closeRequested);
      
      // If closing, reset transaction state
      if (!closeRequested) {
        setTimeout(() => {
          if (isMounted.current) {
            setTransactionStatus('idle');
            setIsSwapping(false);
            processingSwapRef.current = false;
          }
        }, 150); // Small delay to allow animation to complete
      }
    } else {
      setShowTransactionStatus(closeRequested);
    }
  };

  return {
    showConfirmation,
    setShowConfirmation: closeConfirmation,
    showTransactionStatus,
    setShowTransactionStatus: closeTransactionStatus,
    transactionStatus,
    transactionHash,
    errorMessage,
    handleSwapClick,
    handleSwapConfirm
  };
}
