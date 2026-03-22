'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import { mockCases } from '@/lib/mockData';

export default function OfficeCases() {
  const [estimateAmounts, setEstimateAmounts] = useState<{ [caseId: string]: string }>({});

  const handleEstimateSubmit = (caseId: string) => {
    console.log(`Estimate submitted for case ${caseId}: $${estimateAmounts[caseId]}`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <Header />
      <h1 className="text-3xl font-bold mb-2">Available Cases</h1>
      Review and provide estimates on patient dental cases
      <div className="space-y-4">
        {mockCases.map((dentalCase) => (
          <div
            key={dentalCase.id}
            className={`rounded-lg p-6 bg-white shadow-sm ${
              dentalCase.id === 'c001'
                ? 'border-2 border-blue-200 shadow-[0_4px_16px_rgba(37,99,235,0.12)]'
                : 'border'
            }`}
          >
            {dentalCase.id === 'c001' && (
              <>
                <div className="inline-flex items-center gap-1.5 bg-gradient-to-br from-blue-100 to-blue-50 border-2 border-blue-200 text-blue-800 px-3.5 py-1.5 rounded-full text-xs font-bold mb-3" style={{boxShadow: '0 2px 8px rgba(37,99,235,0.15)'}}>
                  <span className="text-sm">⭐</span>
                  <span className="tracking-wide">Recommended First Case</span>
                </div>
                <p className="text-sm text-slate-600 -mt-1 mb-3 leading-relaxed italic">
                  Simple case with clear requirements — great for your first estimate
                </p>
              </>
            )}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{dentalCase.treatment}</h3>
                <p className="text-sm text-gray-500">Case #{dentalCase.id} • Submitted {dentalCase.createdAt}</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                {dentalCase.status}
              </span>
            </div>

            <div className="mb-4">
              <p className="text-sm font-semibold mb-1">Patient Information</p>
              <p className="text-sm text-gray-600">Location: {dentalCase.zipCode}</p>
            </div>

            <div className="mb-4">
              <p className="text-sm font-semibold mb-1">Description</p>
              <p className="text-sm text-gray-700">{dentalCase.description}</p>
            </div>

            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-semibold mb-1">Your Estimate Amount ($)</label>
                <input
                  type="number"
                  placeholder="Enter estimate amount"
                  value={estimateAmounts[dentalCase.id] || ''}
                  onChange={(e) => setEstimateAmounts({ ...estimateAmounts, [dentalCase.id]: e.target.value })}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => handleEstimateSubmit(dentalCase.id)}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Provide Estimate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
