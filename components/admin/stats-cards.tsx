interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

interface StatsCardsProps {
  stats: {
    totalUsers?: number;
    totalMessages?: number;
    totalBookings: number;
    pendingBookings: number;
    completedBookings: number;
    totalRevenue: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  // Fallback object to prevent undefined errors
  const safeStats = stats || {
    totalUsers: 0,
    totalMessages: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-start justify-between">
          <div className="flex-shrink-0 h-10 w-10 text-blue-600 dark:text-blue-400">
            👥
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Users
            </h3>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
              {safeStats?.totalUsers || 0}
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-start justify-between">
          <div className="flex-shrink-0 h-10 w-10 text-blue-600 dark:text-blue-400">
            📋
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Incidents
            </h3>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
              {safeStats?.totalBookings || 0}
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-start justify-between">
          <div className="flex-shrink-0 h-10 w-10 text-yellow-600 dark:text-yellow-400">
            ⏳
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Pending Incidents
            </h3>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
              {safeStats?.pendingBookings || 0}
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-start justify-between">
          <div className="flex-shrink-0 h-10 w-10 text-green-600 dark:text-green-400">
            ✅
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Resolved Incidents
            </h3>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
              {safeStats?.completedBookings || 0}
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-start justify-between">
          <div className="flex-shrink-0 h-10 w-10 text-purple-600 dark:text-purple-400">
            💬
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Support Tickets
            </h3>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
              {safeStats?.totalMessages || 0}
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-start justify-between">
          <div className="flex-shrink-0 h-10 w-10 text-indigo-600 dark:text-indigo-400">
            💰
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Revenue
            </h3>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
              ${(safeStats?.totalRevenue || 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}