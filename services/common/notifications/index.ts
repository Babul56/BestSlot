import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { QUERY_KEYS } from '@/lib/constant';

export function useNotifications() {
  return useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATIONS],
    queryFn: async () => {
      const response = await axios.get(`/api/common/notifications`);
      return response.data;
    },
  });
}
