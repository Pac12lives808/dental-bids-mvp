import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-black border-b border-gray-800 shadow-lg">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3">
          <div className="text-white font-bold text-2xl">Dental Dash Pro</div>
        </Link>
        <div className="flex gap-6">
          <Link href="/patient/submit" className="text-gray-300 hover:text-white transition">For Patients</Link>
          <Link href="/office/cases" className="text-gray-300 hover:text-white transition">For Offices</Link>
          <Link href="/patient/bids" className="text-gray-300 hover:text-white transition">View Bids</Link>
        </div>
      </nav>
    </header>
  );
}
