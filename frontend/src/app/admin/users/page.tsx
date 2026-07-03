'use client';

import { useState } from 'react';
import { useAdminUsers } from '@/hooks/useCms';
import { Search, Users, Shield, Building, User, Mail, Phone, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useAdminUsers();

  const users = data || [];
  const filtered = users.filter((u: any) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.companyName && u.companyName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-bold text-slate-800 uppercase tracking-wide">User Directory</h1>
          <p className="text-slate-500 text-xs mt-0.5 font-semibold">Manage registered global buyers, trade agents, and managers</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
          <input type="text" placeholder="Search by name, email, or company..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary/40 border border-slate-200 shadow-sm" />
        </div>
      </div>

      <div className="glass rounded-3xl border border-slate-100 overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-slate-600 font-bold uppercase tracking-wider px-5 py-3.5">User</th>
                <th className="text-slate-600 font-bold uppercase tracking-wider px-5 py-3.5">Role</th>
                <th className="text-slate-600 font-bold uppercase tracking-wider px-5 py-3.5">Account Type</th>
                <th className="text-slate-600 font-bold uppercase tracking-wider px-5 py-3.5">Company Details</th>
                <th className="text-slate-600 font-bold uppercase tracking-wider px-5 py-3.5">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-5 py-4"><div className="h-4 bg-slate-100 rounded" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center space-y-2">
                    <Users className="mx-auto text-slate-500" size={32} />
                    <p className="text-slate-600 font-bold uppercase">No users registered</p>
                  </td>
                </tr>
              ) : (
                filtered.map((user: any) => (
                  <tr key={user.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-primary font-bold text-[10px] shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{user.name}</p>
                          <p className="text-[10px] text-slate-600 mt-0.5 flex items-center gap-1"><Mail size={10} /> {user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full font-bold border capitalize ${
                        user.role === 'admin'
                          ? 'bg-rose-50 text-rose-600 border-rose-100'
                          : user.role === 'manager'
                          ? 'bg-amber-50 text-amber-600 border-amber-100'
                          : 'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                        <Shield size={9} /> {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full font-bold border capitalize ${
                        user.userType === 'company'
                          ? 'bg-purple-50 text-purple-600 border-purple-100'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>
                        {user.userType === 'company' ? <Building size={9} /> : <User size={9} />}
                        {user.userType}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {user.companyName ? (
                        <div>
                          <p className="font-bold text-slate-800">{user.companyName}</p>
                          {user.phone && <p className="text-[10px] text-slate-600 mt-0.5 flex items-center gap-1"><Phone size={10} /> {user.phone}</p>}
                        </div>
                      ) : (
                        user.phone || '—'
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-600 font-bold tracking-wide text-[10px] flex items-center gap-1 mt-1.5"><Calendar size={10} /> {formatDate(user.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
