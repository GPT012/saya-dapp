import { WalletType, NetworkType } from "./wallet-providers"
import type { BaseWalletAdapter } from "./wallet-adapters/base-wallet"
import { MetaMaskAdapter } from "./wallet-adapters/metamask-adapter"
import { PhantomAdapter } from "./wallet-adapters/phantom-adapter"
import { WalletConnectAdapter } from "./wallet-adapters/walletconnect-adapter"

export class WalletService {
  private static instance: WalletService
  private currentAdapter: BaseWalletAdapter | null = null
  private currentWalletType: WalletType | null = null

  private constructor() {}

  public static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService()
    }
    return WalletService.instance
  }

  public async connect(walletType: WalletType): Promise<string> {
    // قطع اتصال قبلی اگر وجود داشته باشد
    if (this.currentAdapter) {
      await this.disconnect()
    }

    // ایجاد آداپتور مناسب
    switch (walletType) {
      case WalletType.METAMASK:
        this.currentAdapter = new MetaMaskAdapter()
        break
      case WalletType.PHANTOM:
        this.currentAdapter = new PhantomAdapter()
        break
      case WalletType.WALLETCONNECT:
        this.currentAdapter = new WalletConnectAdapter()
        break
      default:
        throw new Error("Unsupported wallet type")
    }

    // اتصال به کیف پول
    const address = await this.currentAdapter.connect()
    this.currentWalletType = walletType

    return address
  }

  public async disconnect(): Promise<void> {
    if (this.currentAdapter) {
      await this.currentAdapter.disconnect()
      this.currentAdapter = null
      this.currentWalletType = null
    }
  }

  public async signMessage(message: string): Promise<string> {
    if (!this.currentAdapter) {
      throw new Error("No wallet connected")
    }
    return await this.currentAdapter.signMessage(message)
  }

  public async getBalance(): Promise<string> {
    if (!this.currentAdapter) {
      throw new Error("No wallet connected")
    }
    return await this.currentAdapter.getBalance()
  }

  public async switchNetwork(networkType: NetworkType): Promise<boolean> {
    if (!this.currentAdapter) {
      throw new Error("No wallet connected")
    }

    // بررسی سازگاری شبکه با کیف پول
    if (networkType === NetworkType.SOLANA && this.currentWalletType !== WalletType.PHANTOM) {
      throw new Error("Solana network is only supported with Phantom wallet")
    }

    if (
      (networkType === NetworkType.ETHEREUM || networkType === NetworkType.POLYGON) &&
      this.currentWalletType === WalletType.PHANTOM
    ) {
      throw new Error("Ethereum and Polygon networks are not supported with Phantom wallet")
    }

    // تغییر شبکه
    if (networkType === NetworkType.ETHEREUM) {
      return await this.currentAdapter.switchNetwork("0x1")
    } else if (networkType === NetworkType.POLYGON) {
      return await this.currentAdapter.switchNetwork("0x89")
    } else {
      throw new Error("Network switching not supported for this wallet")
    }
  }

  public getAddress(): string | null {
    return this.currentAdapter ? this.currentAdapter.getAddress() : null
  }

  public isConnected(): boolean {
    return this.currentAdapter ? this.currentAdapter.isConnected() : false
  }

  public getCurrentWalletType(): WalletType | null {
    return this.currentWalletType
  }

  public async getChainId(): Promise<string | number | null> {
    if (!this.currentAdapter) {
      return null
    }
    return await this.currentAdapter.getChainId()
  }

  public isWalletInstalled(walletType: WalletType): boolean {
    switch (walletType) {
      case WalletType.METAMASK:
        return typeof window !== "undefined" && !!window.ethereum
      case WalletType.PHANTOM:
        return typeof window !== "undefined" && !!window.solana && !!window.solana.isPhantom
      case WalletType.WALLETCONNECT:
        return true // WalletConnect نیازی به نصب ندارد
      default:
        return false
    }
  }
}
