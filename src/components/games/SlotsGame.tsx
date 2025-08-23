import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles, Star, Crown, Zap, Coins, Trophy } from "lucide-react";

interface SlotsGameProps {
  onBack: () => void;
  tokens: number;
  onTokensChange: (newTokens: number) => void;
}

// Slot symbols with their values and frequencies
const SLOT_SYMBOLS = [
  { symbol: "🍒", name: "Cherry", value: 10, frequency: 0.3 },
  { symbol: "🍋", name: "Lemon", value: 20, frequency: 0.25 },
  { symbol: "🍊", name: "Orange", value: 30, frequency: 0.2 },
  { symbol: "💎", name: "Diamond", value: 50, frequency: 0.15 },
  { symbol: "7️⃣", name: "Seven", value: 100, frequency: 0.08 },
  { symbol: "🎰", name: "Slot", value: 200, frequency: 0.02 }
];

const REEL_COUNT = 3;
const SYMBOLS_PER_REEL = 3;

export const SlotsGame = ({ onBack, tokens, onTokensChange }: SlotsGameProps) => {
  const [bet, setBet] = useState(100);
  const [reels, setReels] = useState<string[][]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [gameResult, setGameResult] = useState<"win" | "lose" | null>(null);
  const [winAmount, setWinAmount] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [winLines, setWinLines] = useState<number[]>([]);

  // Initialize reels
  useEffect(() => {
    initializeReels();
  }, []);

  const initializeReels = () => {
    const newReels = Array(REEL_COUNT).fill(null).map(() => 
      Array(SYMBOLS_PER_REEL).fill(null).map(() => 
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)].symbol
      )
    );
    setReels(newReels);
  };

  const spinReels = () => {
    if (bet > tokens) return;
    
    setIsSpinning(true);
    setGameResult(null);
    setWinAmount(0);
    setShowCelebration(false);
    setWinLines([]);
    
    // Deduct bet immediately
    onTokensChange(tokens - bet);
    
    // Simulate spinning animation
    const spinDuration = 3000;
    const spinInterval = 100;
    const iterations = spinDuration / spinInterval;
    let currentIteration = 0;
    
    const spinIntervalId = setInterval(() => {
      const tempReels = Array(REEL_COUNT).fill(null).map(() => 
        Array(SYMBOLS_PER_REEL).fill(null).map(() => 
          SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)].symbol
        )
      );
      setReels(tempReels);
      
      currentIteration++;
      if (currentIteration >= iterations) {
        clearInterval(spinIntervalId);
        finishSpin();
      }
    }, spinInterval);
  };

  const finishSpin = () => {
    // Generate final result
    const finalReels = Array(REEL_COUNT).fill(null).map(() => 
      Array(SYMBOLS_PER_REEL).fill(null).map(() => 
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)].symbol
      )
    );
    
    setReels(finalReels);
    setIsSpinning(false);
    
    // Check for wins
    const result = checkWin(finalReels);
    if (result.won) {
      setGameResult("win");
      setWinAmount(result.amount);
      setWinLines(result.lines);
      setShowCelebration(true);
      onTokensChange(tokens - bet + result.amount);
    } else {
      setGameResult("lose");
    }
  };

  const checkWin = (reels: string[][]) => {
    let totalWin = 0;
    const winningLines: number[] = [];
    
    // Check horizontal lines
    for (let row = 0; row < SYMBOLS_PER_REEL; row++) {
      const symbols = reels.map(reel => reel[row]);
      const firstSymbol = symbols[0];
      const isWin = symbols.every(symbol => symbol === firstSymbol);
      
      if (isWin) {
        const symbolData = SLOT_SYMBOLS.find(s => s.symbol === firstSymbol);
        if (symbolData) {
          const lineWin = bet * (symbolData.value / 10);
          totalWin += lineWin;
          winningLines.push(row);
        }
      }
    }
    
    // Check diagonal lines (top-left to bottom-right)
    const diagonal1 = [reels[0][0], reels[1][1], reels[2][2]];
    const diagonal2 = [reels[0][2], reels[1][1], reels[2][0]];
    
    if (diagonal1.every(symbol => symbol === diagonal1[0])) {
      const symbolData = SLOT_SYMBOLS.find(s => s.symbol === diagonal1[0]);
      if (symbolData) {
        totalWin += bet * (symbolData.value / 10);
        winningLines.push(3); // Diagonal 1
      }
    }
    
    if (diagonal2.every(symbol => symbol === diagonal2[0])) {
      const symbolData = SLOT_SYMBOLS.find(s => s.symbol === diagonal2[0]);
      if (symbolData) {
        totalWin += bet * (symbolData.value / 10);
        winningLines.push(4); // Diagonal 2
      }
    }
    
    return {
      won: totalWin > 0,
      amount: totalWin,
      lines: winningLines
    };
  };

  const resetGame = () => {
    setGameResult(null);
    setWinAmount(0);
    setShowCelebration(false);
    setWinLines([]);
    setBet(100);
    initializeReels();
  };

  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => setShowCelebration(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showCelebration]);

  const getSymbolValue = (symbol: string) => {
    return SLOT_SYMBOLS.find(s => s.symbol === symbol)?.value || 0;
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Casino Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-blue-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffd700' fill-opacity='0.05'%3E%3Cpath d='M30 30L15 15v30h30V15L30 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Floating Casino Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            {i % 4 === 0 && <Star className="w-4 h-4 text-yellow-400" />}
            {i % 4 === 1 && <Sparkles className="w-3 h-3 text-purple-400" />}
            {i % 4 === 2 && <Crown className="w-5 h-5 text-amber-400" />}
            {i % 4 === 3 && <Zap className="w-3 h-3 text-blue-400" />}
          </div>
        ))}
      </div>

      {/* Win Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 via-purple-500/30 to-yellow-400/30 animate-pulse-glow"></div>
          {/* Golden rain effect */}
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-particles"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 space-y-6 p-4">
        <div className="flex items-center gap-3 animate-slide-down">
          <Button variant="ghost" size="sm" onClick={onBack} className="bg-black/50 border border-yellow-400/50 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-300">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-purple-500 to-yellow-400 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
            🎰 SLOT MACHINE 🎰
          </h2>
        </div>

        <Card className="bg-gradient-to-br from-black via-purple-950 to-black border-4 border-yellow-400 shadow-2xl shadow-yellow-400/50 animate-scale-in relative overflow-hidden group">
          {/* Casino lights border effect */}
          <div className="absolute inset-0 rounded-lg border-2 border-yellow-400 animate-pulse-glow"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-purple-500/10 to-yellow-400/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          <CardHeader className="text-center relative z-10 animate-slide-up bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-b border-yellow-400/30" style={{animationDelay: '0.2s'}}>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-purple-400 to-yellow-400 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
              🎰 SPIN TO WIN! 🎰
            </CardTitle>
            <CardDescription className="text-yellow-200 text-lg animate-fade-in" style={{animationDelay: '0.4s'}}>
              Match symbols to win BIG! 💰
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8 relative z-10 bg-gradient-to-b from-transparent to-black/30">
            {/* Slot Machine Display */}
            <div className="flex justify-center relative">
              <div className="relative">
                {/* Slot machine frame */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-600 via-yellow-500 to-yellow-600 rounded-3xl blur-xl scale-110 animate-pulse-glow"></div>
                
                <div className="w-80 h-48 bg-gradient-to-br from-yellow-600 via-yellow-500 to-yellow-600 rounded-3xl border-4 border-yellow-400 shadow-2xl shadow-yellow-400/50 flex items-center justify-center relative overflow-hidden">
                  {/* Reels container */}
                  <div className="w-72 h-36 bg-black rounded-2xl border-2 border-yellow-400 flex items-center justify-center relative overflow-hidden">
                    {/* Reels */}
                    <div className="flex gap-2 w-full h-full p-2">
                      {reels.map((reel, reelIndex) => (
                        <div key={reelIndex} className="flex-1 flex flex-col gap-1">
                          {reel.map((symbol, symbolIndex) => (
                            <div
                              key={symbolIndex}
                              className={`w-full h-10 bg-gradient-to-br from-white to-gray-200 rounded-lg border-2 border-gray-300 flex items-center justify-center text-2xl font-bold transition-all duration-300 ${
                                isSpinning ? 'animate-spin-slow' : ''
                              } ${
                                winLines.includes(symbolIndex) || winLines.includes(symbolIndex + 3) || winLines.includes(symbolIndex + 6)
                                  ? 'border-green-400 bg-green-100 shadow-green-400/50 animate-pulse-glow'
                                  : 'border-gray-300'
                              }`}
                            >
                              {symbol}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                    
                    {/* Win line indicators */}
                    {winLines.map((line, index) => (
                      <div
                        key={index}
                        className="absolute w-full h-1 bg-gradient-to-r from-green-400 to-yellow-400 animate-pulse-glow"
                        style={{
                          top: line < 3 ? `${line * 33.33 + 16.67}%` : 
                               line === 3 ? '50%' : 
                               line === 4 ? '50%' : '50%',
                          transform: line === 3 ? 'rotate(45deg)' : 
                                   line === 4 ? 'rotate(-45deg)' : 'none',
                          width: line < 3 ? '100%' : '140%',
                          left: line >= 3 ? '-20%' : '0%'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Symbol Values Display */}
            <div className="bg-gradient-to-r from-black/80 to-purple-900/50 border border-yellow-400/50 p-4 rounded-lg">
              <h4 className="text-lg font-bold text-yellow-400 mb-3 text-center">💰 SYMBOL VALUES 💰</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                {SLOT_SYMBOLS.map((symbol) => (
                  <div key={symbol.symbol} className="flex items-center gap-2 bg-black/50 p-2 rounded border border-yellow-400/30">
                    <span className="text-2xl">{symbol.symbol}</span>
                    <span className="text-yellow-200 font-bold">{symbol.value}x</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Betting Interface */}
            <div className="space-y-6 animate-slide-up" style={{animationDelay: '0.8s'}}>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-yellow-400 mb-2">💰 PLACE YOUR BET 💰</h3>
                <p className="text-3xl font-bold text-green-400">{bet.toLocaleString()} TOKENS</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[100, 250, 500, 1000].map((amount) => (
                  <Button
                    key={amount}
                    onClick={() => setBet(amount)}
                    disabled={amount > tokens || isSpinning}
                    className={`h-16 text-lg font-bold border-4 transition-all duration-300 hover:scale-110 ${
                      bet === amount
                        ? 'bg-gradient-to-br from-green-600 to-green-500 border-green-400 text-white shadow-2xl shadow-green-400/50 animate-pulse-glow'
                        : amount > tokens
                        ? 'bg-gray-800 border-gray-600 text-gray-500 cursor-not-allowed'
                        : 'bg-black/50 border-green-400 text-green-400 hover:bg-green-400 hover:text-black'
                    }`}
                  >
                    <div className="text-center">
                      <div>🪙</div>
                      <div>{amount}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Game Rules */}
            <div className="bg-gradient-to-r from-black/80 to-purple-900/50 border border-yellow-400/50 p-6 rounded-lg animate-fade-in" style={{animationDelay: '1.2s'}}>
              <h4 className="text-xl font-bold text-yellow-400 mb-4 text-center">🎰 SLOT RULES 🎰</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-200">
                <div className="space-y-2">
                  <p><span className="text-green-400 font-bold">🎯 MATCH SYMBOLS:</span> Win on any line!</p>
                  <p><span className="text-blue-400">• HORIZONTAL:</span> 3 matching symbols</p>
                  <p><span className="text-purple-400">• DIAGONAL:</span> 3 matching symbols</p>
                  <p><span className="text-yellow-400">• MULTIPLE LINES:</span> Win on multiple lines!</p>
                </div>
                <div className="space-y-2">
                  <p><span className="text-red-400 font-bold">💰 PAYOUTS:</span> Bet × Symbol Value</p>
                  <p>🍒 Cherry: 10x | 🍋 Lemon: 20x</p>
                  <p>🍊 Orange: 30x | 💎 Diamond: 50x</p>
                  <p>7️⃣ Seven: 100x | 🎰 Slot: 200x</p>
                </div>
              </div>
            </div>

            {/* Game Result Display */}
            {gameResult && (
              <div className="text-center animate-bounce-in">
                {gameResult === "win" && (
                  <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6 rounded-xl border-4 border-green-400 shadow-2xl shadow-green-400/50 animate-win-celebration">
                    <div className="text-4xl mb-2">🎉 JACKPOT! 🎉</div>
                    <div className="text-2xl font-bold">+{winAmount.toLocaleString()} TOKENS!</div>
                    <div className="text-lg">💰 BIG WIN! 💰</div>
                  </div>
                )}
                
                {gameResult === "lose" && (
                  <div className="bg-gradient-to-r from-red-600 to-red-500 text-white p-6 rounded-xl border-4 border-red-400 shadow-2xl shadow-red-400/50 animate-wiggle">
                    <div className="text-4xl mb-2">💔 NO LUCK! 💔</div>
                    <div className="text-2xl font-bold">-{bet} TOKENS</div>
                    <div className="text-lg">Try again! 🎰</div>
                  </div>
                )}
              </div>
            )}

            {/* Spin Button */}
            <div className="flex gap-3 animate-slide-up" style={{animationDelay: '1.4s'}}>
              {!gameResult ? (
                <Button
                  onClick={spinReels}
                  disabled={bet > tokens || isSpinning}
                  className="w-full h-20 text-2xl font-bold bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 text-black border-4 border-yellow-400 shadow-2xl shadow-yellow-400/50 hover:scale-105 transition-all duration-300 animate-pulse-glow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSpinning ? (
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-black rounded-full animate-spin flex items-center justify-center">
                        <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                      </div>
                      <span>🎰 SPINNING... 🎰</span>
                    </div>
                  ) : (
                    <span>🎰 SPIN THE SLOTS! 🎰</span>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={resetGame}
                  className="w-full h-20 text-2xl font-bold bg-gradient-to-r from-green-600 to-green-500 text-white border-4 border-green-400 shadow-2xl shadow-green-400/50 hover:scale-105 transition-all duration-300"
                >
                  <Sparkles className="w-6 h-6 mr-3" />
                  🎰 SPIN AGAIN! 🎰
                  <Sparkles className="w-6 h-6 ml-3" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
