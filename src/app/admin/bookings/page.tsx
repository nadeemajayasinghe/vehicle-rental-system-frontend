'use client';

export default function AdminBookings() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Booking Management</h1>
        <p className="text-slate-600 mt-2">Manage reservations and bookings</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="text-6xl mb-4">📅</div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Booking Management</h2>
        <p className="text-slate-600 mb-4">
          This section will allow you to oversee all reservations, modify bookings, 
          track booking status, and analyze booking patterns.
        </p>
        <div className="text-sm text-slate-500">
          Features coming soon:
          <ul className="mt-2 space-y-1">
            <li>• Booking status tracking</li>
            <li>• Reservation modifications</li>
            <li>• Booking analytics</li>
            <li>• Calendar view</li>
          </ul>
        </div>
      </div>
    </div>
  );
}