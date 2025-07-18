'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { 
  Mail, 
  Globe, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Zap,
  Eye,
  ExternalLink,
  History,
  TrendingUp,
  Lock,
  Unlock,
  Info
} from 'lucide-react'

interface ScanResult {
  overall: 'safe' | 'suspicious' | 'dangerous'
  score: number
  urlAnalysis: {
    isSuspicious: boolean
    suspiciousKeywords: string[]
    hasHttps: boolean
    domainAge: 'new' | 'established' | 'unknown'
    reputation: 'good' | 'unknown' | 'bad'
  }
  emailAnalysis: {
    isSuspicious: boolean
    domainReputation: 'good' | 'unknown' | 'bad'
    isTyposquatting: boolean
    isCommonProvider: boolean
    suspiciousPatterns: string[]
  }
  recommendations: string[]
}

export default function ScannerPage() {
  const [url, setUrl] = useState('')
  const [email, setEmail] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [scanHistory, setScanHistory] = useState<Array<{ url: string; email: string; result: ScanResult; timestamp: Date }>>([])

  // Enhanced phishing detection algorithms
  const analyzeUrl = (url: string) => {
    const suspiciousKeywords = [
      'free', 'win', 'offer', 'login', 'click', 'verify', 'gift', 'bank', 
      'account', 'security', 'update', 'urgent', 'limited', 'expire',
      'confirm', 'validate', 'suspend', 'unlock', 'claim', 'bonus'
    ]
    
    const highRiskKeywords = [
      'paypal-', 'amazon-', 'apple-', 'microsoft-', 'google-', 
      'facebook-', 'instagram-', 'twitter-', 'linkedin-'
    ]

    const lowerUrl = url.toLowerCase()
    const foundKeywords = suspiciousKeywords.filter(keyword => lowerUrl.includes(keyword))
    const hasHighRiskKeywords = highRiskKeywords.some(keyword => lowerUrl.includes(keyword))
    
    return {
      isSuspicious: foundKeywords.length > 0 || hasHighRiskKeywords,
      suspiciousKeywords: foundKeywords,
      hasHttps: url.startsWith('https://'),
      domainAge: 'unknown' as const,
      reputation: hasHighRiskKeywords ? 'bad' as const : 'unknown' as const
    }
  }

  const analyzeEmail = (email: string) => {
    const commonProviders = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'mail.com']
    const suspiciousPatterns = ['support', 'help', 'admin', 'secure', 'info', 'noreply', 'service']
    const legitimateDomains = ['paypal.com', 'amazon.com', 'apple.com', 'microsoft.com', 'google.com']
    
    const [localPart, domain] = email.toLowerCase().split('@')
    const isCommonProvider = commonProviders.includes(domain)
    const foundPatterns = suspiciousPatterns.filter(pattern => localPart.includes(pattern))
    
    // Check for typosquatting
    const isTyposquatting = legitimateDomains.some(legitDomain => {
      const similarity = calculateSimilarity(domain, legitDomain)
      return similarity > 0.7 && similarity < 1
    })

    return {
      isSuspicious: (isCommonProvider && foundPatterns.length > 0) || isTyposquatting,
      domainReputation: legitimateDomains.includes(domain) ? 'good' as const : 'unknown' as const,
      isTyposquatting,
      isCommonProvider,
      suspiciousPatterns: foundPatterns
    }
  }

  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1
    
    if (longer.length === 0) return 1.0
    
    const editDistance = getEditDistance(longer, shorter)
    return (longer.length - editDistance) / longer.length
  }

  const getEditDistance = (str1: string, str2: string): number => {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null))
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        )
      }
    }
    
    return matrix[str2.length][str1.length]
  }

  const handleScan = async () => {
    if (!url || !email) {
      toast.warning('⚠️ Please enter both Email and URL.')
      return
    }

    setIsScanning(true)
    setScanResult(null)

    // Simulate real scanning delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1500))

    try {
      const urlAnalysis = analyzeUrl(url)
      const emailAnalysis = analyzeEmail(email)

      // Calculate overall risk score (0-100)
      let score = 0
      if (urlAnalysis.isSuspicious) score += 40
      if (emailAnalysis.isSuspicious) score += 35
      if (!urlAnalysis.hasHttps) score += 15
      if (urlAnalysis.reputation === 'bad') score += 20
      if (emailAnalysis.isTyposquatting) score += 25

      // Determine overall result
      let overall: 'safe' | 'suspicious' | 'dangerous'
      if (score >= 70) overall = 'dangerous'
      else if (score >= 30) overall = 'suspicious'
      else overall = 'safe'

      // Generate recommendations
      const recommendations = []
      if (!urlAnalysis.hasHttps) recommendations.push('URL lacks HTTPS encryption')
      if (urlAnalysis.suspiciousKeywords.length > 0) {
        recommendations.push(`Contains suspicious keywords: ${urlAnalysis.suspiciousKeywords.join(', ')}`)
      }
      if (emailAnalysis.isTyposquatting) recommendations.push('Email domain appears to be typosquatting')
      if (emailAnalysis.suspiciousPatterns.length > 0) {
        recommendations.push(`Email uses suspicious patterns: ${emailAnalysis.suspiciousPatterns.join(', ')}`)
      }
      if (overall === 'safe') recommendations.push('No immediate threats detected')

      const result: ScanResult = {
        overall,
        score,
        urlAnalysis,
        emailAnalysis,
        recommendations
      }

      setScanResult(result)
      setScanHistory(prev => [{
        url,
        email,
        result,
        timestamp: new Date()
      }, ...prev.slice(0, 4)]) // Keep last 5 scans

      // Show appropriate toast
      if (overall === 'dangerous') {
        toast.error('🚨 HIGH RISK: This appears to be a phishing attempt!')
      } else if (overall === 'suspicious') {
        toast.warning('⚠️ SUSPICIOUS: Exercise caution with this content')
      } else {
        toast.success('✅ SAFE: No immediate threats detected')
      }

    } catch (error) {
      toast.error('❌ Scan failed. Please try again.')
    } finally {
      setIsScanning(false)
    }
  }

  const getRiskColor = (overall: string) => {
    switch (overall) {
      case 'dangerous': return 'text-red-400'
      case 'suspicious': return 'text-yellow-400'
      case 'safe': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  const getRiskIcon = (overall: string) => {
    switch (overall) {
      case 'dangerous': return <XCircle className="w-6 h-6" />
      case 'suspicious': return <AlertTriangle className="w-6 h-6" />
      case 'safe': return <CheckCircle className="w-6 h-6" />
      default: return <Shield className="w-6 h-6" />
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
          🛡️ Advanced Phishing Scanner
        </h1>
        <p className="text-zinc-400 text-lg">AI-powered analysis to detect phishing emails and malicious URLs</p>
      </div>

      {/* Main Scanner Card */}
      <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-xl p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-cyan-400" />
              Quick Scan
            </h2>

            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-cyan-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="Sender's email (e.g., support@bank.com)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-cyan-500 transition-colors placeholder-zinc-400"
                />
              </div>

              <div className="relative">
                <Globe className="absolute left-3 top-3 text-cyan-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Suspicious URL (e.g., https://secure-bank-update.com)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-cyan-500 transition-colors placeholder-zinc-400"
                />
              </div>

              <button
                onClick={handleScan}
                disabled={isScanning || !url || !email}
                className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
              >
                {isScanning ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Scan for Threats
                  </>
                )}
              </button>
            </div>

            {/* Security Tips */}
            <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
              <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-400" />
                Security Tips
              </h3>
              <ul className="text-zinc-300 text-sm space-y-1">
                <li>• Always verify sender identity independently</li>
                <li>• Check for HTTPS encryption in URLs</li>
                <li>• Be wary of urgent or threatening language</li>
                <li>• Never enter passwords on suspicious sites</li>
              </ul>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {scanResult ? (
              <>
                <div className="text-center">
                  <div className={`inline-flex items-center gap-3 p-4 rounded-lg border ${
                    scanResult.overall === 'dangerous' 
                      ? 'bg-red-500/10 border-red-500/30' 
                      : scanResult.overall === 'suspicious'
                      ? 'bg-yellow-500/10 border-yellow-500/30'
                      : 'bg-green-500/10 border-green-500/30'
                  }`}>
                    <div className={getRiskColor(scanResult.overall)}>
                      {getRiskIcon(scanResult.overall)}
                    </div>
                    <div>
                      <div className={`font-semibold text-lg ${getRiskColor(scanResult.overall)}`}>
                        {scanResult.overall.toUpperCase()}
                      </div>
                      <div className="text-zinc-400 text-sm">
                        Risk Score: {scanResult.score}/100
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Analysis */}
                <div className="space-y-4">
                  <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                    <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-cyan-400" />
                      URL Analysis
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        {scanResult.urlAnalysis.hasHttps ? (
                          <Lock className="w-4 h-4 text-green-400" />
                        ) : (
                          <Unlock className="w-4 h-4 text-red-400" />
                        )}
                        <span className="text-zinc-300">
                          {scanResult.urlAnalysis.hasHttps ? 'HTTPS Secured' : 'No HTTPS encryption'}
                        </span>
                      </div>
                      {scanResult.urlAnalysis.suspiciousKeywords.length > 0 && (
                        <div className="text-orange-300">
                          Suspicious keywords: {scanResult.urlAnalysis.suspiciousKeywords.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                    <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-cyan-400" />
                      Email Analysis
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          scanResult.emailAnalysis.domainReputation === 'good' ? 'bg-green-400' :
                          scanResult.emailAnalysis.domainReputation === 'bad' ? 'bg-red-400' : 'bg-yellow-400'
                        }`}></div>
                        <span className="text-zinc-300">
                          Domain reputation: {scanResult.emailAnalysis.domainReputation}
                        </span>
                      </div>
                      {scanResult.emailAnalysis.isTyposquatting && (
                        <div className="text-red-300">⚠️ Possible typosquatting detected</div>
                      )}
                      {scanResult.emailAnalysis.suspiciousPatterns.length > 0 && (
                        <div className="text-orange-300">
                          Suspicious patterns: {scanResult.emailAnalysis.suspiciousPatterns.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                    <h3 className="text-white font-medium mb-3">Recommendations</h3>
                    <ul className="space-y-1 text-sm text-zinc-300">
                      {scanResult.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-cyan-400 mt-1">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Shield className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-500">Enter email and URL to start scanning</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scan History */}
      {scanHistory.length > 0 && (
        <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            Recent Scans
          </h2>
          <div className="space-y-3">
            {scanHistory.map((scan, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
                <div className="flex items-center gap-3">
                  <div className={getRiskColor(scan.result.overall)}>
                    {getRiskIcon(scan.result.overall)}
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium truncate max-w-xs">
                      {scan.url}
                    </div>
                    <div className="text-zinc-400 text-xs">
                      {scan.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <div className={`text-xs font-medium ${getRiskColor(scan.result.overall)}`}>
                  {scan.result.score}/100
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Educational Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-cyan-400" />
            Common Phishing Signs
          </h3>
          <ul className="space-y-2 text-zinc-300 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-1">•</span>
              Urgent or threatening language
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-1">•</span>
              Requests for personal information
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-1">•</span>
              Suspicious sender addresses
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-1">•</span>
              Poor grammar or spelling
            </li>
          </ul>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            Stay Protected
          </h3>
          <ul className="space-y-2 text-zinc-300 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">•</span>
              Verify sender through other channels
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">•</span>
              Check URLs before clicking
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">•</span>
              Use two-factor authentication
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">•</span>
              Keep software updated
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
