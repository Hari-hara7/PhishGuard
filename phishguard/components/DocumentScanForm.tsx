'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

interface ScanResult {
  prediction: string
  confidence: number
  risk_score: number
  risk_level: string
  verdict: string
  warnings: string[]
  indicators: {
    urgency: string[]
    money: string[]
    credentials: string[]
    threats: string[]
    suspicious_urls: string[]
    actions: string[]
  }
  extracted_text: string
  filename: string
}

export default function DocScanPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const res = await fetch('http://127.0.0.1:8000/scan/doc/', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.detail || 'Upload failed')
      }

      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze document')
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'HIGH': return 'bg-red-500'
      case 'MEDIUM': return 'bg-yellow-500'
      case 'LOW': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getPredictionStyle = (prediction: string) => {
    if (prediction === 'Legitimate') {
      return 'text-green-600 bg-green-100 border-green-300'
    }
    return 'text-red-600 bg-red-100 border-red-300'
  }

  const hasIndicators = (indicators: ScanResult['indicators']) => {
    return Object.values(indicators).some(arr => arr.length > 0)
  }

  return (
    <main className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold">Document Scanner</h1>
          <p className="text-gray-600">Upload a document to scan for phishing indicators and verify authenticity</p>

          <div className="space-y-2">
            <Label htmlFor="file">Upload PDF, DOCX, or TXT file</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={(e) => {
                setFile(e.target.files?.[0] || null)
                setResult(null)
                setError(null)
              }}
              className="cursor-pointer"
            />
          </div>

          <Button 
            onClick={handleUpload} 
            disabled={loading || !file}
            className="w-full sm:w-auto"
          >
            {loading ? 'Scanning Document...' : 'Scan Document'}
          </Button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {result && (
        <>
          {/* Main Result Card */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">Analysis Result</h2>
                  <p className="text-sm text-gray-500">{result.filename}</p>
                </div>
                <div className={`px-4 py-2 rounded-lg border font-semibold ${getPredictionStyle(result.prediction)}`}>
                  {result.prediction}
                </div>
              </div>

              {/* Risk Score */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 rounded-lg bg-gray-50 border">
                  <p className="text-sm text-gray-500">Risk Score</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{result.risk_score}</span>
                    <span className="text-gray-400">/ 100</span>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 border">
                  <p className="text-sm text-gray-500">Risk Level</p>
                  <Badge className={`mt-1 ${getRiskColor(result.risk_level)}`}>
                    {result.risk_level}
                  </Badge>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 border">
                  <p className="text-sm text-gray-500">Confidence</p>
                  <span className="text-2xl font-bold">{(result.confidence * 100).toFixed(1)}%</span>
                </div>
              </div>

              {/* Verdict */}
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <p className="font-medium text-blue-800">{result.verdict}</p>
              </div>

              {/* Warnings */}
              {result.warnings.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-red-600">⚠️ Warnings</h3>
                  <ul className="space-y-1">
                    {result.warnings.map((warning, idx) => (
                      <li key={idx} className="text-sm p-2 bg-red-50 rounded border border-red-100">
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Indicators Card */}
          {hasIndicators(result.indicators) && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-bold">Detected Indicators</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.indicators.urgency.length > 0 && (
                    <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                      <h4 className="font-semibold text-orange-700 mb-2">🚨 Urgency Language</h4>
                      <div className="flex flex-wrap gap-1">
                        {result.indicators.urgency.map((item, idx) => (
                          <Badge key={idx} variant="outline" className="bg-orange-100">{item}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.indicators.money.length > 0 && (
                    <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                      <h4 className="font-semibold text-yellow-700 mb-2">💰 Money-Related</h4>
                      <div className="flex flex-wrap gap-1">
                        {result.indicators.money.map((item, idx) => (
                          <Badge key={idx} variant="outline" className="bg-yellow-100">{item}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.indicators.credentials.length > 0 && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                      <h4 className="font-semibold text-red-700 mb-2">🔐 Credential Requests</h4>
                      <div className="flex flex-wrap gap-1">
                        {result.indicators.credentials.map((item, idx) => (
                          <Badge key={idx} variant="outline" className="bg-red-100">{item}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.indicators.threats.length > 0 && (
                    <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                      <h4 className="font-semibold text-purple-700 mb-2">⚡ Threat Language</h4>
                      <div className="flex flex-wrap gap-1">
                        {result.indicators.threats.map((item, idx) => (
                          <Badge key={idx} variant="outline" className="bg-purple-100">{item}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.indicators.suspicious_urls.length > 0 && (
                    <div className="p-3 rounded-lg bg-pink-50 border border-pink-200 col-span-full">
                      <h4 className="font-semibold text-pink-700 mb-2">🔗 Suspicious URLs</h4>
                      <div className="flex flex-wrap gap-1">
                        {result.indicators.suspicious_urls.map((item, idx) => (
                          <Badge key={idx} variant="outline" className="bg-pink-100 break-all text-xs">{item}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.indicators.actions.length > 0 && (
                    <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                      <h4 className="font-semibold text-blue-700 mb-2">👆 Action Requests</h4>
                      <div className="flex flex-wrap gap-1">
                        {result.indicators.actions.map((item, idx) => (
                          <Badge key={idx} variant="outline" className="bg-blue-100">{item}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Extracted Text Card */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-bold">Extracted Text</h2>
              <div className="max-h-64 overflow-y-auto whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border text-sm font-mono">
                {result.extracted_text || 'No text extracted'}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </main>
  )
}
