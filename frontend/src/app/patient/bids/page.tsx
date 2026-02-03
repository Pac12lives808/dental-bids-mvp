'use client';

import { useState } from 'react';
import { mockBids } from '@/lib/mockData';

export default function ViewBidsPage() {
  const [selectedBid, setSelectedBid] = useState<number | null>(null);

  const handleAcceptBid = (bidId: number) => {
    setSelectedBid(bidId);
    // In real app, would submit to API
    alert('Bid accepted! You will be contacted by the office to schedule your appointment.');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Your Treatment Bids</h1>
      <p className="text-gray-600 mb-8">Review competitive offers from qualified dental offices</p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <p className="text-sm">
          <strong>Case:</strong> Dental Crown - Upper Molar<br/>
          <strong>Submitted:</strong> 2 hours ago<br/>
          <strong>Status:</strong> <span className="text-green-600 font-semibold">3 Bids Received</span>
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {mockBids.map((bid) => (
          <div
            key={bid.id}
            className={`border rounded-lg p-6 ${
              bid.id === '1' ? 'border-green-500 border-2 relative' : 'border-gray-300'
            }`}
          >
            {bid.id === '1' && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                BEST VALUE
              </div>
            )}

            <h3 className="text-xl font-bold mb-2">{bid.officeName}</h3>
            <div className="text-yellow-400 mb-2">
              {'★'.repeat(Math.floor(bid.rating))}{'☆'.repeat(5 - Math.floor(bid.rating))}
              <span className="text-gray-600 ml-2">{bid.rating}</span>
            </div>


            <div className="mb-4">
              <p className="text-3xl font-bold text-green-600">${bid.price.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Estimated total cost</p>
            </div>

            <div className="space-y-2 mb-4 text-sm">
              <p><strong>Experience:</strong> {bid.experience}</p>
              <p><strong>Availability:</strong> {bid.availability}</p>
              <p><strong>Insurance:</strong> {bid.insuranceAccepted ? 'Accepted' : 'Not accepted'}</p>
            </div>

            <button
              onClick={() => handleAcceptBid(bid.id)}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Accept This Bid
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center text-gray-600 text-sm">
        <p>All offices are verified and licensed. You can schedule a consultation before committing.</p>
      </div>
    </div>
  );
}
