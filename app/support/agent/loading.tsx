import { ConversationListSkeleton } from './chat-skeleton';

export default function Loading() {
  return (
    <div className='lg:hidden'>
      <ConversationListSkeleton />
    </div>
  );
}
