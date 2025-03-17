import React, { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { TokenSearchModal } from "@/components/TokenSearchModal";
import { SwapConfirmationDialog } from "@/components/SwapConfirmationDialog";
import { SwapTransactionStatus } from "@/components/SwapTransactionStatus";
import { SwapDetails, TransactionStatus } from "@/types/token";

interface SwapTransactionFlowProps {
  showTokenSearchModal: boolean;
  activeTokenSide: "from" | "to" | null;
  recentTokens: string[];
  tokens: any[];
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
  showConfirmation: boolean;
  showTransactionStatus: boolean;
  transactionStatus: TransactionStatus;
  transactionHash: string;
  errorMessage: string;
  onTokenSelect: (symbol: string) => void;
  onCloseTokenSearch: () => void;
  setShowConfirmation: (show: boolean) => void;
  onConfirmSwap: () => void;
  setShowTransactionStatus: (show: boolean) => void;
}

export function SwapTransactionFlow({
  showTokenSearchModal,
  activeTokenSide,
  recentTokens,
  tokens,
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
  showConfirmation,
  showTransactionStatus,
  transactionStatus,
  transactionHash,
  errorMessage,
  onTokenSelect,
  onCloseTokenSearch,
  setShowConfirmation,
  onConfirmSwap,
  setShowTransactionStatus
}: SwapTransactionFlowProps) {
  
  // Ensure any modal state changes are cleaned up if the component unmounts
  useEffect(() => {
    return () => {
      // Force cleanup of any open modals on unmount
      if (showConfirmation) {
        setShowConfirmation(false);
      }
      if (showTransactionStatus) {
        setShowTransactionStatus(false);
      }
    };
  }, []);

  // Debug modal states - keep for troubleshooting
  useEffect(() => {
    console.log("SwapTransactionFlow: showConfirmation changed to", showConfirmation);
    console.log("SwapTransactionFlow: showTransactionStatus changed to", showTransactionStatus);
  }, [showConfirmation, showTransactionStatus]);

  return (
    <>
      <AnimatePresence>
        {showTokenSearchModal && (
          <TokenSearchModal
            tokens={tokens}
            onTokenSelect={onTokenSelect}
            onClose={onCloseTokenSearch}
            recentTokens={recentTokens}
          />
        )}
      </AnimatePresence>

      {/* Important: Use separate conditions to mount/unmount dialogs rather than passing visibility */}
      {showConfirmation && (
        <SwapConfirmationDialog 
          open={showConfirmation}
          onOpenChange={setShowConfirmation}
          fromToken={fromToken}
          toToken={toToken}
          fromTokenFullName={fromTokenFullName}
          toTokenFullName={toTokenFullName}
          fromAmount={fromAmount}
          toAmount={toAmount}
          fromAmountUsd={fromAmountUsd}
          toAmountUsd={toAmountUsd}
          slippage={slippage}
          swapDetails={swapDetails}
          onConfirm={onConfirmSwap}
          tokens={tokens}
        />
      )}
      
      {showTransactionStatus && (
        <SwapTransactionStatus
          open={showTransactionStatus}
          onOpenChange={setShowTransactionStatus}
          status={transactionStatus}
          fromToken={fromToken}
          toToken={toToken}
          fromTokenFullName={fromTokenFullName}
          toTokenFullName={toTokenFullName}
          fromAmount={fromAmount}
          toAmount={toAmount}
          transactionHash={transactionHash}
          errorMessage={errorMessage}
          tokens={tokens}
        />
      )}
    </>
  );
}
