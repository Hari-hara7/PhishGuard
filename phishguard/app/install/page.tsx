export default function InstallPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full mb-6 shadow-lg shadow-cyan-500/30 animate-pulse">
              <span className="text-3xl">🛡️</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              Install <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 bg-clip-text text-transparent animate-pulse">PhishGuard</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Advanced cybersecurity protection against phishing attacks and malicious websites
            </p>
          </div>

          {/* Main Content Card */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-cyan-500/20 shadow-2xl shadow-cyan-500/10 p-8 md:p-12 relative overflow-hidden">
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-cyan-500/5 animate-pulse"></div>
            
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              {/* Instructions */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
                  <span className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center text-sm font-bold text-black mr-4 shadow-lg shadow-cyan-500/30">⚡</span>
                  Installation Guide
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 group hover:bg-cyan-500/5 p-4 rounded-xl transition-all duration-300">
                    <div className="w-10 h-10 bg-cyan-500/20 border border-cyan-400/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-cyan-500/30 transition-colors">
                      <span className="text-cyan-400 text-sm font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2 text-lg">Download Extension</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">Click the download button to get the PhishGuard extension package</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group hover:bg-cyan-500/5 p-4 rounded-xl transition-all duration-300">
                    <div className="w-10 h-10 bg-cyan-500/20 border border-cyan-400/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-cyan-500/30 transition-colors">
                      <span className="text-cyan-400 text-sm font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2 text-lg">Extract Files</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">Unzip the downloaded file to a secure folder on your system</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group hover:bg-cyan-500/5 p-4 rounded-xl transition-all duration-300">
                    <div className="w-10 h-10 bg-cyan-500/20 border border-cyan-400/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-cyan-500/30 transition-colors">
                      <span className="text-cyan-400 text-sm font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2 text-lg">Access Chrome Extensions</h3>
                      <p className="text-gray-300 text-sm leading-relaxed mb-2">Navigate to <code className="bg-black border border-cyan-500/30 px-3 py-1 rounded-lg text-cyan-400 font-mono text-xs">chrome://extensions</code> in your browser</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group hover:bg-cyan-500/5 p-4 rounded-xl transition-all duration-300">
                    <div className="w-10 h-10 bg-cyan-500/20 border border-cyan-400/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-cyan-500/30 transition-colors">
                      <span className="text-cyan-400 text-sm font-bold">4</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2 text-lg">Enable Developer Mode</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">Toggle the &quot;Developer mode&quot; switch in the top right corner</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group hover:bg-cyan-500/5 p-4 rounded-xl transition-all duration-300">
                    <div className="w-10 h-10 bg-cyan-500/20 border border-cyan-400/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-cyan-500/30 transition-colors">
                      <span className="text-cyan-400 text-sm font-bold">5</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2 text-lg">Deploy Extension</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">Click &quot;Load unpacked&quot; and select your extracted folder</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Download Section */}
              <div className="text-center">
                <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-cyan-400/30 relative overflow-hidden">
                  {/* Animated glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-cyan-500/20 to-cyan-400/10 animate-pulse"></div>
                  
                  <div className="relative z-10">
                    <div className="text-7xl mb-6 animate-bounce">⚡</div>
                    <h3 className="text-3xl font-bold text-white mb-4">Ready to Deploy?</h3>
                    <p className="text-cyan-100 mb-8 text-lg leading-relaxed">Download PhishGuard and activate advanced protection protocols</p>
                    
                    <a
                      href="/assets/phishguard.zip"
                      download
                      className="inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-cyan-500 to-cyan-600 text-black font-bold rounded-2xl hover:from-cyan-400 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 text-lg"
                    >
                      <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download PhishGuard
                    </a>
                    
                    <div className="mt-6 text-sm text-cyan-300">
                      Version 2.0 • Advanced Security • Free
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="mt-10 space-y-5">
                  <div className="flex items-center justify-center space-x-3 text-gray-300 hover:text-cyan-400 transition-colors duration-300 group">
                    <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center border border-cyan-500/30 group-hover:bg-cyan-500/30 transition-colors">
                      <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-medium">Blocks 231+ malicious domains</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3 text-gray-300 hover:text-cyan-400 transition-colors duration-300 group">
                    <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center border border-cyan-500/30 group-hover:bg-cyan-500/30 transition-colors">
                      <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-medium">Real-time threat detection</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3 text-gray-300 hover:text-cyan-400 transition-colors duration-300 group">
                    <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center border border-cyan-500/30 group-hover:bg-cyan-500/30 transition-colors">
                      <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-medium">Zero performance impact</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-10 bg-gradient-to-r from-cyan-500/10 via-cyan-400/5 to-cyan-500/10 border border-cyan-500/30 rounded-2xl p-8 backdrop-blur-sm">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0 border border-cyan-400/30">
                <svg className="w-6 h-6 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-cyan-300 font-bold mb-3 text-lg">Security Protocol Notice</h3>
                <p className="text-gray-300 leading-relaxed">
                  PhishGuard provides advanced protection against known threats but should be part of a comprehensive security strategy. 
                  Always verify URLs manually and maintain good cybersecurity practices when handling sensitive information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
