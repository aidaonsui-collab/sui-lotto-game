import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "../components/theme-provider"
import { SuiWalletProvider } from "../components/providers/sui-wallet-provider"
import { Toaster } from "../components/ui/sonner"
import "./globals.css"
import "@mysten/dapp-kit/dist/index.css"
import Script from "next/script"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "The Playground - Sui Lotto Game",
  description: "A vibrant lotto-style game on Sui blockchain. Play, win, and collect rewards!",
  generator: "The Playground",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <Script id="suppress-dialog-warning" strategy="beforeInteractive">
          {`
            const originalError = console.error;
            console.error = (...args) => {
              if (typeof args[0] === 'string' && args[0].includes('Dialog is changing from uncontrolled to controlled')) {
                return;
              }
              originalError.apply(console, args);
            };
          `}
        </Script>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SuiWalletProvider>
            {children}
            <Toaster />
          </SuiWalletProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
