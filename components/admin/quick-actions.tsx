export default function QuickActions() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Quick Actions
        </h3>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 p-6">
        <a href="/admin/bookings" className="group">
          <div className="flex flex-col items-center justify-center h-16 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="flex-shrink-0 h-8 w-8 text-blue-600 dark:text-blue-400 mb-2">
              📋
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Manage Incidents
            </p>
          </div>
        </a>
        
        <a href="/admin/users" className="group">
          <div className="flex flex-col items-center justify-center h-16 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="flex-shrink-0 h-8 w-8 text-green-600 dark:text-green-400 mb-2">
              👥
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Manage Users
            </p>
          </div>
        </a>
        
        <a href="/admin/reports" className="group">
          <div className="flex flex-col items-center justify-center h-16 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="flex-shrink-0 h-8 w-8 text-purple-600 dark:text-purple-400 mb-2">
              📊
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              View Reports
            </p>
          </div>
        </a>
        
        <a href="/admin/settings" className="group">
          <div className="flex flex-col items-center justify-center h-16 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="flex-shrink-0 h-8 w-8 text-gray-600 dark:text-gray-400 mb-2">
              ⚙️
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Settings
            </p>
          </div>
        </a>
      </div>
    </div>
  );
}