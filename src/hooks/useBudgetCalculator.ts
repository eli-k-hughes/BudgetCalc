import { useState, useCallback } from 'react';
import { BudgetInputs, BudgetCalculation, StoredCalculations } from '../types/budget';
import { calculateDailyBudget, BudgetCalculationError } from '../utils/budgetCalculator';

const STORAGE_KEY = 'budgetCalculations';

export function useBudgetCalculator() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateBudget = useCallback((inputs: BudgetInputs) => {
    setError(null);
    setLoading(true);

    try {
      const result = calculateDailyBudget(inputs);
      const calculation: BudgetCalculation = {
        inputs,
        result,
        timestamp: new Date().toISOString(),
      };

      // Save to local storage
      const stored = localStorage.getItem(STORAGE_KEY);
      const storedData: StoredCalculations = stored
        ? JSON.parse(stored)
        : { calculations: [], lastUpdated: '' };

      storedData.calculations.unshift(calculation);
      storedData.lastUpdated = calculation.timestamp;

      // Keep only last 10 calculations
      if (storedData.calculations.length > 10) {
        storedData.calculations = storedData.calculations.slice(0, 10);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedData));

      setLoading(false);
      return calculation;
    } catch (e) {
      const errorMessage = e instanceof BudgetCalculationError
        ? e.message
        : 'An unexpected error occurred';
      setError(errorMessage);
      setLoading(false);
      throw e;
    }
  }, []);

  const getStoredCalculations = useCallback((): StoredCalculations => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored
      ? JSON.parse(stored)
      : { calculations: [], lastUpdated: '' };
  }, []);

  const clearStoredCalculations = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    calculateBudget,
    getStoredCalculations,
    clearStoredCalculations,
    error,
    loading,
  };
} 