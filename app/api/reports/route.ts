import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authenticateAPI, requireRole } from '@/lib/apiAuth';
import connectDB from '@/lib/mongoose';
import Booking from '@/lib/models/Booking';
import User from '@/lib/models/User';
import Payment from '@/lib/models/Payment';

// Helper function to format date for report filenames
function getReportDateString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0]; // YYYY-MM-DD
}

// GET: Generate various reports based on query parameters
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Authenticate user
    const user = authenticateAPI(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user has admin role
    if (!requireRole(user, 'admin', 'Super Admin', 'Support Engineer')) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type') || 'summary';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Build date filter if provided
    const dateFilter: any = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);
    const hasDateFilter = Object.keys(dateFilter).length > 0;
    
    switch (reportType) {
      case 'summary':
        return await generateSummaryReport(hasDateFilter ? { createdAt: dateFilter } : {});
      
      case 'bookings':
        return await generateBookingsReport(hasDateFilter ? { createdAt: dateFilter } : {});
      
      case 'revenue':
        return await generateRevenueReport(hasDateFilter ? { createdAt: dateFilter } : {});
      
      case 'user-activity':
        return await generateUserActivityReport(hasDateFilter ? { createdAt: dateFilter } : {});
      
      default:
        return NextResponse.json(
          { error: 'Invalid report type. Supported types: summary, bookings, revenue, user-activity' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Generate summary report
async function generateSummaryReport(matchCriteria: any) {
  const [totalBookings, totalUsers, totalRevenue, pendingBookings] = await Promise.all([
    Booking.countDocuments(matchCriteria),
    User.countDocuments({}),
    Payment.aggregate([
      { $match: { ...matchCriteria, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } }}
    ]).then(result => result[0]?.total || 0),
    Booking.countDocuments({ ...matchCriteria, status: 'pending' })
  ]);
  
  const bookingsByStatus = await Booking.aggregate([
    { $match: matchCriteria },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  
  const bookingsByService = await Booking.aggregate([
    { $match: matchCriteria },
    { $group: { _id: '$serviceType', count: { $sum: 1 } } }
  ]);
  
  return NextResponse.json({
    reportType: 'summary',
    generatedAt: new Date().toISOString(),
    dateRange: matchCriteria.createdAt ? { start: matchCriteria.createdAt.$gte, end: matchCriteria.createdAt.$lte } : undefined,
    data: {
      totals: {
        bookings: totalBookings,
        users: totalUsers,
        revenue: totalRevenue,
        pendingBookings: pendingBookings
      },
      bookingsByStatus: Object.fromEntries(bookingsByStatus.map(item => [item._id, item.count])),
      bookingsByService: Object.fromEntries(bookingsByService.map(item => [item._id, item.count]))
    }
  }, { status: 200 });
}

// Generate bookings report
async function generateBookingsReport(matchCriteria: any) {
  const bookings = await Booking.find(matchCriteria)
    .populate('userId', 'fullname email')
    .sort({ createdAt: -1 });
  
  return NextResponse.json({
    reportType: 'bookings',
    generatedAt: new Date().toISOString(),
    dateRange: matchCriteria.createdAt ? { start: matchCriteria.createdAt.$gte, end: matchCriteria.createdAt.$lte } : undefined,
    count: bookings.length,
    data: bookings
  }, { status: 200 });
}

// Generate revenue report
async function generateRevenueReport(matchCriteria: any) {
  const payments = await Payment.find({ 
    ...matchCriteria, 
    status: 'completed' 
  })
  .populate('userId', 'fullname email')
  .populate('bookingId', 'serviceType')
  .sort({ createdAt: -1 });
  
  const dailyRevenue = await Payment.aggregate([
    { $match: { ...matchCriteria, status: 'completed' } },
    { 
      $group: { 
        _id: { 
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } 
        }, 
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      } 
    },
    { $sort: { _id: 1 } }
  ]);
  
  return NextResponse.json({
    reportType: 'revenue',
    generatedAt: new Date().toISOString(),
    dateRange: matchCriteria.createdAt ? { start: matchCriteria.createdAt.$gte, end: matchCriteria.createdAt.$lte } : undefined,
    data: {
      payments: payments,
      dailyRevenue: dailyRevenue,
      totalRevenue: payments.reduce((sum, p) => sum + p.amount, 0)
    }
  }, { status: 200 });
}

// Generate user activity report
async function generateUserActivityReport(matchCriteria: any) {
  // Get users with their booking counts and last activity
  const userActivity = await User.aggregate([
    {
      $lookup: {
        from: 'bookings',
        let: { userId: '$_id' },
        pipeline: matchCriteria.createdAt ? 
          [{ $match: { $and: [matchCriteria, { userId: '$$userId' }] } }] :
          [{ $match: { userId: '$$userId' } }],
        as: 'bookings'
      }
    },
    {
      $addFields: {
        bookingCount: { $size: '$bookings' },
        lastBookingDate: { 
         $arrayElemAt: [ 
           { 
             $sortArray: { 
               input: '$bookings', 
               sortBy: { createdAt: -1 } 
             } 
           }, 
           0 
         ] 
       }
      }
    },
    {
      $project: {
        password: 0, // Exclude password
        bookings: 0    // Exclude bookings array for cleaner output
      }
    },
    { $sort: { bookingCount: -1 } }
  ]);
  
  return NextResponse.json({
    reportType: 'user-activity',
    generatedAt: new Date().toISOString(),
    dateRange: matchCriteria.createdAt ? { start: matchCriteria.createdAt.$gte, end: matchCriteria.createdAt.$lte } : undefined,
    count: userActivity.length,
    data: userActivity
  }, { status: 200 });
}