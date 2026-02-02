import Link from 'next/link';

export default function Patient() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Patient Dashboard</h1>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
          {/* Submit Case Card */}
          <Link href="/patient/submit">
            <div className="border-2 border-blue-500 hover:border-blue-600 rounded-lg p-8 cursor-pointer transition">
              <h2 className="text-2xl font-bold mb-4 text-blue-600">Submit Your Case</h2>
              <p className="text-gray-600 mb-4">
                Describe your dental needs and get competitive bids from qualified offices
              </p>
              <button className="bg-blue-500 text-white px-6 py-3 rounded font-semibold hover:bg-blue-600 transition">
                Get Started →
              </button>
            </div>
          </Link>

          {/* View Bids Card */}
          <Link href="/patient/bids">
            <div className="border-2 border-green-500 hover:border-green-600 rounded-lg p-8 cursor-pointer transition">
              <h2 className="text-2xl font-bold mb-4 text-green-600">View Your Bids</h2>
              <p className="text-gray-600 mb-4">
                Review bids from dental offices and choose the best option for you
              </p>
              <button className="bg-green-500 text-white px-6 py-3 rounded font-semibold hover:bg-green-600 transition">
                View Bids →
              </button>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
