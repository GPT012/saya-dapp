// کلاس پایه برای تمام آداپتورهای کیف پول
export interface WalletAdapter {
  connect(): Promise<string>
  disconnect(): Promise<void>
  getAddress(): string | null
  isConnected(): boolean
  signMessage(message: string): Promise<string>
  getBalance(): Promise<string>
  getChainId(): Promise<string | number>
  switchNetwork(chainId: string): Promise<boolean>
}

export abstract class BaseWalletAdapter implements WalletAdapter {
  protected address: string | null = null
  protected connected = false

  abstract connect(): Promise<string>
  abstract disconnect(): Promise<void>
  abstract signMessage(message: string): Promise<string>
  abstract getBalance(): Promise<string>
  abstract getChainId(): Promise<string | number>
  abstract switchNetwork(chainId: string): Promise<boolean>

  getAddress(): string | null {
    return this.address
  }

  isConnected(): boolean {
    return this.connected
  }
}
