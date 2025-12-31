'use client';

import { useSession } from '@/lib/auth-client';
import { usePresenceStore } from '@/lib/store/presenceStore';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

// Assuming these types are defined somewhere, possibly from Prisma
// For now, defining them here based on usage in the original hook.
interface User {
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
}

interface MessageForPreview {
  id: string;
  senderId: string;
  content: string;
  createdAt: Date;
}

interface ConversationDisplay {
  id: string;
  user1Id: string;
  user2Id: string;
  user1: User;
  user2: User;
  lastMessageAt: Date;
  messages: MessageForPreview[];
}

export function useConversations() {
  const { data: session, isPending: isSessionPending } = useSession();
  const router = useRouter();
  const [conversations, setConversations] = useState<ConversationDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { ably, isConnected } = usePresenceStore();

  const currentUserId = session?.user?.id;

  const fetchConversations = useCallback(async () => {
    if (!currentUserId) return;

    try {
      setIsLoading(true);
      const response = await fetch('/api/chat/conversations');
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }
      const data = await response.json();
      setConversations(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    if (!isSessionPending && !session) {
      router.push('/auth/signin');
    }
    if (session) {
      fetchConversations();
    }
  }, [session, isSessionPending, fetchConversations, router]);

  useEffect(() => {
    if (!ably || !isConnected || !currentUserId) {
      return;
    }

    // This subscription seems to be for an agent/admin to get real-time updates
    // on all conversations. A user-specific channel is appropriate here.
    const channel = ably.channels.get(`user:${currentUserId}`);

    const handleNewMessage = (message: any) => {
      const newConversation = message.data;
      setConversations((prev) => {
        const existingConversation = prev.find(
          (c) => c.id === newConversation.id,
        );
        if (existingConversation) {
          return prev
            .map((c) => (c.id === newConversation.id ? newConversation : c))
            .sort(
              (a, b) =>
                new Date(b.lastMessageAt).getTime() -
                new Date(a.lastMessageAt).getTime(),
            );
        }
        return [newConversation, ...prev];
      });
    };

    channel.subscribe('new-conversation-update', handleNewMessage);

    return () => {
      channel.unsubscribe('new-conversation-update', handleNewMessage);
    };
  }, [ably, isConnected, currentUserId]);

  return { conversations, isLoading, error };
}