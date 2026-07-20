const Booking = require('../lib/models/Booking');
const connectDB = require('../lib/mongoose');

async function getBookings(options = {}) {
  await connectDB();
  const page = parseInt(options.page, 10) || 1;
  const limit = parseInt(options.limit, 10) || 10;
  const skip = (page - 1) * limit;
  const filter = {};
  if (options.userId) filter.userId = options.userId;
  if (options.status) filter.status = options.status;
  if (options.serviceType) filter.serviceType = options.serviceType;
  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Booking.countDocuments(filter)
  ]);
  return {
    bookings,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
}

module.exports = { getBookings };
