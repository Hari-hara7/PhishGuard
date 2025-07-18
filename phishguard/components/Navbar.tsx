'use client'

import Link from 'next/link'
import { auth, googleProvider } from '../lib/firebase'
import { signInWithPopup, signOut } from 'firebase/auth'
import { useEffect, useState } from 'react'
import {
  Home,
  ShieldCheck,
  Bug,
  LayoutDashboard,
  LogIn,
  LogOut,
} from 'lucide-react'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u)
    })
    return () => unsubscribe()
  }, [])

  const login = () => signInWithPopup(auth, googleProvider)
  const logout = () => signOut(auth)

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-black text-white border-b border-zinc-800 shadow-sm">
      <Link href="/" className="text-2xl font-semibold text-cyan-400 flex items-center gap-2 hover:text-cyan-300 transition">
        <ShieldCheck className="w-6 h-6" />
        PhishGuard
      </Link>

      <div className="flex items-center gap-6 text-sm font-medium">
        <Link href="/" className="flex items-center gap-1 hover:text-cyan-400 transition">
          <Home className="w-4 h-4" />
          Home
        </Link>

        {user && (
          <>
            <Link href="/scanner" className="flex items-center gap-1 hover:text-cyan-400 transition">
              <Bug className="w-4 h-4" />
              Scanner
            </Link>
            <Link href="/report" className="flex items-center gap-1 hover:text-cyan-400 transition">
              <ShieldCheck className="w-4 h-4" />
              Report
            </Link>
            <Link href="/dashboard" className="flex items-center gap-1 hover:text-cyan-400 transition">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>

            {/* ✅ Profile Picture */}
            <div className="w-9 h-9 rounded-full overflow-hidden border border-cyan-400">
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </>
        )}

        {!user ? (
          <button
            onClick={login}
            className="flex items-center gap-1 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-md transition"
          >
            <LogIn className="w-4 h-4" />
            Login
          </button>
        ) : (
          <button
            onClick={logout}
            className="flex items-center gap-1 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        )}
      </div>
    </nav>
  )
}
