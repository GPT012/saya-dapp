import { SampleAudioPlayer } from "../components/sample-audio-player"

export default function TestPlayerPage() {
  const sampleTracks = [
    { title: "Midnight Pulse", artist: "علی محمدی", duration: 195 },
    { title: "Summer Vibes", artist: "سارا احمدی", duration: 178 },
    { title: "Ocean Waves", artist: "رضا کریمی", duration: 312 },
    { title: "Electric Storm", artist: "مینا رضایی", duration: 234 },
    { title: "City Lights", artist: "احمد حسینی", duration: 189 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">تست موزیک پلیر</h1>
          <p className="text-white/60">نمونه‌های موزیک برای تست عملکرد پلیر</p>
        </div>

        <div className="space-y-4">
          {sampleTracks.map((track, index) => (
            <SampleAudioPlayer key={index} {...track} />
          ))}
        </div>

        <div className="mt-12 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
          <h3 className="text-white font-semibold mb-4">📝 نکات تست:</h3>
          <ul className="text-white/80 space-y-2 text-sm">
            <li>• این پلیرهای نمونه شبیه‌سازی شده هستند (بدون فایل صوتی واقعی)</li>
            <li>• برای تست پلیر اصلی، ابتدا باید ترک‌ها را از دیتابیس لود کنید</li>
            <li>• فایل‌های IPFS واقعی نیاز به آپلود فایل‌های صوتی دارند</li>
            <li>• می‌توانید از صفحه اصلی ترک‌های موجود را تست کنید</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
