import { useContext } from 'react';
import { CrystalsContext } from './crystalsContext';

export function useCrystals() {
  const ctx = useContext(CrystalsContext);
  if (!ctx) {
    throw new Error('useCrystals must be used inside CrystalsProvider');
  }

  return ctx;
}
