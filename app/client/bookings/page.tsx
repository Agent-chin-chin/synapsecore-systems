'use client'
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Booking {
  _id: string;
  serviceType: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
  assignedTo?: { fullname: string; email: string };
}

export default function ClientBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ serviceType: '', description: '', priority: 'medium' });
  const [submitting, setSubmitting] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/client/bookings', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch bookings');
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/client/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to create booking');

      setFormData({ serviceType: '', description: '', priority: 'medium' });
      setShowForm(false);
      await fetchBookings();
    } catch (err: any) {
      setError(err.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="mt-1 text-sm text-gray-500">View and manage your service bookings</p>
        </div>
        <motion.button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          New Booking
        </motion.button>
      </motion.div>

      {showForm && (
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg p-6 border border-gray-200 space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
            <select
              value={formData.serviceType}
              onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              required
            >
              <option value="">Select service</option>
              <option value="bug-fixing">Bug Fixing</option>
              <option value="malware-removal">Malware Removal</option>
              <option value="website-recovery">Website Recovery</option>
              <option value="wordpress">WordPress Security</option>
              <option value="payment-gateway">Payment Gateway Issues</option>
              <option value="server-security">Server Security</option>
              <option value="database-repair">Database Repair</option>
              <option value="emergency-support">Emergency Support</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div className="flex gap-3">
            <motion.button type="submit" disabled={submitting} className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {submitting ? 'Creating...' : 'Create Booking'}
            </motion.button>
            <motion.button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Cancel
            </motion.button>
          </div>
        </motion.form>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No bookings yet. Create your first booking to get started.
        </div>
      ) : (
        <motion.div
          className="bg-white rounded-lg border border-gray-200 overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.map((booking, index) => (
                <motion.tr
                  key={booking._id}
                  className="hover:bg-gray-50"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * index }}
                  whileHover={{ scale: 1.01 }}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{booking.serviceType}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{booking.description}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 capitalize">{booking.priority}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[booking.status] || 'bg-gray-100 text-gray-800'}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(booking.createdAt).toLocaleDateString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </motion.div>
  );
}
