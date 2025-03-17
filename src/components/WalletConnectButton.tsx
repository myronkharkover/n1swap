
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Wallet, LogOut, ChevronDown } from "lucide-react";
import { useWallet } from "./WalletProvider";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "./ThemeProvider";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

export function WalletConnectButton({ className }: { className?: string }) {
  const { connected, connecting, address, connectWallet, disconnectWallet, phantomConnect } = useWallet();
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();

  // Format address to show abbreviated form
  const formatAddress = (address: string | null) => {
    if (!address) return "";
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
  };

  if (!connected) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "rounded-full shadow-md gap-2",
              "dark:bg-black dark:border-purple-900/50 dark:hover:bg-purple-950/30",
              "bg-white/90 backdrop-blur-sm border border-purple-200 hover:bg-purple-50/70",
              className
            )}
            onClick={() => setOpen(true)}
            disabled={connecting}
          >
            <Wallet className="h-[1rem] w-[1rem] text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-['Satoshi'] font-medium text-purple-700 dark:text-purple-300">
              {connecting ? "Connecting..." : "Connect Wallet"}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60 p-0" align="end">
          <div className="flex flex-col p-2">
            <div className="p-2 text-sm font-['Satoshi'] font-medium text-center border-b border-gray-100 dark:border-gray-800">
              Select a wallet
            </div>
            <button
              className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mt-1"
              onClick={() => {
                phantomConnect();
                setOpen(false);
              }}
            >
              <img 
                src="/uploads/10878691-867e-4514-bf9f-a1fbbfa66450.png" 
                alt="Phantom Wallet" 
                className="w-8 h-8"
              />
              <div className="text-sm font-['Satoshi']">Phantom Wallet</div>
            </button>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "rounded-full shadow-md gap-2",
            "dark:bg-black dark:border-purple-900/50 dark:hover:bg-purple-950/30",
            "bg-white/90 backdrop-blur-sm border border-purple-200 hover:bg-purple-50/70",
            className
          )}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <Avatar className="h-5 w-5 mr-0.5">
              <AvatarImage src="/uploads/10878691-867e-4514-bf9f-a1fbbfa66450.png" alt="Phantom" />
              <AvatarFallback className="bg-purple-100 text-purple-600 text-[10px]">PH</AvatarFallback>
            </Avatar>
            <span className="text-xs font-['Satoshi'] font-medium text-purple-700 dark:text-purple-300">
              {formatAddress(address)}
            </span>
            <ChevronDown className="h-3 w-3 text-purple-600 dark:text-purple-400" />
          </motion.div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        <DropdownMenuItem 
          className="flex items-center gap-2 text-red-500 dark:text-red-400 cursor-pointer"
          onClick={disconnectWallet}
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm font-['Satoshi']">Disconnect</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
