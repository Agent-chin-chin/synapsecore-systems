'use client';
import { useEffect, useState } from 'react';

export default function RoleTable() {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRoles() {
      try {
        setLoading(true);
        const res = await fetch('/api/roles');
        if (!res.ok) throw new Error('Failed to fetch roles');
        const data = await res.json();
        setRoles(data.roles || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRoles();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (roles.length === 0) return <div>No roles found.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Role Name</th>
            <th className="px-4 py-2 border">Permissions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role._id}>
              <td className="px-4 py-2 border">{role.name}</td>
              <td className="px-4 py-2 border">{role.permissions?.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
