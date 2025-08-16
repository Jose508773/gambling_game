import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Diamond, Club, Spade, Star, Sparkles, Crown, Zap } from "lucide-react";

interface BlackjackProGameProps {
  onBack: () => void;
  tokens: number;
  onTokensChange: (newTokens: number) => void;
}

interface Card {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  value: number;
  display: string;
}

const suits = ['hearts', 'diamonds', 'clubs', 'spades'] as const;
const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

const getSuitIcon = (suit: string) => {
  switch (suit) {
    case 'hearts': return <Heart className="w-4 h-4 text-red-500" />;
    case 'diamonds': return <Diamond className="w-4 h-4 text-red-500" />;
    case 'clubs': return <Club className="w-4 h-4 text-black" />;
    case 'spades': return <Spade className="w-4 h-4 text-black" />;
    default: return null;
  }
};

const getDisplayValue = (value: number) => {
  switch (value) {
    case 1: return 'A';
    case 11: return 'J';
    case 12: return 'Q';
    case 13: return 'K';
    default: return value.toString();
  }
};

const getCardValue = (value: number) => {
  if (value === 1) return 11; // Ace
  if (value >= 10) return 10; // Face cards
  return value;
};

const calculateHandValue = (hand: Card[]) => {
  let value = 0;
  let aces = 0;

  for (const card of hand) {
    if (card.value === 1) {
      aces++;
      value += 11;
    } else {
      value += getCardValue(card.value);
    }
  }

  // Adjust aces if needed
  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }

  return value;
};

const createDeck = (): Card[] => {
  const deck: Card[] = [];
  for (const suit of suits) {
    for (const value of values) {
      deck.push({
        suit,
        value,
        display: getDisplayValue(value)
      });
    }
  }
  return deck;
};

const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const BlackjackProGame = ({ onBack, tokens, onTokensChange }: BlackjackProGameProps) => {
  const [bet, setBet] = useState(100);
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'dealer' | 'finished'>('betting');
  const [gameResult, setGameResult] = useState<'win' | 'lose' | 'push' | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isDealing, setIsDealing] = useState(false);

  useEffect(() => {
    setDeck(shuffleDeck(createDeck()));
  }, []);

  const dealInitialCards = () => {
    if (bet > tokens) return;
    
    setIsDealing(true);
    const newDeck = [...deck];
    
    // Deal 2 cards to player
    const playerCards = [newDeck.pop()!, newDeck.pop()!];
    
    // Deal 2 cards to dealer (one face down)
    const dealerCards = [newDeck.pop()!, newDeck.pop()!];
    
    setPlayerHand(playerCards);
    setDealerHand(dealerCards);
    setDeck(newDeck);
    setGameState('playing');
    setIsDealing(false);
    onTokensChange(tokens - bet);
  };

  const hit = () => {
    if (deck.length === 0) return;
    
    const newDeck = [...deck];
    const newCard = newDeck.pop()!;
    const newPlayerHand = [...playerHand, newCard];
    
    setPlayerHand(newPlayerHand);
    setDeck(newDeck);
    
    const playerValue = calculateHandValue(newPlayerHand);
    if (playerValue > 21) {
      endGame('lose');
    }
  };

  const stand = () => {
    setGameState('dealer');
    // Add a small delay to show the dealer playing phase
    setTimeout(() => {
      playDealerHand();
    }, 1000);
  };

  const playDealerHand = () => {
    const newDealerHand = [...dealerHand];
    const newDeck = [...deck];
    
    // Simulate dealer playing with delays
    const playDealerTurn = () => {
      if (calculateHandValue(newDealerHand) >= 17) {
        // Dealer is done, show final result
        setDealerHand(newDealerHand);
        setDeck(newDeck);
        
        const playerValue = calculateHandValue(playerHand);
        const dealerValue = calculateHandValue(newDealerHand);
        
        if (dealerValue > 21) {
          endGame('win');
        } else if (playerValue > dealerValue) {
          endGame('win');
        } else if (playerValue < dealerValue) {
          endGame('lose');
        } else {
          endGame('push');
        }
      } else {
        // Dealer hits
        if (newDeck.length === 0) {
          // No more cards, end game
          setDealerHand(newDealerHand);
          setDeck(newDeck);
          endGame('push'); // Push if no cards left
          return;
        }
        
        const newCard = newDeck.pop()!;
        newDealerHand.push(newCard);
        
        // Update state and continue after a delay
        setDealerHand([...newDealerHand]);
        setDeck([...newDeck]);
        
        setTimeout(playDealerTurn, 800);
      }
    };
    
    // Start dealer's turn
    playDealerTurn();
  };

  const endGame = (result: 'win' | 'lose' | 'push') => {
    setGameResult(result);
    setGameState('finished');
    
    if (result === 'win') {
      setShowCelebration(true);
      onTokensChange(tokens + bet * 2); // Blackjack pays 2:1
    } else if (result === 'push') {
      onTokensChange(tokens + bet); // Return bet
    }
    // Lose: bet is already deducted
  };

  const resetGame = () => {
    setPlayerHand([]);
    setDealerHand([]);
    setGameState('betting');
    setGameResult(null);
    setShowCelebration(false);
    setBet(100);
    setDeck(shuffleDeck(createDeck()));
  };

  const renderCard = (card: Card, hidden = false) => (
    <div className={`w-16 h-24 bg-white rounded-lg border-2 border-gray-300 flex flex-col items-center justify-center relative shadow-lg ${hidden ? 'bg-gradient-to-br from-red-600 to-red-800' : ''}`}>
      {hidden ? (
        <div className="text-white font-bold text-lg">?</div>
      ) : (
        <>
          <div className="absolute top-1 left-1 text-xs font-bold">
            {getSuitIcon(card.suit)}
          </div>
          <div className="text-lg font-bold text-black">
            {card.display}
          </div>
          <div className="absolute bottom-1 right-1 text-xs font-bold rotate-180">
            {getSuitIcon(card.suit)}
          </div>
        </>
      )}
    </div>
  );

  const playerValue = calculateHandValue(playerHand);
  const dealerValue = calculateHandValue(dealerHand);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Casino Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-black to-green-800">
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
            {i % 3 === 0 && <Heart className="w-4 h-4 text-red-400" />}
            {i % 3 === 1 && <Diamond className="w-3 h-3 text-red-400" />}
            {i % 3 === 2 && <Spade className="w-5 h-5 text-black" />}
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto p-4 relative z-10">
        <Card className="bg-gradient-to-br from-black via-green-950 to-black border-4 border-yellow-400 shadow-2xl shadow-yellow-400/50 relative overflow-hidden">
          {/* Casino lights border effect */}
          <div className="absolute inset-0 rounded-lg border-2 border-yellow-400/50 animate-pulse-glow"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-green-500/10 to-yellow-400/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          <CardHeader className="relative z-10 bg-gradient-to-r from-green-900/50 to-amber-900/50 border-b border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="text-yellow-200 hover:text-yellow-400 hover:bg-yellow-400/20"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Lobby
                </Button>
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-green-500 to-yellow-400 bg-clip-text text-transparent">
                  🃏 BLACKJACK PRO 🃏
                </CardTitle>
                <CardDescription className="text-yellow-200">
                  Beat the dealer to 21! 💰
                </CardDescription>
              </div>
              <div className="text-right">
                <p className="text-sm text-yellow-200 font-bold">💰 Your Balance</p>
                <p className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">{tokens.toLocaleString()} chips</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6 relative z-10 bg-gradient-to-b from-transparent to-black/30">
            {/* Betting Phase */}
            {gameState === 'betting' && (
              <div className="text-center space-y-4">
                <div className="text-2xl font-bold text-yellow-200 mb-4">
                  🎰 Place Your Bet 🎰
                </div>
                <div className="flex justify-center items-center gap-4">
                  <input
                    type="range"
                    min="100"
                    max={Math.min(1000, tokens)}
                    step="100"
                    value={bet}
                    onChange={(e) => setBet(parseInt(e.target.value))}
                    className="w-64 h-2 bg-yellow-400/20 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xl font-bold text-yellow-400 min-w-[80px]">
                    {bet} chips
                  </span>
                </div>
                <Button
                  onClick={dealInitialCards}
                  disabled={bet > tokens}
                  className="bg-gradient-to-r from-yellow-400 via-green-500 to-yellow-400 text-black border-2 border-yellow-400 shadow-lg shadow-yellow-400/50 hover:shadow-2xl hover:shadow-yellow-400/50 font-bold text-lg px-8 py-3"
                >
                  🎯 Deal Cards
                </Button>
              </div>
            )}

            {/* Game Phase */}
            {gameState === 'playing' && (
              <div className="space-y-6">
                {/* Dealer's Hand */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-yellow-200 mb-3">🃏 Dealer's Hand</h3>
                  <div className="flex justify-center gap-2">
                    {dealerHand.map((card, index) => 
                      renderCard(card, index === 1) // Hide second card
                    )}
                  </div>
                  <p className="text-yellow-200 mt-2">
                    Value: {dealerHand.length > 0 ? getCardValue(dealerHand[0].value) : 0} + ?
                  </p>
                </div>

                {/* Player's Hand */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-yellow-200 mb-3">🎯 Your Hand</h3>
                  <div className="flex justify-center gap-2">
                    {playerHand.map((card, index) => renderCard(card))}
                  </div>
                  <p className="text-yellow-200 mt-2">
                    Value: {playerValue}
                  </p>
                </div>

                {/* Game Actions */}
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={hit}
                    disabled={playerValue >= 21}
                    className="bg-gradient-to-r from-green-400 to-green-600 text-white border-2 border-green-400 shadow-lg shadow-green-400/50 hover:shadow-2xl hover:shadow-green-400/50 font-bold"
                  >
                    🃏 Hit
                  </Button>
                  <Button
                    onClick={stand}
                    className="bg-gradient-to-r from-red-400 to-red-600 text-white border-2 border-red-400 shadow-lg shadow-red-400/50 hover:shadow-2xl hover:shadow-red-400/50 font-bold"
                  >
                    🛑 Stand
                  </Button>
                </div>
              </div>
            )}

            {/* Dealer Playing */}
            {gameState === 'dealer' && (
              <div className="text-center space-y-4">
                <div className="text-2xl font-bold text-yellow-200">
                  🃏 Dealer is playing...
                </div>
                <div className="flex justify-center gap-2">
                  {dealerHand.map((card, index) => renderCard(card, false))}
                </div>
                <p className="text-yellow-200">
                  Dealer Value: {dealerValue}
                </p>
              </div>
            )}

            {/* Game Result */}
            {gameState === 'finished' && (
              <div className="text-center space-y-6">
                {/* Dealer's Final Hand */}
                <div>
                  <h3 className="text-xl font-bold text-yellow-200 mb-3">🃏 Dealer's Hand</h3>
                  <div className="flex justify-center gap-2">
                    {dealerHand.map((card, index) => renderCard(card))}
                  </div>
                  <p className="text-yellow-200 mt-2">
                    Value: {dealerValue}
                  </p>
                </div>

                {/* Player's Final Hand */}
                <div>
                  <h3 className="text-xl font-bold text-yellow-200 mb-3">🎯 Your Hand</h3>
                  <div className="flex justify-center gap-2">
                    {playerHand.map((card, index) => renderCard(card))}
                  </div>
                  <p className="text-yellow-200 mt-2">
                    Value: {playerValue}
                  </p>
                </div>

                {/* Result Display */}
                <div className={`text-3xl font-bold p-6 rounded-lg border-4 ${
                  gameResult === 'win' ? 'text-green-400 border-green-400 bg-green-400/10' :
                  gameResult === 'lose' ? 'text-red-400 border-red-400 bg-red-400/10' :
                  'text-yellow-400 border-yellow-400 bg-yellow-400/10'
                }`}>
                  {gameResult === 'win' && '🎉 YOU WIN! 🎉'}
                  {gameResult === 'lose' && '😔 DEALER WINS 😔'}
                  {gameResult === 'push' && '🤝 PUSH 🤝'}
                </div>

                <Button
                  onClick={resetGame}
                  className="bg-gradient-to-r from-yellow-400 via-green-500 to-yellow-400 text-black border-2 border-yellow-400 shadow-lg shadow-yellow-400/50 hover:shadow-2xl hover:shadow-yellow-400/50 font-bold text-lg px-8 py-3"
                >
                  🎯 Play Again
                </Button>
              </div>
            )}

            {/* Celebration Effect */}
            {showCelebration && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-bounce text-yellow-400"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${1 + Math.random() * 2}s`
                    }}
                  >
                    <Sparkles className="w-6 h-6" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
