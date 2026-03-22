'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function BidForm() {
  const searchParams = useSearchParams();
  const caseId = searchParams.get('case_id') || '';

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Submit Bid</h1>
      {caseId && <p className="text-gray-500 mb-2">Case ID: {caseId}</p>}
      <form className="max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Your Estimate ($)</label>
          <input type="number" placeholder="Enter bid amount" className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea placeholder="Additional notes..." className="w-full border rounded px-3 py-2" rows={4} />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Submit Bid
        </button>
      </form>
    </main>
  );
}

export default function OfficeBidPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <BidForm />
    </Suspense>
  );
}
