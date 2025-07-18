'use client'

import { useState } from 'react'
import { db, auth } from '../../lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import {
  Globe2,
  Mail,
  AlertTriangle,
  FileText,
  Image,
  SendHorizonal,
} from 'lucide-react'
import { toast } from 'sonner'

export default function ReportPage() {
  const [url, setUrl] = useState('')
  const [email, setEmail] = useState('')
  const [scamType, setScamType] = useState('')
  const [description, setDescription] = useState('')
  const [proofUrl, setProofUrl] = useState('')

  const handleSubmit = async () => {
    const user = auth.currentUser
    if (!user || !url || !scamType || !description) {
      toast.error('Please fill in all required fields.')
      return
    }

    try {
      await addDoc(collection(db, 'reports'), {
        url,
        scamType,
        description,
        reporterEmail: email || user.email,
        proofUrl,
        uid: user.uid,
        createdAt: serverTimestamp(),
      })

      setUrl('')
      setEmail('')
      setScamType('')
      setDescription('')
      setProofUrl('')

      toast.success('✅ Scam report submitted successfully!')
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-20 px-4 text-zinc-100">
      <h2 className="text-4xl font-bold text-center text-cyan-400 mb-8">Report a Scam</h2>

      <div className="space-y-6">
        {/* URL */}
        <div>
          <label className="block mb-2 text-sm font-medium">Scam URL</label>
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-cyan-400" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://scam.example.com"
              className="w-full px-4 py-2 rounded bg-zinc-900 border border-zinc-700 focus:ring-2 ring-cyan-500 text-sm"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2 text-sm font-medium">Your Email (optional)</label>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-cyan-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-2 rounded bg-zinc-900 border border-zinc-700 focus:ring-2 ring-cyan-500 text-sm"
            />
          </div>
        </div>

        {/* Scam Type */}
        <div>
          <label className="block mb-2 text-sm font-medium">Scam Type</label>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-cyan-400" />
            <select
              value={scamType}
              onChange={(e) => setScamType(e.target.value)}
              className="w-full px-4 py-2 rounded bg-zinc-900 border border-zinc-700 focus:ring-2 ring-cyan-500 text-sm"
            >
              <option value="">Select scam type...</option>
              <option value="Phishing">Phishing</option>
              <option value="Fake Tech Support">Fake Tech Support</option>
              <option value="Financial Scam">Financial Scam</option>
              <option value="Crypto Scam">Crypto Scam</option>
              <option value="Impersonation">Impersonation</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 text-sm font-medium">Details / Description</label>
          <div className="flex items-start gap-2">
            <FileText className="w-4 h-4 text-cyan-400 mt-2" />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Explain what happened, how they contacted you, etc."
              className="w-full px-4 py-2 rounded bg-zinc-900 border border-zinc-700 focus:ring-2 ring-cyan-500 text-sm"
            />
          </div>
        </div>

        {/* Screenshot Proof */}
        <div>
          <label className="block mb-2 text-sm font-medium">Proof or Screenshot Link (optional)</label>
          <div className="flex items-center gap-2">
            <Image className="w-4 h-4 text-cyan-400" />
            <input
              type="url"
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              placeholder="https://imgur.com/your-screenshot"
              className="w-full px-4 py-2 rounded bg-zinc-900 border border-zinc-700 focus:ring-2 ring-cyan-500 text-sm"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-semibold rounded-md shadow-md transition"
        >
          <SendHorizonal className="w-4 h-4" />
          Submit Report
        </button>
      </div>
    </div>
  )
}
