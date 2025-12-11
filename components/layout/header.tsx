"use client"

import { useCurrentAccount, useConnectWallet, useDisconnectWallet, useWallets } from "@mysten/dapp-kit"
import { Moon, Sun, Sparkles, Wallet, LogOut, ChevronDown } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const currentAccount = useCurrentAccount()
  const { mutate: connect } = useConnectWallet()
  const { mutate: disconnect } = useDisconnectWallet()
  const wallets = useWallets()

  useEffect(() => {
    setMounted(true)
    console.log("[v0] Header: Available wallets detected:", wallets.length)
    console.log(
      "[v0] Header: Wallets list:",
      wallets.map((w) => w.name),
    )
  }, [wallets])

  if (!mounted) {
    return null
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const handleWalletConnect = (wallet: any) => {
    console.log("[v0] Attempting to connect wallet:", wallet.name)
    connect(
      { wallet },
      {
        onSuccess: () => console.log("[v0] Wallet connected successfully"),
        onError: (error) => console.error("[v0] Wallet connection error:", error),
      },
    )
  }

  const handleDropdownOpenChange = (open: boolean) => {
    console.log("[v0] Wallet dropdown open state changed:", open)
  }

  return (
    <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Sparkles className="h-8 w-8 text-primary animate-sparkle" />
            </div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent drop-shadow-lg">
              The Playground
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="rounded-full"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

            {currentAccount ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Wallet className="h-4 w-4" />
                    {formatAddress(currentAccount.address)}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => disconnect()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu onOpenChange={handleDropdownOpenChange}>
                <DropdownMenuTrigger asChild>
                  <Button className="gap-2" onClick={() => console.log("[v0] Connect Wallet button clicked")}>
                    <Wallet className="h-4 w-4" />
                    Connect Wallet
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {wallets.length > 0 ? (
                    wallets.map((wallet) => (
                      <DropdownMenuItem
                        key={wallet.name}
                        onClick={() => handleWalletConnect(wallet)}
                        className="cursor-pointer"
                      >
                        {wallet.icon && (
                          <img src={wallet.icon || "/placeholder.svg"} alt={wallet.name} className="mr-2 h-5 w-5" />
                        )}
                        {wallet.name}
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem disabled>No wallets detected</DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                    Install a Sui wallet extension
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
