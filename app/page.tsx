"use client"

import { GameBoard } from "@/components/game/game-board"
import { Header } from "@/components/layout/header"
import { Leaderboard } from "@/components/leaderboard/leaderboard"
import { JackpotDisplay } from "@/components/game/jackpot-display"
import { MysteryBoxStatus } from "@/components/game/mystery-box-status"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { TopPlayersSelections } from "@/components/game/top-players-selections"
import { GameStatistics } from "@/components/stats/game-statistics"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gamepad2, Trophy, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            <div className="lg:col-span-2">
              <JackpotDisplay />
            </div>
            <div className="lg:col-span-1">
              <MysteryBoxStatus />
            </div>
          </div>

          <div className="mb-8">
            <GameStatistics />
          </div>

          <Tabs defaultValue="game" className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-8 h-12">
              <TabsTrigger value="game" className="text-base font-bold gap-2">
                <Gamepad2 className="w-4 h-4" />
                Play Game
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="text-base font-bold gap-2">
                <Trophy className="w-4 h-4" />
                Leaderboard
              </TabsTrigger>
              <TabsTrigger value="top-players" className="text-base font-bold gap-2">
                <Users className="w-4 h-4" />
                Top Picks
              </TabsTrigger>
            </TabsList>

            <TabsContent value="game">
              <GameBoard />
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
    </div>
  )
}
