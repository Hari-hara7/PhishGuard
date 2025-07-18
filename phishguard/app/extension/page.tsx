'use client'

import { DownloadCloud } from 'lucide-react'

export default function ExtensionPage() {
  return (
    <div className="max-w-3xl mx-auto text-center py-20 px-4 text-zinc-100">
      <h2 className="text-4xl font-extrabold text-cyan-400 mb-4 tracking-tight">
        PhishGuard Chrome Extension
      </h2>
      <p className="text-lg text-zinc-400 mb-8">
        Install our browser extension to detect phishing and scam links in real-time — right inside Chrome.
      </p>

      <img
        src="/images/extension-preview.png"
        alt="Chrome Extension Preview"
        className="w-full max-w-md mx-auto mb-8 rounded-xl shadow-lg ring-1 ring-zinc-800 hover:ring-cyan-500 transition"
      />

      <a
        href="/downloads/phishguard-extension.zip"
        className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-semibold rounded-lg shadow-md transition"
        download
      >
        <DownloadCloud className="w-5 h-5" />
        Download Extension
      </a>

      <p className="text-sm text-zinc-500 mt-6">
        Available for Chrome-based browsers. Manual install instructions included.
      </p>
    </div>
  )
}
