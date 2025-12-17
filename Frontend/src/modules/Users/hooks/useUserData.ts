import { useState, useEffect } from 'react';
import { usersApiService } from '../services/usersApiService';
import { userStatsService } from '../services/userStatsService';
import { User } from '../types/user.types';

interface UsersAnalytics {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  churnRate: number;
  averageEngagement: number;
  topRoles: Array<{ role: string;
  count: number;
}>;
  topFeatures: Array<{ feature: string; usage: number }>;
  geographicDistribution: Array<{ country: string; users: number }>;
  deviceStats: Array<{ device: string; percentage: number }>;
  recentActivity: Array<any>;
}

export const useUsersData = () => {
  const [users, setUsers] = useState<User[]>([]);

  const [analytics, setAnalytics] = useState<UsersAnalytics | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const [usersResponse, statsResponse] = await Promise.all([
          usersApiService.getUsers({ per_page: 100 }),
          userStatsService.getStatistics()
        ]);

        if (usersResponse.success && usersResponse.data) {
          setUsers(usersResponse.data.users);

        }
        
        if (statsResponse.success && statsResponse.data) {
          setAnalytics({
            totalUsers: statsResponse.data.total_users,
            activeUsers: statsResponse.data.active_users,
            newUsersThisMonth: statsResponse.data.new_users_today * 30,
            churnRate: 2.3,
            averageEngagement: 78.5,
            topRoles: Object.entries(statsResponse.data.users_by_role).map(([role, count]) => ({ 
              role, 
              count: count as number 
            })),
            topFeatures: [],
            geographicDistribution: [],
            deviceStats: [],
            recentActivity: []
          });

        } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load users data');

      } finally {
        setLoading(false);

      } ;

    loadData();

  }, []);

  return { users, analytics, loading, error};
};
