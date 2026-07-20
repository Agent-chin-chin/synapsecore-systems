'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface BookingTableBooking {
  _id: string;
  userId?: {
    fullname?: string;
    email?: string;
  };
  description?: string;
  serviceType?: string;
  status?: string;
  priority?: string;
  createdAt?: string;
}

export default function BookingTable() {
  const [bookings, setBookings] = useState<BookingTableBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [currentPage, itemsPerPage, filter]);

  async function fetchBookings() {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });
      if (filter !== 'all') {
        params.append('status', filter);
      }
      
      const res = await fetch(`/api/incidents?${params.toString()}`);
      if (!res.ok) {
        throw new Error('Failed to fetch incidents');
      }
      const result = await res.json();
      setBookings(result.incidents || []);
      const total = result.incidents?.length || 0;
      setTotalPages(Math.max(1, Math.ceil(total / itemsPerPage)));
    } catch (err: any) {
      setError(err.message || 'Failed to load incidents');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-sky-100 text-sky-800';
      case 'investigating':
        return 'bg-violet-100 text-violet-800';
      case 'assigned':
        return 'bg-cyan-100 text-cyan-800';
      case 'resolved':
      case 'closed':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-md">
        <h3 className="font-medium mb-2">Error loading incidents</h3>
        <p>{error}</p>
        <button
          onClick={() => fetchBookings()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const filteredBookings = bookings.filter((booking: any) => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        booking.userId?.fullname?.toLowerCase().includes(searchLower) ||
        booking.userId?.email?.toLowerCase().includes(searchLower) ||
        booking.description?.toLowerCase().includes(searchLower) ||
        booking.serviceType?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const paginatedBookings = filteredBookings.slice(0, itemsPerPage);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search incidents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="investigating">Investigating</option>
            <option value="assigned">Assigned</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Incident Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
            {paginatedBookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  No incidents found
                </td>
              </tr>
            ) : (
              paginatedBookings.map((booking: any) => (
                <tr key={booking._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {booking._id?.slice(-8)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {booking.userId?.fullname || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {booking.userId?.email || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {booking.serviceType?.replace(/-/g, ' ')?.replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                      {booking.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityBadge(booking.priority)}`}>
                      {booking.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(booking.status)}`}>
                      {(booking.status || 'unknown').replace(/-/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(booking.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link
                      href={`/admin/incidents/${booking._id}`}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md text-sm transition-colors"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Info */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <div>
          Showing {Math.min(filteredBookings.length, itemsPerPage)} of {filteredBookings.length} incidents
          {filter !== 'all' && ` (filtered from ${bookings.length} total)`}
        </div>
      </div>
    </div>
  );
}
