export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Dental Bids</h1>
        <div className="flex gap-4">
          <a href="#" className="text-gray-600 hover:text-blue-600">About</a>
          <a href="#" className="text-gray-600 hover:text-blue-600">Login</a>
        </div>
      </nav>
    </header>
  )
}
