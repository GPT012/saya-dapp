import type React from "react"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { MusicPlayerProvider } from "@/contexts/music-player-context"
import { Header } from "./components/header"
import { Footer } from "./components/footer"
import { MusicPlayer } from "./components/music-player"
import { Suspense } from "react"

export const metadata = {
  title: "سایا | پلتفرم موسیقی NFT",
  description: "سایا، خانه‌ی آثار تو. پلتفرم موسیقی مبتنی بر Web3",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#7B61FF" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans+Arabic:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-persian">
        <AuthProvider>
          <MusicPlayerProvider>
            <Header />
            <main>
              <Suspense
                fallback={
                  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                    <div className="text-white">در حال بارگذاری...</div>
                  </div>
                }
              >
                {children}
              </Suspense>
            </main>
            <Footer />
            <MusicPlayer />
          </MusicPlayerProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
