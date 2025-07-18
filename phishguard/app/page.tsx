'use client'

import React, { useEffect, useState } from 'react'
import { 
  ShieldCheck, 
  Bug, 
  UploadCloud, 
  Globe2, 
  Download, 
  Zap,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  Shield,
  Scan,
  AlertTriangle,
  TrendingUp,
  Clock,
  Award
} from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [currentFeature, setCurrentFeature] = useState(0)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 3)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    { icon: Shield, text: "Real-time protection against phishing attacks" },
    { icon: Scan, text: "AI-powered URL analysis and threat detection" },
    { icon: AlertTriangle, text: "Instant alerts for malicious content" }
  ]

  const stats = [
    { number: "10+", label: "URLs Scanned" },
    { number: "20+", label: "Threats Blocked" },
    { number: "99.9%", label: "Accuracy Rate" },
    { number: "24/7", label: "Protection" }
  ]

  if (!mounted) {
    return null
  }
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-400/5 to-blue-400/5 rounded-full blur-3xl"></div>
      </div>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-6xl mx-auto text-center space-y-8">
            
            {/* Badge */}
            <div className="flex justify-center animate-fade-in">
              <Badge 
                variant="outline" 
                className="text-cyan-400 px-6 py-3 border-cyan-400/50 bg-cyan-400/10 backdrop-blur-sm text-sm sm:text-base font-medium hover:bg-cyan-400/20 transition-all duration-300 cursor-pointer"
              >
                <Zap className="w-4 h-4 mr-2" />
                🚀 AI Powered Security Platform
              </Badge>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Real-Time Scam
              </span>
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Link Detection
              </span>
            </h1>

            {/* Rotating Feature Display */}
            <div className="h-16 flex items-center justify-center">
              <div className="flex items-center space-x-3 bg-zinc-800/50 backdrop-blur-sm rounded-full px-6 py-3 border border-zinc-700/50">
                {React.createElement(features[currentFeature].icon, {
                  className: "w-5 h-5 text-cyan-400"
                })}
                <span className="text-zinc-300 text-sm sm:text-base font-medium">
                  {features[currentFeature].text}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-lg sm:text-xl lg:text-2xl text-zinc-300 leading-relaxed max-w-4xl mx-auto px-4">
              PhishGuard uses <span className="text-cyan-400 font-semibold">intelligent scanning</span> and 
              <span className="text-blue-400 font-semibold"> real-time AI analysis</span> to detect phishing, 
              malware, and scam threats — <span className="text-purple-400 font-semibold">before you click</span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12 px-4">
              <Link
                href="/extension"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Download className="w-5 h-5 group-hover:animate-bounce" />
                Install Extension
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/report"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <UploadCloud className="w-5 h-5 group-hover:animate-pulse" />
                Report Scam
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mt-16 px-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-zinc-400 text-xs sm:text-sm lg:text-base font-medium mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 text-zinc-400">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <span className="text-sm sm:text-base">
                  Join <span className="text-cyan-400 font-semibold">10+</span> users
                </span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-zinc-600 rounded-full"></div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-sm sm:text-base">4.9/5 rating</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-6">
                Advanced Protection Features
              </h2>
              <p className="text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto">
                Comprehensive security solutions designed to keep you safe from evolving online threats
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="group bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm p-6 lg:p-8 rounded-2xl border border-zinc-700/50 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-400/10 transform hover:-translate-y-2">
                <div className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheck className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold mb-4 text-white group-hover:text-cyan-400 transition-colors">
                  Real-Time Detection
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  Instantly detect phishing URLs using advanced AI-powered scanning, machine learning algorithms, and comprehensive URL intelligence databases.
                </p>
                <div className="mt-4 flex items-center text-cyan-400 text-sm font-medium">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  99.9% accuracy rate
                </div>
              </div>

              <div className="group bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm p-6 lg:p-8 rounded-2xl border border-zinc-700/50 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-400/10 transform hover:-translate-y-2">
                <div className="w-14 h-14 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Bug className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold mb-4 text-white group-hover:text-cyan-400 transition-colors">
                  Malware Protection
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  Receive instant alerts for links hosting malware, spyware, ransomware, or harmful scripts before they can compromise your system.
                </p>
                <div className="mt-4 flex items-center text-cyan-400 text-sm font-medium">
                  <Clock className="w-4 h-4 mr-2" />
                  Sub-second response time
                </div>
              </div>

              <div className="group bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm p-6 lg:p-8 rounded-2xl border border-zinc-700/50 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-400/10 transform hover:-translate-y-2 md:col-span-2 lg:col-span-1">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Globe2 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold mb-4 text-white group-hover:text-cyan-400 transition-colors">
                  Global Coverage
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  Comprehensive URL scanning across all regions, languages, and domains. Stay protected worldwide with our international threat database.
                </p>
                <div className="mt-4 flex items-center text-cyan-400 text-sm font-medium">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  200+ countries covered
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 backdrop-blur-sm border-y border-zinc-700/50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-8">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Stay Safe. Stay Ahead.
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-zinc-300 mb-8 leading-relaxed">
              Join thousands of users protecting themselves from scams every day. 
              Start your journey to safer browsing today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/scanner"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Scan className="w-5 h-5 group-hover:animate-spin" />
                Launch Scanner Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/dashboard"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-zinc-600 text-zinc-300 hover:border-cyan-400 hover:text-cyan-400 font-semibold rounded-xl transition-all duration-300"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
