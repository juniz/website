import Link from 'next/link';

export default function PageHeader({ title, breadcrumbs = [], action }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
            {breadcrumbs.map((bc, index) => (
              <div key={`${bc.href}-${index}`} className="flex items-center gap-2">
                <Link href={bc.href} className="hover:text-azure-primary transition-colors">
                  {bc.label}
                </Link>
                {index < breadcrumbs.length - 1 && <span>/</span>}
              </div>
            ))}
          </nav>
        )}
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
      </div>
      
      {action && (
        <div className="flex shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}
