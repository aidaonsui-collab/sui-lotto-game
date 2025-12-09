"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trophy, TrendingUp, TrendingDown } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const leaderboardData = [
  {
    rank: 1,
    address: "0x1234...5678",
    plays: 0,
    wins: 0,
    losses: 0,
    pnl: 0,
    strategy: [3, 7, 12, 18, 21],
  },
  {
    rank: 2,
    address: "0xabcd...efgh",
    plays: 0,
    wins: 0,
    losses: 0,
    pnl: 0,
    strategy: [1, 5, 13, 17, 25],
  },
  {
    rank: 3,
    address: "0x9876...5432",
    plays: 0,
    wins: 0,
    losses: 0,
    pnl: 0,
    strategy: [2, 8, 14, 19, 23],
  },
  {
    rank: 4,
    address: "0xdef0...1234",
    plays: 0,
    wins: 0,
    losses: 0,
    pnl: 0,
    strategy: [4, 9, 11, 16, 24],
  },
  {
    rank: 5,
    address: "0x5678...9abc",
    plays: 0,
    wins: 0,
    losses: 0,
    pnl: 0,
    strategy: [6, 10, 15, 20, 22],
  },
]

export function Leaderboard() {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-warning" />
    if (rank === 2) return <Trophy className="h-5 w-5 text-muted-foreground" />
    if (rank === 3) return <Trophy className="h-5 w-5 text-orange-600" />
    return <span className="text-muted-foreground font-bold">#{rank}</span>
  }

  const copyStrategy = (strategy: number[]) => {
    navigator.clipboard.writeText(strategy.join(", "))
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            Top Players
          </CardTitle>
          <CardDescription>Rankings based on profit and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Rank</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead className="text-center">Plays</TableHead>
                  <TableHead className="text-center">Wins</TableHead>
                  <TableHead className="text-center">Losses</TableHead>
                  <TableHead className="text-center">Win Rate</TableHead>
                  <TableHead className="text-right">PnL</TableHead>
                  <TableHead className="text-center">Strategy</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboardData.map((player) => {
                  const winRate = player.plays > 0 ? ((player.wins / player.plays) * 100).toFixed(1) : "0.0"
                  const isProfitable = player.pnl > 0

                  return (
                    <TableRow key={player.rank}>
                      <TableCell>
                        <div className="flex items-center justify-center">{getRankIcon(player.rank)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/20 text-xs">
                              {player.address.slice(2, 4).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-mono text-sm">{player.address}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-medium">{player.plays}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                          {player.wins}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                          {player.losses}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-bold">{winRate}%</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1 font-bold">
                          {isProfitable ? (
                            <>
                              <TrendingUp className="h-4 w-4 text-success" />
                              <span className="text-success">+{player.pnl.toFixed(2)}</span>
                            </>
                          ) : (
                            <>
                              <TrendingDown className="h-4 w-4 text-destructive" />
                              <span className="text-destructive">{player.pnl.toFixed(2)}</span>
                            </>
                          )}
                          <span className="text-muted-foreground ml-1">SUI</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyStrategy(player.strategy)}
                                className="font-mono text-xs"
                              >
                                {player.strategy.join(", ")}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Click to copy strategy</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
