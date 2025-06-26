import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Forward the request to Pinata API
    const pinataResponse = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: formData,
    })

    if (!pinataResponse.ok) {
      throw new Error("Failed to upload to Pinata")
    }

    const result = await pinataResponse.json()

    return NextResponse.json(result)
  } catch (error) {
    console.error("IPFS upload API error:", error)
    return NextResponse.json({ error: "Failed to upload to IPFS" }, { status: 500 })
  }
}
