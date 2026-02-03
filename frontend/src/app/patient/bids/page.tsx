'use client';

import { useState } from 'react';
import { mockBids } from '@/lib/mockData';
import Link from 'next/link';

export default function ViewBidsPage() {
  const [selectedBid, setSelectedBid] = useState<string | null>(null);

  const handleAcceptBid = (bidId: string) => {
    setSelectedBid(bidId);
    alert('Bid accepted! You will be contacted by the office to schedule your appointment.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-blue-800/30 backdrop-blur-sm bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="text-white font-bold text-2xl tracking-tight">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">DENTAL</span>
                <span className="text-white">DASH</span>
                <span className="text-blue-400 text-sm ml-1">PRO</span>
              </div>
            </Link>
            <div className="flex space-x-4">
              <Link href="/" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition">Home</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Your Treatment Bids
            </span>
          </h1>
          <p className="text-gray-300 text-lg">Review competitive offers from qualified dental offices</p>
        </div>

        {/* Case Summary Card */}
        <div className="bg-blue-900/30 backdrop-blur border border-blue-500/30 rounded-xl p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Case:</span>
              <span className="text-white ml-2 font-semibold">Dental Crown - Upper Molar</span>
            </div>
            <div>
              <span className="text-gray-400">Submitted:</span>
              <span className="text-white ml-2 font-semibold">2 hours ago</span>
            </div>
            <div>
              <span className="text-gray-400">Status:</span>
              <span className="text-green-400 ml-2 font-semibold">3 Bids Received</span>
            </div>
          </div>
        </div>

        {/* Bids Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {mockBids.map((bid) => (
            <div
              key={bid.id}
              className={`bg-slate-800/50 backdrop-blur border rounded-xl p-6 transition-all hover:shadow-xl hover:shadow-blue-500/20 ${
                bid.id === '1' 
                  ? 'border-green-500/50 ring-2 ring-green-500/30' 
                  : 'border-blue-500/20 hover:border-blue-500/50'
              }`}
            >
              {/* Best Value Badge */}
              {bid.id === '1' && (
                <div className="-mt-9 mb-4 flex justify-center">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                    ⭐ BEST VALUE
                  </div>
                </div>
              )}

              {/* Office Name */}
              <h3 className="text-2xl font-bold text-white mb-3">{bid.officeName}</h3>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 text-lg">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>{i < Math.floor(bid.rating) ? '★' : '☆'}</span>
                  ))}
                </div>
                <span className="text-gray-400 ml-2 text-sm">{bid.rating}</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  ${bid.price.toLocaleString()}
                </div>
                <p className="text-gray-400 text-sm">Estimated total cost</p>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handleAcceptBid(bid.id)}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg shadow-blue-500/30"
              >
                Accept This Bid
              </button>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            All offices are verified and licensed. You can schedule a consultation before committing.
          </p>
        </div>
      </div>
    </div>
  );
}
