import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { OrganizationSummary, User } from '../types';
import { Trash2, Shield, Building, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';
import { useToast } from '../context/ToastContext';

interface OrgUser {
  username: string;
  organization: string;
  is_admin: boolean;
}

const Admin: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [orgs, setOrgs] = useState<OrgUser[]>([]);
  const [details, setDetails] = useState<Record<string, OrganizationSummary>>({});
  const [loading, setLoading] = useState(true);
  const [selectedOrgToDelete, setSelectedOrgToDelete] = useState<string | null>(null);

  // Protect route
  useEffect(() => {
    if (!user?.is_admin && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const fetchOrgs = async () => {
    try {
      const data = await api.get<OrgUser[]>('/admin/organizations');
      setOrgs(data);

      // Fetch details for each org to get counts
      // Note: In a real app with many orgs, we wouldn't fetch all details at once.
      // We would likely have the list endpoint return summary counts.
      // Based on provided backend, list returns users, details returns counts.
      const detailMap: Record<string, OrganizationSummary> = {};
      await Promise.all(data.map(async (u) => {
        if (!u.is_admin) { // Skip admin itself
          try {
            const det = await api.get<OrganizationSummary>(`/admin/organizations/${u.organization}`);
            detailMap[u.organization] = det;
          } catch (e) {
            console.error(`Failed to load details for ${u.organization}`);
          }
        }
      }));
      setDetails(detailMap);

    } catch (e) {
      console.error(e);
      alert("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.is_admin) {
      fetchOrgs();
    }
  }, [user]);

  const handleDeleteClick = (orgName: string) => {
    setSelectedOrgToDelete(orgName);
  };

  const activeDelete = async () => {
    if (!selectedOrgToDelete) return;

    try {
      await api.delete(`/admin/organizations/${selectedOrgToDelete}`);
      addToast(`Organization ${selectedOrgToDelete} deleted successfully`, 'success');
      fetchOrgs();
    } catch (e: any) {
      addToast(e.message || "Delete failed", 'error');
    } finally {
      setSelectedOrgToDelete(null);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading admin panel...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-2xl text-white shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
            <Shield className="w-8 h-8 text-brand-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">System Administration</h1>
            <p className="text-slate-400">Manage registered organizations and platform security.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Building className="w-5 h-5 text-slate-500" />
            Registered Organizations
          </h2>
          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
            Total: {orgs.filter(o => !o.is_admin).length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Organization</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Admin User</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Orders</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Deliveries</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orgs.filter(o => !o.is_admin).map((org) => {
                const detail = details[org.organization];
                return (
                  <tr key={org.organization} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{org.organization}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{org.username}</td>
                    <td className="px-6 py-4">
                      {detail ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                          {detail.orders_count}
                        </span>
                      ) : <span className="text-slate-300">-</span>}
                    </td>
                    <td className="px-6 py-4">
                      {detail ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                          {detail.deliveries_count}
                        </span>
                      ) : <span className="text-slate-300">-</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteClick(org.organization)}
                        className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition-all"
                        title="Delete Organization"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {orgs.filter(o => !o.is_admin).length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 flex flex-col items-center gap-2">
                    <AlertTriangle className="w-8 h-8 opacity-50" />
                    No organizations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


      <DeleteConfirmationModal
        isOpen={!!selectedOrgToDelete}
        onClose={() => setSelectedOrgToDelete(null)}
        onConfirm={activeDelete}
        orgName={selectedOrgToDelete || ''}
      />
    </div >
  );
};

export default Admin;