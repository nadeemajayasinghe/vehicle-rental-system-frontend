'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { customerService, ServiceHistoryResponse } from '@/services/customerService';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [serviceHistory, setServiceHistory] = useState<ServiceHistoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    const loadServiceHistory = async () => {
      try {
        setIsLoading(true);
        const history = await customerService.getServiceHistory(user.id);
        setServiceHistory(history);
      } catch (error: unknown) {
        const message = axios.isAxiosError<{ message?: string }>(error)
          ? error.response?.data?.message
          : undefined;
        setError(message || 'Failed to load service history');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadServiceHistory();
  }, [user]);

  const recentRental = serviceHistory[0];
  const completedRentals = serviceHistory.filter((service) => service.status.toLowerCase() === 'completed').length;
  const totalSpent = serviceHistory.reduce((sum, service) => sum + service.cost, 0);

  const getStatusStyles = (status: string) => {
    const normalizedStatus = status.toLowerCase();

    if (normalizedStatus === 'completed') {
      return 'bg-blue-50 text-blue-700 ring-1 ring-blue-100';
    }

    if (normalizedStatus === 'pending') {
      return 'bg-slate-100 text-slate-700 ring-1 ring-slate-200';
    }

    return 'bg-slate-900 text-white ring-1 ring-slate-900/10';
  };

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 shadow-sm">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 px-6 py-8 text-white shadow-2xl shadow-slate-900/10 sm:px-8 lg:px-10">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-1/3 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-200">Dashboard</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                Welcome back, {user.name}!
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                Track your rentals, review recent activity, and keep your account details organized in one calm workspace.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-slate-100">
                  Account status: Active
                </div>
                <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-slate-100">
                  Member type: {user.role}
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-white/8 p-5 backdrop-blur">
              <p className="text-sm font-medium text-blue-200">Latest activity</p>
              <div className="mt-4 space-y-4">
                <div className="rounded-2xl bg-white p-4 text-slate-950">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Most recent rental</p>
                  <p className="mt-2 text-xl font-semibold">
                    {recentRental ? recentRental.vehicle : 'No rentals yet'}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {recentRental
                      ? new Date(recentRental.serviceDate).toLocaleDateString()
                      : 'Book your first vehicle to start building your history.'}
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-300">Completed</p>
                    <p className="mt-2 text-2xl font-semibold">{completedRentals}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-300">Total spent</p>
                    <p className="mt-2 text-2xl font-semibold">${totalSpent.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Account Status</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Active</p>
                <p className="mt-2 text-sm text-slate-500">Your customer account is ready to book and manage rentals.</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Rentals</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{serviceHistory.length}</p>
                <p className="mt-2 text-sm text-slate-500">Every booking and service visit is collected in your history below.</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Member Type</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{user.role}</p>
                <p className="mt-2 text-sm text-slate-500">Your profile tier shapes the experience you’ll see across the app.</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-6 sm:flex-row sm:items-end sm:justify-between sm:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">Rental history</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                Your complete rental timeline
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Review dates, vehicles, statuses, and total cost in one place.
              </p>
            </div>
            <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
              {serviceHistory.length} record{serviceHistory.length === 1 ? '' : 's'}
            </div>
          </div>

          <div className="px-6 py-6 sm:px-8">
            {isLoading ? (
              <div className="flex min-h-64 items-center justify-center rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 text-sm font-medium text-slate-500">
                Loading service history...
              </div>
            ) : error ? (
              <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
                {error}
              </div>
            ) : serviceHistory.length === 0 ? (
              <div className="flex min-h-72 flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <p className="mt-5 text-xl font-semibold text-slate-950">No rental history yet</p>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Start your journey with your first vehicle booking and your activity will appear here automatically.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-[1.5rem] border border-slate-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr className="text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        <th className="px-5 py-4">Rental Date</th>
                        <th className="px-5 py-4">Vehicle</th>
                        <th className="px-5 py-4">Details</th>
                        <th className="px-5 py-4">Status</th>
                        <th className="px-5 py-4 text-right">Total Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {serviceHistory.map((service) => (
                        <tr key={service.id} className="transition hover:bg-slate-50/80">
                          <td className="px-5 py-4 text-sm font-medium text-slate-700">
                            {new Date(service.serviceDate).toLocaleDateString()}
                          </td>
                          <td className="px-5 py-4">
                            <div className="font-semibold text-slate-950">{service.vehicle}</div>
                          </td>
                          <td className="px-5 py-4 text-sm leading-6 text-slate-500">
                            {service.description}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyles(service.status)}`}>
                              {service.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right text-sm font-semibold text-slate-950">
                            ${service.cost.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
