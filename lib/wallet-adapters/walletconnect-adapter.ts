import { ethers } from "ethers"
import { BaseWalletAdapter } from "./base-wallet"
import { NETWORK_CONFIGS, NetworkType } from "../wallet-providers"
import WalletConnectProvider from "@walletconnect/web3-provider"

export class WalletConnectAdapter extends BaseWalletAdapter {
  private provider: WalletConnectProvider | null = null
  private ethersProvider: ethers.providers.Web3Provider | null = null

  constructor() {
    super()
  }

  async connect(): Promise<string> {
    try {
      // ایجاد پروایدر WalletConnect
      this.provider = new WalletConnectProvider({
        rpc: {
          1: NETWORK_CONFIGS[NetworkType.ETHEREUM].rpcUrls[0],
          137: NETWORK_CONFIGS[NetworkType.POLYGON].rpcUrls[0],
        },
        qrcodeModalOptions: {
          mobileLinks: ["rainbow", "metamask", "trust", "argent"],
        },
      })

      // اتصال به کیف پول
      await this.provider.enable()

      // ایجاد پروایدر ethers
      this.ethersProvider = new ethers.providers.Web3Provider(this.provider)

      // دریافت آدرس کیف پول
      const accounts = await this.ethersProvider.listAccounts()
      if (accounts.length === 0) {
        throw new Error("No accounts found")
      }

      this.address = accounts[0]
      this.connected = true

      // اضافه کردن event listener برای قطع اتصال
      this.provider.on("disconnect", () => {
        this.disconnect()
      })

      return this.address
    } catch (error: any) {
      console.error("WalletConnect connection error:", error)
      throw new Error(error.message || "Failed to connect with WalletConnect")
    }
  }

  async disconnect(): Promise<void> {
    if (this.provider) {
      try {
        await this.provider.disconnect()
      } catch (error) {
        console.error("Error disconnecting from WalletConnect:", error)
      }
    }

    this.provider = null
    this.ethersProvider = null
    this.address = null
    this.connected = false
  }

  async signMessage(message: string): Promise<string> {
    if (!this.ethersProvider || !this.address) {
      throw new Error("Wallet not connected")
    }

    try {
      const signer = this.ethersProvider.getSigner()
      return await signer.signMessage(message)
    } catch (error: any) {
      console.error("Error signing message with WalletConnect:", error)
      throw new Error(error.message || "Failed to sign message")
    }
  }

  async getBalance(): Promise<string> {
    if (!this.ethersProvider || !this.address) {
      throw new Error("Wallet not connected")
    }

    try {
      const balance = await this.ethersProvider.getBalance(this.address)
      return ethers.utils.formatEther(balance)
    } catch (error: any) {
      console.error("Error getting balance with WalletConnect:", error)
      throw new Error(error.message || "Failed to get balance")
    }
  }

  async getChainId(): Promise<number> {
    if (!this.provider) {
      throw new Error("Wallet not connected")
    }

    try {
      return this.provider.chainId
    } catch (error: any) {
      console.error("Error getting chain ID with WalletConnect:", error)
      throw new Error(error.message || "Failed to get chain ID")
    }
  }

  async switchNetwork(chainId: string): Promise<boolean> {
    if (!this.provider) {
      throw new Error("Wallet not connected")
    }

    try {
      // WalletConnect نسخه 1 از تغییر شبکه پشتیبانی نمی‌کند
      // کاربر باید در کیف پول خود شبکه را تغییر دهد
      throw new Error("Network switching not supported in WalletConnect v1")
    } catch (error: any) {
      console.error("Error switching network with WalletConnect:", error)
      throw new Error(error.message || "Failed to switch network")
    }
  }
}
