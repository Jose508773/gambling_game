import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Crown } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  username: string;
  tokens: number;
  streak: number;
}

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, username: "TokenMaster", tokens: 15420, streak: 7 },
  { rank: 2, username: "LuckyPlayer", tokens: 12350, streak: 5 },
  { rank: 3, username: "GameChamp", tokens: 10890, streak: 4 },
  { rank: 4, username: "BettingPro", tokens: 9500, streak: 3 },
  { rank: 5, username: "CoinFlipKing", tokens: 8200, streak: 2 },
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-5 h-5 text-yellow-400" />;
    case 2:
      return <Trophy className="w-5 h-5 text-gray-400" />;
    case 3:
      return <Medal className="w-5 h-5 text-orange-400" />;
    default:
      return <Award className="w-5 h-5 text-muted-foreground" />;
  }
};

const getRankStyle = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border-yellow-400/40";
    case 2:
      return "bg-gradient-to-r from-gray-400/20 to-slate-400/20 border-gray-400/40";
    case 3:
      return "bg-gradient-to-r from-orange-400/20 to-red-400/20 border-orange-400/40";
    default:
      return "bg-muted/30 border-border";
  }
};

export const Leaderboard = () => {
  return (
    <Card className="bg-gradient-card border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Trophy className="w-5 h-5 text-secondary" />
          Weekly Leaderboard
        </CardTitle>
        <CardDescription>
          Top players this week • Resets in 3 days
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {mockLeaderboard.map((entry) => (
            <div
              key={entry.rank}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 hover:scale-[1.02] ${getRankStyle(entry.rank)}`}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {getRankIcon(entry.rank)}
                  <span className="font-bold text-sm">#{entry.rank}</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{entry.username}</p>
                  <p className="text-xs text-muted-foreground">
                    {entry.streak} day streak
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-bold text-secondary">
                  {entry.tokens.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">tokens</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
          <p className="text-center text-sm text-primary font-medium">
            🏆 Weekly winners get exclusive badges and cosmetics!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};