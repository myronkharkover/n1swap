import React from "react";
import { motion } from "framer-motion";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  ComposedChart
} from "recharts";
import { useTheme } from "@/components/ThemeProvider";
import { format } from "date-fns";

const createSampleData = (timeframe: "1H" | "1D" | "1W" | "1M" | "1Y") => {
  const result = [];
  let value = 100 + Math.random() * 50;
  
  const now = new Date();
  
  const timeStep = 
    timeframe === "1H" ? 60 * 1000 : 
    timeframe === "1D" ? 3600 * 1000 : 
    timeframe === "1W" ? 86400 * 1000 : 
    timeframe === "1M" ? 86400 * 1000 : 
    2592000 * 1000;
  
  const points = 
    timeframe === "1H" ? 60 : 
    timeframe === "1D" ? 24 : 
    timeframe === "1W" ? 7 : 
    timeframe === "1M" ? 30 : 
    12;
  
  const skipFactor = timeframe === "1M" ? 3 : 1;
  
  for (let i = points - 1; i >= 0; i -= skipFactor) {
    value = value + (Math.random() - 0.5) * 10;
    
    const date = new Date(now.getTime() - (i * timeStep));
    
    result.push({
      date,
      price: Math.round(value)
    });
  }
  
  return result;
};

const formatXAxis = (date: Date, timeframe: string) => {
  switch (timeframe) {
    case "1H":
      return format(date, "HH:mm");
    case "1D":
      return format(date, "HH:mm");
    case "1W":
      return format(date, "EEE");
    case "1M":
      return format(date, "dd MMM");
    case "1Y":
      return format(date, "MMM");
    default:
      return "";
  }
};

interface PriceChartProps {
  fromToken: string;
  toToken: string;
  className?: string;
}

export function PriceChart({ fromToken, toToken, className }: PriceChartProps) {
  const [timeframe, setTimeframe] = React.useState<"1H" | "1D" | "1W" | "1M" | "1Y">("1D");
  const { theme } = useTheme();
  
  const sampleData = React.useMemo(() => {
    return createSampleData(timeframe);
  }, [timeframe, fromToken, toToken]);

  const axisColor = theme === "dark" ? "#444" : "#e0e0e0";
  
  // Solid purple line color
  const purpleLineColor = "#8B5CF6";
  // Gradient colors that start underneath the line
  const gradientStartColor = purpleLineColor; // Match the line color
  const gradientEndColor = theme === "dark" ? "rgba(0, 0, 0, 0)" : "rgba(255, 255, 255, 0)";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 bg-card text-card-foreground rounded-xl shadow-sm relative z-20 ${className}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-foreground font-['Satoshi']">
          {fromToken} / {toToken}
        </h3>
        <div className="flex gap-1 text-xs">
          {["1H", "1D", "1W", "1M", "1Y"].map((tf) => (
            <button
              key={tf}
              className={`px-2 py-1 rounded font-['Satoshi'] ${
                timeframe === tf 
                  ? "bg-purple-600 text-white" 
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              onClick={() => setTimeframe(tf as any)}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            data={sampleData} 
            margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
          >
            <defs>
              <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="65%" stopColor={gradientStartColor} stopOpacity={0.4} />
                <stop offset="95%" stopColor={gradientEndColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => formatXAxis(date, timeframe)}
              tick={{ fontSize: 10, fill: theme === "dark" ? "#888" : "#333", fontFamily: "Satoshi" }}
              axisLine={{ stroke: axisColor }}
              minTickGap={15}
            />
            <YAxis 
              domain={['auto', 'auto']} 
              tick={{ fontSize: 10, fill: theme === "dark" ? "#888" : "#333", fontFamily: "Satoshi" }} 
              tickFormatter={(value) => `$${value}`}
              width={50}
              axisLine={{ stroke: axisColor }}
            />
            <Tooltip 
              formatter={(value) => [`$${value}`, `Price`]}
              labelFormatter={(date) => formatXAxis(date, timeframe)}
              contentStyle={{ 
                backgroundColor: theme === "dark" ? "#222" : "#fff",
                borderColor: theme === "dark" ? "#444" : "#e0e0e0",
                color: theme === "dark" ? "#fff" : "#333",
                fontFamily: "Satoshi"
              }}
            />
            
            {/* Use only the Area component with the stroke property to combine line and area */}
            <Area
              type="monotone"
              dataKey="price"
              fill="url(#purpleGradient)"
              stroke={purpleLineColor}
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}