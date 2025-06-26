import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { hash } = await request.json()

    const pinataResponse = await fetch("https://api.pinata.cloud/pinning/pinByHash", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: JSON.stringify({
        hashToPin: hash,
        pinataMetadata: {
          name: `saya-pin-${hash}`,
          keyvalues: {
            service: "saya-platform",
            timestamp: new Date().toISOString(),
          },
        },
      }),
    })

    if (!pinataResponse.ok) {
      throw new Error("Failed to pin to Pinata")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("IPFS pin API error:", error)
    return NextResponse.json({ error: "Failed to pin to IPFS" }, { status: 500 })
  }
}
