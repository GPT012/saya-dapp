import { UploadForm } from "../components/upload-form"

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">آپلود موزیک</h1>
          <p className="text-white/60 text-lg">موزیک خود را به شبکه غیرمتمرکز IPFS آپلود کنید</p>
        </div>

        <UploadForm />

        <div className="mt-12 text-center text-white/60">
          <h3 className="text-lg font-semibold mb-4">چرا IPFS؟</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-4">
              <h4 className="font-medium mb-2">غیرمتمرکز</h4>
              <p className="text-sm">فایل‌های شما در شبکه‌ای از گره‌ها ذخیره می‌شوند</p>
            </div>
            <div className="p-4">
              <h4 className="font-medium mb-2">مقاوم</h4>
              <p className="text-sm">حتی اگر برخی گره‌ها آفلاین شوند، فایل‌ها در دسترس هستند</p>
            </div>
            <div className="p-4">
              <h4 className="font-medium mb-2">تغییرناپذیر</h4>
              <p className="text-sm">هر فایل هش منحصربه‌فردی دارد که تضمین اصالت می‌کند</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
