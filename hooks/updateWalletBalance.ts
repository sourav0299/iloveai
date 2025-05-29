import { useState } from 'react';
import toast from 'react-hot-toast';
import { useWalletStore } from '@/store/store';

interface UseWalletUpdateReturn {
  isLoading: boolean;
  updateCredits: (amount: number, firebaseUid: string) => Promise<boolean>;
}

export const useWalletUpdate = (): UseWalletUpdateReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const { fetchBalance } = useWalletStore();

  const updateCredits = async (amount: number, firebaseUid: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/purchase-credit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount, firebaseUid })
      });

      if (!response.ok) {
        throw new Error("Failed to update credits");
      }

      await response.json();
      await fetchBalance(firebaseUid);
      return true
    } catch (error) {
      toast.error("Failed to update credits");
      throw error;
      return false
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    updateCredits
  };
};