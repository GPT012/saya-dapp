"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2, Database, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface ConnectionTest {
  name: string
  status: "pending" | "success" | "error"
  message: string
  details?: any
}

export default function TestConnectionPage() {
  const [tests, setTests] = useState<ConnectionTest[]>([
    { name: "Supabase Connection", status: "pending", message: "Testing..." },
    { name: "Database Tables", status: "pending", message: "Testing..." },
    { name: "Sample Data", status: "pending", message: "Testing..." },
    { name: "MetaMask Detection", status: "pending", message: "Testing..." },
  ])
  const [isRunning, setIsRunning] = useState(false)

  const updateTest = (index: number, status: "success" | "error", message: string, details?: any) => {
    setTests((prev) => prev.map((test, i) => (i === index ? { ...test, status, message, details } : test)))
  }

  const runTests = async () => {
    setIsRunning(true)

    // Test 1: Supabase Connection
    try {
      const { data, error } = await supabase.from("users").select("count", { count: "exact", head: true })
      if (error) throw error
      updateTest(0, "success", `Connected successfully. Users count: ${data?.length || 0}`)
    } catch (error: any) {
      updateTest(0, "error", `Connection failed: ${error.message}`, error)
    }

    // Test 2: Database Tables
    try {
      const tables = ["users", "tracks", "likes", "plays", "follows"]
      const results = []

      for (const table of tables) {
        try {
          const { count } = await supabase.from(table).select("*", { count: "exact", head: true })
          results.push(`${table}: ${count || 0} records`)
        } catch (error: any) {
          results.push(`${table}: Error - ${error.message}`)
        }
      }

      updateTest(1, "success", "Tables checked", results)
    } catch (error: any) {
      updateTest(1, "error", `Table check failed: ${error.message}`, error)
    }

    // Test 3: Sample Data
    try {
      const { data: tracks, error } = await supabase.from("tracks").select("id, title, artist_name").limit(3)

      if (error) throw error
      updateTest(2, "success", `Found ${tracks?.length || 0} sample tracks`, tracks)
    } catch (error: any) {
      updateTest(2, "error", `Sample data check failed: ${error.message}`, error)
    }

    // Test 4: MetaMask Detection
    try {
      if (typeof window !== "undefined") {
        const hasEthereum = typeof window.ethereum !== "undefined"
        const isMetaMask = window.ethereum?.isMetaMask

        if (hasEthereum && isMetaMask) {
          updateTest(3, "success", "MetaMask detected and ready")
        } else if (hasEthereum) {
          updateTest(3, "success", "Ethereum wallet detected (not MetaMask)")
        } else {
          updateTest(3, "error", "No Ethereum wallet detected. Please install MetaMask.")
        }
      } else {
        updateTest(3, "error", "Window object not available")
      }
    } catch (error: any) {
      updateTest(3, "error", `MetaMask check failed: ${error.message}`, error)
    }

    setIsRunning(false)
  }

  useEffect(() => {
    runTests()
  }, [])

  const getStatusIcon = (status: ConnectionTest["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
    }
  }

  const getStatusColor = (status: ConnectionTest["status"]) => {
    switch (status) {
      case "success":
        return "border-green-500/50 bg-green-500/10"
      case "error":
        return "border-red-500/50 bg-red-500/10"
      default:
        return "border-blue-500/50 bg-blue-500/10"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">تست اتصالات سیستم</h1>
          <p className="text-white/60">بررسی وضعیت اتصال به دیتابیس و سرویس‌ها</p>
        </div>

        <div className="grid gap-6">
          {tests.map((test, index) => (
            <Card key={index} className={`${getStatusColor(test.status)} border backdrop-blur-sm`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  {getStatusIcon(test.status)}
                  {test.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 mb-2">{test.message}</p>
                {test.details && (
                  <details className="mt-3">
                    <summary className="text-white/60 cursor-pointer hover:text-white">جزئیات بیشتر</summary>
                    <pre className="mt-2 p-3 bg-black/20 rounded text-xs text-white/70 overflow-auto">
                      {JSON.stringify(test.details, null, 2)}
                    </pre>
                  </details>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button
            onClick={runTests}
            disabled={isRunning}
            className="bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] text-white hover:opacity-90"
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                در حال تست...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                اجرای مجدد تست‌ها
              </>
            )}
          </Button>
        </div>

        {/* Environment Info */}
        <Card className="mt-8 bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              اطلاعات محیط
            </CardTitle>
          </CardHeader>
          <CardContent className="text-white/80 space-y-2">
            <div>
              <strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ تنظیم شده" : "❌ تنظیم نشده"}
            </div>
            <div>
              <strong>Supabase Anon Key:</strong>{" "}
              {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ تنظیم شده" : "❌ تنظیم نشده"}
            </div>
            <div>
              <strong>Pinata JWT:</strong> {process.env.PINATA_JWT ? "✅ تنظیم شده" : "❌ تنظیم نشده"}
            </div>
            <div>
              <strong>Environment:</strong> {process.env.NODE_ENV || "development"}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
