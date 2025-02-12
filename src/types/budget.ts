export interface CampaignSplit {
  name: string;
  percentage: number;
}

export interface BudgetInputs {
  currentSpend: number;
  totalMonthlyBudget: number;
  daysRemaining: number;
  campaignSplits: CampaignSplit[];
}

export interface DailyBudget {
  total: number;
  byCampaign: {
    [key: string]: number;
  };
}

export interface BudgetCalculation {
  inputs: BudgetInputs;
  result: DailyBudget;
  timestamp: string;
}

// Local storage type
export interface StoredCalculations {
  calculations: BudgetCalculation[];
  lastUpdated: string;
} 