"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { loginWithWallet, logout, getCurrentUser, isMetaMaskInstalled } from "@/lib/web3auth"
import type { User } from "@/lib/supabase"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  isMetaMaskInstalled: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isMetaMaskInstalled: false,
  login: async () => {},
  logout: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [metaMaskInstalled, setMetaMaskInstalled] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    // Check MetaMask installation after component mounts
    if (typeof window !== "undefined") {
      setMetaMaskInstalled(isMetaMaskInstalled())
    }
  }, [])

  useEffect(() => {
    if (!isMounted) return

    async function loadUser() {
      try {
        if (metaMaskInstalled) {
          const currentUser = await getCurrentUser()
          setUser(currentUser)
        }
      } catch (error) {
        console.error("Error loading user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [isMounted, metaMaskInstalled])

  const login = async () => {
    if (!isMounted) return

    if (!metaMaskInstalled) {
      throw new Error("MetaMask is not installed. Please install MetaMask to continue.")
    }

    try {
      setIsLoading(true)
      const { user: authUser } = await loginWithWallet()
      setUser(authUser as User)
    } catch (error: any) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      await logout()
      setUser(null)
    } catch (error: any) {
      console.error("Logout error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">در حال بارگذاری...</div>
      </div>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isMetaMaskInstalled: metaMaskInstalled,
        login,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
