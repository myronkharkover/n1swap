
import { useState } from "react";

export function useSlippageSettings() {
  const [slippage, setSlippage] = useState<string>("0.5");
  const [showSlippageMenu, setShowSlippageMenu] = useState<boolean>(false);

  return {
    slippage,
    setSlippage,
    showSlippageMenu,
    setShowSlippageMenu
  };
}
