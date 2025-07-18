'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Mail, Globe } from 'lucide-react'

export default function ScannerPage() {
  const [url, setUrl] = useState('')
  const [email, setEmail] = useState('')

  const handleScan = () => {
    if (!url || !email) {
      toast.warning('⚠️ Please enter both Email and URL.')
      return
    }

    const suspiciousUrlKeywords = ['free', 'win', 'offer', 'login', 'click', 'verify', 'gift', 'bank', 'account', 'security', 'update']
    const suspiciousEmailPatterns = ['gmail.com', 'outlook.com', 'yahoo.com', 'mail.com']

    const lowerUrl = url.toLowerCase()
    const lowerEmail = email.toLowerCase()

    const urlIsSuspicious = suspiciousUrlKeywords.some(keyword => lowerUrl.includes(keyword))
    const isFakeCompanyEmail =
      suspiciousEmailPatterns.some(domain => lowerEmail.endsWith(`@${domain}`)) &&
      /support|help|admin|secure|info/.test(lowerEmail.split('@')[0])

    if (urlIsSuspicious && isFakeCompanyEmail) {
      toast.error('❌ FAKE: Suspicious Link & Fake Company Email')
    } else if (urlIsSuspicious) {
      toast.error('❌ FAKE: Suspicious Link')
    } else if (isFakeCompanyEmail) {
      toast.error('❌ FAKE: Suspicious Email Format')
    } else {
      toast.success('✅ REAL: No suspicious signs found')
    }
  }

  return (
    <div className="max-w-xl mx-auto text-center py-20 px-4 animate-fadeIn">
      <h1 className="text-4xl font-extrabold text-cyan-400 mb-8 tracking-tight">
        🛡️ Scam Link & Email Scanner
      </h1>

      <div className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-3 top-3 text-cyan-400 w-5 h-5" />
          <input
            type="email"
            placeholder="Your Email (e.g. support@bank.com)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded bg-gray-900 text-white border border-gray-700 focus:ring-2 focus:ring-cyan-500 transition"
          />
        </div>

        <div className="relative">
          <Globe className="absolute left-3 top-3 text-cyan-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Paste URL to Scan (e.g. https://secure-update.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded bg-gray-900 text-white border border-gray-700 focus:ring-2 focus:ring-cyan-500 transition"
          />
        </div>

        <button
          onClick={handleScan}
          className="mt-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded shadow transition-all duration-200"
        >
          🔍 Scan Now
        </button>
      </div>
    </div>
  )
}
