"use client";

interface Props {
  completed: number;
  total: number;
}

export default function ProgressBar({ completed, total }: Props) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 text-sm text-gray-300">
        <div>Progress</div>
        <div>{pct}%</div>
      </div>
      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        <div className="h-2 bg-green-400" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
