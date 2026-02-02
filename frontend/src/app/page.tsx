import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Find Affordable Dental Care
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect with qualified dental offices and get competitive bids for your treatment
          </p>
        </div>

        <div className="flex gap-4 justify-center mt-12 mb-16">
          <Link href="/patient/submit">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              I'm a Patient - Submit Case
            </button>
          </Link>
          <Link href="/office/cases">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition">
              I'm a Dental Office - View Cases
            </button>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-blue-600 text-4xl font-bold mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Submit Your Case</h3>
              <p className="text-gray-600">
                Patients describe their dental needs and insurance information
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-blue-600 text-4xl font-bold mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Receive Bids</h3>
              <p className="text-gray-600">
                Qualified dental offices review and submit competitive pricing
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-blue-600 text-4xl font-bold mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Choose & Save</h3>
              <p className="text-gray-600">
                Compare offers and select the best option for your budget
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold mb-4">Demo Pages (Investor Preview)</h3>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/patient/bids" className="text-blue-600 underline hover:text-blue-800">
              View Sample Bids (Patient View)
            </Link>
            <Link href="/office/cases" className="text-blue-600 underline hover:text-blue-800">
              View Available Cases (Office View)
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
