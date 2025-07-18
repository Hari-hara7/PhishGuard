import './globals.css'
import { ReactNode } from 'react'
import Navbar from '../components/Navbar'
import { Toaster } from 'sonner'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-gradient-to-b from-black via-zinc-950 to-zinc-900 text-zinc-100 antialiased font-sans">
        {/* Global Navbar */}
        <Navbar />

        {/* Toast Notifications */}
        <Toaster 
          position="top-center"
          richColors
          expand={true}
          duration={4000}
        />

        {/* Page Content */}
        <main className="min-h-screen px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
