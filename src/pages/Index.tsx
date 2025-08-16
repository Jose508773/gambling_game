import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GameCard } from "@/components/GameCard";
import { TokenDisplay } from "@/components/TokenDisplay";
import { Leaderboard } from "@/components/Leaderboard";
import { GameStore } from "@/components/GameStore";
import { CoinFlipGame } from "@/components/games/CoinFlipGame";
import { NumberGuessGame } from "@/components/games/NumberGuessGame";
import { DiceRollerGame } from "@/components/games/DiceRollerGame";
import { BlackjackProGame } from "@/components/games/BlackjackProGame";
import { Gamepad2, Trophy, ShoppingCart, Coins, Zap, Clock, Star, Sparkles, Crown } from "lucide-react";

type GameType = "lobby" | "coinflip" | "numberguess" | "diceroller" | "blackjackpro";

const Index = () => {
  const [currentGame, setCurrentGame] = useState<GameType>("lobby");
  const [tokens, setTokens] = useState(3000);
  const [timeUntilRefresh, setTimeUntilRefresh] = useState("23:59:45");
  const [ownedItems, setOwnedItems] = useState<string[]>([]);

  const [isWatchingAd, setIsWatchingAd] = useState(false);

  const handleBuyTokens = () => {
    if (isWatchingAd) return; // Prevent multiple clicks
    
    setIsWatchingAd(true);
    
    // Simulate watching an ad for 3 seconds
    setTimeout(() => {
      setTokens(tokens + 1000);
      setIsWatchingAd(false);
      console.log("Ad watched! +1000 chips added");
      
      // Show success notification
      alert("🎉 Ad completed! +1000 chips added to your balance! 🎉");
    }, 3000);
  };

  const handleStorePurchase = (item: string, price: number) => {
    if (tokens >= price && !ownedItems.includes(item)) {
      setTokens(tokens - price);
      setOwnedItems([...ownedItems, item]);
      console.log(`Successfully purchased ${item} for ${price} tokens!`);
    }
  };

  const handlePlayGame = (game: GameType) => {
    setCurrentGame(game);
  };

  const handleBackToLobby = () => {
    setCurrentGame("lobby");
  };

  if (currentGame === "coinflip") {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <CoinFlipGame 
            onBack={handleBackToLobby}
            tokens={tokens}
            onTokensChange={setTokens}
          />
        </div>
      </div>
    );
  }

  if (currentGame === "numberguess") {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <NumberGuessGame 
            onBack={handleBackToLobby}
            tokens={tokens}
            onTokensChange={setTokens}
          />
        </div>
      </div>
    );
  }

  if (currentGame === "diceroller") {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <DiceRollerGame 
            onBack={handleBackToLobby}
            tokens={tokens}
            onTokensChange={setTokens}
          />
        </div>
      </div>
    );
  }

  if (currentGame === "blackjackpro") {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <BlackjackProGame 
            onBack={handleBackToLobby}
            tokens={tokens}
            onTokensChange={setTokens}
          />
        </div>
      </div>
    );
  }

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
            {i % 4 === 1 && <Sparkles className="w-3 h-3 text-red-400" />}
            {i % 4 === 2 && <Crown className="w-5 h-5 text-amber-400" />}
            {i % 4 === 3 && <Zap className="w-3 h-3 text-blue-400" />}
          </div>
        ))}
      </div>

      {/* Casino Header */}
      <div className="border-b-4 border-yellow-400 bg-gradient-to-r from-black/90 via-red-950/90 to-black/90 backdrop-blur-sm sticky top-0 z-50 animate-slide-down shadow-2xl shadow-yellow-400/30 relative">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 animate-scale-in">
              <div className="p-2 bg-gradient-to-br from-yellow-400 via-red-500 to-yellow-400 rounded-lg hover:shadow-yellow-400/50 hover:shadow-2xl transition-all duration-300 animate-pulse-glow">
                <Gamepad2 className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
                  🎰 CASINO WAGER BATTLES 🎰
                </h1>
                <p className="text-lg text-yellow-200 animate-fade-in" style={{animationDelay: '0.2s'}}>
                  🎲 Win BIG, Climb the Leaderboard! 💰
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 animate-slide-up" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center gap-2 text-sm text-yellow-200 bg-black/50 px-3 py-1 rounded-lg border border-yellow-400/30">
                <Clock className="w-4 h-4 text-yellow-400" />
                <span>🔄 Next refresh: {timeUntilRefresh}</span>
              </div>
              
              {/* Casino Token Display */}
              <div className="bg-gradient-to-br from-black via-red-950 to-black px-6 py-3 rounded-lg border-4 border-yellow-400 hover:border-yellow-300 transition-all duration-300 shadow-2xl shadow-yellow-400/50 animate-pulse-glow">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-yellow-400/20 rounded-full animate-spin" style={{animationDuration: '3s'}}>
                    <Coins className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-yellow-200 font-bold">💰 CHIPS</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">{tokens.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <TokenDisplay tokens={tokens} onBuyTokens={handleBuyTokens} isWatchingAd={isWatchingAd} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 relative z-10">
        <Tabs defaultValue="games" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-black via-red-950 to-black border-4 border-yellow-400 mb-6 animate-bounce-in shadow-2xl shadow-yellow-400/30" style={{animationDelay: '0.5s'}}>
            <TabsTrigger value="games" className="flex items-center gap-2 hover:animate-wiggle transition-all duration-300 bg-transparent text-yellow-200 hover:bg-yellow-400/20 hover:text-yellow-400 data-[state=active]:bg-yellow-400 data-[state=active]:text-black font-bold">
              <Gamepad2 className="w-4 h-4" />
              🎲 Games
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2 hover:animate-wiggle transition-all duration-300 bg-transparent text-yellow-200 hover:bg-yellow-400/20 hover:text-yellow-400 data-[state=active]:bg-yellow-400 data-[state=active]:text-black font-bold">
              <Trophy className="w-4 h-4" />
              🏆 Leaderboard
            </TabsTrigger>
            <TabsTrigger value="store" className="flex items-center gap-2 hover:animate-wiggle transition-all duration-300 bg-transparent text-yellow-200 hover:bg-yellow-400/20 hover:text-yellow-400 data-[state=active]:bg-yellow-400 data-[state=active]:text-black font-bold">
              <ShoppingCart className="w-4 h-4" />
              🛒 Store
            </TabsTrigger>
          </TabsList>

          <TabsContent value="games" className="space-y-6">
            {/* Casino Daily Challenge Banner */}
            <div className="bg-gradient-to-br from-black via-red-950 to-black p-6 rounded-lg border-4 border-yellow-400 text-yellow-200 relative overflow-hidden animate-scale-in hover:shadow-2xl hover:shadow-yellow-400/50 transition-all duration-300 hover:scale-[1.02]" style={{animationDelay: '0.6s'}}>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-red-500/10 to-yellow-400/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="animate-slide-up" style={{animationDelay: '0.8s'}}>
                    <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
                      🎯 DAILY JACKPOT CHALLENGE 🎯
                    </h2>
                    <p className="text-yellow-200 text-lg mb-3 animate-fade-in" style={{animationDelay: '1s'}}>
                      🎰 Win 3 games in a row for the BONUS JACKPOT! 💰
                    </p>
                    <Badge variant="secondary" className="bg-yellow-400/20 text-yellow-400 border-yellow-400/50 font-bold animate-bounce-in hover:animate-heartbeat" style={{animationDelay: '1.2s'}}>
                      🎆 Reward: 1,000 BONUS CHIPS 🎆
                    </Badge>
                  </div>
                  <div className="text-right animate-number-pop" style={{animationDelay: '1.4s'}}>
                    <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">0/3</div>
                    <div className="text-lg text-yellow-200 font-bold">🎯 Progress</div>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full -translate-y-8 translate-x-8 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-500/10 rounded-full translate-y-4 -translate-x-4 animate-pulse"></div>
            </div>

            {/* Casino Available Games */}
            <div className="animate-slide-up" style={{animationDelay: '1.6s'}}>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 animate-scale-in bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 bg-clip-text text-transparent" style={{animationDelay: '1.8s'}}>
                <Zap className="w-6 h-6 text-yellow-400" />
                🎰 CASINO GAMES 🎰
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="animate-bounce-in" style={{animationDelay: '2s'}}>
                  <GameCard
                    title="Coin Flip"
                    description="Classic heads or tails betting"
                    minBet={100}
                    maxBet={1000}
                    players={0}
                    onPlay={() => handlePlayGame("coinflip")}
                  />
                </div>
                <div className="animate-bounce-in" style={{animationDelay: '2.2s'}}>
                  <GameCard
                    title="Number Guess"
                    description="Guess the mystery number 1-100"
                    minBet={100}
                    maxBet={1000}
                    players={0}
                    onPlay={() => handlePlayGame("numberguess")}
                  />
                </div>
                <div className="animate-bounce-in" style={{animationDelay: '2.4s'}}>
                  <GameCard
                    title="Dice Roller"
                    description="Roll the dice and predict the outcome"
                    minBet={100}
                    maxBet={1000}
                    players={0}
                    onPlay={() => handlePlayGame("diceroller")}
                  />
                </div>
                <div className="animate-bounce-in" style={{animationDelay: '2.6s'}}>
                  <GameCard
                    title="Blackjack Pro"
                    description="Beat the dealer to 21 with enhanced gameplay"
                    minBet={100}
                    maxBet={1000}
                    players={0}
                    onPlay={() => handlePlayGame("blackjackpro")}
                  />
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up" style={{animationDelay: '2.6s'}}>
              <div className="bg-gradient-card p-4 rounded-lg border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-neon hover:scale-105 animate-scale-in" style={{animationDelay: '2.8s'}}>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-full">
                    <Coins className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Today's Winnings</p>
                    <p className="text-lg font-bold text-foreground">+0</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-card p-4 rounded-lg border border-primary/20 hover:border-secondary/40 transition-all duration-300 hover:shadow-gold hover:scale-105 animate-scale-in" style={{animationDelay: '3s'}}>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/20 rounded-full">
                    <Trophy className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Win Streak</p>
                    <p className="text-lg font-bold text-foreground">0 games</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-card p-4 rounded-lg border border-primary/20 hover:border-accent/40 transition-all duration-300 hover:shadow-neon hover:scale-105 animate-scale-in" style={{animationDelay: '3.2s'}}>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/20 rounded-full">
                    <Gamepad2 className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Games Played</p>
                    <p className="text-lg font-bold text-foreground">0</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Leaderboard />
          </TabsContent>

          <TabsContent value="store">
            <GameStore 
              tokens={tokens}
              ownedItems={ownedItems}
              onPurchase={handleStorePurchase}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
