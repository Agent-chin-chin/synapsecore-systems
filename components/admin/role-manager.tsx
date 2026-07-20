'use client';

import { FormEvent, useEffect, useState } from 'react';

type Role = {
  _id: string;
  name: string;
  permissions: string[];
};

export default function RoleManager() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [permissions, setPermissions] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  async function fetchRoles() {
    try {
      setLoading(true);
      const res = await fetch('/api/roles');
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body?.error || 'Failed to load roles');
      }
      const data = await res.json();
      setRoles(data.roles || []);
    } catch (err: any) {
      setError(err.message || 'Unable to fetch roles');
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setName('');
    setPermissions('');
    setSelectedRoleId(null);
  }

  async function handleSaveRole(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Role name is required');
      return;
    }

    const permissionList = permissions
      .split(',')
      .map((permission) => permission.trim())
      .filter(Boolean);

    if (permissionList.length === 0) {
      setError('At least one permission is required');
      return;
    }

    setSaving(true);

    try {
      const payload = { name: name.trim(), permissions: permissionList };
      const url = '/api/roles';
      const res = await fetch(url, {
        method: selectedRoleId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedRoleId ? { roleId: selectedRoleId, ...payload } : payload)
      });

      const body = await res.json();
      if (!res.ok) {
        throw new Error(body?.error || 'Unable to save role');
      }

      resetForm();
      fetchRoles();
    } catch (err: any) {
      setError(err.message || 'Failed to save role');
    } finally {
      setSaving(false);
    }
  }

  async function handleEditRole(role: Role) {
    setSelectedRoleId(role._id);
    setName(role.name);
    setPermissions(role.permissions?.join(', ') || '');
  }

  async function handleDelete(roleId: string) {
    if (!window.confirm('Delete this role? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/roles?roleId=${encodeURIComponent(roleId)}`, {
        method: 'DELETE'
      });
      const body = await res.json();
      if (!res.ok) {
        throw new Error(body?.error || 'Unable to delete role');
      }
      fetchRoles();
    } catch (err: any) {
      setError(err.message || 'Failed to delete role');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading role management...</div>;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-white mb-3">Create / Edit Role</h2>
        <p className="text-sm text-slate-400 mb-6">Define role names and comma-separated permissions for admin access control.</p>

        {error && <div className="mb-4 rounded-xl bg-red-900/70 px-4 py-3 text-red-100">{error}</div>}

        <form onSubmit={handleSaveRole} className="grid gap-4">
          <div>
            <label htmlFor="roleName" className="block text-sm font-medium text-slate-200 mb-2">Role name</label>
            <input
              id="roleName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
              placeholder="Support Engineer"
            />
          </div>

          <div>
            <label htmlFor="permissions" className="block text-sm font-medium text-slate-200 mb-2">Permissions</label>
            <input
              id="permissions"
              value={permissions}
              onChange={(e) => setPermissions(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
              placeholder="manage_users, view_reports, export_data"
            />
            <p className="mt-2 text-sm text-slate-500">Separate multiple permissions with commas.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-60"
            >
              {saving ? 'Saving...' : selectedRoleId ? 'Update Role' : 'Create Role'}
            </button>
            {selectedRoleId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 px-6 py-3 text-sm text-slate-200 transition hover:border-slate-500"
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Existing Roles</h2>
            <p className="text-sm text-slate-400">Manage roles with permissions and delete roles you no longer need.</p>
          </div>
          <div className="text-sm text-slate-500">{roles.length} roles</div>
        </div>

        {roles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-6 text-slate-500">No roles found yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700 text-left text-sm text-slate-200">
              <thead className="bg-slate-900">
                <tr>
                  <th className="px-4 py-3">Role name</th>
                  <th className="px-4 py-3">Permissions</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950">
                {roles.map((role) => (
                  <tr key={role._id} className="hover:bg-slate-900/50">
                    <td className="px-4 py-3 font-medium text-white">{role.name}</td>
                    <td className="px-4 py-3 text-slate-300">{role.permissions?.join(', ')}</td>
                    <td className="px-4 py-3 space-x-2">
                      <button
                        type="button"
                        onClick={() => handleEditRole(role)}
                        className="rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-blue-400"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(role._id)}
                        className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-red-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
