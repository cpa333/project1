import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { logout } from '@/app/login/actions'
import { BookOpen, LogOut, BookMarked } from 'lucide-react'

export default async function Navbar() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <nav className="w-full flex justify-center border-b border-gray-200 h-16 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600 hover:text-blue-700 transition">
          <BookOpen strokeWidth={2.5} size={24} />
          <span>DailyEng</span>
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-medium hidden sm:inline-block">
                Hey, {user.email?.split('@')[0]}!
              </span>
              <Link
                href="/vocabulary"
                className="flex items-center gap-2 py-2 px-3.5 rounded-xl font-bold text-blue-700 bg-blue-100/80 hover:bg-blue-200 transition-colors"
                title="내 단어장"
              >
                <BookMarked size={18} className="sm:inline-block" />
                <span className="hidden sm:inline-block">내 단어장</span>
              </Link>
              <form action={logout}>
                <button title="Logout" className="flex items-center gap-2 py-2.5 px-3 rounded-xl no-underline bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors">
                  <LogOut size={18} />
                  <span className="hidden sm:inline-block">Logout</span>
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="py-2 px-4 rounded-md no-underline font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
