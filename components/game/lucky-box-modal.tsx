"use client"

import { motion } from "framer-motion"
import { Gift, Sparkles } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface LuckyBoxModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCollect: () => void
}

export function LuckyBoxModal({ open, onOpenChange, onCollect }: LuckyBoxModalProps) {
  return (
    <Dialog open={!!open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-2 border-secondary bg-gradient-to-br from-background to-secondary/10">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
        >
          <DialogHeader>
            <motion.div
              className="flex justify-center mb-4"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            >
              <div className="relative">
                <Gift className="h-24 w-24 text-secondary" />
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Sparkles className="h-8 w-8 text-warning" />
                </motion.div>
              </div>
            </motion.div>

            <DialogTitle className="text-3xl text-center bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              Feeling Lucky!
            </DialogTitle>
            <DialogDescription className="text-center text-lg">
              Congratulations on 10 consecutive wins!
              <br />
              You have earned a special Lucky Box reward!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-6">
            <motion.div
              className="bg-gradient-to-r from-secondary/20 to-accent/20 rounded-lg p-6 text-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            >
              <p className="text-4xl font-bold text-secondary">+5 SUI</p>
              <p className="text-sm text-muted-foreground mt-1">Bonus Reward</p>
            </motion.div>

            <Button
              onClick={onCollect}
              size="lg"
              className="w-full text-lg font-bold bg-gradient-to-r from-secondary to-accent hover:opacity-90"
            >
              Collect Reward
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
