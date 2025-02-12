import { describe, it, expect } from 'vitest';
import {
  calculateDailyBudget,
  validateInputs,
  BudgetCalculationError,
} from '../budgetCalculator';
import { BudgetInputs } from '../../types/budget';

describe('Budget Calculator', () => {
  const validInputs: BudgetInputs = {
    currentSpend: 1000,
    totalMonthlyBudget: 5000,
    daysRemaining: 10,
    campaignSplits: [
      { name: 'Awareness', percentage: 50 },
      { name: 'Conversions', percentage: 30 },
      { name: 'Engagement', percentage: 20 },
    ],
  };

  describe('validateInputs', () => {
    it('should not throw for valid inputs', () => {
      expect(() => validateInputs(validInputs)).not.toThrow();
    });

    it('should throw for negative days remaining', () => {
      const invalidInputs = {
        ...validInputs,
        daysRemaining: -1,
      };
      expect(() => validateInputs(invalidInputs)).toThrow(BudgetCalculationError);
    });

    it('should throw when percentages do not sum to 100', () => {
      const invalidInputs = {
        ...validInputs,
        campaignSplits: [
          { name: 'Awareness', percentage: 50 },
          { name: 'Conversions', percentage: 30 },
        ],
      };
      expect(() => validateInputs(invalidInputs)).toThrow(BudgetCalculationError);
    });
  });

  describe('calculateDailyBudget', () => {
    it('should calculate correct daily budgets', () => {
      const result = calculateDailyBudget(validInputs);
      
      // Total remaining budget is 4000 (5000 - 1000)
      // Daily budget should be 400 (4000 / 10)
      expect(result.total).toBe(400);
      
      // Campaign splits
      expect(result.byCampaign['Awareness']).toBe(200); // 50% of 400
      expect(result.byCampaign['Conversions']).toBe(120); // 30% of 400
      expect(result.byCampaign['Engagement']).toBe(80); // 20% of 400
    });

    it('should throw when budget is exceeded', () => {
      const invalidInputs = {
        ...validInputs,
        currentSpend: 6000, // More than total budget
      };
      expect(() => calculateDailyBudget(invalidInputs)).toThrow(BudgetCalculationError);
    });
  });
}); 