
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Swap from "./pages/Swap";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./components/ThemeProvider";
import { ThemeToggle } from "./components/ThemeToggle";
import { WalletProvider } from "./components/WalletProvider";
import { WalletConnectButton } from "./components/WalletConnectButton";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <WalletProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <div className="fixed top-5 right-5 z-50 flex flex-col items-end gap-3">
            <WalletConnectButton />
            <ThemeToggle className="relative top-0 right-0" />
          </div>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/swap" replace />} />
              <Route path="/swap" element={<Swap />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </WalletProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
