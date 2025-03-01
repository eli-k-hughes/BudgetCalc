export interface CampaignSplit {
  name: string;
  percentage: number;
}

export interface BudgetInputs {
  currentSpend: number;
  totalMonthlyBudget: number;
  campaignStartDate: Date;
  campaignEndDate: Date;
  campaignSplits: CampaignSplit[];
}

export interface DailyBudget {
  total: number;
  byCampaign: {
    [key: string]: number;
  };
  daysRemaining: number;
  startDate: Date;
  endDate: Date;
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