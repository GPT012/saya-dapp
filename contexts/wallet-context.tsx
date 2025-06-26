"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { WalletService } from "@/lib/wallet-service"
import { type WalletType, NetworkType, SUPPORTED_WALLETS } from "@/lib/wallet-providers"

interface WalletContextType {
  address: string | null
  isConnected: boolean
  isConnecting: boolean
  walletType: WalletType | null
  networkType: NetworkType | null
  balance: string | null
  error: string | null
  connect: (walletType: WalletType) => Promise<boolean>
  disconnect: () => Promise<void>
  signMessage: (message: string) => Promise<string>
  switchNetwork: (networkType: NetworkType) => Promise<boolean>
  getInstalledWallets: () => WalletType[]
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  isConnecting: false,
  walletType: null,
  networkType: null,
  balance: null,
  error: null,
  connect: async () => false,
  disconnect: async () => {},
  signMessage: async () => "",
  switchNetwork: async () => false,
  getInstalledWallets: () => [],
})

export const useWallet = () => useContext(WalletContext)

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [walletType, setWalletType] = useState<WalletType | null>(null)
  const [networkType, setNetworkType] = useState<NetworkType | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // ایجاد نمونه سرویس کیف پول
  const walletService = WalletService.getInstance()

  // بررسی اتصال قبلی در هنگام بارگذاری
  useEffect(() => {
    const checkConnection = async () => {
      if (walletService.isConnected()) {
        const currentAddress = walletService.getAddress()
        const currentWalletType = walletService.getCurrentWalletType()

        if (currentAddress && currentWalletType) {
          setAddress(currentAddress)
          setWalletType(currentWalletType)
          setIsConnected(true)

          try {
            // دریافت موجودی
            const currentBalance = await walletService.getBalance()
            setBalance(currentBalance)

            // دریافت شبکه فعلی
            const chainId = await walletService.getChainId()
            if (chainId) {
              if (typeof chainId === "string" && chainId === "mainnet-beta") {
                setNetworkType(NetworkType.SOLANA)
              } else if (chainId === "0x1" || chainId === 1) {
                setNetworkType(NetworkType.ETHEREUM)
              } else if (chainId === "0x89" || chainId === 137) {
                setNetworkType(NetworkType.POLYGON)
              }
            }
          } catch (err) {
            console.error("Error fetching wallet data:", err)
          }
        }
      }
    }

    checkConnection()
  }, [])

  // اتصال به کیف پول
  const connect = async (type: WalletType): Promise<boolean> => {
    setIsConnecting(true)
    setError(null)

    try {
      const newAddress = await walletService.connect(type)
      setAddress(newAddress)
      setWalletType(type)
      setIsConnected(true)

      // دریافت موجودی
      const newBalance = await walletService.getBalance()
      setBalance(newBalance)

      // دریافت شبکه فعلی
      const chainId = await walletService.getChainId()
      if (chainId) {
        if (typeof chainId === "string" && chainId === "mainnet-beta") {
          setNetworkType(NetworkType.SOLANA)
        } else if (chainId === "0x1" || chainId === 1) {
          setNetworkType(NetworkType.ETHEREUM)
        } else if (chainId === "0x89" || chainId === 137) {
          setNetworkType(NetworkType.POLYGON)
        }
      }

      return true
    } catch (err: any) {
      console.error("Wallet connection error:", err)
      setError(err.message || "Failed to connect wallet")
      return false
    } finally {
      setIsConnecting(false)
    }
  }

  // قطع اتصال کیف پول
  const disconnect = async (): Promise<void> => {
    try {
      await walletService.disconnect()
      setAddress(null)
      setWalletType(null)
      setNetworkType(null)
      setBalance(null)
      setIsConnected(false)
    } catch (err: any) {
      console.error("Wallet disconnection error:", err)
      setError(err.message || "Failed to disconnect wallet")
    }
  }

  // امضای پیام
  const signMessage = async (message: string): Promise<string> => {
    setError(null)
    try {
      return await walletService.signMessage(message)
    } catch (err: any) {
      console.error("Message signing error:", err)
      setError(err.message || "Failed to sign message")
      throw err
    }
  }

  // تغییر شبکه
  const switchNetwork = async (network: NetworkType): Promise<boolean> => {
    setError(null)
    try {
      const success = await walletService.switchNetwork(network)
      if (success) {
        setNetworkType(network)
      }
      return success
    } catch (err: any) {
      console.error("Network switching error:", err)
      setError(err.message || "Failed to switch network")
      return false
    }
  }

  // دریافت لیست کیف پول‌های نصب شده
  const getInstalledWallets = (): WalletType[] => {
    return SUPPORTED_WALLETS.filter((wallet) => walletService.isWalletInstalled(wallet.id)).map((wallet) => wallet.id)
  }

  const value = {
    address,
    isConnected,
    isConnecting,
    walletType,
    networkType,
    balance,
    error,
    connect,
    disconnect,
    signMessage,
    switchNetwork,
    getInstalledWallets,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}
