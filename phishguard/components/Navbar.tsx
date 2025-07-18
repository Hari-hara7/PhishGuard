'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { auth, googleProvider } from '../lib/firebase'
import { signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth'
import { useEffect, useState } from 'react'
import {
  Home,
  ShieldCheck,
  Bug,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Settings,
  ChevronDown,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { toast } from 'sonner'

export default function Navbar() {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u)
    })
    return () => unsubscribe()
  }, [])

  const login = async () => {
    setIsLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
      toast.success('Successfully signed in!')
    } catch (error) {
      console.error('Login failed:', error)
      toast.error('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await signOut(auth)
      toast.success('Successfully signed out!')
    } catch (error) {
      console.error('Logout failed:', error)
      toast.error('Logout failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const isActiveLink = (path: string) => {
    return pathname === path
  }

  const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={`${isMobile ? 'flex flex-col space-y-3' : 'flex items-center space-x-6'}`}>
      <Link 
        href="/" 
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-cyan-500/10 ${
          isActiveLink('/') 
            ? 'text-cyan-400 bg-cyan-500/20 shadow-lg shadow-cyan-500/25' 
            : 'text-zinc-300 hover:text-cyan-400'
        }`}
      >
        <Home className="w-4 h-4" />
        <span className="font-medium">Home</span>
      </Link>

      {user && (
        <>
          <Link 
            href="/scanner" 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-cyan-500/10 ${
              isActiveLink('/scanner') 
                ? 'text-cyan-400 bg-cyan-500/20 shadow-lg shadow-cyan-500/25' 
                : 'text-zinc-300 hover:text-cyan-400'
            }`}
          >
            <Bug className="w-4 h-4" />
            <span className="font-medium">Scanner</span>
          </Link>
          <Link 
            href="/report" 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-cyan-500/10 ${
              isActiveLink('/report') 
                ? 'text-cyan-400 bg-cyan-500/20 shadow-lg shadow-cyan-500/25' 
                : 'text-zinc-300 hover:text-cyan-400'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="font-medium">Report</span>
          </Link>
          <Link 
            href="/dashboard" 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-cyan-500/10 ${
              isActiveLink('/dashboard') 
                ? 'text-cyan-400 bg-cyan-500/20 shadow-lg shadow-cyan-500/25' 
                : 'text-zinc-300 hover:text-cyan-400'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="font-medium">Dashboard</span>
          </Link>
        </>
      )}
    </div>
  )

  return (
    <nav className="sticky top-0 z-50 bg-black backdrop-blur-md border-b border-zinc-700/50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent hover:from-cyan-300 hover:to-blue-300 transition-all duration-300 group"
          >
            <div className="relative">
              <ShieldCheck className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" />
              <Sparkles className="w-3 h-3 text-cyan-300 absolute -top-1 -right-1 animate-pulse" />
            </div>
            PhishGuard
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLinks />
          </div>

          {/* User Section - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* User Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-zinc-800/50 transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-cyan-400/50 group-hover:border-cyan-400 transition-colors relative">
                      <Image
                        src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'User')}&background=0891b2&color=fff`}
                        alt={user.displayName || 'Profile'}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                    <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-zinc-800/95 backdrop-blur-sm border border-zinc-700/50 rounded-xl shadow-2xl py-2 z-50">
                      <div className="px-4 py-3 border-b border-zinc-700/50">
                        <p className="text-sm font-medium text-white">{user.displayName}</p>
                        <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setShowUserMenu(false)
                            // Add settings navigation here
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-700/50 transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </button>
                        <button
                          onClick={() => {
                            setShowUserMenu(false)
                            logout()
                          }}
                          disabled={isLoading}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                        >
                          <LogOut className="w-4 h-4" />
                          {isLoading ? 'Signing out...' : 'Sign out'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Button 
                onClick={login}
                disabled={isLoading}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                ) : (
                  <LogIn className="w-4 h-4 mr-2" />
                )}
                {isLoading ? 'Signing in...' : 'Sign in with Google'}
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-zinc-800/50">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-gradient-to-b from-slate-900 to-zinc-900 text-white border-zinc-700/50 w-80">
                <SheetHeader className="border-b border-zinc-700/50 pb-4">
                  <SheetTitle className="flex items-center gap-2 text-xl">
                    <ShieldCheck className="w-6 h-6 text-cyan-400" />
                    <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-bold">
                      PhishGuard
                    </span>
                  </SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-6">
                  {/* User Info - Mobile */}
                  {user && (
                    <div className="flex items-center space-x-3 p-3 bg-zinc-800/50 rounded-lg">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-cyan-400/50 relative">
                        <Image
                          src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'User')}&background=0891b2&color=fff`}
                          alt={user.displayName || 'Profile'}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{user.displayName}</p>
                        <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                      </div>
                    </div>
                  )}

                  {/* Navigation Links - Mobile */}
                  <div className="space-y-2">
                    <NavLinks isMobile={true} />
                  </div>

                  {/* Auth Button - Mobile */}
                  <div className="pt-4 border-t border-zinc-700/50">
                    {!user ? (
                      <Button 
                        onClick={login}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white"
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        ) : (
                          <LogIn className="w-4 h-4 mr-2" />
                        )}
                        {isLoading ? 'Signing in...' : 'Sign in with Google'}
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <Button
                          onClick={() => {
                            // Add settings navigation here
                          }}
                          variant="ghost"
                          className="w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-800/50"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </Button>
                        <Button 
                          onClick={logout}
                          disabled={isLoading}
                          variant="ghost"
                          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          {isLoading ? 'Signing out...' : 'Sign out'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </nav>
  )
}
