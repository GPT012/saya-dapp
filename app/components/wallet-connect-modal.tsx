"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle, CheckCircle, Wallet, ExternalLink } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface WalletConnectModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WalletConnectModal({ isOpen, onClose }: WalletConnectModalProps) {
  const { login, isLoading, isMetaMaskInstalled } = useAuth()
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "connecting" | "success" | "error">("idle")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setConnectionStatus("idle")
      setError(null)
    }
  }, [isOpen])

  const handleConnect = async () => {
    if (!isMetaMaskInstalled) {
      setError("MetaMask نصب نشده است. لطفاً ابتدا MetaMask را نصب کنید.")
      setConnectionStatus("error")
      return
    }

    setConnectionStatus("connecting")
    setError(null)

    try {
      await login()
      setConnectionStatus("success")
      setTimeout(() => {
        onClose()
      }, 1000)
    } catch (err: any) {
      setConnectionStatus("error")

      // Handle specific error messages
      if (err.message.includes("MetaMask is not installed")) {
        setError("MetaMask نصب نشده است. لطفاً ابتدا MetaMask را نصب کنید.")
      } else if (err.message.includes("User rejected")) {
        setError("درخواست اتصال رد شد. لطفاً دوباره تلاش کنید.")
      } else if (err.message.includes("already processing")) {
        setError("MetaMask در حال پردازش درخواست قبلی است. لطفاً صبر کنید.")
      } else {
        setError(err.message || "خطا در اتصال کیف پول")
      }
    }
  }

  const openMetaMaskInstall = () => {
    window.open("https://metamask.io/download/", "_blank")
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gray-900/95 backdrop-blur-lg border border-white/20 text-white max-w-md rounded-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">اتصال کیف پول</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* MetaMask */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-[#7B61FF]/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 bg-white/10 rounded-full p-2 flex items-center justify-center">
                  <Wallet className="h-8 w-8 text-[#7B61FF]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">MetaMask</h3>
                  <p className="text-sm text-white/70">
                    {isMetaMaskInstalled ? "اتصال به کیف پول متامسک" : "نصب MetaMask مورد نیاز است"}
                  </p>
                </div>
              </div>

              {isMetaMaskInstalled ? (
                <Button
                  onClick={handleConnect}
                  disabled={connectionStatus === "connecting" || isLoading}
                  className={`min-w-[100px] ${
                    connectionStatus === "success"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-[#7B61FF] hover:bg-[#6A50E0]"
                  }`}
                >
                  {connectionStatus === "connecting" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      اتصال...
                    </>
                  ) : connectionStatus === "success" ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      متصل شد
                    </>
                  ) : connectionStatus === "error" ? (
                    <>
                      <AlertCircle className="mr-2 h-4 w-4" />
                      خطا
                    </>
                  ) : (
                    "اتصال"
                  )}
                </Button>
              ) : (
                <Button onClick={openMetaMaskInstall} className="min-w-[100px] bg-orange-600 hover:bg-orange-700">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  نصب
                </Button>
              )}
            </div>

            {connectionStatus === "error" && error && (
              <div className="mt-4 text-sm text-red-400 bg-red-400/10 p-3 rounded-lg">
                <AlertCircle className="inline-block mr-2 h-4 w-4" />
                {error}
              </div>
            )}

            {!isMetaMaskInstalled && (
              <div className="mt-4 text-sm text-orange-400 bg-orange-400/10 p-3 rounded-lg">
                <AlertCircle className="inline-block mr-2 h-4 w-4" />
                برای استفاده از سایا، نصب MetaMask الزامی است.
              </div>
            )}
          </div>

          {/* سایر کیف پول‌ها (غیرفعال) */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 opacity-60 cursor-not-allowed">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 bg-white/10 rounded-full p-2 flex items-center justify-center">
                  <Wallet className="h-8 w-8 text-white/40" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">WalletConnect</h3>
                  <p className="text-sm text-white/70">به‌زودی</p>
                </div>
              </div>
              <Button disabled className="min-w-[100px] bg-gray-600">
                به‌زودی
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-white/60 mt-2">
          با اتصال کیف پول، شما <span className="text-[#00D4FF] hover:underline cursor-pointer">شرایط استفاده</span> از
          سایا را می‌پذیرید.
        </div>
      </DialogContent>
    </Dialog>
  )
}
