import Link from 'next/link';

export default function Office() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Dental Office Dashboard</h1>
        
        <div className="max-w-2xl">
          <Link href="/office/cases">
            <div className="border-2 border-purple-500 hover:border-purple-600 rounded-lg p-8 cursor-pointer transition">
              <h2 className="text-2xl font-bold mb-4 text-purple-600">View Available Cases</h2>
              <p className="text-gray-600 mb-4">
                Review and bid on patient dental cases
              </p>
              <button className="bg-purple-500 text-white px-6 py-3 rounded font-semibold hover:bg-purple-600 transition">
                View Cases →
              </button>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
