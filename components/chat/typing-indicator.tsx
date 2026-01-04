'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';

interface TypingIndicatorProps {
  user?: {
    name: string | null;
    image: string | null;
  } | null; // Added | null to allow null values
}

export function TypingIndicator({ user }: TypingIndicatorProps) {
  return (
    <div className='flex justify-start'>
      <div className='flex items-end gap-3'>
        <Avatar className='h-8 w-8 shadow-sm'>
          <AvatarImage src={user?.image || undefined} />
          <AvatarFallback className='bg-linear-to-br from-blue-500 to-purple-600 text-xs font-medium text-white'>
            {getInitials(user?.name)}
          </AvatarFallback>
        </Avatar>
        <div className='border-border/50 bg-background/80 rounded-2xl rounded-bl-md border px-4 py-3 shadow-lg backdrop-blur-sm'>
          <div className='flex space-x-1'>
            <div className='bg-muted-foreground/60 h-2 w-2 animate-bounce rounded-full' />
            <div
              className='bg-muted-foreground/60 h-2 w-2 animate-bounce rounded-full'
              style={{ animationDelay: '0.1s' }}
            />
            <div
              className='bg-muted-foreground/60 h-2 w-2 animate-bounce rounded-full'
              style={{ animationDelay: '0.2s' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
