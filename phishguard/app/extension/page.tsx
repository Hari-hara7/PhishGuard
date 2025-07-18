'use client'

import { useState } from 'react'
import { 
  DownloadCloud, 
  Shield, 
  Chrome, 
  Firefox, 
  CheckCircle, 
  AlertTriangle, 
  Zap, 
  Eye, 
  Lock,
  Globe,
  Star,
  Users,
  Download,
  PlayCircle,
  ExternalLink,
  Info
} from 'lucide-react'

export default function ExtensionPage() {
  const [activeTab, setActiveTab] = useState('features')

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Real-time Protection",
      description: "Automatically scans websites as you browse and warns about phishing attempts"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Alerts",
      description: "Get immediate notifications when visiting suspicious or malicious websites"
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "URL Analysis",
      description: "Deep analysis of URLs to detect typosquatting and domain reputation issues"
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Secure Browsing",
      description: "Blocks known phishing sites and prevents credential theft attempts"
    }
  ]

  const stats = [
    { icon: <Users className="w-5 h-5" />, label: "Active Users", value: "2+" },
    { icon: <Shield className="w-5 h-5" />, label: "Threats Blocked", value: "10+" },
    { icon: <Star className="w-5 h-5" />, label: "User Rating", value: "4.8/5" },
    { icon: <Globe className="w-5 h-5" />, label: "Sites Protected", value: "10+" }
  ]

  const installSteps = [
    {
      step: 1,
      title: "Download Extension",
      description: "Click the download button to get the PhishGuard extension package"
    },
    {
      step: 2,
      title: "Open Chrome Extensions",
      description: "Go to chrome://extensions/ in your Chrome browser"
    },
    {
      step: 3,
      title: "Enable Developer Mode",
      description: "Toggle the 'Developer mode' switch in the top-right corner"
    },
    {
      step: 4,
      title: "Load Extension",
      description: "Click 'Load unpacked' and select the extracted PhishGuard folder"
    }
  ]

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          🛡️ PhishGuard Extension
        </h1>
        <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
          Advanced browser protection that detects and blocks phishing attempts in real-time. 
          Stay safe while browsing with our AI-powered security extension.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mt-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-lg p-4">
              <div className="text-cyan-400 mb-2 flex justify-center">
                {stat.icon}
              </div>
              <div className="text-white font-semibold">{stat.value}</div>
              <div className="text-zinc-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-xl p-8">
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {['features', 'install', 'demo'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab
                  ? 'bg-cyan-600 text-white'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              {tab === 'features' && 'Features'}
              {tab === 'install' && 'Installation'}
              {tab === 'demo' && 'Demo'}
            </button>
          ))}
        </div>

        {/* Features Tab */}
        {activeTab === 'features' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Powerful Protection Features</h2>
              <p className="text-zinc-400">Advanced security features to keep you safe online</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6 hover:border-cyan-500/30 transition-colors">
                  <div className="text-cyan-400 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-zinc-300">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Additional Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="text-center p-4">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <h4 className="text-white font-medium">Privacy Focused</h4>
                <p className="text-zinc-400 text-sm">No tracking, no data collection</p>
              </div>
              <div className="text-center p-4">
                <AlertTriangle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <h4 className="text-white font-medium">Smart Detection</h4>
                <p className="text-zinc-400 text-sm">AI-powered threat recognition</p>
              </div>
              <div className="text-center p-4">
                <Zap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h4 className="text-white font-medium">Lightning Fast</h4>
                <p className="text-zinc-400 text-sm">Zero impact on browsing speed</p>
              </div>
            </div>
          </div>
        )}

        {/* Installation Tab */}
        {activeTab === 'install' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Easy Installation</h2>
              <p className="text-zinc-400 mb-8">Get protected in just a few simple steps</p>

              {/* Download Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <a
                  href="/downloads/phishguard-extension.zip"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105"
                  download
                >
                  <Chrome className="w-6 h-6" />
                  Download for Chrome
                  <DownloadCloud className="w-5 h-5" />
                </a>
                <button className="inline-flex items-center gap-3 px-8 py-4 bg-zinc-700 hover:bg-zinc-600 text-white font-semibold rounded-lg transition-all">
                  <Firefox className="w-6 h-6" />
                  Firefox (Coming Soon)
                </button>
              </div>
            </div>

            {/* Installation Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {installSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="bg-cyan-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                    {step.step}
                  </div>
                  <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                  <p className="text-zinc-400 text-sm">{step.description}</p>
                </div>
              ))}
            </div>

            {/* System Requirements */}
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-cyan-400" />
                System Requirements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="text-cyan-400 font-medium mb-2">Supported Browsers</h4>
                  <ul className="text-zinc-300 space-y-1">
                    <li>• Google Chrome 90+</li>
                    <li>• Microsoft Edge 90+</li>
                    <li>• Brave Browser</li>
                    <li>• Opera 76+</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-cyan-400 font-medium mb-2">Requirements</h4>
                  <ul className="text-zinc-300 space-y-1">
                    <li>• Chrome Extensions API v3</li>
                    <li>• Internet connection required</li>
                    <li>• 5MB free storage space</li>
                    <li>• Developer mode enabled</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Demo Tab */}
        {activeTab === 'demo' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">See PhishGuard in Action</h2>
              <p className="text-zinc-400 mb-8">Watch how our extension protects you from real threats</p>
            </div>

            {/* Demo Video/Screenshot */}
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-8 text-center">
              <div className="bg-zinc-900 rounded-lg p-12 mb-6">
                <PlayCircle className="w-24 h-24 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-white text-xl font-semibold mb-2">Interactive Demo</h3>
                <p className="text-zinc-400">Coming Soon - See real-time protection in action</p>
              </div>
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors">
                <ExternalLink className="w-4 h-4" />
                View Demo Site
              </button>
            </div>

            {/* Demo Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6 text-center">
                <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Threat Detection</h3>
                <p className="text-zinc-400 text-sm">See how phishing sites are automatically detected and blocked</p>
              </div>
              <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6 text-center">
                <Eye className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Real-time Scanning</h3>
                <p className="text-zinc-400 text-sm">Watch URLs being analyzed as you browse</p>
              </div>
              <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6 text-center">
                <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Smart Warnings</h3>
                <p className="text-zinc-400 text-sm">Experience intelligent threat notifications</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FAQ Section */}
      <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-xl p-8">
        <h2 className="text-3xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-2">Is the extension free?</h3>
              <p className="text-zinc-400 text-sm">Yes, PhishGuard is completely free to use with no hidden fees or premium features.</p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Does it slow down my browser?</h3>
              <p className="text-zinc-400 text-sm">No, our extension is optimized for performance and has zero impact on browsing speed.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-2">What data do you collect?</h3>
              <p className="text-zinc-400 text-sm">We prioritize privacy and don&apos;t collect any personal browsing data or history.</p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">How often is it updated?</h3>
              <p className="text-zinc-400 text-sm">The threat database is updated in real-time to protect against the latest phishing attempts.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-8">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Stay Protected?</h2>
        <p className="text-zinc-400 mb-6">Join thousands of users who browse safely with PhishGuard</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/downloads/phishguard-extension.zip"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105"
            download
          >
            <Download className="w-5 h-5" />
            Download Now
          </a>
          <a
            href="/scanner"
            className="inline-flex items-center gap-3 px-8 py-4 bg-zinc-700 hover:bg-zinc-600 text-white font-semibold rounded-lg transition-all"
          >
            <Shield className="w-5 h-5" />
            Try Web Scanner
          </a>
        </div>
      </div>
    </div>
  )
}
