import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles, Star, Crown, Zap, Coins, Trophy } from "lucide-react";

interface PokerShowdownGameProps {
  onBack: () => void;
  tokens: number;
  onTokensChange: (newTokens: number) => void;
}

// Card suits and ranks
const SUITS = ['♠️', '♥️', '♦️', '♣️'];
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

interface Card {
  suit: string;
  rank: string;
  value: number;
}

interface Hand {
  cards: Card[];
  rank: string;
  value: number;
}

export const PokerShowdownGame = ({ onBack, tokens, onTokensChange }: PokerShowdownGameProps) => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [aiHand, setAiHand] = useState<Card[]>([]);
  const [bet, setBet] = useState(100);
  const [pot, setPot] = useState(0);
  const [gamePhase, setGamePhase] = useState<'betting' | 'dealing' | 'reveal' | 'result'>('betting');
  const [gameResult, setGameResult] = useState<'win' | 'lose' | 'tie' | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [aiBet, setAiBet] = useState(0);
  const [playerHandRank, setPlayerHandRank] = useState<string>('');
  const [aiHandRank, setAiHandRank] = useState<string>('');

  // Initialize deck
  useEffect(() => {
    initializeDeck();
  }, []);

  const initializeDeck = () => {
    const newDeck: Card[] = [];
    SUITS.forEach(suit => {
      RANKS.forEach((rank, index) => {
        newDeck.push({
          suit,
          rank,
          value: index + 2
        });
      });
    });
    setDeck(shuffleDeck(newDeck));
  };

  const shuffleDeck = (cards: Card[]): Card[] => {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const dealCards = () => {
    if (bet > tokens) return;
    
    setGamePhase('dealing');
    onTokensChange(tokens - bet);
    setPot(bet * 2); // Player bet + AI bet
    
    // Deal 5 cards to each player
    const newDeck = [...deck];
    const playerCards: Card[] = [];
    const aiCards: Card[] = [];
    
    for (let i = 0; i < 5; i++) {
      playerCards.push(newDeck.pop()!);
      aiCards.push(newDeck.pop()!);
    }
    
    setPlayerHand(playerCards);
    setAiHand(aiCards);
    setDeck(newDeck);
    
    // Evaluate hands
    const playerHandResult = evaluateHand(playerCards);
    const aiHandResult = evaluateHand(aiCards);
    
    setPlayerHandRank(playerHandResult.rank);
    setAiHandRank(aiHandResult.rank);
    
    // Determine winner
    setTimeout(() => {
      setGamePhase('reveal');
      
      setTimeout(() => {
        let result: 'win' | 'lose' | 'tie';
        if (playerHandResult.value > aiHandResult.value) {
          result = 'win';
          setShowCelebration(true);
          onTokensChange(tokens - bet + pot);
        } else if (playerHandResult.value < aiHandResult.value) {
          result = 'lose';
        } else {
          result = 'tie';
          onTokensChange(tokens - bet + bet); // Return bet on tie
        }
        
        setGameResult(result);
        setGamePhase('result');
      }, 2000);
    }, 2000);
  };

  const evaluateHand = (cards: Card[]): Hand => {
    const sortedCards = [...cards].sort((a, b) => b.value - a.value);
    
    // Check for different hand types
    if (isRoyalFlush(sortedCards)) return { cards: sortedCards, rank: 'Royal Flush', value: 10 };
    if (isStraightFlush(sortedCards)) return { cards: sortedCards, rank: 'Straight Flush', value: 9 };
    if (isFourOfAKind(sortedCards)) return { cards: sortedCards, rank: 'Four of a Kind', value: 8 };
    if (isFullHouse(sortedCards)) return { cards: sortedCards, rank: 'Full House', value: 7 };
    if (isFlush(sortedCards)) return { cards: sortedCards, rank: 'Flush', value: 6 };
    if (isStraight(sortedCards)) return { cards: sortedCards, rank: 'Straight', value: 5 };
    if (isThreeOfAKind(sortedCards)) return { cards: sortedCards, rank: 'Three of a Kind', value: 4 };
    if (isTwoPair(sortedCards)) return { cards: sortedCards, rank: 'Two Pair', value: 3 };
    if (isOnePair(sortedCards)) return { cards: sortedCards, rank: 'One Pair', value: 2 };
    
    return { cards: sortedCards, rank: 'High Card', value: 1 };
  };

  const isRoyalFlush = (cards: Card[]): boolean => {
    return isStraightFlush(cards) && cards[0].value === 14;
  };

  const isStraightFlush = (cards: Card[]): boolean => {
    return isFlush(cards) && isStraight(cards);
  };

  const isFourOfAKind = (cards: Card[]): boolean => {
    const groups = groupByValue(cards);
    return Object.values(groups).some(group => group.length === 4);
  };

  const isFullHouse = (cards: Card[]): boolean => {
    const groups = groupByValue(cards);
    const values = Object.values(groups);
    return values.some(group => group.length === 3) && values.some(group => group.length === 2);
  };

  const isFlush = (cards: Card[]): boolean => {
    return cards.every(card => card.suit === cards[0].suit);
  };

  const isStraight = (cards: Card[]): boolean => {
    for (let i = 0; i < cards.length - 1; i++) {
      if (cards[i].value - cards[i + 1].value !== 1) return false;
    }
    return true;
  };

  const isThreeOfAKind = (cards: Card[]): boolean => {
    const groups = groupByValue(cards);
    return Object.values(groups).some(group => group.length === 3);
  };

  const isTwoPair = (cards: Card[]): boolean => {
    const groups = groupByValue(cards);
    const pairs = Object.values(groups).filter(group => group.length === 2);
    return pairs.length === 2;
  };

  const isOnePair = (cards: Card[]): boolean => {
    const groups = groupByValue(cards);
    return Object.values(groups).some(group => group.length === 2);
  };

  const groupByValue = (cards: Card[]): Record<number, Card[]> => {
    return cards.reduce((groups, card) => {
      if (!groups[card.value]) groups[card.value] = [];
      groups[card.value].push(card);
      return groups;
    }, {} as Record<number, Card[]>);
  };

  const resetGame = () => {
    setPlayerHand([]);
    setAiHand([]);
    setPot(0);
    setGamePhase('betting');
    setGameResult(null);
    setShowCelebration(false);
    setAiBet(0);
    setPlayerHandRank('');
    setAiHandRank('');
    setBet(100);
    initializeDeck();
  };

  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => setShowCelebration(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showCelebration]);

  const renderCard = (card: Card, hidden: boolean = false) => (
    <div className={`w-16 h-24 bg-white rounded-lg border-2 border-gray-300 flex flex-col items-center justify-center text-sm font-bold shadow-lg ${
      hidden ? 'bg-gradient-to-br from-red-600 to-red-800 text-white' : ''
    }`}>
      {hidden ? (
        <div className="text-2xl">🂠</div>
      ) : (
        <>
          <div className={`text-lg ${card.suit === '♥️' || card.suit === '♦️' ? 'text-red-600' : 'text-black'}`}>
            {card.suit}
          </div>
          <div className="text-xs">{card.rank}</div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Casino Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-black to-green-900">
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
            {i % 4 === 1 && <Sparkles className="w-3 h-3 text-blue-400" />}
            {i % 4 === 2 && <Crown className="w-5 h-5 text-amber-400" />}
            {i % 4 === 3 && <Zap className="w-3 h-3 text-green-400" />}
          </div>
        ))}
      </div>

      {/* Win Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 via-blue-500/30 to-yellow-400/30 animate-pulse-glow"></div>
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
          <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-blue-500 to-yellow-400 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
            ♠️ POKER SHOWDOWN ♠️
          </h2>
        </div>

        <div className="space-y-6">
          {/* Game Status */}
          <Card className="bg-gradient-to-br from-black via-blue-950 to-black border-4 border-yellow-400 shadow-2xl shadow-yellow-400/50 animate-scale-in relative overflow-hidden group">
            <CardHeader className="text-center relative z-10 animate-slide-up bg-gradient-to-r from-blue-900/50 to-black/50 border-b border-yellow-400/30">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-blue-400 to-yellow-400 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
                {gamePhase === 'betting' && '💰 PLACE YOUR BET 💰'}
                {gamePhase === 'dealing' && '🃏 DEALING CARDS 🃏'}
                {gamePhase === 'reveal' && '🎭 REVEALING HANDS 🎭'}
                {gamePhase === 'result' && '🏆 GAME RESULT 🏆'}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4 relative z-10 bg-gradient-to-b from-transparent to-black/30">
              {/* Pot Display */}
              <div className="text-center">
                <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black p-4 rounded-lg border-2 border-yellow-400 shadow-lg">
                  <p className="text-2xl font-bold">💰 POT: {pot.toLocaleString()} TOKENS 💰</p>
                </div>
              </div>

              {/* Game Phase Info */}
              {gamePhase === 'betting' && (
                <div className="text-center space-y-4">
                  <p className="text-yellow-200 text-lg">Place your bet to challenge the AI in 5-card poker!</p>
                  
                  {/* Betting Interface */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-yellow-400">Bet Amount: {bet} tokens</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {[100, 250, 500, 1000].map((amount) => (
                        <Button
                          key={amount}
                          onClick={() => setBet(amount)}
                          disabled={amount > tokens}
                          className={`h-12 text-sm font-bold border-2 transition-all duration-300 hover:scale-110 ${
                            bet === amount
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
                    
                    <Button
                      onClick={dealCards}
                      disabled={bet > tokens}
                      className="w-full h-16 text-xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white border-4 border-blue-400 shadow-2xl shadow-blue-400/50 hover:scale-105 transition-all duration-300 animate-pulse-glow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      🃏 DEAL CARDS! 🃏
                    </Button>
                  </div>
                </div>
              )}

              {gamePhase === 'dealing' && (
                <div className="text-center">
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-8 h-8 bg-blue-400 rounded-full animate-spin flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                    <span className="text-xl font-bold text-blue-400">Dealing cards...</span>
                  </div>
                </div>
              )}

              {gamePhase === 'reveal' && (
                <div className="text-center">
                  <p className="text-xl font-bold text-yellow-400">Revealing hands...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Hand */}
          <Card className="bg-gradient-to-br from-black via-red-950 to-black border-4 border-red-400 shadow-2xl shadow-red-400/50 animate-scale-in relative overflow-hidden group">
            <CardHeader className="text-center relative z-10 animate-slide-up bg-gradient-to-r from-red-900/50 to-black/50 border-b border-red-400/30">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                🤖 AI OPPONENT 🤖
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4 relative z-10 bg-gradient-to-b from-transparent to-black/30">
              <div className="flex justify-center gap-2">
                {aiHand.map((card, index) => (
                  <div key={index} className="animate-bounce-in" style={{animationDelay: `${index * 0.2}s`}}>
                    {renderCard(card, gamePhase !== 'reveal' && gamePhase !== 'result')}
                  </div>
                ))}
              </div>
              
              {(gamePhase === 'reveal' || gamePhase === 'result') && (
                <div className="text-center">
                  <Badge className="bg-red-600 text-white font-bold text-lg px-4 py-2">
                    {aiHandRank}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Player Hand */}
          <Card className="bg-gradient-to-br from-black via-green-950 to-black border-4 border-green-400 shadow-2xl shadow-green-400/50 animate-scale-in relative overflow-hidden group">
            <CardHeader className="text-center relative z-10 animate-slide-up bg-gradient-to-r from-green-900/50 to-black/50 border-b border-green-400/30">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                👤 YOUR HAND 👤
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4 relative z-10 bg-gradient-to-b from-transparent to-black/30">
              <div className="flex justify-center gap-2">
                {playerHand.map((card, index) => (
                  <div key={index} className="animate-bounce-in" style={{animationDelay: `${index * 0.2}s`}}>
                    {renderCard(card)}
                  </div>
                ))}
              </div>
              
              {playerHandRank && (
                <div className="text-center">
                  <Badge className="bg-green-600 text-white font-bold text-lg px-4 py-2">
                    {playerHandRank}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Game Result */}
          {gamePhase === 'result' && (
            <Card className="bg-gradient-to-br from-black via-yellow-950 to-black border-4 border-yellow-400 shadow-2xl shadow-yellow-400/50 animate-scale-in relative overflow-hidden group">
              <CardContent className="space-y-4 relative z-10 bg-gradient-to-b from-transparent to-black/30 p-6">
                <div className="text-center animate-bounce-in">
                  {gameResult === "win" && (
                    <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6 rounded-xl border-4 border-green-400 shadow-2xl shadow-green-400/50 animate-win-celebration">
                      <div className="text-4xl mb-2">🎉 WINNER! 🎉</div>
                      <div className="text-2xl font-bold">+{pot.toLocaleString()} TOKENS!</div>
                      <div className="text-lg">💰 JACKPOT! 💰</div>
                    </div>
                  )}
                  
                  {gameResult === "lose" && (
                    <div className="bg-gradient-to-r from-red-600 to-red-500 text-white p-6 rounded-xl border-4 border-red-400 shadow-2xl shadow-red-400/50 animate-wiggle">
                      <div className="text-4xl mb-2">💔 DEFEATED! 💔</div>
                      <div className="text-2xl font-bold">-{bet} TOKENS</div>
                      <div className="text-lg">Better luck next time! 🃏</div>
                    </div>
                  )}
                  
                  {gameResult === "tie" && (
                    <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black p-6 rounded-xl border-4 border-yellow-400 shadow-2xl shadow-yellow-400/50 animate-pulse">
                      <div className="text-4xl mb-2">🤝 TIE GAME! 🤝</div>
                      <div className="text-2xl font-bold">Bet Returned!</div>
                      <div className="text-lg">No risk, no reward! 🃏</div>
                    </div>
                  )}
                </div>

                <Button
                  onClick={resetGame}
                  className="w-full h-16 text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 text-white border-4 border-blue-400 shadow-2xl shadow-blue-400/50 hover:scale-105 transition-all duration-300"
                >
                  <Sparkles className="w-6 h-6 mr-3" />
                  🃏 PLAY AGAIN! 🃏
                  <Sparkles className="w-6 h-6 ml-3" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
