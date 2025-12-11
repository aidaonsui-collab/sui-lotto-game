"use client"

import { GameBoardWrapper } from "@/components/game/game-board-wrapper"
import { Leaderboard } from "@/components/leaderboard/leaderboard"
import { TopPlayersSelections } from "@/components/game/top-players-selections"
import { Header } from "@/components/layout/header"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { GameStatistics } from "@/components/stats/game-statistics"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gamepad2, Trophy, Users } from "lucide-react"
import { JackpotDisplay } from "@/components/game/jackpot-display"
import { MysteryBoxStatus } from "@/components/game/mystery-box-status"
import { StatsPanel } from "@/components/game/stats-panel"

export default function Home() {
  console.log("[v0] HOME PAGE RENDERING")
  console.log("[v0] JackpotDisplay:", JackpotDisplay)
  console.log("[v0] MysteryBoxStatus:", MysteryBoxStatus)
  console.log("[v0] StatsPanel:", StatsPanel)

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <Header />

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <JackpotDisplay />
          <MysteryBoxStatus />
        </div>

        <GameStatistics />

        <Tabs defaultValue="play" className="w-full max-w-7xl mx-auto mt-8">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="play" className="flex items-center gap-2">
              <Gamepad2 className="h-4 w-4" />
              Play Game
            </TabsTrigger>

            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Leaderboard
            </TabsTrigger>

            <TabsTrigger value="top-players" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Top Picks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="play">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
              <GameBoardWrapper />
              <div className="lg:sticky lg:top-24 lg:self-start">
                <StatsPanel />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Leaderboard />
          </TabsContent>

          <TabsContent value="top-players">
            <TopPlayersSelections />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
