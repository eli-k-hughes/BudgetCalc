import { BudgetInputs, DailyBudget } from '../types/budget';

export class BudgetCalculationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BudgetCalculationError';
  }
}

function calculateDaysRemaining(startDate: Date, endDate: Date): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // Include both start and end dates
}

export function validateInputs(inputs: BudgetInputs): void {
  if (inputs.totalMonthlyBudget < 0) {
    throw new BudgetCalculationError('Total monthly budget cannot be negative');
  }
  if (inputs.currentSpend < 0) {
    throw new BudgetCalculationError('Current spend cannot be negative');
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const startDate = new Date(inputs.campaignStartDate);
  const endDate = new Date(inputs.campaignEndDate);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  if (endDate < startDate) {
    throw new BudgetCalculationError('End date must be after start date');
  }

  if (endDate < today) {
    throw new BudgetCalculationError('End date must be in the future');
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

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Use today as start date if campaign start date is in the past
  const effectiveStartDate = new Date(inputs.campaignStartDate) < today 
    ? today 
    : new Date(inputs.campaignStartDate);

  const daysRemaining = calculateDaysRemaining(effectiveStartDate, inputs.campaignEndDate);
  
  if (daysRemaining <= 0) {
    throw new BudgetCalculationError('Campaign has already ended');
  }
  
  const dailyTotal = remainingBudget / daysRemaining;
  
  const byCampaign = inputs.campaignSplits.reduce((acc, split) => {
    acc[split.name] = (dailyTotal * split.percentage) / 100;
    return acc;
  }, {} as { [key: string]: number });
  
  return {
    total: dailyTotal,
    byCampaign,
    daysRemaining,
    startDate: effectiveStartDate,
    endDate: new Date(inputs.campaignEndDate),
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function calculateDaysFromToday(date: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
} 