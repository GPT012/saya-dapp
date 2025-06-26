"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, Loader2, LogOut, User, Download } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { shortenAddress } from "@/lib/utils"
import { WalletConnectModal } from "./wallet-connect-modal"
import Link from "next/link"

export function WalletConnectButton() {
  const { user, isLoading, isAuthenticated, isMetaMaskInstalled, login, logout } = useAuth()
  const [isConnecting, setIsConnecting] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const handleConnect = async () => {
    if (!isMetaMaskInstalled) {
      setShowModal(true)
      return
    }

    try {
      setIsConnecting(true)
      await login()
    } catch (error: any) {
      console.error("Connection error:", error)

      // Handle specific MetaMask errors
      if (error.code === 4001) {
        alert("اتصال کیف پول لغو شد. لطفاً دوباره تلاش کنید.")
      } else if (error.code === -32002) {
        alert("MetaMask در حال پردازش درخواست قبلی است. لطفاً صبر کنید.")
      } else if (error.message.includes("MetaMask is not installed")) {
        alert("لطفاً ابتدا MetaMask را نصب کنید.")
      } else if (error.message.includes("User rejected")) {
        alert("اتصال کیف پول لغو شد.")
      } else if (error.message.includes("Already processing")) {
        alert("MetaMask مشغول است. لطفاً صبر کنید.")
      } else {
        alert(`خطا در اتصال کیف پول: ${error.message}`)
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const openMetaMaskInstall = () => {
    window.open("https://metamask.io/download/", "_blank")
  }

  if (isLoading) {
    return (
      <Button disabled className="rounded-full bg-white/10 text-white">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        در حال بارگذاری...
      </Button>
    )
  }

  if (isAuthenticated && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="rounded-full bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] px-6 text-white hover:opacity-90">
            <Wallet className="mr-2 h-4 w-4" />
            {shortenAddress(user.wallet_address)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-white/10 text-white">
          <DropdownMenuLabel>حساب کاربری</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem
            asChild
            className="hover:bg-white/10 cursor-pointer"
          >
            <Link href="/profile" className="flex items-center w-full">
              <User className="mr-2 h-4 w-4" />
              پروفایل
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-white/10 cursor-pointer" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            خروج
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // If MetaMask is not installed, show install button
  if (!isMetaMaskInstalled) {
    return (
      <>
        <Button
          onClick={openMetaMaskInstall}
          className="rounded-full bg-orange-600 hover:bg-orange-700 px-6 text-white"
        >
          <Download className="mr-2 h-4 w-4" />
          نصب MetaMask
        </Button>
        <WalletConnectModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </>
    )
  }

  return (
    <>
      <Button
        onClick={handleConnect}
        disabled={isConnecting}
        className="rounded-full bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] px-6 text-white hover:opacity-90"
      >
        {isConnecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            در حال اتصال...
          </>
        ) : (
          <>
            <Wallet className="mr-2 h-4 w-4" />
            اتصال کیف پول
          </>
        )}
      </Button>

      <WalletConnectModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  )
}
