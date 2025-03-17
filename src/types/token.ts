
export interface Token {
  symbol: string;
  name: string;
  balance: string;
  usdValue?: string;
  icon?: string;
  contractAddress?: string;
}

export interface SlippageOption {
  value: string;
  label: string;
}

export interface SwapDetails {
  networkFee: string;
  priceImpact: string;
  exchangeRate: string;
}

export type TransactionStatus = 'idle' | 'confirming' | 'loading' | 'confirmed' | 'failed';

export interface TransactionResult {
  status: TransactionStatus;
  hash?: string;
  errorMessage?: string;
  progress?: number;
}
