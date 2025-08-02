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
  Link2,
  FileText,
  Mail,
  Download,
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

  const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => {
    const linkClass = (path: string) => `
      relative flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm
      transition-all duration-300 ease-in-out group
      ${isMobile ? 'w-full justify-start' : ''}
      ${isActiveLink(path) 
        ? 'text-white bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 shadow-lg shadow-cyan-500/20' 
        : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent hover:border-slate-600/50'
      }
    `

    return (
      <div className={`${isMobile ? 'flex flex-col space-y-2' : 'flex items-center space-x-2'}`}>
        <Link href="/" className={linkClass('/')}>
          <Home className={`w-4 h-4 transition-transform duration-300 ${isActiveLink('/') ? 'text-cyan-400' : 'group-hover:scale-110'}`} />
          <span>Home</span>
          {isActiveLink('/') && <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-xl animate-pulse" />}
        </Link>

        {user && (
          <>
            <Link href="/link" className={linkClass('/link')}>
              <Link2 className={`w-4 h-4 transition-transform duration-300 ${isActiveLink('/link') ? 'text-cyan-400' : 'group-hover:scale-110'}`} />
              <span>Link Scanner</span>
              {isActiveLink('/link') && <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-xl animate-pulse" />}
            </Link>
            <Link href="/doc" className={linkClass('/doc')}>
              <FileText className={`w-4 h-4 transition-transform duration-300 ${isActiveLink('/doc') ? 'text-cyan-400' : 'group-hover:scale-110'}`} />
              <span>Doc Scanner</span>
              {isActiveLink('/doc') && <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-xl animate-pulse" />}
            </Link>
            <Link href="/email" className={linkClass('/email')}>
              <Mail className={`w-4 h-4 transition-transform duration-300 ${isActiveLink('/email') ? 'text-cyan-400' : 'group-hover:scale-110'}`} />
              <span>Email Scanner</span>
              {isActiveLink('/email') && <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-xl animate-pulse" />}
            </Link>
            <Link href="/install" className={linkClass('/install')}>
              <Download className={`w-4 h-4 transition-transform duration-300 ${isActiveLink('/install') ? 'text-cyan-400' : 'group-hover:scale-110'}`} />
              <span>Install</span>
              {isActiveLink('/install') && <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-xl animate-pulse" />}
            </Link>
           
            <Link href="/report" className={linkClass('/report')}>
              <ShieldCheck className={`w-4 h-4 transition-transform duration-300 ${isActiveLink('/report') ? 'text-cyan-400' : 'group-hover:scale-110'}`} />
              <span>Report</span>
              {isActiveLink('/report') && <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-xl animate-pulse" />}
            </Link>
            <Link href="/dashboard" className={linkClass('/dashboard')}>
              <LayoutDashboard className={`w-4 h-4 transition-transform duration-300 ${isActiveLink('/dashboard') ? 'text-cyan-400' : 'group-hover:scale-110'}`} />
              <span>Dashboard</span>
              {isActiveLink('/dashboard') && <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-xl animate-pulse" />}
            </Link>
         
          </>
        )}
      </div>
    )
  }

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-18">

<div className="flex-1 flex justify-end md:justify-end lg:justify-end xl:justify-end">
  <Link
    href="/"
    className="flex items-center gap-3 text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent hover:from-cyan-300 hover:via-blue-300 hover:to-purple-300 transition-all duration-500 group mr-4"
  >
    <div className="relative p-1">
      <ShieldCheck className="w-7 h-7 md:w-8 md:h-8 text-cyan-400 group-hover:text-cyan-300 transition-all duration-300 group-hover:rotate-12" />
      <Sparkles className="w-3 h-3 text-cyan-300 absolute -top-0.5 -right-0.5 animate-pulse group-hover:animate-bounce" />
      <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
    <span className="hidden sm:inline">PhishGuard</span>
    <span className="sm:hidden">PhishGuard</span>
  </Link>
</div>


          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
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
                    className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-800/60 transition-all duration-300 group border border-transparent hover:border-slate-600/50"
                  >
                    <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-cyan-400/50 group-hover:border-cyan-400 transition-all duration-300 relative group-hover:scale-105">
                      <Image
                        src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'User')}&background=0891b2&color=fff`}
                        alt={user.displayName || 'Profile'}
                        width={36}
                        height={36}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-medium text-white truncate max-w-32">{user.displayName || 'User'}</p>
                      <p className="text-xs text-slate-400 truncate max-w-32">{user.email}</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-all duration-300 group-hover:text-cyan-400 ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-3 w-72 bg-slate-800/95 backdrop-blur-xl border border-slate-600/50 rounded-2xl shadow-2xl py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-4 border-b border-slate-600/50">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-400/50">
                            <Image
                              src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'User')}&background=0891b2&color=fff`}
                              alt={user.displayName || 'Profile'}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{user.displayName}</p>
                            <p className="text-xs text-slate-400 truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="py-2">
                        <button
                          onClick={() => {
                            setShowUserMenu(false)
                            window.location.href = '/settings'
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 group"
                        >
                          <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                          <span>Settings</span>
                        </button>
                        <button
                          onClick={() => {
                            setShowUserMenu(false)
                            logout()
                          }}
                          disabled={isLoading}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 disabled:opacity-50 group"
                        >
                          <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                          <span>{isLoading ? 'Signing out...' : 'Sign out'}</span>
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
                className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 text-white border-0 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 px-6 py-2.5 rounded-xl font-medium disabled:opacity-50 group"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                ) : (
                  <LogIn className="w-4 h-4 mr-2 group-hover:translate-x-0.5 transition-transform duration-300" />
                )}
                <span>{isLoading ? 'Signing in...' : 'Sign in with Google'}</span>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-slate-800/60 hover:text-cyan-400 transition-all duration-300 rounded-xl border border-transparent hover:border-slate-600/50"
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white border-slate-600/50 w-80 md:w-96">
                <SheetHeader className="border-b border-slate-600/50 pb-6">
                  <SheetTitle className="flex items-center gap-3 text-xl">
                    <div className="relative">
                      <ShieldCheck className="w-7 h-7 text-cyan-400" />
                      <Sparkles className="w-3 h-3 text-cyan-300 absolute -top-0.5 -right-0.5 animate-pulse" />
                    </div>
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent font-bold">
                      PhishGuard
                    </span>
                  </SheetTitle>
                </SheetHeader>
                
                <div className="mt-8 space-y-8">
                  {/* User Info - Mobile */}
                  {user && (
                    <div className="flex items-center space-x-4 p-4 bg-slate-800/60 rounded-2xl border border-slate-600/30">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-400/50 relative">
                        <Image
                          src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'User')}&background=0891b2&color=fff`}
                          alt={user.displayName || 'Profile'}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{user.displayName}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      </div>
                    </div>
                  )}

                  {/* Navigation Links - Mobile */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-2">Navigation</h3>
                    <NavLinks isMobile={true} />
                  </div>

                  {/* Auth Button - Mobile */}
                  <div className="pt-6 border-t border-slate-600/50">
                    {!user ? (
                      <Button 
                        onClick={login}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 text-white py-3 rounded-xl font-medium shadow-lg"
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                        ) : (
                          <LogIn className="w-5 h-5 mr-3" />
                        )}
                        <span>{isLoading ? 'Signing in...' : 'Sign in with Google'}</span>
                      </Button>
                    ) : (
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider px-2">Account</h3>
                        <Button
                          onClick={() => {
                            window.location.href = '/settings'
                          }}
                          variant="ghost"
                          className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800/60 py-4 rounded-xl border border-transparent hover:border-slate-600/50 text-base"
                        >
                          <Settings className="w-5 h-5 mr-3" />
                          <span>Settings</span>
                        </Button>
                        <Button 
                          onClick={() => {
                            logout()
                          }}
                          disabled={isLoading}
                          className="w-full justify-start bg-red-600/20 hover:bg-red-600/30 text-red-300 hover:text-red-200 border border-red-500/30 hover:border-red-400/50 py-4 rounded-xl font-medium text-base transition-all duration-300 disabled:opacity-50 shadow-lg"
                        >
                          <LogOut className="w-5 h-5 mr-3" />
                          <span className="font-semibold">{isLoading ? 'Signing out...' : 'Sign Out'}</span>
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
