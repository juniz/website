import { twMerge } from 'tailwind-merge';

const colors = {
  Pending:   'bg-amber-50 text-amber-600 border-amber-100',
  Confirmed: 'bg-blue-50 text-blue-600 border-blue-100',
  Done:      'bg-emerald-50 text-emerald-600 border-emerald-100',
  Cancelled: 'bg-red-50 text-red-600 border-red-100',
};

export default function StatusBadge({ status, className }) {
  const colorClass = colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  
  return (
    <span className={twMerge(
      'px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
      colorClass,
      className
    )}>
      {status}
    </span>
  );
}
