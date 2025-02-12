import React, { useState } from 'react';
import { BudgetInputs, CampaignSplit } from '../types/budget';

interface BudgetFormProps {
  onSubmit: (inputs: BudgetInputs) => void;
  isLoading?: boolean;
  error?: string | null;
}

const DEFAULT_CAMPAIGNS: CampaignSplit[] = [
  { name: 'Awareness', percentage: 40 },
  { name: 'Conversions', percentage: 40 },
  { name: 'Engagement', percentage: 20 },
];

export function BudgetForm({ onSubmit, isLoading = false, error = null }: BudgetFormProps) {
  const [currentSpend, setCurrentSpend] = useState<string>('');
  const [totalMonthlyBudget, setTotalMonthlyBudget] = useState<string>('');
  const [daysRemaining, setDaysRemaining] = useState<string>('');
  const [campaignSplits, setCampaignSplits] = useState<CampaignSplit[]>(DEFAULT_CAMPAIGNS);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const inputs: BudgetInputs = {
      currentSpend: parseFloat(currentSpend),
      totalMonthlyBudget: parseFloat(totalMonthlyBudget),
      daysRemaining: parseInt(daysRemaining, 10),
      campaignSplits,
    };

    onSubmit(inputs);
  };

  const handleCampaignSplitChange = (index: number, value: string) => {
    const newSplits = [...campaignSplits];
    newSplits[index] = {
      ...newSplits[index],
      percentage: parseFloat(value) || 0,
    };
    setCampaignSplits(newSplits);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Budget Calculator</h2>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="currentSpend" className="block text-sm font-medium text-gray-700">
            Current Spend ($)
          </label>
          <input
            type="number"
            id="currentSpend"
            value={currentSpend}
            onChange={(e) => setCurrentSpend(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label htmlFor="totalBudget" className="block text-sm font-medium text-gray-700">
            Total Monthly Budget ($)
          </label>
          <input
            type="number"
            id="totalBudget"
            value={totalMonthlyBudget}
            onChange={(e) => setTotalMonthlyBudget(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label htmlFor="daysRemaining" className="block text-sm font-medium text-gray-700">
            Days Remaining
          </label>
          <input
            type="number"
            id="daysRemaining"
            value={daysRemaining}
            onChange={(e) => setDaysRemaining(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            min="1"
            step="1"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Campaign Splits (%)
          </label>
          {campaignSplits.map((split, index) => (
            <div key={split.name} className="flex items-center space-x-2">
              <span className="w-24 text-sm text-gray-600">{split.name}</span>
              <input
                type="number"
                value={split.percentage}
                onChange={(e) => handleCampaignSplitChange(index, e.target.value)}
                className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                min="0"
                max="100"
                step="1"
              />
              <span className="text-sm text-gray-500">%</span>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {isLoading ? 'Calculating...' : 'Calculate Budget'}
        </button>
      </div>
    </form>
  );
} 