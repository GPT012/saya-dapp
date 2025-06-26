"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Upload, Music, ImageIcon, Loader2 } from "lucide-react"
import { uploadToIPFS, uploadMetadataToIPFS, type MusicMetadata } from "@/lib/ipfs"
import { addTrack } from "@/lib/database"
import { useAuth } from "@/contexts/auth-context"

export function UploadForm() {
  const [isUploading, setIsUploading] = useState(false)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    description: "",
    genre: "",
  })
  const [uploadResult, setUploadResult] = useState<{
    audioHash: string
    coverHash?: string
    metadataHash: string
  } | null>(null)
  const { user } = useAuth()

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("audio/")) {
      setAudioFile(file)
    }
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setCoverFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!audioFile || !user) return

    setIsUploading(true)
    try {
      // Upload audio file to IPFS
      console.log("Uploading audio file...")
      const audioResult = await uploadToIPFS(audioFile)

      // Upload cover image if provided
      let coverResult
      if (coverFile) {
        console.log("Uploading cover image...")
        coverResult = await uploadToIPFS(coverFile)
      }

      // Create metadata
      const metadata: MusicMetadata = {
        title: formData.title,
        artist: formData.artist,
        description: formData.description,
        genre: formData.genre,
        audioFile: audioResult.hash,
        coverImage: coverResult?.hash,
        createdAt: new Date().toISOString(),
      }

      // Upload metadata to IPFS
      console.log("Uploading metadata...")
      const metadataHash = await uploadMetadataToIPFS(metadata)

      // Add track to database
      await addTrack({
        user_id: user.id,
        title: formData.title,
        artist_name: formData.artist,
        description: formData.description,
        genre: formData.genre,
        ipfs_hash: audioResult.hash,
        metadata_hash: metadataHash,
        cover_image_hash: coverResult?.hash,
        duration: undefined,
        price_eth: 0,
      })

      setUploadResult({
        audioHash: audioResult.hash,
        coverHash: coverResult?.hash,
        metadataHash,
      })

      console.log("Upload completed successfully!")
    } catch (error) {
      console.error("Upload failed:", error)
      alert("آپلود ناموفق بود. لطفاً دوباره تلاش کنید.")
    } finally {
      setIsUploading(false)
    }
  }

  if (uploadResult) {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-center">✅ آپلود موفقیت‌آمیز!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-white/80">
            <p className="mb-2">
              <strong>هش فایل صوتی:</strong>
            </p>
            <code className="block p-2 bg-black/20 rounded text-sm break-all">{uploadResult.audioHash}</code>
          </div>

          {uploadResult.coverHash && (
            <div className="text-white/80">
              <p className="mb-2">
                <strong>هش تصویر کاور:</strong>
              </p>
              <code className="block p-2 bg-black/20 rounded text-sm break-all">{uploadResult.coverHash}</code>
            </div>
          )}

          <div className="text-white/80">
            <p className="mb-2">
              <strong>هش متادیتا:</strong>
            </p>
            <code className="block p-2 bg-black/20 rounded text-sm break-all">{uploadResult.metadataHash}</code>
          </div>

          <Button
            onClick={() => {
              setUploadResult(null)
              setAudioFile(null)
              setCoverFile(null)
              setFormData({ title: "", artist: "", description: "", genre: "" })
            }}
            className="w-full bg-gradient-to-r from-[#7B61FF] to-[#00D4FF]"
          >
            آپلود فایل جدید
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white text-center">آپلود موزیک به IPFS</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Audio File Upload */}
          <div>
            <Label htmlFor="audio" className="text-white mb-2 block">
              فایل صوتی *
            </Label>
            <div className="relative">
              <Input id="audio" type="file" accept="audio/*" onChange={handleAudioChange} className="hidden" />
              <Label
                htmlFor="audio"
                className="flex items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-[#7B61FF] transition-colors"
              >
                {audioFile ? (
                  <div className="text-center text-white">
                    <Music className="h-8 w-8 mx-auto mb-2" />
                    <p>{audioFile.name}</p>
                    <p className="text-sm text-white/60">{(audioFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div className="text-center text-white/60">
                    <Upload className="h-8 w-8 mx-auto mb-2" />
                    <p>فایل صوتی را انتخاب کنید</p>
                    <p className="text-sm">MP3, WAV, FLAC</p>
                  </div>
                )}
              </Label>
            </div>
          </div>

          {/* Cover Image Upload */}
          <div>
            <Label htmlFor="cover" className="text-white mb-2 block">
              تصویر کاور (اختیاری)
            </Label>
            <div className="relative">
              <Input id="cover" type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
              <Label
                htmlFor="cover"
                className="flex items-center justify-center w-full h-24 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-[#7B61FF] transition-colors"
              >
                {coverFile ? (
                  <div className="text-center text-white">
                    <ImageIcon className="h-6 w-6 mx-auto mb-1" />
                    <p className="text-sm">{coverFile.name}</p>
                  </div>
                ) : (
                  <div className="text-center text-white/60">
                    <ImageIcon className="h-6 w-6 mx-auto mb-1" />
                    <p className="text-sm">تصویر کاور را انتخاب کنید</p>
                  </div>
                )}
              </Label>
            </div>
          </div>

          {/* Metadata Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title" className="text-white mb-2 block">
                عنوان ترک *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="نام ترک را وارد کنید"
                required
              />
            </div>
            <div>
              <Label htmlFor="artist" className="text-white mb-2 block">
                نام هنرمند *
              </Label>
              <Input
                id="artist"
                value={formData.artist}
                onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="نام هنرمند را وارد کنید"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="genre" className="text-white mb-2 block">
              ژانر
            </Label>
            <Input
              id="genre"
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              className="bg-white/10 border-white/20 text-white"
              placeholder="مثال: پاپ، راک، الکترونیک"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-white mb-2 block">
              توضیحات
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-white/10 border-white/20 text-white min-h-[100px]"
              placeholder="توضیحاتی درباره ترک خود بنویسید..."
            />
          </div>

          <Button
            type="submit"
            disabled={!audioFile || !formData.title || !formData.artist || isUploading}
            className="w-full bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] hover:opacity-90 disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                در حال آپلود...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                آپلود به IPFS
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
