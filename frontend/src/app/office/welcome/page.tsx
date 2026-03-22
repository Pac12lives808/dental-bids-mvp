import Link from 'next/link';

export default function OfficeWelcomePage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome to Dental Bids</h1>
      <p className="text-gray-600 mb-6">Your office account is set up. Start reviewing patient cases and submitting bids.</p>
      <div className="space-y-4">
        <Link href="/office/cases" className="block bg-blue-600 text-white text-center px-6 py-3 rounded hover:bg-blue-700">
          View Available Cases
        </Link>
        <Link href="/office" className="block border border-gray-300 text-center px-6 py-3 rounded hover:bg-gray-50">
          Go to Dashboard
        </Link>
      </div>
    </main>
  );
}
