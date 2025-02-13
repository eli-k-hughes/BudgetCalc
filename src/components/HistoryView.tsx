import React from 'react';
import { StoredCalculations } from '../types/budget';
import { formatCurrency } from '../utils/budgetCalculator';
import { PieChart } from './PieChart';

interface HistoryViewProps {
  storedCalculations: StoredCalculations;
  onClearHistory: () => void;
}

export function HistoryView({ storedCalculations, onClearHistory }: HistoryViewProps) {
  if (storedCalculations.calculations.length === 0) {
    return (
      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md text-center text-gray-500">
        No calculation history available
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">Calculation History</h3>
        <button
          onClick={onClearHistory}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Clear History
        </button>
      </div>

      <div className="space-y-4">
        {storedCalculations.calculations.map((calc, index) => (
          <div
            key={calc.timestamp}
            className="p-4 border rounded-md hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-sm text-gray-500">
                  {new Date(calc.timestamp).toLocaleDateString()}{' '}
                  {new Date(calc.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <span className="text-lg font-semibold text-blue-600">
                {formatCurrency(calc.result.total)}/day
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Monthly Budget:</span>
                <span className="ml-2 font-medium">
                  {formatCurrency(calc.inputs.totalMonthlyBudget)}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Current Spend:</span>
                <span className="ml-2 font-medium">
                  {formatCurrency(calc.inputs.currentSpend)}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Days Remaining:</span>
                <span className="ml-2 font-medium">{calc.result.daysRemaining}</span>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <PieChart splits={calc.inputs.campaignSplits} size="tiny" />
                </div>
                <div className="flex items-center">
                  <div className="text-sm text-gray-500">
                    {calc.inputs.campaignSplits.map((split) => (
                      <div key={split.name}>
                        {split.name}: {split.percentage}%
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 