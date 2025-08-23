import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles, Star, Crown, Zap, Coins, Trophy } from "lucide-react";

interface RouletteGameProps {
  onBack: () => void;
  tokens: number;
  onTokensChange: (newTokens: number) => void;
}

// Roulette numbers and their properties
const ROULETTE_NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

// Betting options
const BETTING_OPTIONS = {
  red: [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36],
  black: [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35],
  even: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36],
  odd: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35],
  low: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
  high: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
  dozen1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  dozen2: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
  dozen3: [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
  column1: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
  column2: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
  column3: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36]
};

type BetType = keyof typeof BETTING_OPTIONS | 'straight' | 'split' | 'corner' | 'street' | 'line';

interface Bet {
  type: BetType;
  value: number | number[];
  amount: number;
  payout: number;
}

export const RouletteGame = ({ onBack, tokens, onTokensChange }: RouletteGameProps) => {
  const [bets, setBets] = useState<Bet[]>([]);
  const [currentBet, setCurrentBet] = useState(100);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [winAmount, setWinAmount] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [selectedBetType, setSelectedBetType] = useState<BetType | null>(null);

  const spinWheel = () => {
    if (bets.length === 0) return;
    
    const totalBet = bets.reduce((sum, bet) => sum + bet.amount, 0);
    if (totalBet > tokens) return;
    
    setIsSpinning(true);
    setResult(null);
    setWinAmount(0);
    setShowCelebration(false);
    
    // Deduct total bet
    onTokensChange(tokens - totalBet);
    
    // Simulate spinning
    setTimeout(() => {
      const spinResult = ROULETTE_NUMBERS[Math.floor(Math.random() * ROULETTE_NUMBERS.length)];
      setResult(spinResult);
      setIsSpinning(false);
      
      // Calculate winnings
      const winnings = calculateWinnings(spinResult, bets);
      if (winnings > 0) {
        setWinAmount(winnings);
        setShowCelebration(true);
        onTokensChange(tokens - totalBet + winnings);
      }
    }, 3000);
  };

  const calculateWinnings = (spinResult: number, currentBets: Bet[]): number => {
    let totalWinnings = 0;
    
    currentBets.forEach(bet => {
      let won = false;
      
      switch (bet.type) {
        case 'straight':
          won = spinResult === bet.value;
          break;
        case 'red':
          won = BETTING_OPTIONS.red.includes(spinResult);
          break;
        case 'black':
          won = BETTING_OPTIONS.black.includes(spinResult);
          break;
        case 'even':
          won = BETTING_OPTIONS.even.includes(spinResult);
          break;
        case 'odd':
          won = BETTING_OPTIONS.odd.includes(spinResult);
          break;
        case 'low':
          won = BETTING_OPTIONS.low.includes(spinResult);
          break;
        case 'high':
          won = BETTING_OPTIONS.high.includes(spinResult);
          break;
        case 'dozen1':
          won = BETTING_OPTIONS.dozen1.includes(spinResult);
          break;
        case 'dozen2':
          won = BETTING_OPTIONS.dozen2.includes(spinResult);
          break;
        case 'dozen3':
          won = BETTING_OPTIONS.dozen3.includes(spinResult);
          break;
        case 'column1':
          won = BETTING_OPTIONS.column1.includes(spinResult);
          break;
        case 'column2':
          won = BETTING_OPTIONS.column2.includes(spinResult);
          break;
        case 'column3':
          won = BETTING_OPTIONS.column3.includes(spinResult);
          break;
        case 'split':
          won = Array.isArray(bet.value) && bet.value.includes(spinResult);
          break;
        case 'corner':
          won = Array.isArray(bet.value) && bet.value.includes(spinResult);
          break;
        case 'street':
          won = Array.isArray(bet.value) && bet.value.includes(spinResult);
          break;
        case 'line':
          won = Array.isArray(bet.value) && bet.value.includes(spinResult);
          break;
      }
      
      if (won) {
        totalWinnings += bet.amount * bet.payout;
      }
    });
    
    return totalWinnings;
  };

  const addBet = () => {
    if (!selectedBetType || selectedNumbers.length === 0) return;
    
    let payout = 1;
    let value: number | number[] = selectedNumbers[0];
    
    switch (selectedBetType) {
      case 'straight':
        payout = 35;
        value = selectedNumbers[0];
        break;
      case 'split':
        payout = 17;
        value = selectedNumbers;
        break;
      case 'corner':
        payout = 8;
        value = selectedNumbers;
        break;
      case 'street':
        payout = 11;
        value = selectedNumbers;
        break;
      case 'line':
        payout = 5;
        value = selectedNumbers;
        break;
      case 'red':
      case 'black':
      case 'even':
      case 'odd':
      case 'low':
      case 'high':
        payout = 1;
        value = 0;
        break;
      case 'dozen1':
      case 'dozen2':
      case 'dozen3':
      case 'column1':
      case 'column2':
      case 'column3':
        payout = 2;
        value = 0;
        break;
    }
    
    const newBet: Bet = {
      type: selectedBetType,
      value,
      amount: currentBet,
      payout
    };
    
    setBets([...bets, newBet]);
    setSelectedNumbers([]);
    setSelectedBetType(null);
  };

  const removeBet = (index: number) => {
    setBets(bets.filter((_, i) => i !== index));
  };

  const clearBets = () => {
    setBets([]);
    setSelectedNumbers([]);
    setSelectedBetType(null);
  };

  const resetGame = () => {
    setBets([]);
    setResult(null);
    setWinAmount(0);
    setShowCelebration(false);
    setSelectedNumbers([]);
    setSelectedBetType(null);
    setCurrentBet(100);
  };

  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => setShowCelebration(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showCelebration]);

  const getNumberColor = (num: number) => {
    if (num === 0) return 'bg-green-600';
    return BETTING_OPTIONS.red.includes(num) ? 'bg-red-600' : 'bg-black';
  };

  const totalBet = bets.reduce((sum, bet) => sum + bet.amount, 0);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Casino Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-black to-red-900">
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
            {i % 4 === 1 && <Sparkles className="w-3 h-3 text-green-400" />}
            {i % 4 === 2 && <Crown className="w-5 h-5 text-amber-400" />}
            {i % 4 === 3 && <Zap className="w-3 h-3 text-red-400" />}
          </div>
        ))}
      </div>

      {/* Win Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 via-green-500/30 to-yellow-400/30 animate-pulse-glow"></div>
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
          <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-green-500 to-yellow-400 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
            🎰 ROULETTE WHEEL 🎰
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Roulette Wheel */}
          <Card className="bg-gradient-to-br from-black via-green-950 to-black border-4 border-yellow-400 shadow-2xl shadow-yellow-400/50 animate-scale-in relative overflow-hidden group">
            <CardHeader className="text-center relative z-10 animate-slide-up bg-gradient-to-r from-green-900/50 to-black/50 border-b border-yellow-400/30">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-green-400 to-yellow-400 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
                🎰 ROULETTE WHEEL 🎰
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6 relative z-10 bg-gradient-to-b from-transparent to-black/30">
              {/* Wheel Display */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-64 h-64 bg-gradient-to-br from-yellow-600 via-yellow-500 to-yellow-600 rounded-full border-4 border-yellow-400 shadow-2xl shadow-yellow-400/50 flex items-center justify-center relative overflow-hidden">
                    {isSpinning ? (
                      <div className="w-56 h-56 bg-gradient-to-br from-green-600 via-red-600 to-green-600 rounded-full border-4 border-white animate-spin flex items-center justify-center">
                        <div className="text-4xl font-bold text-white">🎰</div>
                      </div>
                    ) : result !== null ? (
                      <div className="w-56 h-56 bg-gradient-to-br from-green-600 via-red-600 to-green-600 rounded-full border-4 border-white flex items-center justify-center">
                        <div className={`text-6xl font-bold text-white ${getNumberColor(result)} rounded-full w-20 h-20 flex items-center justify-center`}>
                          {result}
                        </div>
                      </div>
                    ) : (
                      <div className="w-56 h-56 bg-gradient-to-br from-green-600 via-red-600 to-green-600 rounded-full border-4 border-white flex items-center justify-center">
                        <div className="text-4xl font-bold text-white">?</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Result Display */}
              {result !== null && (
                <div className="text-center animate-bounce-in">
                  <div className="bg-black/50 border border-yellow-400 rounded-lg p-4 inline-block">
                    <p className="text-2xl font-bold text-yellow-400">
                      🎰 RESULT: {result} 🎰
                    </p>
                    {winAmount > 0 && (
                      <p className="text-xl font-bold text-green-400 mt-2">
                        💰 WIN: {winAmount.toLocaleString()} TOKENS! 💰
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Spin Button */}
              <Button
                onClick={spinWheel}
                disabled={bets.length === 0 || isSpinning || totalBet > tokens}
                className="w-full h-16 text-xl font-bold bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 text-black border-4 border-yellow-400 shadow-2xl shadow-yellow-400/50 hover:scale-105 transition-all duration-300 animate-pulse-glow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSpinning ? (
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 bg-black rounded-full animate-spin flex items-center justify-center">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    </div>
                    <span>🎰 SPINNING... 🎰</span>
                  </div>
                ) : (
                  <span>🎰 SPIN THE WHEEL! 🎰</span>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Betting Area */}
          <Card className="bg-gradient-to-br from-black via-red-950 to-black border-4 border-yellow-400 shadow-2xl shadow-yellow-400/50 animate-scale-in relative overflow-hidden group">
            <CardHeader className="text-center relative z-10 animate-slide-up bg-gradient-to-r from-red-900/50 to-black/50 border-b border-yellow-400/30">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-red-400 to-yellow-400 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
                💰 PLACE YOUR BETS 💰
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6 relative z-10 bg-gradient-to-b from-transparent to-black/30">
              {/* Bet Amount */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-yellow-400">Bet Amount: {currentBet} tokens</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[100, 250, 500, 1000].map((amount) => (
                    <Button
                      key={amount}
                      onClick={() => setCurrentBet(amount)}
                      disabled={amount > tokens}
                      className={`h-12 text-sm font-bold border-2 transition-all duration-300 hover:scale-110 ${
                        currentBet === amount
                          ? 'bg-gradient-to-br from-green-600 to-green-500 border-green-400 text-white shadow-2xl shadow-green-400/50 animate-pulse-glow'
                          : amount > tokens
                          ? 'bg-gray-800 border-gray-600 text-gray-500 cursor-not-allowed'
                          : 'bg-black/50 border-green-400 text-green-400 hover:bg-green-400 hover:text-black'
                      }`}
                    >
                      {amount}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Betting Options */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-yellow-400">Betting Options</h3>
                
                {/* Outside Bets */}
                <div className="grid grid-cols-2 gap-2">
                  {(['red', 'black', 'even', 'odd', 'low', 'high'] as const).map((type) => (
                    <Button
                      key={type}
                      onClick={() => setSelectedBetType(type)}
                      disabled={isSpinning}
                      className={`h-10 text-sm font-bold border-2 transition-all duration-300 ${
                        selectedBetType === type
                          ? 'bg-gradient-to-br from-purple-600 to-purple-500 border-purple-400 text-white shadow-2xl shadow-purple-400/50 animate-pulse-glow'
                          : 'bg-black/50 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black'
                      }`}
                    >
                      {type.toUpperCase()} (1:1)
                    </Button>
                  ))}
                </div>

                {/* Dozens and Columns */}
                <div className="grid grid-cols-2 gap-2">
                  {(['dozen1', 'dozen2', 'dozen3'] as const).map((type) => (
                    <Button
                      key={type}
                      onClick={() => setSelectedBetType(type)}
                      disabled={isSpinning}
                      className={`h-10 text-sm font-bold border-2 transition-all duration-300 ${
                        selectedBetType === type
                          ? 'bg-gradient-to-br from-blue-600 to-blue-500 border-blue-400 text-white shadow-2xl shadow-blue-400/50 animate-pulse-glow'
                          : 'bg-black/50 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black'
                      }`}
                    >
                      {type.replace('dozen', 'DOZEN ')} (2:1)
                    </Button>
                  ))}
                  {(['column1', 'column2', 'column3'] as const).map((type) => (
                    <Button
                      key={type}
                      onClick={() => setSelectedBetType(type)}
                      disabled={isSpinning}
                      className={`h-10 text-sm font-bold border-2 transition-all duration-300 ${
                        selectedBetType === type
                          ? 'bg-gradient-to-br from-blue-600 to-blue-500 border-blue-400 text-white shadow-2xl shadow-blue-400/50 animate-pulse-glow'
                          : 'bg-black/50 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black'
                      }`}
                    >
                      {type.replace('column', 'COLUMN ')} (2:1)
                    </Button>
                  ))}
                </div>

                {/* Straight Bet */}
                <div className="space-y-2">
                  <Button
                    onClick={() => setSelectedBetType('straight')}
                    disabled={isSpinning}
                    className={`w-full h-10 text-sm font-bold border-2 transition-all duration-300 ${
                      selectedBetType === 'straight'
                        ? 'bg-gradient-to-br from-red-600 to-red-500 border-red-400 text-white shadow-2xl shadow-red-400/50 animate-pulse-glow'
                        : 'bg-black/50 border-red-400 text-red-400 hover:bg-red-400 hover:text-black'
                    }`}
                  >
                    STRAIGHT BET (35:1)
                  </Button>
                  {selectedBetType === 'straight' && (
                    <div className="grid grid-cols-6 gap-1">
                      {Array.from({ length: 37 }, (_, i) => (
                        <Button
                          key={i}
                          onClick={() => setSelectedNumbers([i])}
                          disabled={isSpinning}
                          className={`h-8 text-xs font-bold border transition-all duration-300 ${
                            selectedNumbers.includes(i)
                              ? 'bg-gradient-to-br from-red-600 to-red-500 border-red-400 text-white shadow-2xl shadow-red-400/50'
                              : 'bg-black/50 border-red-400 text-red-400 hover:bg-red-400 hover:text-black'
                          }`}
                        >
                          {i}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Add Bet Button */}
              <Button
                onClick={addBet}
                disabled={!selectedBetType || (selectedBetType === 'straight' && selectedNumbers.length === 0) || isSpinning}
                className="w-full h-12 text-lg font-bold bg-gradient-to-r from-green-600 to-green-500 text-white border-4 border-green-400 shadow-2xl shadow-green-400/50 hover:scale-105 transition-all duration-300"
              >
                💰 ADD BET 💰
              </Button>

              {/* Current Bets */}
              {bets.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-yellow-400">Current Bets: {totalBet} tokens</h3>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {bets.map((bet, index) => (
                      <div key={index} className="flex items-center justify-between bg-black/50 p-2 rounded border border-yellow-400/30">
                        <span className="text-yellow-200 text-sm">
                          {bet.type.toUpperCase()}: {bet.amount} tokens ({bet.payout}:1)
                        </span>
                        <Button
                          size="sm"
                          onClick={() => removeBet(index)}
                          disabled={isSpinning}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          ✕
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={clearBets}
                    disabled={isSpinning}
                    className="w-full h-10 text-sm font-bold bg-red-600 hover:bg-red-700 text-white border-2 border-red-400"
                  >
                    🗑️ CLEAR ALL BETS
                  </Button>
                </div>
              )}

              {/* Game Result Display */}
              {result !== null && (
                <div className="text-center animate-bounce-in">
                  {winAmount > 0 ? (
                    <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-4 rounded-xl border-4 border-green-400 shadow-2xl shadow-green-400/50 animate-win-celebration">
                      <div className="text-2xl mb-2">🎉 WINNER! 🎉</div>
                      <div className="text-xl font-bold">+{winAmount.toLocaleString()} TOKENS!</div>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-red-600 to-red-500 text-white p-4 rounded-xl border-4 border-red-400 shadow-2xl shadow-red-400/50 animate-wiggle">
                      <div className="text-2xl mb-2">💔 NO LUCK! 💔</div>
                      <div className="text-xl font-bold">-{totalBet} TOKENS</div>
                    </div>
                  )}
                </div>
              )}

              {/* Reset Button */}
              {result !== null && (
                <Button
                  onClick={resetGame}
                  className="w-full h-12 text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-500 text-white border-4 border-blue-400 shadow-2xl shadow-blue-400/50 hover:scale-105 transition-all duration-300"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  🎰 PLAY AGAIN! 🎰
                  <Sparkles className="w-5 h-5 ml-2" />
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
