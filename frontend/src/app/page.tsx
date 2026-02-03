import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-blue-800/30 backdrop-blur-sm bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center space-x-3">
              {/* Dental Dash Pro Logo Text */}
              <div className="text-white font-bold text-2xl tracking-tight">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">DENTAL</span>
                <span className="text-white">DASH</span>
                <span className="text-blue-400 text-sm ml-1">PRO</span>
              </div>
            </div>
            <div className="flex space-x-4">
              <Link href="/patient/submit" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition">Patient</Link>
              <Link href="/office/cases" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition">Dental Office</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Affordable Dental Care
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Connect with qualified dental offices and get competitive bids instantly
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/patient/submit">
                <button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg shadow-blue-500/50 transition-all transform hover:scale-105">
                  I'm a Patient
                </button>
              </Link>
              <Link href="/office/cases">
                <button className="bg-slate-800 hover:bg-slate-700 text-white border-2 border-blue-500/50 px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105">
                  I'm a Dental Office
                </button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Licensed Offices</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Secure Platform</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-4xl font-bold text-center mb-16">
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            How It Works
          </span>
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-slate-800/50 backdrop-blur border border-blue-500/20 rounded-xl p-8 hover:border-blue-500/50 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-2xl mb-4">
              1
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Submit Your Case</h3>
            <p className="text-gray-400">
              Patients describe their dental needs and insurance information
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-800/50 backdrop-blur border border-blue-500/20 rounded-xl p-8 hover:border-blue-500/50 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-2xl mb-4">
              2
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Receive Bids</h3>
            <p className="text-gray-400">
              Qualified dental offices review and submit competitive pricing
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-800/50 backdrop-blur border border-blue-500/20 rounded-xl p-8 hover:border-blue-500/50 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-2xl mb-4">
              3
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Choose & Save</h3>
            <p className="text-gray-400">
              Compare offers and select the best option for your budget
            </p>
          </div>
        </div>
      </div>

      {/* Investor Demo Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 backdrop-blur border border-blue-500/30 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Investor Demo</h2>
          <p className="text-gray-300 mb-8">Experience the platform from both perspectives</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/patient/bids">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all">
                View Sample Bids (Patient View)
              </button>
            </Link>
            <Link href="/office/cases">
              <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-semibold transition-all">
                View Available Cases (Office View)
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-blue-800/30 backdrop-blur-sm bg-slate-900/50 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-400 text-sm">
            © 2026 Dental Dash Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
