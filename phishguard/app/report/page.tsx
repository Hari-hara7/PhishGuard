'use client'

import { useState } from 'react'
import { db, auth } from '../../lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import {
  Globe2,
  Mail,
  AlertTriangle,
  FileText,
  ImageIcon,
  SendHorizonal,
  Shield,
  CheckCircle,
  Loader2,
  Info,
} from 'lucide-react'
import { toast } from 'sonner'

export default function ReportPage() {
  const [url, setUrl] = useState('')
  const [email, setEmail] = useState('')
  const [scamType, setScamType] = useState('')
  const [description, setDescription] = useState('')
  const [proofUrl, setProofUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!url.trim()) {
      newErrors.url = 'URL is required'
    } else if (!isValidUrl(url)) {
      newErrors.url = 'Please enter a valid URL'
    }
    
    if (!scamType) {
      newErrors.scamType = 'Please select a scam type'
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required'
    } else if (description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    }
    
    if (email && !isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (proofUrl && !isValidUrl(proofUrl)) {
      newErrors.proofUrl = 'Please enter a valid URL'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch {
      return false
    }
  }

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async () => {
    const user = auth.currentUser
    if (!user) {
      toast.error('Please sign in to submit a report.')
      return
    }

    if (!validateForm()) {
      toast.error('Please fix the errors below.')
      return
    }

    setIsSubmitting(true)

    try {
      await addDoc(collection(db, 'reports'), {
        url: url.trim(),
        scamType,
        description: description.trim(),
        reporterEmail: email || user.email,
        proofUrl: proofUrl.trim() || null,
        uid: user.uid,
        createdAt: serverTimestamp(),
        status: 'pending',
      })

      setUrl('')
      setEmail('')
      setScamType('')
      setDescription('')
      setProofUrl('')
      setErrors({})

      toast.success('✅ Scam report submitted successfully! We\'ll review it shortly.')
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-5xl mx-auto py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-4 sm:mb-6">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Report a Scam
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-zinc-400 max-w-3xl mx-auto px-2">
            Help protect others by reporting suspicious websites and scams. Your report will be reviewed by our security team.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8">
          <div className="grid gap-6 sm:gap-8">
            
            {/* URL Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-zinc-200">
                <Globe2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Scam URL</span>
                <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://suspicious-website.com"
                className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg bg-zinc-900/80 border transition-all duration-200 text-sm sm:text-base placeholder:text-zinc-500 focus:outline-none focus:ring-2 ${
                  errors.url 
                    ? 'border-red-500 focus:ring-red-500/50' 
                    : 'border-zinc-600 focus:border-cyan-400 focus:ring-cyan-500/50'
                }`}
              />
              {errors.url && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                  <span>{errors.url}</span>
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-zinc-200">
                <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Your Email (optional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg bg-zinc-900/80 border transition-all duration-200 text-sm sm:text-base placeholder:text-zinc-500 focus:outline-none focus:ring-2 ${
                  errors.email 
                    ? 'border-red-500 focus:ring-red-500/50' 
                    : 'border-zinc-600 focus:border-cyan-400 focus:ring-cyan-500/50'
                }`}
              />
              {errors.email && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                  <span>{errors.email}</span>
                </p>
              )}
              <p className="text-zinc-500 text-xs sm:text-sm flex items-start gap-1">
                <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
                <span>We&apos;ll use this to contact you for follow-up questions</span>
              </p>
            </div>

            {/* Scam Type Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-zinc-200">
                <AlertTriangle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Scam Type</span>
                <span className="text-red-400">*</span>
              </label>
              <select
                value={scamType}
                onChange={(e) => setScamType(e.target.value)}
                className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg bg-zinc-900/80 border transition-all duration-200 text-sm sm:text-base focus:outline-none focus:ring-2 ${
                  errors.scamType 
                    ? 'border-red-500 focus:ring-red-500/50' 
                    : 'border-zinc-600 focus:border-cyan-400 focus:ring-cyan-500/50'
                }`}
              >
                <option value="">Select scam type...</option>
                <option value="Phishing">🎣 Phishing (Fake login pages)</option>
                <option value="Fake Tech Support">💻 Fake Tech Support</option>
                <option value="Financial Scam">💰 Financial Scam</option>
                <option value="Crypto Scam">₿ Crypto Scam</option>
                <option value="Romance Scam">💕 Romance Scam</option>
                <option value="Shopping Scam">🛒 Shopping Scam</option>
                <option value="Impersonation">👤 Impersonation</option>
                <option value="Malware">🦠 Malware/Virus</option>
                <option value="Other">🔍 Other</option>
              </select>
              {errors.scamType && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                  <span>{errors.scamType}</span>
                </p>
              )}
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-zinc-200">
                <FileText className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Detailed Description</span>
                <span className="text-red-400">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Please provide details about the scam:
• How did you encounter it?
• What happened?
• What information did they ask for?
• Any other relevant details..."
                className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg bg-zinc-900/80 border transition-all duration-200 text-sm sm:text-base placeholder:text-zinc-500 focus:outline-none focus:ring-2 resize-none ${
                  errors.description 
                    ? 'border-red-500 focus:ring-red-500/50' 
                    : 'border-zinc-600 focus:border-cyan-400 focus:ring-cyan-500/50'
                }`}
              />
              <div className="flex justify-between items-center">
                {errors.description ? (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                    <span>{errors.description}</span>
                  </p>
                ) : (
                  <p className="text-zinc-500 text-xs sm:text-sm">
                    {description.length}/500 characters
                  </p>
                )}
              </div>
            </div>

            {/* Proof URL Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm sm:text-base font-semibold text-zinc-200">
                <ImageIcon className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Evidence/Screenshot Link (optional)</span>
              </label>
              <input
                type="url"
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
                placeholder="https://imgur.com/your-screenshot or https://example.com/evidence"
                className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg bg-zinc-900/80 border transition-all duration-200 text-sm sm:text-base placeholder:text-zinc-500 focus:outline-none focus:ring-2 ${
                  errors.proofUrl 
                    ? 'border-red-500 focus:ring-red-500/50' 
                    : 'border-zinc-600 focus:border-cyan-400 focus:ring-cyan-500/50'
                }`}
              />
              {errors.proofUrl && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                  <span>{errors.proofUrl}</span>
                </p>
              )}
              <p className="text-zinc-500 text-xs sm:text-sm flex items-start gap-1">
                <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
                <span>Upload screenshots to services like Imgur, then paste the link here</span>
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-2 sm:pt-4">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-zinc-600 disabled:to-zinc-600 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 text-sm sm:text-base transform hover:scale-[1.02] disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    <span className="hidden sm:inline">Submitting Report...</span>
                    <span className="sm:hidden">Submitting...</span>
                  </>
                ) : (
                  <>
                    <SendHorizonal className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Submit Report</span>
                  </>
                )}
              </button>
            </div>

            {/* Info Box */}
            <div className="bg-cyan-900/20 border border-cyan-700/50 rounded-lg p-4 sm:p-6 mt-4 sm:mt-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm sm:text-base text-cyan-200">
                  <p className="font-semibold mb-2">What happens after you submit?</p>
                  <ul className="space-y-1.5 text-cyan-300 text-sm sm:text-base">
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0">•</span>
                      <span>Our security team will review your report within 24 hours</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0">•</span>
                      <span>We&apos;ll investigate the reported URL and add it to our database if confirmed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0">•</span>
                      <span>Your report helps protect other users from falling victim to scams</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0">•</span>
                      <span>We may contact you for additional information if needed</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}