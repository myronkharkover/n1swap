
interface PhantomProvider {
  isPhantom?: boolean;
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
}

interface PhantomSolana {
  isPhantom?: boolean;
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
}

interface PhantomWindow {
  phantom?: {
    solana?: PhantomSolana;
  };
}

declare global {
  interface Window extends PhantomWindow {}
}

export {};
