import { cn } from '@/lib/utils';

export default function ActionItem({
  icon,
  iconBg,
  title,
  description,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  isVerified?: boolean;
  hideCheck?: boolean;
}) {
  return (
    <div className='flex items-start gap-4 group cursor-pointer'>
      <div
        className={cn(
          'flex items-center justify-center size-10 rounded-full shrink-0 shadow-lg transition-transform group-hover:scale-110',
          iconBg,
        )}
      >
        {icon}
      </div>
      <div className='flex-1 min-w-0 border-b  pb-3'>
        <div className='flex items-center gap-2'>
          <h4 className='text-sm font-bold '>{title}</h4>
        </div>
        <p className='text-xs text-muted-foreground line-clamp-1'>
          {description}
        </p>
      </div>
    </div>
  );
}
