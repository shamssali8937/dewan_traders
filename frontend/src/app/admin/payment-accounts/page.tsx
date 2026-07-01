'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Edit, Plus, Trash2, CheckCircle2, XCircle, Clock, Check, X, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPaymentAccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [form, setForm] = useState({
    type: 'bank',
    bankName: '',
    accountTitle: '',
    accountNumber: '',
    iban: '',
    branch: '',
    isActive: true,
  });

  const loadAccounts = async () => {
    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
    try {
      const res = await fetch(`${apiUrl}/payment-accounts`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setAccounts(data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load payment accounts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleEditClick = (acc: any) => {
    setEditingId(acc.id);
    setForm({
      type: acc.type,
      bankName: acc.bankName || '',
      accountTitle: acc.accountTitle || '',
      accountNumber: acc.accountNumber || '',
      iban: acc.iban || '',
      branch: acc.branch || '',
      isActive: acc.isActive,
    });
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingId(null);
    setForm({
      type: 'bank',
      bankName: '',
      accountTitle: '',
      accountNumber: '',
      iban: '',
      branch: '',
      isActive: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.accountTitle || !form.accountNumber) {
      toast.error('Account title and account number are required.');
      return;
    }
    if (form.type === 'bank' && !form.bankName) {
      toast.error('Bank name is required for bank transfer method.');
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${apiUrl}/payment-accounts/${editingId}` : `${apiUrl}/payment-accounts`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        toast.success(editingId ? 'Payment method updated successfully!' : 'Payment method created successfully!');
        handleCancel();
        loadAccounts();
      } else {
        toast.error(data.message || 'Action failed.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to save payment account details.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this payment account?')) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
    try {
      const res = await fetch(`${apiUrl}/payment-accounts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`
        }
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Payment account deleted.');
        loadAccounts();
      } else {
        toast.error(data.message || 'Deletion failed.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete payment account.');
    }
  };

  const handleToggleActive = async (acc: any) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
    try {
      const res = await fetch(`${apiUrl}/payment-accounts/${acc.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`
        },
        body: JSON.stringify({
          ...acc,
          isActive: !acc.isActive
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Account status set to: ${!acc.isActive ? 'Active' : 'Inactive'}`);
        loadAccounts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 uppercase tracking-wide">Payment Accounts Manager</h1>
          <p className="text-slate-500 text-xs mt-0.5 font-semibold">Manage transaction bank and mobile wallet details shown to customers during checkout.</p>
        </div>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-primary/10"
          >
            <Plus size={14} /> Add Payment Method
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Form Container */}
        {showAddForm && (
          <div className="lg:col-span-1 bg-white border border-slate-100 rounded-3xl p-6 shadow-md space-y-5">
            <h3 className="text-slate-800 font-bold text-xs uppercase tracking-wider">
              {editingId ? 'Edit Payment Method' : 'New Payment Method'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
              <div>
                <label className="text-[9px] text-slate-400 uppercase tracking-wider mb-1 block">Account Type *</label>
                <select
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none"
                >
                  <option value="bank">Bank Transfer</option>
                  <option value="easypaisa">EasyPaisa</option>
                  <option value="jazzcash">JazzCash</option>
                </select>
              </div>

              {form.type === 'bank' && (
                <div>
                  <label className="text-[9px] text-slate-400 uppercase tracking-wider mb-1 block">Bank Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Meezan Bank, HBL"
                    value={form.bankName}
                    onChange={e => setForm({ ...form, bankName: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none"
                    required
                  />
                </div>
              )}

              <div>
                <label className="text-[9px] text-slate-400 uppercase tracking-wider mb-1 block">Account Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Sajjad Hussain Awan"
                  value={form.accountTitle}
                  onChange={e => setForm({ ...form, accountTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[9px] text-slate-400 uppercase tracking-wider mb-1 block">Account / Mobile Number *</label>
                <input
                  type="text"
                  placeholder="Account Number or Phone Number"
                  value={form.accountNumber}
                  onChange={e => setForm({ ...form, accountNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none"
                  required
                />
              </div>

              {form.type === 'bank' && (
                <>
                  <div>
                    <label className="text-[9px] text-slate-400 uppercase tracking-wider mb-1 block">IBAN Number</label>
                    <input
                      type="text"
                      placeholder="PKXX..."
                      value={form.iban}
                      onChange={e => setForm({ ...form, iban: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-400 uppercase tracking-wider mb-1 block">Branch Details</label>
                    <input
                      type="text"
                      placeholder="e.g. Sargodha Main Branch (099)"
                      value={form.branch}
                      onChange={e => setForm({ ...form, branch: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={e => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-primary focus:ring-primary"
                />
                <label htmlFor="isActive" className="text-slate-600 cursor-pointer select-none">Active / Show to Customers</label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-center font-bold uppercase"
                >
                  Save Account
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2.5 border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 font-bold uppercase"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Accounts List Grid */}
        <div className={showAddForm ? 'lg:col-span-2 space-y-4' : 'lg:col-span-3 space-y-4'}>
          {loading ? (
            <div className="h-40 bg-white border rounded-3xl animate-pulse" />
          ) : accounts.length === 0 ? (
            <div className="bg-white border rounded-3xl p-16 text-center text-slate-400 space-y-2">
              <CreditCard className="mx-auto text-slate-200" size={40} />
              <p className="text-xs font-bold uppercase">No billing credentials setup yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accounts.map(acc => (
                <div key={acc.id} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center pb-2.5 border-b border-slate-50">
                    <div>
                      <span className="text-xs font-bold text-slate-800">{acc.bankName || 'Mobile Account'}</span>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-sky-100 text-sky-700 font-bold capitalize ml-2">{acc.type}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleActive(acc)}
                        className={`p-1 rounded ${acc.isActive ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-300 hover:bg-slate-50'}`}
                        title={acc.isActive ? 'Active' : 'Inactive'}
                      >
                        {acc.isActive ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                      </button>
                      <button
                        onClick={() => handleEditClick(acc)}
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(acc.id)}
                        className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="text-[11px] font-semibold text-slate-600 grid grid-cols-1 sm:grid-cols-2 gap-2 leading-relaxed">
                    <div>
                      <span className="text-[9px] text-slate-400 block">Account Title</span>
                      <span className="text-slate-800">{acc.accountTitle}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block">Account/Wallet No</span>
                      <span className="text-slate-800">{acc.accountNumber}</span>
                    </div>
                    {acc.iban && (
                      <div className="sm:col-span-2">
                        <span className="text-[9px] text-slate-400 block">IBAN Code</span>
                        <span className="font-mono text-slate-800">{acc.iban}</span>
                      </div>
                    )}
                    {acc.branch && (
                      <div className="sm:col-span-2">
                        <span className="text-[9px] text-slate-400 block">Branch Details</span>
                        <span className="text-slate-700">{acc.branch}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
