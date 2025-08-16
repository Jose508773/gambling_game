import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, Clock, Users, Trophy, Sparkles, Star } from "lucide-react";

interface GameCardProps {
  title: string;
  description: string;
  minBet: number;
  maxBet: number;
  players: number;
  timeLeft?: string;
  onPlay: () => void;
  disabled?: boolean;
}

export const GameCard = ({ 
  title, 
  description, 
  minBet, 
  maxBet, 
  players, 
  timeLeft, 
  onPlay, 
  disabled = false 
}: GameCardProps) => {
  return (
    <Card className="bg-gradient-to-br from-black via-red-950 to-black border-4 border-yellow-400 hover:border-yellow-300 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/50 hover:-translate-y-2 hover:scale-105 group relative overflow-hidden">
      {/* Casino lights shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-red-500/10 to-yellow-400/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      <div className="absolute inset-0 rounded-lg border-2 border-yellow-400/50 animate-pulse-glow"></div>
      
      <CardHeader className="pb-3 relative z-10 bg-gradient-to-r from-red-900/50 to-amber-900/50">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg group-hover:text-yellow-400 transition-colors duration-300 font-bold bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">
              🎲 {title} 🎲
            </CardTitle>
            <CardDescription className="text-yellow-200/80 group-hover:text-yellow-200">
              🎯 {description}
            </CardDescription>
          </div>
          {timeLeft && (
            <Badge variant="outline" className="bg-yellow-400/20 text-yellow-400 border-yellow-400/50 font-bold">
              <Clock className="w-3 h-3 mr-1" />
              {timeLeft}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 relative z-10 bg-gradient-to-b from-transparent to-black/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm text-yellow-200/80">
            <div className="flex items-center gap-1">
              <Coins className="w-4 h-4 text-yellow-400" />
              <span className="font-bold text-yellow-200">💰 {minBet}-{maxBet} chips</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-yellow-400" />
              <span className="font-bold text-yellow-200">👥 {players} playing</span>
            </div>
          </div>
        </div>
        
        <Button 
          className="w-full bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 hover:from-yellow-300 hover:via-red-400 hover:to-yellow-300 text-black font-bold hover:shadow-2xl hover:shadow-yellow-400/50 transition-all duration-300 hover:scale-105 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed" 
          onClick={onPlay}
          disabled={disabled}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-30 transition-opacity duration-300"></div>
          <Trophy className="w-4 h-4 mr-2" />
          <span className="relative z-10">
            {disabled ? "🔒 Coming Soon" : "🎰 Play Now! 🎰"}
          </span>
        </Button>
      </CardContent>
      
      {/* Casino floating sparkles effect on hover */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Star className="absolute top-4 right-4 w-4 h-4 text-yellow-400 animate-particles" style={{animationDelay: '0s'}} />
        <Sparkles className="absolute top-8 right-8 w-3 h-3 text-red-400 animate-particles" style={{animationDelay: '0.5s'}} />
        <Star className="absolute top-6 right-12 w-3 h-3 text-amber-400 animate-particles" style={{animationDelay: '1s'}} />
      </div>
    </Card>
  );
};