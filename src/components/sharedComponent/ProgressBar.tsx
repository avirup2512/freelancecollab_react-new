import { Progress } from '../ui/_progress';

interface ProgressBarProps {
  value: number;
  total: number;
}

export function ProgressBar({ value, total }: ProgressBarProps) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  
  return (
    <div className="flex items-center gap-3 w-full">
      <Progress value={percentage} className="flex-1 h-2" />
      <span className="text-sm text-gray-600 min-w-[40px]">
        {value}/{total}
      </span>
    </div>
  );
}