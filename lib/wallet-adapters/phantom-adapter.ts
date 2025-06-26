import { BaseWalletAdapter } from "./base-wallet"
import { Connection, type PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { SOLANA_NETWORK } from "../wallet-providers"

export class PhantomAdapter extends BaseWalletAdapter {
  private provider: any = null
  private connection: Connection | null = null
  private publicKey: PublicKey | null = null

  constructor() {
    super()
    this.checkConnection()
  }

  private async checkConnection() {
    if (typeof window !== "undefined" && window.solana && window.solana.isPhantom) {
      try {
        this.provider = window.solana

        if (this.provider.isConnected) {
          this.publicKey = this.provider.publicKey
          this.address = this.publicKey?.toString() || null
          this.connected = true

          // ایجاد اتصال به شبکه سولانا
          const rpcUrl = this.getRpcUrl()
          this.connection = new Connection(rpcUrl, "confirmed")
        }
      } catch (error) {
        console.error("Error checking Phantom connection:", error)
      }
    }
  }

  private getRpcUrl(): string {
    switch (SOLANA_NETWORK) {
      case "mainnet-beta":
        return "https://api.mainnet-beta.solana.com"
      case "devnet":
        return "https://api.devnet.solana.com"
      case "testnet":
        return "https://api.testnet.solana.com"
      default:
        return "https://api.mainnet-beta.solana.com"
    }
  }

  async connect(): Promise<string> {
    if (typeof window === "undefined") {
      throw new Error("Browser environment is required")
    }

    if (!window.solana || !window.solana.isPhantom) {
      throw new Error("Phantom wallet is not installed")
    }

    try {
      this.provider = window.solana

      // ایجاد اتصال به شبکه سولانا
      const rpcUrl = this.getRpcUrl()
      this.connection = new Connection(rpcUrl, "confirmed")

      const { publicKey } = await this.provider.connect()
      this.publicKey = publicKey
      this.address = publicKey.toString()
      this.connected = true

      return this.address
    } catch (error: any) {
      console.error("Phantom connection error:", error)
      throw new Error(error.message || "Failed to connect to Phantom")
    }
  }

  async disconnect(): Promise<void> {
    if (this.provider) {
      try {
        await this.provider.disconnect()
      } catch (error) {
        console.error("Error disconnecting from Phantom:", error)
      }
    }

    this.provider = null
    this.connection = null
    this.publicKey = null
    this.address = null
    this.connected = false
  }

  async signMessage(message: string): Promise<string> {
    if (!this.provider || !this.publicKey) {
      throw new Error("Wallet not connected")
    }

    try {
      // تبدیل پیام به آرایه بایت
      const encodedMessage = new TextEncoder().encode(message)

      // امضای پیام
      const { signature } = await this.provider.signMessage(encodedMessage, "utf8")

      // تبدیل امضا به رشته هگزادسیمال
      return Buffer.from(signature).toString("hex")
    } catch (error: any) {
      console.error("Error signing message with Phantom:", error)
      throw new Error(error.message || "Failed to sign message")
    }
  }

  async getBalance(): Promise<string> {
    if (!this.connection || !this.publicKey) {
      throw new Error("Wallet not connected")
    }

    try {
      const balance = await this.connection.getBalance(this.publicKey)
      return (balance / LAMPORTS_PER_SOL).toString()
    } catch (error: any) {
      console.error("Error getting Solana balance:", error)
      throw new Error(error.message || "Failed to get balance")
    }
  }

  async getChainId(): Promise<string> {
    return SOLANA_NETWORK
  }

  async switchNetwork(chainId: string): Promise<boolean> {
    // در سولانا، تغییر شبکه به این صورت انجام نمی‌شود
    // معمولاً کاربر باید در تنظیمات کیف پول شبکه را تغییر دهد
    throw new Error("Network switching not supported in Phantom wallet")
  }
}

// تعریف window.solana برای TypeScript
declare global {
  interface Window {
    solana?: any
  }
}
