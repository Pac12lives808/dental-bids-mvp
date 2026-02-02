'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SubmitCase() {
  const router = useRouter()
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => router.push('/patient/bids'), 2000)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Case Submitted!</h2>
          <p className="text-gray-600">Dental offices in your area are being notified...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Submit Your Case</h1>
        <p className="text-gray-600 mb-8">Get competitive bids from qualified dental offices</p>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Treatment Needed</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required>
              <option value="">Select treatment...</option>
              <option>Dental Implant</option>
              <option>Root Canal</option>
              <option>Crown</option>
              <option>Bridge</option>
              <option>Dentures</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500" placeholder="Describe your dental needs..." required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your ZIP Code</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="85295" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photos (Optional)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="text-4xl mb-2">📷</div>
              <p className="text-gray-600">Click or drag photos here</p>
              <input type="file" className="hidden" accept="image/*" multiple />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Submit Case
          </button>
        </form>
      </div>
    </div>
  )
}
