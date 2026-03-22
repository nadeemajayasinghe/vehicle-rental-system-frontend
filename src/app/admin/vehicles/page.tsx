'use client';

export default function AdminVehicles() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Vehicle Management</h1>
        <p className="text-slate-600 mt-2">Manage your fleet of vehicles</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="text-6xl mb-4">🚗</div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Vehicle Management</h2>
        <p className="text-slate-600 mb-4">
          This section will allow you to manage your vehicle fleet, including adding new vehicles, 
          editing existing ones, tracking availability, and scheduling maintenance.
        </p>
        <div className="text-sm text-slate-500">
          Features coming soon:
          <ul className="mt-2 space-y-1">
            <li>• Add, edit, and delete vehicles</li>
            <li>• Vehicle availability tracking</li>
            <li>• Maintenance scheduling</li>
            <li>• Fleet analytics</li>
          </ul>
        </div>
      </div>
    </div>
  );
}