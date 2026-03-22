'use client';

import Link from 'next/link';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Vehicles', value: '24', icon: '🚗' },
    { label: 'Total Customers', value: '156', icon: '👥' },
    { label: 'Active Bookings', value: '12', icon: '📅' },
    { label: 'Monthly Revenue', value: '$12,450', icon: '💰' },
  ];

  const quickActions = [
    { label: 'Add New Vehicle', href: '/vehicles/create', icon: '➕' },
    { label: 'View All Bookings', href: '/admin/bookings', icon: '📋' },
    { label: 'Generate Reports', href: '/admin/reports', icon: '📊' },
    { label: 'Manage Customers', href: '/admin/customers', icon: '👤' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-600 mt-2">Welcome to the CarRent administration panel</p>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="font-medium text-slate-700">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">New booking created</p>
              <p className="text-xs text-slate-600">Customer John Doe booked Toyota Camry for 3 days</p>
            </div>
            <span className="text-xs text-slate-500">2 hours ago</span>
          </div>
          <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">Vehicle added to fleet</p>
              <p className="text-xs text-slate-600">Honda Civic 2024 added to available vehicles</p>
            </div>
            <span className="text-xs text-slate-500">5 hours ago</span>
          </div>
          <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">Payment processed</p>
              <p className="text-xs text-slate-600">$450 payment received for booking #1234</p>
            </div>
            <span className="text-xs text-slate-500">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}