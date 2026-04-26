'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { vehicleService, VehicleResponse, VehicleRequest } from '@/services/vehicleService';

const EMPTY: VehicleRequest = {
  make: '', brand: '', model: '', year: new Date().getFullYear(),
  plateNumber: '', dailyRate: 0, mileage: 0, color: '', imageUrl: '', description: '',
};

export default function AdminVehiclesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editVehicle, setEditVehicle] = useState<VehicleResponse | null>(null);
  const [form, setForm] = useState<VehicleRequest>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState<VehicleRequest>(EMPTY);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) router.push('/');
  }, [user, authLoading, router]);

  useEffect(() => { if (user?.role === 'ADMIN') load(); }, [user]);

  async function load() {
    setLoading(true);
    try {
      const res = await vehicleService.getAllVehicles('', 0, 200);
      setVehicles(res.dataList);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 3000); }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await vehicleService.deleteVehicle(deleteId);
      setVehicles((v) => v.filter((x) => x.id !== deleteId));
      showToast('Vehicle deleted successfully.');
    } catch { showToast('Delete failed. Please try again.'); }
    setDeleteId(null);
  }

  function openEdit(v: VehicleResponse) {
    setEditVehicle(v);
    setForm({
      make: v.make, brand: v.brand, model: v.model, year: v.year,
      plateNumber: v.plateNumber, dailyRate: v.dailyRate, mileage: v.mileage,
      color: v.color, imageUrl: v.imageUrl, description: v.description
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editVehicle) return;
    setSaving(true);
    try {
      await vehicleService.updateVehicle(editVehicle.id, form);
      await load();
      setEditVehicle(null);
      showToast('Vehicle updated successfully.');
    } catch { showToast('Update failed. Please try again.'); }
    setSaving(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      await vehicleService.createVehicle(createForm);
      await load();
      setShowCreate(false);
      setCreateForm(EMPTY);
      showToast('Vehicle created successfully.');
    } catch { showToast('Create failed. Please try again.'); }
    setCreating(false);
  }

  const filtered = vehicles.filter((v) =>
    `${v.make} ${v.model} ${v.plateNumber} ${v.brand}`.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading || loading) return (
    <div className="flex h-64 items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        <span className="text-sm text-slate-500">Loading vehicles...</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-6 right-6 z-50 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Vehicles</h2>
          <p className="text-sm text-slate-500 mt-1">{filtered.length} of {vehicles.length} vehicles</p>
        </div>
        <button
          onClick={() => { setCreateForm(EMPTY); setShowCreate(true); }}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 transition">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Vehicle
        </button>
      </div>

      <div className="relative">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by make, model, brand or plate..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Vehicle', 'Plate', 'Year', 'Color', 'Daily Rate', 'Mileage', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((v) => (
              <tr key={v.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {v.imageUrl ? (
                      <img src={v.imageUrl} alt={v.make} className="h-10 w-16 rounded-lg object-cover border border-slate-200 shrink-0" />
                    ) : (
                      <div className="h-10 w-16 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                        <svg className="h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-slate-900">{v.make} {v.model}</p>
                      <p className="text-xs text-slate-400">{v.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3"><span className="font-mono text-xs font-semibold bg-slate-100 text-slate-700 px-2 py-1 rounded-lg">{v.plateNumber}</span></td>
                <td className="px-4 py-3 text-slate-600">{v.year}</td>
                <td className="px-4 py-3 text-slate-600 capitalize">{v.color}</td>
                <td className="px-4 py-3 font-bold text-blue-700">${v.dailyRate}<span className="text-xs font-normal text-slate-400">/day</span></td>
                <td className="px-4 py-3 text-slate-600">{v.mileage?.toLocaleString()} km</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(v)}
                      className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition">Edit</button>
                    <button onClick={() => setDeleteId(v.id)}
                      className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-400 text-sm">No vehicles found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Delete Vehicle?</h3>
            <p className="text-sm text-slate-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition">Delete</button>
              <button onClick={() => setDeleteId(null)} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl my-4">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h3 className="text-lg font-bold text-slate-900">Edit — {editVehicle.make} {editVehicle.model}</h3>
              <button onClick={() => setEditVehicle(null)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 grid grid-cols-2 gap-4">
              {([
                ['make', 'Make', 'text'], ['brand', 'Brand', 'text'], ['model', 'Model', 'text'],
                ['year', 'Year', 'number'], ['plateNumber', 'Plate Number', 'text'], ['color', 'Color', 'text'],
                ['dailyRate', 'Daily Rate ($)', 'number'], ['mileage', 'Mileage (km)', 'number'],
                ['imageUrl', 'Image URL', 'text'],
              ] as [keyof VehicleRequest, string, string][]).map(([key, label, type]) => (
                <div key={key} className={key === 'imageUrl' ? 'col-span-2' : ''}>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
                  <input type={type} value={(form as any)[key]}
                    onChange={(e) => setForm({ ...form, [key]: type === 'number' ? Number(e.target.value) : e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
              ))}
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                <textarea value={form.description} rows={2} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none" />
              </div>
              <div className="col-span-2 flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60 transition">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={() => setEditVehicle(null)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl my-4">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Add New Vehicle</h3>
                <p className="text-xs text-slate-400 mt-0.5">Fill in the details to add a vehicle to the fleet</p>
              </div>
              <button onClick={() => setShowCreate(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 grid grid-cols-2 gap-4">
              {([
                ['make', 'Make', 'text'], ['brand', 'Brand', 'text'], ['model', 'Model', 'text'],
                ['year', 'Year', 'number'], ['plateNumber', 'Plate Number', 'text'], ['color', 'Color', 'text'],
                ['dailyRate', 'Daily Rate ($)', 'number'], ['mileage', 'Mileage (km)', 'number'],
                ['imageUrl', 'Image URL', 'text'],
              ] as [keyof VehicleRequest, string, string][]).map(([key, label, type]) => (
                <div key={key} className={key === 'imageUrl' ? 'col-span-2' : ''}>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
                  <input type={type} value={(createForm as any)[key]} required={key !== 'imageUrl'}
                    onChange={(e) => setCreateForm({ ...createForm, [key]: type === 'number' ? Number(e.target.value) : e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
              ))}
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                <textarea value={createForm.description} rows={2}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none" />
              </div>
              <div className="col-span-2 flex gap-3 pt-2">
                <button type="submit" disabled={creating}
                  className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60 transition">
                  {creating ? 'Creating...' : 'Create Vehicle'}
                </button>
                <button type="button" onClick={() => setShowCreate(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}