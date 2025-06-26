"use client"

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Check if we're in browser environment with proper checks
const isBrowser = typeof window !== "undefined" && typeof window.ethereum !== "undefined"

// Get Ethereum provider safely with multiple checks
export const getProvider = () => {
  if (typeof window === "undefined") return null
  if (typeof window.ethereum === "undefined") return null
  return window.ethereum
}

// Check if MetaMask is installed
export const isMetaMaskInstalled = () => {
  if (typeof window === "undefined") return false
  return typeof window.ethereum !== "undefined" && window.ethereum.isMetaMask
}

// Connect wallet and return address
export async function connectWallet() {
  // Ensure we're in browser environment
  if (typeof window === "undefined") {
    throw new Error("Browser environment required")
  }

  // Check if MetaMask is installed
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask is not installed. Please install MetaMask to continue.")
  }

  try {
    const provider = getProvider()
    if (!provider) {
      throw new Error("No Ethereum wallet found. Please install MetaMask.")
    }

    // Request account access
    const accounts = await provider.request({ method: "eth_requestAccounts" })
    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found")
    }

    const address = accounts[0]
    return { address, provider }
  } catch (error: any) {
    console.error("Error connecting wallet:", error)

    // Handle specific MetaMask errors
    if (error.code === 4001) {
      throw new Error("User rejected the connection request")
    } else if (error.code === -32002) {
      throw new Error("MetaMask is already processing a request. Please wait.")
    }

    throw error
  }
}

// Sign message to verify wallet ownership
export async function signMessage(message: string) {
  if (typeof window === "undefined") {
    throw new Error("Browser environment required")
  }

  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask is not installed")
  }

  try {
    const provider = getProvider()
    if (!provider) {
      throw new Error("No Ethereum wallet found")
    }

    const accounts = await provider.request({ method: "eth_accounts" })
    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts connected")
    }

    const address = accounts[0]
    const signature = await provider.request({
      method: "personal_sign",
      params: [message, address],
    })

    return { signature, address }
  } catch (error: any) {
    console.error("Error signing message:", error)

    if (error.code === 4001) {
      throw new Error("User rejected the signature request")
    }

    throw error
  }
}

// Simple signature verification (client-side only for demo)
export function verifySignature(message: string, signature: string, address: string) {
  return !!(message && signature && address)
}

// Generate a nonce for authentication
export function generateNonce() {
  return `saya-auth-${Math.floor(Math.random() * 1000000)}-${Date.now()}`
}

// Login with wallet
export async function loginWithWallet() {
  if (!isBrowser) {
    throw new Error("Browser environment required")
  }

  try {
    // Connect wallet
    const { address } = await connectWallet()

    // Check if user exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id, wallet_address, username, display_name, verified")
      .eq("wallet_address", address.toLowerCase())
      .single()

    // Generate nonce
    const nonce = generateNonce()

    // Sign message with nonce
    const message = `Welcome to Saya!\n\nSign this message to authenticate.\n\nNonce: ${nonce}`
    const { signature } = await signMessage(message)

    // Verify signature (simplified for demo)
    const isValid = verifySignature(message, signature, address)
    if (!isValid) throw new Error("Invalid signature")

    if (existingUser) {
      // User exists, return user data
      return {
        user: existingUser,
        isNewUser: false,
      }
    } else {
      // Create new user
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({
          wallet_address: address.toLowerCase(),
          username: `user_${address.slice(-6)}`,
          display_name: `User ${address.slice(-4)}`,
        })
        .select()
        .single()

      if (createError) throw createError

      return {
        user: newUser,
        isNewUser: true,
      }
    }
  } catch (error: any) {
    console.error("Login error:", error)
    throw error
  }
}

// Logout (simplified - just clear local state)
export async function logout() {
  try {
    return true
  } catch (error: any) {
    console.error("Logout error:", error)
    throw error
  }
}

// Get current user (simplified - in real app you'd check session/token)
export async function getCurrentUser() {
  if (typeof window === "undefined") {
    return null
  }

  if (!isMetaMaskInstalled()) {
    return null
  }

  try {
    const provider = getProvider()
    if (!provider) return null

    const accounts = await provider.request({ method: "eth_accounts" })
    if (!accounts || accounts.length === 0) return null

    const address = accounts[0]
    const { data: user } = await supabase.from("users").select("*").eq("wallet_address", address.toLowerCase()).single()

    return user
  } catch (error: any) {
    console.error("Get current user error:", error)
    return null
  }
}

// Switch to Ethereum Mainnet
export async function switchToEthereum() {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask not found")
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x1" }], // Ethereum Mainnet
    })
  } catch (error: any) {
    if (error.code === 4902) {
      // Network not added to MetaMask
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x1",
            chainName: "Ethereum Mainnet",
            nativeCurrency: {
              name: "Ether",
              symbol: "ETH",
              decimals: 18,
            },
            rpcUrls: ["https://mainnet.infura.io/v3/"],
            blockExplorerUrls: ["https://etherscan.io"],
          },
        ],
      })
    } else {
      throw error
    }
  }
}
