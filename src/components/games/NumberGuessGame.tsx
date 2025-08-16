import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Target, Dice6, Star, Sparkles, Crown } from "lucide-react";

interface NumberGuessGameProps {
  onBack: () => void;
  tokens: number;
  onTokensChange: (newTokens: number) => void;
}

export const NumberGuessGame = ({ onBack, tokens, onTokensChange }: NumberGuessGameProps) => {
  const [bet, setBet] = useState(100);
  const [guess, setGuess] = useState("");
  const [targetNumber, setTargetNumber] = useState<number | null>(null);
  const [result, setResult] = useState<"win" | "lose" | "close" | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);

  const playGame = () => {
    const guessNum = parseInt(guess);
    if (isNaN(guessNum) || guessNum < 1 || guessNum > 100 || bet > tokens) return;
    
    setIsRevealing(true);
    const target = Math.floor(Math.random() * 100) + 1;
    setTargetNumber(target);
    
    setTimeout(() => {
      const difference = Math.abs(target - guessNum);
      
      if (difference === 0) {
        setResult("win");
        onTokensChange(tokens + bet * 10); // 10x multiplier for exact guess
      } else if (difference <= 5) {
        setResult("close");
        onTokensChange(tokens + Math.floor(bet * 0.5)); // 0.5x for close guess
      } else {
        setResult("lose");
        onTokensChange(tokens - bet);
      }
      setIsRevealing(false);
    }, 2000);
  };

  const resetGame = () => {
    setGuess("");
    setTargetNumber(null);
    setResult(null);
    setBet(100);
  };

  const getResultMessage = () => {
    if (!result || !targetNumber) return "";
    
    switch (result) {
      case "win":
        return `🎯 Perfect! Number was ${targetNumber}. +${bet * 10} tokens!`;
      case "close":
        return `🎯 Close! Number was ${targetNumber}. +${Math.floor(bet * 0.5)} tokens!`;
      case "lose":
        return `😔 Wrong! Number was ${targetNumber}. -${bet} tokens.`;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Casino Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-black to-amber-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffd700' fill-opacity='0.05'%3E%3Cpath d='M30 30L15 15v30h30V15L30 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Floating Casino Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
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
            {i % 4 === 1 && <Sparkles className="w-3 h-3 text-red-400" />}
            {i % 4 === 2 && <Crown className="w-5 h-5 text-amber-400" />}
            {i % 4 === 3 && <Target className="w-3 h-3 text-blue-400" />}
          </div>
        ))}
      </div>

    <div className="space-y-6 relative z-10 p-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="bg-black/50 border border-yellow-400/50 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-300">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
          🎯 CASINO NUMBER GUESS 🎯
        </h2>
      </div>

      <Card className="bg-gradient-to-br from-black via-red-950 to-black border-4 border-yellow-400 shadow-2xl shadow-yellow-400/50 relative overflow-hidden group">
        {/* Casino lights border effect */}
        <div className="absolute inset-0 rounded-lg border-2 border-yellow-400 animate-pulse-glow"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-red-500/10 to-yellow-400/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        
        <CardHeader className="text-center relative z-10 bg-gradient-to-r from-red-900/50 to-amber-900/50 border-b border-yellow-400/30">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%] flex items-center justify-center gap-2">
            <Target className="w-8 h-8 text-yellow-400" />
            🎯 GUESS THE NUMBER 🎯
          </CardTitle>
          <CardDescription className="text-yellow-200 text-lg">
            🎰 Pick a number between 1-100. Exact = 10x, Within 5 = 0.5x 💰
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 relative z-10 bg-gradient-to-b from-transparent to-black/30">
          {/* Casino Number Display */}
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 via-amber-300 to-yellow-600 border-4 border-yellow-400 flex items-center justify-center text-4xl font-bold text-black shadow-2xl shadow-yellow-400/50">
              {isRevealing ? (
                <Dice6 className="w-16 h-16 animate-spin text-black" />
              ) : targetNumber ? (
                <span className={`${result === 'win' ? 'text-green-600 animate-heartbeat' : result === 'close' ? 'text-yellow-600' : 'text-red-600'}`}>
                  {targetNumber}
                </span>
              ) : (
                "?"
              )}
            </div>
          </div>

          {/* Casino Guess Input */}
          <div className="space-y-3">
            <div className="flex justify-center">
              <Input
                type="number"
                placeholder="🎯 Enter your guess (1-100) 🎯"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                min="1"
                max="100"
                disabled={isRevealing || result !== null}
                className="text-center text-lg font-bold max-w-64 bg-black/50 border-4 border-yellow-400 text-yellow-200 placeholder:text-yellow-400/50 focus:border-yellow-300 focus:ring-yellow-300"
              />
            </div>
          </div>

          {/* Casino Bet Amount */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-yellow-200 font-bold text-lg">💰 Bet Amount:</span>
              <span className="text-yellow-400 font-bold text-xl">{bet} chips</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[100, 250, 500, 1000].map((amount) => (
                <Button
                  key={amount}
                  size="sm"
                  onClick={() => setBet(amount)}
                  disabled={amount > tokens || isRevealing || result !== null}
                  className={`transition-all duration-300 hover:scale-105 ${
                    bet === amount ? 'bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 text-black border-2 border-yellow-400 shadow-lg shadow-yellow-400/50 animate-pulse-glow' : 'bg-transparent text-yellow-200 border-2 border-yellow-400/50 hover:border-yellow-400 hover:bg-yellow-400/20'
                  }`}
                >
                  {amount}
                </Button>
              ))}
            </div>
          </div>

          {/* Casino Multiplier Info */}
          <div className="bg-gradient-to-br from-black via-red-950 to-black p-4 rounded-lg border-4 border-yellow-400">
            <h4 className="font-bold text-yellow-200 mb-2 text-lg">🎰 CASINO PAYOUTS 🎰:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-yellow-200">🎯 Exact guess:</span>
                <span className="text-green-400 font-bold">10x bet</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-200">🎯 Within 5:</span>
                <span className="text-yellow-400 font-bold">0.5x bet</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-200">🎯 Other:</span>
                <span className="text-red-400 font-bold">Lose bet</span>
              </div>
            </div>
          </div>

          {/* Casino Game Result */}
          {result && (
            <div className="text-center">
              <Badge 
                className={`text-xl py-3 px-6 font-bold ${
                  result === "win" ? 'bg-gradient-to-r from-green-400 via-yellow-400 to-green-400 text-black border-4 border-green-400 shadow-2xl shadow-green-400/50 animate-win-celebration' : 
                  result === "close" ? 'bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 text-black border-4 border-yellow-400 shadow-2xl shadow-yellow-400/50 animate-pulse' :
                  'bg-gradient-to-r from-red-400 via-red-600 to-red-400 text-white border-4 border-red-400 shadow-2xl shadow-red-400/50 animate-wiggle'
                }`}
              >
                {getResultMessage()}
              </Badge>
            </div>
          )}

          {/* Casino Action Buttons */}
          <div className="flex gap-3">
            {!result ? (
              <Button
                size="lg"
                className="flex-1 bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 hover:from-yellow-300 hover:via-red-400 hover:to-yellow-300 text-black font-bold hover:shadow-2xl hover:shadow-yellow-400/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={playGame}
                disabled={!guess || bet > tokens || isRevealing}
              >
                {isRevealing ? "🎰 Revealing..." : "🎯 Submit Guess! 🎯"}
              </Button>
            ) : (
              <Button
                size="lg"
                className="flex-1 bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 hover:from-yellow-300 hover:via-red-400 hover:to-yellow-300 text-black font-bold hover:shadow-2xl hover:shadow-yellow-400/50 transition-all duration-300 hover:scale-105"
                onClick={resetGame}
              >
                🎰 Play Again! 🎰
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
  );
};