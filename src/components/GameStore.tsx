import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gamepad2, Palette, Zap, ShoppingCart, Star, Sparkles, Crown } from "lucide-react";

interface StoreItemProps {
  title: string;
  description: string;
  price: number;
  type: "game" | "cosmetic" | "animation";
  rarity?: "common" | "rare" | "epic" | "legendary";
  owned?: boolean;
  canAfford?: boolean;
  onPurchase: () => void;
}

const StoreItem = ({ title, description, price, type, rarity = "common", owned = false, canAfford = true, onPurchase }: StoreItemProps) => {
  const getRarityColor = () => {
    switch (rarity) {
      case "legendary": return "text-yellow-400 border-yellow-400/30 bg-yellow-400/10";
      case "epic": return "text-purple-400 border-purple-400/30 bg-purple-400/10";
      case "rare": return "text-blue-400 border-blue-400/30 bg-blue-400/10";
      default: return "text-muted-foreground border-border bg-muted/20";
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case "game": return <Gamepad2 className="w-4 h-4" />;
      case "cosmetic": return <Palette className="w-4 h-4" />;
      case "animation": return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <Card className={`bg-gradient-to-br from-black via-red-950 to-black border-4 border-yellow-400 transition-all duration-300 hover:border-yellow-300 hover:shadow-2xl hover:shadow-yellow-400/50 hover:-translate-y-1 relative overflow-hidden group ${owned ? 'opacity-60' : ''}`}>
      {/* Casino lights border effect */}
      <div className="absolute inset-0 rounded-lg border-2 border-yellow-400/50 animate-pulse-glow"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-red-500/10 to-yellow-400/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
      <CardHeader className="pb-3 relative z-10 bg-gradient-to-r from-red-900/50 to-amber-900/50">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {getTypeIcon()}
            <CardTitle className="text-base text-yellow-200 font-bold">{title}</CardTitle>
          </div>
          <Badge className={`${getRarityColor()} font-bold`}>
            {rarity}
          </Badge>
        </div>
        <CardDescription className="text-sm text-yellow-200/80">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0 relative z-10 bg-gradient-to-b from-transparent to-black/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-yellow-400 font-bold">
            <Star className="w-4 h-4" />
            <span>{price.toLocaleString()} chips</span>
          </div>
          
          <Button 
            size="sm"
            onClick={onPurchase}
            disabled={owned || !canAfford}
            className={`${
              owned ? 'bg-transparent text-yellow-200 border-2 border-yellow-400/50' :
              canAfford ? 'bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 text-black border-2 border-yellow-400 shadow-lg shadow-yellow-400/50 hover:shadow-2xl hover:shadow-yellow-400/50' :
              'bg-transparent text-red-400 border-2 border-red-400/50 opacity-50 cursor-not-allowed'
            } transition-all duration-300 hover:scale-105`}
          >
            {owned ? (
              "🎉 Owned"
            ) : !canAfford ? (
              "💰 Can't Afford"
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-1" />
                🛒 Buy
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const gameItems = [
  { title: "Poker Showdown", description: "5-card poker battles", price: 7500, type: "game" as const, rarity: "epic" as const },
  { title: "Roulette Wheel", description: "Classic casino roulette game", price: 4000, type: "game" as const, rarity: "rare" as const },
];

const cosmeticItems = [
  { title: "Golden Coins", description: "Luxurious golden token design", price: 2500, type: "cosmetic" as const, rarity: "epic" as const },
  { title: "Neon Theme", description: "Cyberpunk neon interface", price: 4000, type: "cosmetic" as const, rarity: "legendary" as const },
  { title: "Royal Cards", description: "Premium card designs", price: 1500, type: "cosmetic" as const, rarity: "rare" as const },
];

const animationItems = [
  { title: "Victory Fireworks", description: "Explosive win celebrations", price: 3500, type: "animation" as const, rarity: "epic" as const },
  { title: "Token Rain", description: "Tokens fall from the sky", price: 2000, type: "animation" as const, rarity: "rare" as const },
  { title: "Coin Flip 3D", description: "Realistic 3D coin physics", price: 1000, type: "animation" as const, rarity: "common" as const },
];

interface GameStoreProps {
  tokens: number;
  ownedItems: string[];
  onPurchase: (item: string, price: number) => void;
}

export const GameStore = ({ tokens, ownedItems, onPurchase }: GameStoreProps) => {
  const handlePurchase = (item: string, price: number) => {
    if (tokens >= price && !ownedItems.includes(item)) {
      onPurchase(item, price);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-black via-red-950 to-black border-4 border-yellow-400 shadow-2xl shadow-yellow-400/50 relative overflow-hidden group">
      {/* Casino lights border effect */}
      <div className="absolute inset-0 rounded-lg border-2 border-yellow-400 animate-pulse-glow"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-red-500/10 to-yellow-400/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
      <CardHeader className="relative z-10 bg-gradient-to-r from-red-900/50 to-amber-900/50 border-b border-yellow-400/30">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 bg-clip-text text-transparent">
              <ShoppingCart className="w-6 h-6 text-yellow-400" />
              🎰 CASINO STORE 🎰
            </CardTitle>
            <CardDescription className="text-yellow-200 text-lg">
              🎲 Enhance your gaming experience with new games, cosmetics, and animations 💰
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-sm text-yellow-200 font-bold">💰 Your Balance</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">{tokens.toLocaleString()} chips</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10 bg-gradient-to-b from-transparent to-black/30">
        <Tabs defaultValue="games" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-black via-red-950 to-black border-4 border-yellow-400 shadow-2xl shadow-yellow-400/30">
            <TabsTrigger value="games" className="flex items-center gap-2 bg-transparent text-yellow-200 hover:bg-yellow-400/20 hover:text-yellow-400 data-[state=active]:bg-yellow-400 data-[state=active]:text-black font-bold">
              <Gamepad2 className="w-4 h-4" />
              🎲 Games
            </TabsTrigger>
            <TabsTrigger value="cosmetics" className="flex items-center gap-2 bg-transparent text-yellow-200 hover:bg-yellow-400/20 hover:text-yellow-400 data-[state=active]:bg-yellow-400 data-[state=active]:text-black font-bold">
              <Palette className="w-4 h-4" />
              🎨 Cosmetics
            </TabsTrigger>
            <TabsTrigger value="animations" className="flex items-center gap-2 bg-transparent text-yellow-200 hover:bg-yellow-400/20 hover:text-yellow-400 data-[state=active]:bg-yellow-400 data-[state=active]:text-black font-bold">
              <Zap className="w-4 h-4" />
              ✨ Animations
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="games" className="mt-4">
            <div className="grid gap-3">
              {gameItems.map((item, index) => (
                <StoreItem
                  key={index}
                  {...item}
                  owned={ownedItems.includes(item.title)}
                  canAfford={tokens >= item.price}
                  onPurchase={() => handlePurchase(item.title, item.price)}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="cosmetics" className="mt-4">
            <div className="grid gap-3">
              {cosmeticItems.map((item, index) => (
                <StoreItem
                  key={index}
                  {...item}
                  owned={ownedItems.includes(item.title)}
                  canAfford={tokens >= item.price}
                  onPurchase={() => handlePurchase(item.title, item.price)}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="animations" className="mt-4">
            <div className="grid gap-3">
              {animationItems.map((item, index) => (
                <StoreItem
                  key={index}
                  {...item}
                  owned={ownedItems.includes(item.title)}
                  canAfford={tokens >= item.price}
                  onPurchase={() => handlePurchase(item.title, item.price)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};