export default function OfficSignupPage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Office Sign Up</h1>
      <p className="text-gray-600 mb-6">Create your dental office account to start receiving bids from patients.</p>
      <form className="max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Practice Name</label>
          <input type="text" placeholder="Enter practice name" className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" placeholder="Enter email" className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input type="password" placeholder="Enter password" className="w-full border rounded px-3 py-2" />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Create Account
        </button>
      </form>
    </main>
  );
}
