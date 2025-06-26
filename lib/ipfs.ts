"use client"

// IPFS configuration and utilities
export interface IPFSFile {
  path: string
  hash: string
  size: number
}

export interface MusicMetadata {
  title: string
  artist: string
  description?: string
  genre?: string
  duration?: number
  coverImage?: string
  audioFile: string
  createdAt: string
}

// IPFS Gateway URLs (you can use multiple for redundancy)
export const IPFS_GATEWAYS = [
  "https://ipfs.io/ipfs/",
  "https://gateway.pinata.cloud/ipfs/",
  "https://cloudflare-ipfs.com/ipfs/",
  "https://dweb.link/ipfs/",
]

// Get IPFS URL with fallback gateways
export function getIPFSUrl(hash: string, gatewayIndex = 0): string {
  if (gatewayIndex >= IPFS_GATEWAYS.length) {
    return `${IPFS_GATEWAYS[0]}${hash}`
  }
  return `${IPFS_GATEWAYS[gatewayIndex]}${hash}`
}

// Upload file to IPFS via Pinata API
export async function uploadToIPFS(file: File): Promise<IPFSFile> {
  const formData = new FormData()
  formData.append("file", file)

  const metadata = JSON.stringify({
    name: file.name,
    keyvalues: {
      uploadedBy: "saya-platform",
      timestamp: new Date().toISOString(),
    },
  })
  formData.append("pinataMetadata", metadata)

  const options = JSON.stringify({
    cidVersion: 1,
  })
  formData.append("pinataOptions", options)

  try {
    const response = await fetch("/api/ipfs/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to upload to IPFS")
    }

    const result = await response.json()
    return {
      path: file.name,
      hash: result.IpfsHash,
      size: result.PinSize,
    }
  } catch (error) {
    console.error("IPFS upload error:", error)
    throw error
  }
}

// Upload JSON metadata to IPFS
export async function uploadMetadataToIPFS(metadata: MusicMetadata): Promise<string> {
  const blob = new Blob([JSON.stringify(metadata, null, 2)], {
    type: "application/json",
  })
  const file = new File([blob], "metadata.json", { type: "application/json" })

  const result = await uploadToIPFS(file)
  return result.hash
}

// Retrieve metadata from IPFS
export async function getMetadataFromIPFS(hash: string): Promise<MusicMetadata> {
  for (let i = 0; i < IPFS_GATEWAYS.length; i++) {
    try {
      const url = getIPFSUrl(hash, i)
      const response = await fetch(url)

      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.warn(`Failed to fetch from gateway ${i}:`, error)
      continue
    }
  }

  throw new Error("Failed to retrieve metadata from IPFS")
}

// Pin file to IPFS (keep it available)
export async function pinToIPFS(hash: string): Promise<boolean> {
  try {
    const response = await fetch("/api/ipfs/pin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hash }),
    })

    return response.ok
  } catch (error) {
    console.error("Pin to IPFS error:", error)
    return false
  }
}
