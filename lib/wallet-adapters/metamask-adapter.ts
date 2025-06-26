import { ethers } from "ethers"
import { BaseWalletAdapter } from "./base-wallet"
import { NETWORK_CONFIGS, NetworkType } from "../wallet-providers"

export class MetaMaskAdapter extends BaseWalletAdapter {
  private provider: ethers.providers.Web3Provider | null = null

  constructor() {
    super()
    this.checkConnection()
  }

  private async checkConnection() {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const accounts = await provider.listAccounts()

        if (accounts.length > 0) {
          this.provider = provider
          this.address = accounts[0]
          this.connected = true
        }
      } catch (error) {
        console.error("Error checking MetaMask connection:", error)
      }
    }
  }

  async connect(): Promise<string> {
    if (typeof window === "undefined") {
      throw new Error("Browser environment is required")
    }

    if (!window.ethereum) {
      throw new Error("MetaMask is not installed")
    }

    try {
      this.provider = new ethers.providers.Web3Provider(window.ethereum)
      const accounts = await this.provider.send("eth_requestAccounts", [])

      if (accounts.length === 0) {
        throw new Error("No accounts found")
      }

      this.address = accounts[0]
      this.connected = true
      return this.address
    } catch (error: any) {
      console.error("MetaMask connection error:", error)
      throw new Error(error.message || "Failed to connect to MetaMask")
    }
  }

  async disconnect(): Promise<void> {
    this.provider = null
    this.address = null
    this.connected = false
  }

  async signMessage(message: string): Promise<string> {
    if (!this.provider || !this.address) {
      throw new Error("Wallet not connected")
    }

    try {
      const signer = this.provider.getSigner()
      return await signer.signMessage(message)
    } catch (error: any) {
      console.error("Error signing message:", error)
      throw new Error(error.message || "Failed to sign message")
    }
  }

  async getBalance(): Promise<string> {
    if (!this.provider || !this.address) {
      throw new Error("Wallet not connected")
    }

    try {
      const balance = await this.provider.getBalance(this.address)
      return ethers.utils.formatEther(balance)
    } catch (error: any) {
      console.error("Error getting balance:", error)
      throw new Error(error.message || "Failed to get balance")
    }
  }

  async getChainId(): Promise<string> {
    if (!this.provider) {
      throw new Error("Wallet not connected")
    }

    try {
      const network = await this.provider.getNetwork()
      return "0x" + network.chainId.toString(16)
    } catch (error: any) {
      console.error("Error getting chain ID:", error)
      throw new Error(error.message || "Failed to get chain ID")
    }
  }

  async switchNetwork(chainId: string): Promise<boolean> {
    if (!this.provider || !window.ethereum) {
      throw new Error("Wallet not connected")
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      })
      return true
    } catch (error: any) {
      // این خطا زمانی رخ می‌دهد که شبکه در کیف پول تعریف نشده باشد
      if (error.code === 4902) {
        try {
          const networkType = chainId === "0x89" ? NetworkType.POLYGON : NetworkType.ETHEREUM
          const networkConfig = NETWORK_CONFIGS[networkType]

          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: networkConfig.chainId,
                chainName: networkConfig.chainName,
                nativeCurrency: networkConfig.nativeCurrency,
                rpcUrls: networkConfig.rpcUrls,
                blockExplorerUrls: networkConfig.blockExplorerUrls,
              },
            ],
          })
          return true
        } catch (addError) {
          console.error("Error adding network:", addError)
          throw new Error("Failed to add network")
        }
      }
      console.error("Error switching network:", error)
      throw new Error(error.message || "Failed to switch network")
    }
  }
}

// تعریف window.ethereum برای TypeScript
declare global {
  interface Window {
    ethereum?: any
  }
}
