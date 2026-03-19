import { createContext, useContext, useState, useEffect } from 'react';
import { getCrystals } from '../api/crystalsApi';
import { useAuth } from './AuthContext';

const CrystalsContext = createContext();

export function CrystalsProvider({ children }) {
  const { user } = useAuth();
  const [crystals, setCrystals] = useState(0);
  const [loading, setLoading] = useState(true); 
  useEffect(() => {
    if (!user?.id) {
      setCrystals(0);
      setLoading(false);
      return;
    }

    const loadCrystals = async () => {
      setLoading(true);
      try {
        const data = await getCrystals(user.id); 
        setCrystals(data?.payload ?? 0);
      } catch (e) {
        console.error(e);
        setCrystals(0);
      } finally {
        setLoading(false);
      }
    };

    loadCrystals();
  }, [user?.id]);

  const refreshCrystals = async () => {
    if (!user?.id) return;
    try {
      const data = await getCrystals(user.id);
      setCrystals(data?.payload ?? 0);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <CrystalsContext.Provider value={{ crystals, refreshCrystals, loading }}>
      {children}
    </CrystalsContext.Provider>
  );
}

export const useCrystals = () => useContext(CrystalsContext);