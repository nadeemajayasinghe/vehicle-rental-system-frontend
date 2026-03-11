import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-6">
            Vehicle Rental Booking System
          </h1>
          
          <div className="flex gap-4 justify-center mt-8">
            <Link
              href="/booking"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
            >
              Create New Booking
            </Link>
            <Link
              href="/bookings"
              className="px-8 py-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold text-lg"
            >
              View All Bookings
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

