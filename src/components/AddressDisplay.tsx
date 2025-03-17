
import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddressDisplayProps {
  address: string;
  truncateLength?: number;
  className?: string;
  iconSize?: number;
}

export function AddressDisplay({ 
  address, 
  truncateLength = 4, 
  className,
  iconSize = 14
}: AddressDisplayProps) {
  const [copied, setCopied] = useState(false);

  const truncatedAddress = address ? 
    `${address.substring(0, truncateLength)}...${address.substring(address.length - truncateLength)}` : 
    '';

  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className={cn("inline-flex items-center text-xs cursor-pointer group", className)}
      onClick={copyToClipboard}
    >
      <span className="text-stone-500 group-hover:text-stone-700 dark:group-hover:text-stone-300 transition-colors">
        {truncatedAddress}
      </span>
      <span className="ml-1.5">
        {copied ? (
          <Check size={iconSize} className="text-green-500" />
        ) : (
          <Copy size={iconSize} className="text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors" />
        )}
      </span>
    </div>
  );
}
