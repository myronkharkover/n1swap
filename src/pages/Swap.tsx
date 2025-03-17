
import React from "react";
import { useTheme } from "@/components/ThemeProvider";
import { SwapContainer } from "@/components/SwapContainer";
import { SwapTransactionFlow } from "@/components/SwapTransactionFlow";
import { useSwapState } from "@/hooks/useSwapState";
import { AnimatedGradientBackground } from "@/components/AnimatedGradientBackground";

const Swap = () => {
  const { theme } = useTheme();
  const swapState = useSwapState();
  
  // Determine if any modal is active
  const isModalActive = swapState.showTokenSearchModal || swapState.showConfirmation || swapState.showTransactionStatus;
  
  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen w-full bg-transparent p-4 overflow-hidden pt-16 sm:pt-12">
      {/* Place the background at a lower z-index to ensure it's behind the modal */}
      <AnimatedGradientBackground duration={15} className="fixed inset-0 z-[-1]" />
      
      {/* Main content - always interactive */}
      <div className="relative z-10 w-full flex justify-center items-center">
        <SwapContainer 
          fromToken={swapState.fromToken}
          toToken={swapState.toToken}
          tokens={swapState.tokens}
          setFromToken={swapState.setFromToken}
          setToToken={swapState.setToToken}
          fromAmount={swapState.fromAmount}
          toAmount={swapState.toAmount}
          fromAmountUsd={swapState.fromAmountUsd}
          toAmountUsd={swapState.toAmountUsd}
          setFromAmount={swapState.setFromAmount}
          setToAmount={swapState.setToAmount}
          selectedPercentage={swapState.selectedPercentage}
          setSelectedPercentage={swapState.setSelectedPercentage}
          swapDetails={swapState.swapDetails}
          handleSwapClick={swapState.handleSwapClick}
          handleTokenSelectForSide={swapState.handleTokenSelectForSide}
          showSlippageMenu={swapState.showSlippageMenu}
          slippage={swapState.slippage}
          onToggleSlippageMenu={() => swapState.setShowSlippageMenu(!swapState.showSlippageMenu)}
          onSelectSlippage={swapState.setSlippage}
        />
      </div>

      {/* 
        Modal layer - IMPORTANT: Using an overlay div that allows clicks to pass through
        when no modal is active, and blocks clicks when a modal is showing
      */}
      <div 
        className={`fixed inset-0 z-[100] transition-all duration-200 ${!isModalActive ? 'pointer-events-none' : ''}`}
        aria-hidden={!isModalActive}
      >
        <SwapTransactionFlow 
          showTokenSearchModal={swapState.showTokenSearchModal}
          activeTokenSide={swapState.activeTokenSide}
          recentTokens={swapState.recentTokens}
          tokens={swapState.tokens}
          fromToken={swapState.fromToken}
          toToken={swapState.toToken}
          fromTokenFullName={swapState.fromTokenFullName}
          toTokenFullName={swapState.toTokenFullName}
          fromAmount={swapState.fromAmount}
          toAmount={swapState.toAmount}
          fromAmountUsd={swapState.fromAmountUsd}
          toAmountUsd={swapState.toAmountUsd}
          slippage={swapState.slippage}
          swapDetails={swapState.swapDetails}
          showConfirmation={swapState.showConfirmation}
          showTransactionStatus={swapState.showTransactionStatus}
          transactionStatus={swapState.transactionStatus}
          transactionHash={swapState.transactionHash}
          errorMessage={swapState.errorMessage}
          onTokenSelect={swapState.handleTokenSelect}
          onCloseTokenSearch={() => swapState.setShowTokenSearchModal(false)}
          setShowConfirmation={swapState.setShowConfirmation}
          onConfirmSwap={swapState.handleSwapConfirm}
          setShowTransactionStatus={swapState.setShowTransactionStatus}
        />
      </div>
    </div>
  );
};

export default Swap;
