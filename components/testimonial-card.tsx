interface TestimonialCardProps {
  name: string;
  position: string;
  company: string;
  rating: number;
  comment: string;
  avatar: string;
}

export default function TestimonialCard({ 
  name, 
  position, 
  company, 
  rating, 
  comment, 
  avatar 
}: TestimonialCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-start space-x-4 mb-4">
        <div className="flex-shrink-0">
          <img 
            src={avatar} 
            alt={`${name}'s avatar`} 
            className="h-12 w-12 rounded-full object-cover"
          />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
            {name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {position} at {company}
          </p>
          <div className="text-yellow-400 dark:text-yellow-300 mb-2">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-xs">
                {i < rating ? "★" : "☆"}
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-300 italic">
        "{comment}"
      </p>
    </div>
  );
}