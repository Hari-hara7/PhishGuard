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
  Menu,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

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

  const NavLinks = () => (
    <>
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
        </>
      )}
    </>
  )

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-black text-white border-b border-zinc-800 shadow-sm">
      <Link
        href="/"
        className="text-2xl font-semibold text-cyan-400 flex items-center gap-2 hover:text-cyan-300 transition"
      >
        <ShieldCheck className="w-6 h-6" />
        PhishGuard
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-6 text-sm font-medium">
        <NavLinks />

        {user && (
          <div className="w-9 h-9 rounded-full overflow-hidden border border-cyan-400">
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {!user ? (
          <Button onClick={login} className="bg-cyan-600 hover:bg-cyan-500 text-white">
            <LogIn className="w-4 h-4 mr-1" />
            Login
          </Button>
        ) : (
          <Button onClick={logout} className="bg-red-600 hover:bg-red-500 text-white">
            <LogOut className="w-4 h-4 mr-1" />
            Logout
          </Button>
        )}
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6 text-white" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-black text-white w-64">
            <SheetHeader>
              <SheetTitle className="text-cyan-400 text-xl">PhishGuard</SheetTitle>
            </SheetHeader>
            <div className="mt-4 flex flex-col gap-4 text-sm font-medium">
              <NavLinks />

              {user && (
                <div className="w-9 h-9 rounded-full overflow-hidden border border-cyan-400">
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {!user ? (
                <Button onClick={login} className="bg-cyan-600 hover:bg-cyan-500 text-white">
                  <LogIn className="w-4 h-4 mr-1" />
                  Login
                </Button>
              ) : (
                <Button onClick={logout} className="bg-red-600 hover:bg-red-500 text-white">
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
