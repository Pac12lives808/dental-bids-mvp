'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { mockCases } from '@/lib/mockData';

export default function OfficeCases() {
  const [Provide EstiestimatemateAmounts, setProvide EstiestimatemateAmounts] = useState<{ [caseId: string]: string }>({});

  const handleProvide EstiestimatemateSubmit = (caseId: string) => {
    console.log(`Provide Estiestimatemate submitted for case ${caseId}: $${Provide EstiestimatemateAmounts[caseId]}`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <Header />
      <h1 className="text-3xl font-bold mb-2">Available Cases</h1>
Review and provide estimates on patient dental cases
      <div className="space-y-4">
        {mockCases.map((dentalCase) => (
          <div key={dentalCase.id} className="border rounded-lg p-6 bg-white shadow-sm">
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
                  placeholder="Enter Provide Estiestimatemate amount"
                  value={Provide EstiestimatemateAmounts[dentalCase.id] || ''}
                  onChange={(e) => setProvide EstiestimatemateAmounts({ ...Provide EstiestimatemateAmounts, [dentalCase.id]: e.target.value })}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => handleProvide EstiestimatemateSubmit(dentalCase.id)}
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
