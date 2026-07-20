'use client';

import { useEffect, useState } from 'react';

interface UserTableUser {
  _id: string;
  fullname: string;
  email: string;
  phone?: string;
  role: string;
  status?: string;
  createdAt: string;
}

export default function UserTable() {
  const [users, setUsers] = useState<UserTableUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, itemsPerPage, searchText, selectedRole, selectedStatus]);

  async function fetchUsers() {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString()
      });

      if (searchText) {
        params.set('search', searchText);
      }
      if (selectedRole !== 'all') {
        params.set('role', selectedRole);
      }
      if (selectedStatus !== 'all') {
        params.set('status', selectedStatus);
      }

      const res = await fetch(`/api/users?${params.toString()}`);
      if (!res.ok) {
        throw new Error('Failed to fetch users');
      }
      const result = await res.json();
      setUsers(result.users);
      setTotalUsers(result.pagination.total);
      setTotalPages(result.pagination.pages);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateStatus(userId: string, status: string) {
    if (!window.confirm(`Are you sure you want to ${status} this learner?`)) {
      return;
    }

    try {
      setUpdatingUserId(userId);
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status })
      });
      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error || 'Failed to update user status');
      }
      await fetchUsers();
    } catch (err: any) {
      alert(err.message || 'Unable to update learner status');
    } finally {
      setUpdatingUserId(null);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-[90%] mb-2" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-md">
        <h3 className="font-medium mb-2">Error loading users</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">No users found</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            value={searchText}
            onChange={(e) => {
              setCurrentPage(1);
              setSearchText(e.target.value);
            }}
            placeholder="Search name or email"
            className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none sm:min-w-[250px]"
          />
          <select
            value={selectedRole}
            onChange={(e) => {
              setCurrentPage(1);
              setSelectedRole(e.target.value);
            }}
            className="rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">All roles</option>
            <option value="learner">Learner</option>
            <option value="client">Client</option>
            <option value="admin">Admin</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Support Engineer">Support Engineer</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => {
              setCurrentPage(1);
              setSelectedStatus(e.target.value);
            }}
            className="rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {totalUsers} users found
        </div>
      </div>

      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Full Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
            {users.map((user: any) => (
              <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {user._id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {user.fullname}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {user.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${user.role === 'Super Admin' ? 'bg-red-100 text-red-800' : 
                      user.role === 'Support Engineer' ? 'bg-blue-100 text-blue-800' : 
                      'bg-green-100 text-green-800'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${user.status === 'approved' ? 'bg-green-100 text-green-800' : user.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex flex-wrap gap-2">
                    {user.role === 'learner' && user.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(user._id, 'approved')}
                          disabled={updatingUserId === user._id}
                          className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(user._id, 'rejected')}
                          disabled={updatingUserId === user._id}
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    ) : null}
                    <button
                      onClick={() => {
                        const newRole = window.prompt('Enter new role (admin, client, learner, Super Admin, Support Engineer):', user.role);
                        if (!newRole) return;
                        handleUpdateStatus(user._id, newRole.trim());
                      }}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md text-sm transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        if (!window.confirm('Are you sure you want to delete this user?')) return;
                        try {
                          setUpdatingUserId(user._id);
                          const response = await fetch(`/api/users?userId=${user._id}`, {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                          });
                          if (!response.ok) {
                            const body = await response.json();
                            throw new Error(body.error || 'Failed to delete user');
                          }
                          await fetchUsers();
                        } catch (err: any) {
                          alert(err.message || 'Unable to delete user');
                        } finally {
                          setUpdatingUserId(null);
                        }
                      }}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing {totalUsers === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalUsers)} of {totalUsers} users
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}