import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { 
  generateCycleInsights, 
  getCurrentCycleStatus, 
  PersonalInsights, 
  CurrentCycleStatus 
} from '@/utils/cycleInsights';

interface CycleInsightsContextType {
  insights: PersonalInsights | null;
  cycleStatus: CurrentCycleStatus | null;
  loading: boolean;
  refreshInsights: () => Promise<void>;
}

const CycleInsightsContext = createContext<CycleInsightsContextType>({
  insights: null,
  cycleStatus: null,
  loading: false,
  refreshInsights: async () => {},
});

export const useCycleInsights = () => useContext(CycleInsightsContext);

interface CycleInsightsProviderProps {
  children: ReactNode;
}

export const CycleInsightsProvider: React.FC<CycleInsightsProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<PersonalInsights | null>(null);
  const [cycleStatus, setCycleStatus] = useState<CurrentCycleStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!user) {
      setInsights(null);
      setCycleStatus(null);
      return;
    }

    try {
      setLoading(true);
      const [userInsights, userCycleStatus] = await Promise.all([
        generateCycleInsights(user.id),
        getCurrentCycleStatus(user.id)
      ]);

      setInsights(userInsights);
      setCycleStatus(userCycleStatus);
    } catch (error) {
      console.error('Error fetching cycle data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const refreshInsights = async () => {
    await fetchData();
  };

  return (
    <CycleInsightsContext.Provider
      value={{
        insights,
        cycleStatus,
        loading,
        refreshInsights
      }}
    >
      {children}
    </CycleInsightsContext.Provider>
  );
}; 