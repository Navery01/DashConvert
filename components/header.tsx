import { FileSpreadsheet } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="border-b">
      <div className="container max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <FileSpreadsheet className="h-6 w-6" />
          <span className="font-bold text-xl">DashConvert</span>
        </Link>
        <nav>
          <ul className="flex items-center gap-6">
            <li>
              <Link href="/" className="text-sm font-medium hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="#about" className="text-sm font-medium hover:underline">
                About
              </Link>
            </li>
            <li>
              <Link href="#faq" className="text-sm font-medium hover:underline">
                FAQ
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
