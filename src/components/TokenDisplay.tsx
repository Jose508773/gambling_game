import { useState, useEffect } from "react";
import { Coins, Plus, TrendingUp, TrendingDown, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TokenDisplayProps {
  tokens: number;
  onBuyTokens: () => void;
  isWatchingAd?: boolean;
}

// Animated Counter Component
const AnimatedCounter = ({ value, previousValue }: { value: number; previousValue: number }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const isIncreasing = value > previousValue;
  const isDecreasing = value < previousValue;

  useEffect(() => {
    if (value !== displayValue) {
      setIsAnimating(true);
      const duration = 1000; // 1 second
      const startTime = Date.now();
      const startValue = displayValue;
      const diff = value - startValue;

      const animateValue = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.round(startValue + diff * easeOutQuart);
        
        setDisplayValue(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(animateValue);
        } else {
          setIsAnimating(false);
        }
      };
      
      requestAnimationFrame(animateValue);
    }
  }, [value, displayValue]);

  return (
    <div className="relative">
      <p className={`text-xl font-bold bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent transition-all duration-300 ${
        isAnimating ? 'animate-number-pop' : ''
      } ${isIncreasing ? 'text-green-400' : isDecreasing ? 'text-red-400' : ''}`}>
        {displayValue.toLocaleString()}
      </p>
      {isAnimating && isIncreasing && (
        <TrendingUp className="absolute -top-1 -right-6 w-4 h-4 text-green-400 animate-bounce-in" />
      )}
      {isAnimating && isDecreasing && (
        <TrendingDown className="absolute -top-1 -right-6 w-4 h-4 text-red-400 animate-bounce-in" />
      )}
    </div>
  );
};

export const TokenDisplay = ({ tokens, onBuyTokens, isWatchingAd = false }: TokenDisplayProps) => {
  const [previousTokens, setPreviousTokens] = useState(tokens);

  useEffect(() => {
    if (tokens !== previousTokens) {
      setPreviousTokens(tokens);
    }
  }, [tokens, previousTokens]);

  return (
    <div className="flex items-center gap-3 bg-gradient-to-br from-black via-red-950 to-black p-4 rounded-lg border-4 border-yellow-400 hover:border-yellow-300 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/50 hover:scale-105 group relative overflow-hidden">
      {/* Casino background shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-red-500/10 to-yellow-400/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      <div className="absolute inset-0 rounded-lg border-2 border-yellow-400/50 animate-pulse-glow"></div>
      
      <div className="flex items-center gap-2 relative z-10">
        <div className="p-2 bg-yellow-400/20 rounded-full animate-spin" style={{animationDuration: '3s'}}>
          <Coins className="w-6 h-6 text-yellow-400" />
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-1">
        <p className="text-xs text-yellow-200/80 font-bold">
          📺 Watch Ad
        </p>
        <p className="text-lg font-bold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
          +1000
        </p>
      </div>
      
      <Button 
        size="sm" 
        onClick={onBuyTokens}
        disabled={isWatchingAd}
        className={`ml-auto relative z-10 text-black font-bold hover:shadow-2xl hover:shadow-yellow-400/50 transition-all duration-300 hover:scale-105 ${
          isWatchingAd 
            ? 'bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 cursor-not-allowed opacity-50' 
            : 'bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 hover:from-yellow-300 hover:via-red-400 hover:to-yellow-300'
        }`}
      >
        {isWatchingAd ? (
          <>
            <div className="w-4 h-4 mr-1 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            📺 Watching Ad...
          </>
        ) : (
          <>
            <Plus className="w-4 h-4 mr-1" />
            📺 Watch Ad (+1000)
          </>
        )}
      </Button>
      
      {/* Casino floating sparkles */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Star className="absolute top-2 right-8 w-3 h-3 text-yellow-400 animate-particles" style={{animationDelay: '0s'}} />
        <Sparkles className="absolute top-4 right-12 w-4 h-4 text-red-400 animate-particles" style={{animationDelay: '0.3s'}} />
        <Star className="absolute top-3 right-16 w-3 h-3 text-amber-400 animate-particles" style={{animationDelay: '0.6s'}} />
      </div>
    </div>
  );
};