'use client'

import { ShieldCheck, Bug, UploadCloud, Globe2, Download } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-black to-zinc-900 text-zinc-100 px-6 py-16 overflow-hidden">
      {/* Decorative Globe Animation */}
   

      {/* Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto space-y-8 mb-24 z-10">
        {/* Animated Globe in Background */}
      

        {/* Badge */}
        <div className="flex justify-center">
          <Badge variant="outline" className="text-cyan-400 px-4 py-2 border-cyan-400 bg-zinc-800/50 backdrop-blur-sm">
            🚀 AI Powered Security
          </Badge>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300 drop-shadow-lg">
          Real-Time Scam Link Detection
        </h1>

        {/* Subtext */}
        <p className="text-lg md:text-xl text-zinc-300 leading-relaxed px-2 md:px-10">
          PhishGuard uses intelligent scanning and real-time AI analysis to detect phishing, malware, and scam threats — before you click.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <Link
            href="/extension"
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 text-black font-semibold rounded-lg hover:bg-cyan-400 transition shadow-lg"
          >
            <Download className="w-4 h-4" />
            Install Extension
          </Link>
          <Link
            href="/report"
            className="inline-flex items-center gap-2 px-6 py-3 border border-cyan-500 text-cyan-400 rounded-lg hover:bg-cyan-500 hover:text-black transition shadow-lg"
          >
            <UploadCloud className="w-4 h-4" />
            Report Scam
          </Link>
        </div>

        {/* Tagline / Stat */}
        <p className="text-sm md:text-base text-zinc-400 mt-4 italic">
          Join <span className="text-cyan-400 font-semibold">detect</span>  detecting scam links across the web.
        </p>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center py-10">
        <div className="bg-zinc-800 p-6 rounded-xl shadow-lg hover:shadow-cyan-500/30 transition">
          <ShieldCheck className="mx-auto w-10 h-10 text-cyan-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">Real-Time Detection</h3>
          <p className="text-zinc-400">Instantly detect phishing URLs using AI-powered scanning and URL intelligence.</p>
        </div>

        <div className="bg-zinc-800 p-6 rounded-xl shadow-lg hover:shadow-cyan-500/30 transition">
          <Bug className="mx-auto w-10 h-10 text-cyan-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">Malware Alerts</h3>
          <p className="text-zinc-400">Receive instant alerts for links hosting malware, spyware, or harmful scripts.</p>
        </div>

        <div className="bg-zinc-800 p-6 rounded-xl shadow-lg hover:shadow-cyan-500/30 transition">
          <Globe2 className="mx-auto w-10 h-10 text-cyan-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">Global Coverage</h3>
          <p className="text-zinc-400">Scan URLs across all regions and languages — stay protected worldwide.</p>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="text-center mt-20 border-t border-zinc-800 pt-10">
        <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
          Stay Safe. Stay Ahead.
        </h2>
        <p className="text-zinc-400 mb-6">
          Join thousands of users protecting themselves from scams every day.
        </p>
        <Link
          href="/scanner"
          className="inline-block px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-semibold rounded-md transition shadow-lg"
        >
          Launch Scanner
        </Link>

         
      </section>
    </main>
  )
}
