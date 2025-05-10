import { Leaf, Mountain } from "lucide-react"

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mountain className="h-6 w-6 text-emerald-600" />
          <h1 className="text-2xl font-bold text-gray-800">Sassowitz Family Adventures</h1>
          <Leaf className="h-5 w-5 text-emerald-500" />
        </div>
        <p className="text-sm text-gray-600 italic">Made with love for Mother's Day 2025</p>
      </div>
    </header>
  )
}
