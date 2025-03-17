
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";

interface WalletContextType {
  connected: boolean;
  connecting: boolean;
  address: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  phantomConnect: () => void;
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  connecting: false,
  address: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  phantomConnect: () => {},
});

export const useWallet = () => useContext(WalletContext);

interface WalletProviderProps {
  children: React.ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  // Check if wallet was previously connected
  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress");
    if (savedAddress) {
      setAddress(savedAddress);
      setConnected(true);
    }
  }, []);

  // Function to automatically connect to Phantom wallet (no actual connection)
  const phantomConnect = () => {
    // Only connect if not already connected
    if (connected) return;
    
    // Generate a fake wallet address
    const mockWalletAddress = `${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 10)}`;
    
    // Update application state
    setAddress(mockWalletAddress);
    setConnected(true);
    localStorage.setItem("walletAddress", mockWalletAddress);
    
    toast.success("Wallet connected successfully!");
  };

  // Function to connect to Phantom wallet
  const connectWallet = async () => {
    // If already connected, do nothing
    if (connected) return;
    
    setConnecting(true);
    
    try {
      // Auto-connect with phantom connect directly 
      phantomConnect();
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet. Please try again.");
    } finally {
      setConnecting(false);
    }
  };

  // Function to disconnect wallet
  const disconnectWallet = () => {
    try {
      // Clear local state
      setAddress(null);
      setConnected(false);
      localStorage.removeItem("walletAddress");
      
      toast.success("Wallet disconnected");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast.error("Failed to disconnect wallet");
    }
  };

  return (
    <WalletContext.Provider
      value={{
        connected,
        connecting,
        address,
        connectWallet,
        disconnectWallet,
        phantomConnect
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
