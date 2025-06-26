// تعریف انواع کیف پول‌های پشتیبانی شده
export enum WalletType {
  METAMASK = "metamask",
  PHANTOM = "phantom",
  WALLETCONNECT = "walletconnect",
}

// تعریف شبکه‌های پشتیبانی شده
export enum NetworkType {
  ETHEREUM = "ethereum",
  POLYGON = "polygon",
  SOLANA = "solana",
}

// اطلاعات هر کیف پول
export interface WalletInfo {
  id: WalletType
  name: string
  icon: string
  description: string
  networks: NetworkType[]
  installUrl?: string
}

// تعریف اطلاعات کیف پول‌های پشتیبانی شده
export const SUPPORTED_WALLETS: WalletInfo[] = [
  {
    id: WalletType.METAMASK,
    name: "MetaMask",
    icon: "/wallets/metamask.png",
    description: "اتصال به کیف پول MetaMask",
    networks: [NetworkType.ETHEREUM, NetworkType.POLYGON],
    installUrl: "https://metamask.io/download/",
  },
  {
    id: WalletType.PHANTOM,
    name: "Phantom",
    icon: "/wallets/phantom.png",
    description: "اتصال به کیف پول Phantom",
    networks: [NetworkType.SOLANA],
    installUrl: "https://phantom.app/download",
  },
  {
    id: WalletType.WALLETCONNECT,
    name: "WalletConnect",
    icon: "/wallets/walletconnect.png",
    description: "اتصال به انواع کیف پول‌های موبایل",
    networks: [NetworkType.ETHEREUM, NetworkType.POLYGON],
  },
]

// تنظیمات شبکه‌ها
export const NETWORK_CONFIGS = {
  [NetworkType.POLYGON]: {
    chainId: "0x89", // 137 در هگزادسیمال
    chainName: "Polygon Mainnet",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://polygon-rpc.com/"],
    blockExplorerUrls: ["https://polygonscan.com/"],
  },
  [NetworkType.ETHEREUM]: {
    chainId: "0x1", // 1 در هگزادسیمال
    chainName: "Ethereum Mainnet",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://mainnet.infura.io/v3/"],
    blockExplorerUrls: ["https://etherscan.io"],
  },
}

// تنظیمات Solana
export const SOLANA_NETWORK = "mainnet-beta" // یا "devnet" برای محیط توسعه
