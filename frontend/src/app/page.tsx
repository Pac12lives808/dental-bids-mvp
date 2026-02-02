import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-black text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl font-bold mb-6">
              Affordable Dental Care
            </h1>
            <p className="text-2xl text-gray-300 mb-10">
              Connect with qualified dental offices and get competitive bids instantly
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/patient/submit">
                <button className="bg-white text-black px-8 py-4 rounded font-semibold hover:bg-gray-100 transition text-lg">
                  I'm a Patient
                </button>
              </Link>
              <Link href="/office/cases">
                <button className="bg-transparent text-white px-8 py-4 rounded font-semibold border-2 border-white hover:bg-white hover:text-black transition text-lg">
                  I'm a Dental Office
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-black">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="bg-black text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4 text-black">Submit Your Case</h3>
              <p className="text-gray-600 text-lg">
                Patients describe their dental needs and insurance information
              </p>
            </div>

            <div className="text-center">
              <div className="bg-black text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4 text-black">Receive Bids</h3>
              <p className="text-gray-600 text-lg">
                Qualified dental offices review and submit competitive pricing
              </p>
            </div>

            <div className="text-center">
              <div className="bg-black text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4 text-black">Choose & Save</h3>
              <p className="text-gray-600 text-lg">
                Compare offers and select the best option for your budget
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Section for Investors */}
      <div className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Investor Demo</h3>
          <p className="text-gray-300 mb-8 text-lg">Experience the platform from both perspectives</p>
          <div className="flex gap-6 justify-center flex-wrap">
            <Link href="/patient/bids" className="text-white border-b-2 border-white hover:text-gray-300 hover:border-gray-300 transition text-lg pb-1">
              View Sample Bids (Patient View)
            </Link>
            <Link href="/office/cases" className="text-white border-b-2 border-white hover:text-gray-300 hover:border-gray-300 transition text-lg pb-1">
              View Available Cases (Office View)
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
