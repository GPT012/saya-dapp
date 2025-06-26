"use client"

import { useEffect } from "react"

export function VercelAnalytics() {
  useEffect(() => {
    console.log("Vercel analytics component mounted")
  }, [])

  return null
}
