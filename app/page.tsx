import { FileUploader } from "@/components/file-uploader"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Tableau to Power BI Converter</h1>
          <p className="text-xl text-muted-foreground">
            Drag and drop your Tableau TWBX files and get Power BI PBIT files in seconds
          </p>
        </div>
        <FileUploader />
      </main>
      <Footer />
    </div>
  )
}
