import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Sparkles, Star, Crown, Zap } from "lucide-react";

interface DiceRollerGameProps {
  onBack: () => void;
  tokens: number;
  onTokensChange: (newTokens: number) => void;
}

const DiceComponents = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

export const DiceRollerGame = ({ onBack, tokens, onTokensChange }: DiceRollerGameProps) => {
  const [bet, setBet] = useState(100);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [gameResult, setGameResult] = useState<"win" | "lose" | "tie" | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [betMode, setBetMode] = useState<"highlow" | "exact">("highlow");
  const [highLowChoice, setHighLowChoice] = useState<"high" | "low" | null>(null);

  const rollDice = () => {
    if (betMode === "highlow" && !highLowChoice) return;
    if (betMode === "exact" && !prediction) return;
    if (bet > tokens) return;
    
    setIsRolling(true);
    setDiceResult(null);
    setGameResult(null);
    setShowCelebration(false);
    
    setTimeout(() => {
      const result = Math.floor(Math.random() * 6) + 1;
      setDiceResult(result);
      setIsRolling(false);
      
      let won = false;
      let tie = false;
      let multiplier = 1;
      
      if (betMode === "highlow") {
        if (result === 3) {
          // Tie - get money back
          tie = true;
          setGameResult("tie");
          // No tokens change for tie
        } else if (
          (highLowChoice === "high" && result > 3) ||
          (highLowChoice === "low" && result < 3)
        ) {
          won = true;
          multiplier = 2; // 2x for high/low
        }
      } else {
        // Exact number betting
        if (result === prediction) {
          won = true;
          multiplier = 6; // 6x for exact number
        }
      }
      
      if (tie) {
        // Keep the same tokens for tie
      } else if (won) {
        setGameResult("win");
        setShowCelebration(true);
        onTokensChange(tokens + bet * (multiplier - 1)); // -1 because we keep original bet
      } else {
        setGameResult("lose");
        onTokensChange(tokens - bet);
      }
    }, 2500);
  };

  const resetGame = () => {
    setPrediction(null);
    setHighLowChoice(null);
    setDiceResult(null);
    setGameResult(null);
    setShowCelebration(false);
    setBet(100);
  };

  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showCelebration]);

  const getMultiplier = () => {
    if (betMode === "exact") return "6x";
    return "2x";
  };

  const getWinnings = () => {
    if (betMode === "exact") return bet * 6;
    return bet * 2;
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

      {/* Win Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 via-red-500/30 to-yellow-400/30 animate-pulse-glow"></div>
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
          <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
            🎲 CASINO DICE 🎲
          </h2>
        </div>

        <Card className="bg-gradient-to-br from-black via-red-950 to-black border-4 border-yellow-400 shadow-2xl shadow-yellow-400/50 animate-scale-in relative overflow-hidden group">
          {/* Casino lights border effect */}
          <div className="absolute inset-0 rounded-lg border-2 border-yellow-400 animate-pulse-glow"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-red-500/10 to-yellow-400/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          <CardHeader className="text-center relative z-10 animate-slide-up bg-gradient-to-r from-red-900/50 to-amber-900/50 border-b border-yellow-400/30" style={{animationDelay: '0.2s'}}>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-red-400 to-yellow-400 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
              🎰 ROLL THE DICE 🎰
            </CardTitle>
            <CardDescription className="text-yellow-200 text-lg animate-fade-in" style={{animationDelay: '0.4s'}}>
              Choose your strategy and WIN BIG! 💰
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8 relative z-10 bg-gradient-to-b from-transparent to-black/30">
            {/* Giant Casino Dice Display */}
            <div className="flex justify-center relative">
              <div className="relative">
                {/* Dice glow effect */}
                <div className="absolute inset-0 bg-yellow-400/20 rounded-3xl blur-xl scale-110 animate-pulse-glow"></div>
                
                {isRolling ? (
                  <div className="w-32 h-32 bg-gradient-to-br from-red-600 via-yellow-400 to-red-600 rounded-3xl border-4 border-yellow-400 shadow-2xl shadow-yellow-400/50 flex items-center justify-center animate-spin relative">
                    <div className="absolute inset-2 bg-gradient-to-br from-white to-gray-200 rounded-2xl animate-pulse"></div>
                    <Sparkles className="w-16 h-16 text-yellow-600 z-10 animate-spin" style={{animationDirection: 'reverse'}} />
                  </div>
                ) : diceResult ? (
                  <div className={`w-32 h-32 bg-gradient-to-br from-white to-gray-100 rounded-3xl border-4 shadow-2xl flex items-center justify-center relative transition-all duration-500 ${
                    gameResult === 'win' ? 'border-green-400 shadow-green-400/50 animate-win-celebration' : 
                    gameResult === 'lose' ? 'border-red-400 shadow-red-400/50 animate-wiggle' :
                    gameResult === 'tie' ? 'border-yellow-400 shadow-yellow-400/50 animate-pulse' :
                    'border-yellow-400 shadow-yellow-400/50'
                  }`}>
                    {(() => {
                      const DiceComponent = DiceComponents[diceResult - 1];
                      return <DiceComponent className={`w-20 h-20 ${
                        gameResult === 'win' ? 'text-green-600' : 
                        gameResult === 'lose' ? 'text-red-600' :
                        gameResult === 'tie' ? 'text-yellow-600' :
                        'text-black'
                      }`} />;
                    })()}
                    
                    {/* Result sparkles */}
                    {gameResult === 'win' && (
                      <div className="absolute inset-0">
                        {[...Array(8)].map((_, i) => (
                          <Sparkles
                            key={i}
                            className="absolute w-4 h-4 text-green-400 animate-ping"
                            style={{
                              left: `${10 + Math.cos(i * 45 * Math.PI / 180) * 50}%`,
                              top: `${50 + Math.sin(i * 45 * Math.PI / 180) * 50}%`,
                              animationDelay: `${i * 0.1}s`
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-white to-gray-100 rounded-3xl border-4 border-yellow-400 shadow-2xl shadow-yellow-400/50 flex items-center justify-center hover:scale-105 transition-transform duration-300">
                    <div className="text-6xl font-bold text-gray-400">?</div>
                  </div>
                )}
              </div>
            </div>

            {diceResult && (
              <div className="text-center animate-bounce-in">
                <div className="bg-black/50 border border-yellow-400 rounded-lg p-4 inline-block">
                  <p className="text-3xl font-bold text-yellow-400">
                    🎲 ROLLED: {diceResult} 🎲
                  </p>
                </div>
              </div>
            )}

            {/* Casino Game Mode Selection */}
            <div className="grid grid-cols-2 gap-6 animate-bounce-in" style={{animationDelay: '0.6s'}}>
              <Button
                variant={betMode === "highlow" ? "default" : "outline"}
                onClick={() => {setBetMode("highlow"); setPrediction(null); setHighLowChoice(null);}}
                disabled={isRolling}
                className={`h-20 text-lg font-bold border-2 transition-all duration-300 hover:scale-105 ${
                  betMode === "highlow" 
                    ? 'bg-gradient-to-r from-green-600 to-green-500 border-green-400 text-white shadow-lg shadow-green-400/50' 
                    : 'bg-black/50 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black'
                }`}
              >
                <div className="text-center">
                  <div>🎯 HIGH/LOW</div>
                  <div className="text-sm">2x Payout</div>
                </div>
              </Button>
              <Button
                variant={betMode === "exact" ? "default" : "outline"}
                onClick={() => {setBetMode("exact"); setPrediction(null); setHighLowChoice(null);}}
                disabled={isRolling}
                className={`h-20 text-lg font-bold border-2 transition-all duration-300 hover:scale-105 ${
                  betMode === "exact" 
                    ? 'bg-gradient-to-r from-red-600 to-red-500 border-red-400 text-white shadow-lg shadow-red-400/50' 
                    : 'bg-black/50 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black'
                }`}
              >
                <div className="text-center">
                  <div>🎰 EXACT NUMBER</div>
                  <div className="text-sm">6x Payout</div>
                </div>
              </Button>
            </div>

            {/* Casino Betting Interface */}
            {betMode === "highlow" ? (
              <div className="space-y-6 animate-slide-up" style={{animationDelay: '0.8s'}}>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-yellow-400 mb-4">🎲 HIGH OR LOW? 🎲</h3>
                  <p className="text-yellow-200 mb-6">Roll 3 = TIE (get money back) | Above 3 = HIGH | Below 3 = LOW</p>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <Button
                    onClick={() => setHighLowChoice("low")}
                    disabled={isRolling || gameResult !== null}
                    className={`h-24 text-2xl font-bold border-4 transition-all duration-300 hover:scale-110 ${
                      highLowChoice === "low"
                        ? 'bg-gradient-to-br from-blue-600 to-blue-500 border-blue-400 text-white shadow-2xl shadow-blue-400/50 animate-pulse-glow'
                        : 'bg-black/50 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black'
                    }`}
                  >
                    <div className="text-center">
                      <div>🔽 LOW</div>
                      <div className="text-lg">(1, 2)</div>
                    </div>
                  </Button>
                  
                  <Button
                    onClick={() => setHighLowChoice("high")}
                    disabled={isRolling || gameResult !== null}
                    className={`h-24 text-2xl font-bold border-4 transition-all duration-300 hover:scale-110 ${
                      highLowChoice === "high"
                        ? 'bg-gradient-to-br from-red-600 to-red-500 border-red-400 text-white shadow-2xl shadow-red-400/50 animate-pulse-glow'
                        : 'bg-black/50 border-red-400 text-red-400 hover:bg-red-400 hover:text-black'
                    }`}
                  >
                    <div className="text-center">
                      <div>🔼 HIGH</div>
                      <div className="text-lg">(4, 5, 6)</div>
                    </div>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-slide-up" style={{animationDelay: '0.8s'}}>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-yellow-400 mb-4">🎯 EXACT NUMBER 🎯</h3>
                  <p className="text-yellow-200 mb-6">Pick the exact number that will be rolled!</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <Button
                      key={num}
                      onClick={() => setPrediction(num)}
                      disabled={isRolling || gameResult !== null}
                      className={`h-20 text-2xl font-bold border-4 transition-all duration-300 hover:scale-110 ${
                        prediction === num
                          ? 'bg-gradient-to-br from-purple-600 to-purple-500 border-purple-400 text-white shadow-2xl shadow-purple-400/50 animate-pulse-glow'
                          : 'bg-black/50 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black'
                      }`}
                    >
                      {num}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Payout Display */}
            {((betMode === "highlow" && highLowChoice) || (betMode === "exact" && prediction)) && (
              <div className="text-center animate-bounce-in">
                <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black p-4 rounded-lg border-2 border-yellow-400 shadow-lg">
                  <p className="text-xl font-bold">
                    💰 POTENTIAL WIN: {getWinnings().toLocaleString()} tokens ({getMultiplier()})
                  </p>
                </div>
              </div>
            )}

            {/* Casino Betting Chips */}
            <div className="space-y-6 animate-slide-up" style={{animationDelay: '1s'}}>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-yellow-400 mb-2">💰 PLACE YOUR BET 💰</h3>
                <p className="text-3xl font-bold text-green-400">{bet.toLocaleString()} TOKENS</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[100, 250, 500, 1000].map((amount) => (
                  <Button
                    key={amount}
                    onClick={() => setBet(amount)}
                    disabled={amount > tokens || isRolling || gameResult !== null}
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

            {/* Casino Rules */}
            <div className="bg-gradient-to-r from-black/80 to-red-900/50 border border-yellow-400/50 p-6 rounded-lg animate-fade-in" style={{animationDelay: '1.2s'}}>
              <h4 className="text-xl font-bold text-yellow-400 mb-4 text-center">🎰 CASINO RULES 🎰</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-200">
                <div className="space-y-2">
                  <p><span className="text-green-400 font-bold">🎯 HIGH/LOW:</span> 2x payout</p>
                  <p><span className="text-blue-400">• LOW:</span> Roll 1 or 2</p>
                  <p><span className="text-red-400">• HIGH:</span> Roll 4, 5, or 6</p>
                  <p><span className="text-yellow-400">• TIE:</span> Roll 3 (money back)</p>
                </div>
                <div className="space-y-2">
                  <p><span className="text-purple-400 font-bold">🎰 EXACT:</span> 6x payout</p>
                  <p>Pick the exact number (1-6)</p>
                  <p>Higher risk = Higher reward!</p>
                  <p className="text-red-400 font-bold">💰 BIG MONEY! 💰</p>
                </div>
              </div>
            </div>

            {/* Game Result Display */}
            {gameResult && (
              <div className="text-center animate-bounce-in">
                {gameResult === "win" && (
                  <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6 rounded-xl border-4 border-green-400 shadow-2xl shadow-green-400/50 animate-win-celebration">
                    <div className="text-4xl mb-2">🎉 WINNER! 🎉</div>
                    <div className="text-2xl font-bold">+{bet * (betMode === "exact" ? 5 : 1)} TOKENS!</div>
                    <div className="text-lg">💰 JACKPOT! 💰</div>
                  </div>
                )}
                
                {gameResult === "lose" && (
                  <div className="bg-gradient-to-r from-red-600 to-red-500 text-white p-6 rounded-xl border-4 border-red-400 shadow-2xl shadow-red-400/50 animate-wiggle">
                    <div className="text-4xl mb-2">💔 TOUGH LUCK! 💔</div>
                    <div className="text-2xl font-bold">-{bet} TOKENS</div>
                    <div className="text-lg">Try again! 🎲</div>
                  </div>
                )}
                
                {gameResult === "tie" && (
                  <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black p-6 rounded-xl border-4 border-yellow-400 shadow-2xl shadow-yellow-400/50 animate-pulse">
                    <div className="text-4xl mb-2">🤝 TIE GAME! 🤝</div>
                    <div className="text-2xl font-bold">Money Back!</div>
                    <div className="text-lg">No risk, no reward! 🎲</div>
                  </div>
                )}
              </div>
            )}

            {/* Casino Action Button */}
            <div className="flex gap-3 animate-slide-up" style={{animationDelay: '1.4s'}}>
              {!gameResult ? (
                <Button
                  onClick={rollDice}
                  disabled={
                    (betMode === "highlow" && !highLowChoice) ||
                    (betMode === "exact" && !prediction) ||
                    bet > tokens ||
                    isRolling
                  }
                  className="w-full h-20 text-2xl font-bold bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 text-black border-4 border-yellow-400 shadow-2xl shadow-yellow-400/50 hover:scale-105 transition-all duration-300 animate-pulse-glow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRolling ? (
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-black rounded-full animate-spin flex items-center justify-center">
                        <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                      </div>
                      <span>🎲 ROLLING... 🎲</span>
                    </div>
                  ) : (
                    <span>🎰 ROLL THE DICE! 🎰</span>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={resetGame}
                  className="w-full h-20 text-2xl font-bold bg-gradient-to-r from-green-600 to-green-500 text-white border-4 border-green-400 shadow-2xl shadow-green-400/50 hover:scale-105 transition-all duration-300"
                >
                  <Sparkles className="w-6 h-6 mr-3" />
                  🎲 PLAY AGAIN! 🎲
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