import { cn } from '@/lib/utils';
import { ProjectType } from '@/types';
import { Check, Hourglass } from 'lucide-react';

const PortfolioCard = ({
  title,
  client,
  contact,
  description,
  status,
}: ProjectType) => {
  return (
    <div
      className={cn(
        'p-4 rounded-md border border-slate-200 hover:-translate-y-1 transition-all duration-200 ease-in-out flex flex-col justify-between',
        status === 'delivered' ? 'bg-sky-50 border-sky-400' : 'bg-slate-50',
        'h-[280px]'
      )}
    >
      <div className="flex flex-col space-y-2">
        <h3
          className="text-2xl font-semibold tracking-tight text-slate-900 mb-1 line-clamp-2"
          title={title}
        >
          {title}
        </h3>
        <p className="text-sm text-slate-800 line-clamp-4" title={description}>
          {description}
        </p>
      </div>

      <div className="flex flex-col space-y-1 mt-4">
        <p className="text-sm text-slate-800 flex gap-2">
          <strong className="text-slate-900">Client: </strong>
          <span className="truncate block">{client}</span>
        </p>
        <p className="flex items-center text-sm text-slate-800">
          <strong className="text-slate-900 mr-1">Status:</strong>
          {status === 'delivered' ? (
            <Check className="mr-1 text-green-500" size={16} />
          ) : (
            <Hourglass className="mr-1 text-orange-500" size={16} />
          )}
          {status === 'delivered' ? 'Delivered' : 'Ongoing'}
        </p>
        <p className="text-sm text-slate-800 flex gap-2 items-center">
          <strong className="text-slate-900 mr-1">Contact:</strong>
          <a
            href={contact!.includes('@') ? `mailto:${contact}` : contact}
            className="text-sky-600 hover:underline truncate block"
          >
            {contact!.includes('@') ? 'Contact via email' : 'Facebook'}
          </a>
        </p>
      </div>
    </div>
  );
};

export default PortfolioCard;
