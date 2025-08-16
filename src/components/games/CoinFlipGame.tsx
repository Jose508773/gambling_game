import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, ArrowLeft, Sparkles, Zap, Star, Crown } from "lucide-react";

interface CoinFlipGameProps {
  onBack: () => void;
  tokens: number;
  onTokensChange: (newTokens: number) => void;
}

export const CoinFlipGame = ({ onBack, tokens, onTokensChange }: CoinFlipGameProps) => {
  const [bet, setBet] = useState(100);
  const [choice, setChoice] = useState<"heads" | "tails" | null>(null);
  const [result, setResult] = useState<"heads" | "tails" | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [gameResult, setGameResult] = useState<"win" | "lose" | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const flipCoin = () => {
    if (!choice || bet > tokens) return;
    
    setIsFlipping(true);
    setResult(null);
    setGameResult(null);
    setShowCelebration(false);
    
    setTimeout(() => {
      const coinResult = Math.random() < 0.5 ? "heads" : "tails";
      setResult(coinResult);
      setIsFlipping(false);
      
      if (coinResult === choice) {
        setGameResult("win");
        setShowCelebration(true);
        onTokensChange(tokens + bet);
      } else {
        setGameResult("lose");
        onTokensChange(tokens - bet);
      }
    }, 2000);
  };

  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showCelebration]);

  const resetGame = () => {
    setChoice(null);
    setResult(null);
    setGameResult(null);
    setShowCelebration(false);
    setBet(100);
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
            {i % 4 === 3 && <Zap className="w-3 h-3 text-blue-400" />}
          </div>
        ))}
      </div>

    <div className="space-y-6 relative z-10 p-4">
      {/* Casino Win Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 via-red-500/30 to-yellow-400/30 animate-pulse-glow"></div>
          {/* Golden rain effect */}
          {[...Array(30)].map((_, i) => (
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

      <div className="flex items-center gap-3 animate-slide-down">
        <Button variant="ghost" size="sm" onClick={onBack} className="bg-black/50 border border-yellow-400/50 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-300">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
          �� CASINO COIN FLIP ��
        </h2>
        <Zap className="w-6 h-6 text-yellow-400" />
      </div>

      <Card className="bg-gradient-to-br from-black via-red-950 to-black border-4 border-yellow-400 shadow-2xl shadow-yellow-400/50 animate-scale-in relative overflow-hidden group">
        {/* Casino lights border effect */}
        <div className="absolute inset-0 rounded-lg border-2 border-yellow-400 animate-pulse-glow"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-red-500/10 to-yellow-400/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        
        <CardHeader className="text-center relative z-10 animate-slide-up bg-gradient-to-r from-red-900/50 to-amber-900/50 border-b border-yellow-400/30" style={{animationDelay: '0.2s'}}>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
            🎰 CHOOSE YOUR SIDE 🎰
          </CardTitle>
          <CardDescription className="text-yellow-200 text-lg animate-fade-in" style={{animationDelay: '0.4s'}}>
            🪙 Pick heads or tails, place your bet, and flip the coin! 💰
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 relative z-10 bg-gradient-to-b from-transparent to-black/30">
          {/* Casino Coin Display */}
          <div className="flex justify-center relative">
            <div className="absolute inset-0 flex justify-center">
              <div className={`w-40 h-40 rounded-full bg-gradient-to-r from-yellow-400/20 to-red-500/20 animate-pulse-glow ${showCelebration ? 'animate-win-celebration' : ''}`}></div>
            </div>
            <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 via-amber-300 to-yellow-600 border-4 border-yellow-400 flex items-center justify-center text-4xl font-bold transition-all duration-500 relative z-10 shadow-2xl shadow-yellow-400/50 ${
              isFlipping ? 'animate-coin-flip-3d' : gameResult === 'win' ? 'animate-win-celebration' : ''
            } ${gameResult === 'lose' ? 'animate-wiggle' : ''}`}>
              {isFlipping ? (
                <Coins className="w-16 h-16 text-black animate-spin" />
              ) : result ? (
                <span className={`${gameResult === 'win' ? 'text-green-400 animate-heartbeat' : gameResult === 'lose' ? 'text-red-400' : 'text-black'}`}>
                  {result === "heads" ? "🪙" : "🪙"}
                </span>
              ) : (
                <Coins className="w-16 h-16 text-black" />
              )}
            </div>
            
            {/* Casino floating sparkles around coin */}
            {(isFlipping || showCelebration) && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute"
                    style={{
                      left: `${30 + Math.cos(i * 45 * Math.PI / 180) * 40}%`,
                      top: `${50 + Math.sin(i * 45 * Math.PI / 180) * 40}%`,
                      animationDelay: `${i * 0.2}s`
                    }}
                  >
                    {i % 2 === 0 ? <Star className="w-3 h-3 text-yellow-400 animate-particles" /> : <Sparkles className="w-2 h-2 text-red-400 animate-particles" />}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Casino Choice Selection */}
          <div className="grid grid-cols-2 gap-4 animate-bounce-in" style={{animationDelay: '0.6s'}}>
            <Button
              variant={choice === "heads" ? "default" : "outline"}
              size="lg"
              onClick={() => setChoice("heads")}
              disabled={isFlipping}
              className={`h-20 text-lg font-bold transition-all duration-300 hover:scale-105 relative overflow-hidden group ${
                choice === "heads" ? 'bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 text-black border-4 border-yellow-400 shadow-2xl shadow-yellow-400/50 animate-pulse-glow' : 'bg-transparent text-yellow-200 border-4 border-yellow-400/50 hover:border-yellow-400 hover:bg-yellow-400/20'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              <span className="relative z-10 font-bold">🪙 HEADS 🪙</span>
              {choice === "heads" && <Sparkles className="absolute top-2 right-2 w-4 h-4 text-yellow-400 animate-win-celebration" />}
            </Button>
            <Button
              variant={choice === "tails" ? "default" : "outline"}
              size="lg"
              onClick={() => setChoice("tails")}
              disabled={isFlipping}
              className={`h-20 text-lg font-bold transition-all duration-300 hover:scale-105 relative overflow-hidden group ${
                choice === "tails" ? 'bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 text-black border-4 border-yellow-400 shadow-2xl shadow-yellow-400/50 animate-pulse-glow' : 'bg-transparent text-yellow-200 border-4 border-yellow-400/50 hover:border-yellow-400 hover:bg-yellow-400/20'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              <span className="relative z-10 font-bold">🪙 TAILS 🪙</span>
              {choice === "tails" && <Sparkles className="absolute top-2 right-2 w-4 h-4 text-yellow-400 animate-win-celebration" />}
            </Button>
          </div>

          {/* Casino Bet Amount */}
          <div className="space-y-3 animate-slide-up" style={{animationDelay: '0.8s'}}>
            <div className="flex justify-between items-center">
              <span className="text-yellow-200 font-bold text-lg">💰 Bet Amount:</span>
              <span className="text-yellow-400 font-bold text-xl animate-number-pop">{bet} chips</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[100, 250, 500, 1000].map((amount, index) => (
                <Button
                  key={amount}
                  size="sm"
                  onClick={() => setBet(amount)}
                  disabled={amount > tokens || isFlipping}
                  className={`transition-all duration-300 hover:scale-105 ${
                    bet === amount ? 'bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 text-black border-2 border-yellow-400 shadow-lg shadow-yellow-400/50 animate-pulse-glow' : 'bg-transparent text-yellow-200 border-2 border-yellow-400/50 hover:border-yellow-400 hover:bg-yellow-400/20'
                  }`}
                >
                  {amount}
                </Button>
              ))}
            </div>
          </div>

          {/* Casino Game Result */}
          {gameResult && (
            <div className="text-center animate-bounce-in">
              <Badge 
                className={`text-xl py-3 px-6 font-bold relative overflow-hidden ${
                  gameResult === "win" ? 'bg-gradient-to-r from-green-400 via-yellow-400 to-green-400 text-black border-4 border-green-400 shadow-2xl shadow-green-400/50 animate-win-celebration' : 
                  'bg-gradient-to-r from-red-400 via-red-600 to-red-400 text-white border-4 border-red-400 shadow-2xl shadow-red-400/50 animate-wiggle'
                }`}
              >
                {gameResult === "win" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-green-400/30 animate-shimmer"></div>
                )}
                <span className="relative z-10">
                  {gameResult === "win" ? (
                    <>🎉 JACKPOT! +{bet} CHIPS! 🎉</>
                  ) : (
                    <>😔 TOUGH LUCK! -{bet} CHIPS 😔</>
                  )}
                </span>
                {gameResult === "win" && (
                  <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-400 animate-win-celebration" />
                )}
              </Badge>
            </div>
          )}

          {/* Casino Action Buttons */}
          <div className="flex gap-3 animate-slide-up" style={{animationDelay: '1.2s'}}>
            {!gameResult ? (
              <Button
                size="lg"
                className="flex-1 bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 hover:from-yellow-300 hover:via-red-400 hover:to-yellow-300 text-black font-bold hover:shadow-2xl hover:shadow-yellow-400/50 transition-all duration-300 hover:scale-105 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={flipCoin}
                disabled={!choice || bet > tokens || isFlipping}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center gap-2">
                  {isFlipping ? (
                    <>
                      <Coins className="w-4 h-4 animate-spin" />
                      🎰 Flipping...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      🎰 Flip Coin! 🎰
                    </>
                  )}
                </span>
              </Button>
            ) : (
              <Button
                size="lg"
                className="flex-1 bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 hover:from-yellow-300 hover:via-red-400 hover:to-yellow-300 text-black font-bold hover:shadow-2xl hover:shadow-yellow-400/50 transition-all duration-300 hover:scale-105"
                onClick={resetGame}
              >
                <Sparkles className="w-4 h-4 mr-2" />
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