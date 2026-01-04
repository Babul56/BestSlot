'use client';

import { format } from 'date-fns';
import { AlertCircle, Check, CheckCheck } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { MessageWithSender } from '@/hooks/use-chat-messages';
import { cn, getInitials } from '@/lib/utils';

interface MessageBubbleProps {
  message: MessageWithSender;
  isCurrentUser: boolean;
  onRetry: (messageId: string) => void;
}

export function MessageBubble({ message, isCurrentUser }: MessageBubbleProps) {
  const [imageError, setImageError] = useState(false);

  const formatMessageTime = (date: Date) => format(date, 'hh:mm aa');

  const getMessageStatusIcon = (status?: string) => {
    switch (status) {
      case 'sending':
        return (
          <div className='h-3 w-3 animate-spin rounded-full border border-current border-t-transparent' />
        );
      case 'sent':
        return <Check className='h-3 w-3' />;
      case 'delivered':
        return <CheckCheck className='h-3 w-3' />;
      case 'read':
        return <CheckCheck className='h-3 w-3 text-blue-500' />;
      case 'failed':
        return <AlertCircle className='text-destructive h-3 w-3' />;
      default:
        return <Check className='h-3 w-3' />;
    }
  };

  return (
    <div
      className={cn(
        'flex w-full mb-4',
        isCurrentUser ? 'justify-end' : 'justify-start',
      )}
    >
      <div
        className={cn(
          'flex max-w-[75%] gap-2',
          isCurrentUser ? 'flex-row-reverse' : 'flex-row',
        )}
      >
        {/* Avatar */}
        {!isCurrentUser && (
          <Avatar className='h-8 w-8 shrink-0 self-end'>
            {message.sender?.image && !imageError ? (
              <div className='relative h-full w-full overflow-hidden rounded-full'>
                <Image
                  src={message.sender.image}
                  alt='avatar'
                  fill
                  className='object-cover'
                  onError={() => setImageError(true)}
                />
              </div>
            ) : (
              <AvatarFallback className='text-xs'>
                {getInitials(message.sender.name)}
              </AvatarFallback>
            )}
          </Avatar>
        )}

        {/* Message Content + Outside Metadata */}
        <div
          className={cn(
            'flex flex-col gap-1',
            isCurrentUser ? 'items-end' : 'items-start',
          )}
        >
          <div
            className={cn(
              'relative rounded-lg px-3 py-2 shadow-sm transition-all',
              isCurrentUser
                ? 'rounded-br-none bg-slate-950 text-white dark:bg-primary'
                : 'rounded-bl-none bg-secondary text-secondary-foreground border border-border/50',
              message.type === 'IMAGE' && 'p-0 rounded-lg overflow-hidden',
            )}
          >
            {message.type === 'IMAGE' && message.fileUrl ? (
              <Image
                src={message.fileUrl}
                alt='sent'
                width={300}
                height={300}
                className='object-cover rounded-lg'
              />
            ) : (
              <p className='text-sm leading-relaxed wrap-break-word whitespace-pre-wrap'>
                {message.content}
              </p>
            )}
          </div>

          {/* METADATA OUTSIDE BUBBLE */}
          <div className='flex items-center gap-1.5 px-1'>
            <span className='text-[10px] font-medium text-muted-foreground uppercase'>
              {formatMessageTime(message.createdAt)}
            </span>
            {isCurrentUser && (
              <span className='text-muted-foreground'>
                {getMessageStatusIcon(message.status)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
