import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BudgetInputs, CampaignSplit } from '../types/budget';
import { PieChart } from './PieChart';
import { formatCurrency } from '../utils/budgetCalculator';

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

const MAX_BUDGET = 1000000; // $1M maximum budget validation

interface CampaignBudget extends CampaignSplit {
  budget: number;
}

export function BudgetForm({ onSubmit, isLoading = false, error = null }: BudgetFormProps) {
  const [currentSpend, setCurrentSpend] = useState<string>('');
  const [totalMonthlyBudget, setTotalMonthlyBudget] = useState<string>('');
  const [campaignStartDate, setCampaignStartDate] = useState<Date>(new Date());
  const [campaignEndDate, setCampaignEndDate] = useState<Date>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30); // Default to 30 days from now
    return date;
  });
  const [campaignSplits, setCampaignSplits] = useState<CampaignSplit[]>(DEFAULT_CAMPAIGNS);
  const [inputMode, setInputMode] = useState<'percentage' | 'budget'>('percentage');
  const [campaignBudgets, setCampaignBudgets] = useState<CampaignBudget[]>(
    DEFAULT_CAMPAIGNS.map(camp => ({ ...camp, budget: 0 }))
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [isAddingCampaign, setIsAddingCampaign] = useState(false);

  // Calculate total budget from individual budgets
  useEffect(() => {
    if (inputMode === 'budget') {
      const totalBudget = campaignBudgets.reduce((sum, camp) => sum + camp.budget, 0);
      setTotalMonthlyBudget(totalBudget.toString());
      
      // Update percentages based on budgets
      if (totalBudget > 0) {
        const newSplits = campaignBudgets.map(camp => ({
          name: camp.name,
          percentage: Math.round((camp.budget / totalBudget) * 100),
        }));
        setCampaignSplits(newSplits);
      }
    }
  }, [inputMode, campaignBudgets]);

  // Update campaign budgets when total budget or splits change
  useEffect(() => {
    if (inputMode === 'percentage' && totalMonthlyBudget) {
      const total = parseFloat(totalMonthlyBudget);
      const newBudgets = campaignSplits.map(split => ({
        ...split,
        budget: (split.percentage / 100) * total,
      }));
      setCampaignBudgets(newBudgets);
    }
  }, [inputMode, totalMonthlyBudget, campaignSplits]);

  const validateBudgets = (budgets: CampaignBudget[]): boolean => {
    const total = budgets.reduce((sum, camp) => sum + camp.budget, 0);
    if (total > MAX_BUDGET) {
      setValidationError(`Total budget cannot exceed ${formatCurrency(MAX_BUDGET)}`);
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputMode === 'budget' && !validateBudgets(campaignBudgets)) {
      return;
    }

    const totalPercentage = campaignSplits.reduce((sum, split) => sum + split.percentage, 0);
    if (Math.abs(totalPercentage - 100) > 0.01) {
      setValidationError('Total percentage must equal 100%');
      return;
    }
    
    const inputs: BudgetInputs = {
      currentSpend: parseFloat(currentSpend),
      totalMonthlyBudget: parseFloat(totalMonthlyBudget),
      campaignStartDate,
      campaignEndDate,
      campaignSplits,
    };

    setValidationError(null);
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

  const handleCampaignBudgetChange = (index: number, value: string) => {
    const newBudgets = [...campaignBudgets];
    newBudgets[index] = {
      ...newBudgets[index],
      budget: parseFloat(value) || 0,
    };
    setCampaignBudgets(newBudgets);
    validateBudgets(newBudgets);
  };

  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      setCampaignStartDate(date);
      // If end date is before new start date, update it
      if (campaignEndDate < date) {
        const newEndDate = new Date(date);
        newEndDate.setDate(date.getDate() + 30);
        setCampaignEndDate(newEndDate);
      }
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      setCampaignEndDate(date);
    }
  };

  const handleAddCampaign = () => {
    if (!newCampaignName.trim()) {
      setValidationError('Please enter a campaign name');
      return;
    }

    const existingCampaign = campaignSplits.find(
      camp => camp.name.toLowerCase() === newCampaignName.trim().toLowerCase()
    );
    if (existingCampaign) {
      setValidationError('A campaign with this name already exists');
      return;
    }

    const newCampaign = { name: newCampaignName.trim(), percentage: 0 };
    const newSplits = [...campaignSplits, newCampaign];
    
    // Redistribute percentages
    const equalShare = Math.floor(100 / newSplits.length);
    const remainder = 100 - (equalShare * newSplits.length);
    
    newSplits.forEach((split, index) => {
      split.percentage = equalShare + (index === 0 ? remainder : 0);
    });

    setCampaignSplits(newSplits);
    setCampaignBudgets(prev => [
      ...prev,
      { ...newCampaign, budget: 0 },
    ]);

    setNewCampaignName('');
    setIsAddingCampaign(false);
    setValidationError(null);
  };

  const handleRemoveCampaign = (index: number) => {
    if (campaignSplits.length <= 2) {
      setValidationError('Must have at least two campaign objectives');
      return;
    }

    const newSplits = campaignSplits.filter((_, i) => i !== index);
    const removedPercentage = campaignSplits[index].percentage;
    
    // Redistribute the removed percentage
    const distributePer = Math.floor(removedPercentage / newSplits.length);
    const remainder = removedPercentage - (distributePer * newSplits.length);
    
    newSplits.forEach((split, i) => {
      split.percentage += distributePer + (i === 0 ? remainder : 0);
    });

    setCampaignSplits(newSplits);
    setCampaignBudgets(prev => prev.filter((_, i) => i !== index));
    setValidationError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Budget Calculator</h2>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {validationError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{validationError}</p>
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <DatePicker
              selected={campaignStartDate}
              onChange={handleStartDateChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              dateFormat="MMMM d, yyyy"
              minDate={new Date()}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <DatePicker
              selected={campaignEndDate}
              onChange={handleEndDateChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              dateFormat="MMMM d, yyyy"
              minDate={campaignStartDate}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 pl-[2px]">
              Campaign Allocation
            </label>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-600"
                  checked={inputMode === 'percentage'}
                  onChange={() => setInputMode('percentage')}
                />
                <span className="ml-2 text-sm text-gray-600">By Percentage</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-600"
                  checked={inputMode === 'budget'}
                  onChange={() => setInputMode('budget')}
                />
                <span className="ml-2 text-sm text-gray-600">By Budget</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-[1fr,auto] gap-4">
            <div className="space-y-2">
              {inputMode === 'percentage' ? (
                // Percentage inputs with strict column alignment
                <div className="space-y-2">
                  {campaignSplits.map((split, index) => (
                    <div key={split.name} className="grid grid-cols-[200px,80px,40px,40px] items-center h-9">
                      <span className="text-gray-600 pl-[2px]">{split.name}</span>
                      <input
                        type="number"
                        value={split.percentage}
                        onChange={(e) => handleCampaignSplitChange(index, e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                        min="0"
                        max="100"
                        step="1"
                      />
                      <span className="text-gray-500 justify-self-center">%</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCampaign(index)}
                        className="text-red-500 hover:text-red-700 focus:outline-none justify-self-center"
                        aria-label="Remove campaign"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                // Budget inputs with strict column alignment
                <div className="space-y-2">
                  {campaignBudgets.map((camp, index) => (
                    <div key={camp.name} className="grid grid-cols-[200px,100px,60px,40px] items-center h-9">
                      <span className="text-gray-600 pl-[2px]">{camp.name}</span>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          value={camp.budget}
                          onChange={(e) => handleCampaignBudgetChange(index, e.target.value)}
                          className="w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          required
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <span className="text-gray-500">({camp.percentage}%)</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCampaign(index)}
                        className="text-red-500 hover:text-red-700 focus:outline-none justify-self-center"
                        aria-label="Remove campaign"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Campaign Button aligned with campaign names */}
              {isAddingCampaign ? (
                <div className="grid grid-cols-[200px,auto] items-center h-9 gap-2">
                  <input
                    type="text"
                    value={newCampaignName}
                    onChange={(e) => setNewCampaignName(e.target.value)}
                    placeholder="Campaign name"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleAddCampaign}
                      className="text-green-600 hover:text-green-700 focus:outline-none"
                      aria-label="Confirm add campaign"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingCampaign(false);
                        setNewCampaignName('');
                      }}
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                      aria-label="Cancel add campaign"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-9 flex items-center">
                  <button
                    type="button"
                    onClick={() => setIsAddingCampaign(true)}
                    className="text-blue-600 hover:text-blue-800 focus:outline-none flex items-center pl-[2px]"
                  >
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add Campaign</span>
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-start justify-end pt-2">
              <PieChart splits={campaignSplits} size="small" />
            </div>
          </div>
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