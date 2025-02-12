import { BudgetInputs, DailyBudget } from '../types/budget';

export class BudgetCalculationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BudgetCalculationError';
  }
}

export function validateInputs(inputs: BudgetInputs): void {
  if (inputs.daysRemaining <= 0) {
    throw new BudgetCalculationError('Days remaining must be greater than zero');
  }
  if (inputs.totalMonthlyBudget < 0) {
    throw new BudgetCalculationError('Total monthly budget cannot be negative');
  }
  if (inputs.currentSpend < 0) {
    throw new BudgetCalculationError('Current spend cannot be negative');
  }
  
  const totalPercentage = inputs.campaignSplits.reduce(
    (sum, split) => sum + split.percentage,
    0
  );
  
  if (Math.abs(totalPercentage - 100) > 0.01) {
    throw new BudgetCalculationError('Campaign split percentages must sum to 100');
  }
}

export function calculateDailyBudget(inputs: BudgetInputs): DailyBudget {
  validateInputs(inputs);
  
  const remainingBudget = inputs.totalMonthlyBudget - inputs.currentSpend;
  if (remainingBudget < 0) {
    throw new BudgetCalculationError('Budget has been exceeded');
  }
  
  const dailyTotal = remainingBudget / inputs.daysRemaining;
  
  const byCampaign = inputs.campaignSplits.reduce((acc, split) => {
    acc[split.name] = (dailyTotal * split.percentage) / 100;
    return acc;
  }, {} as { [key: string]: number });
  
  return {
    total: dailyTotal,
    byCampaign,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
} 