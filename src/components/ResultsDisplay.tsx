import React from 'react';
import { BudgetCalculation } from '../types/budget';
import { formatCurrency, formatDate } from '../utils/budgetCalculator';

interface ResultsDisplayProps {
  calculation: BudgetCalculation | null;
}

export function ResultsDisplay({ calculation }: ResultsDisplayProps) {
  if (!calculation) return null;

  const { result, timestamp } = calculation;
  const date = new Date(timestamp).toLocaleDateString();
  const time = new Date(timestamp).toLocaleTimeString();

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">Daily Budget Breakdown</h3>
      
      <div className="bg-blue-50 p-4 rounded-md">
        <div className="flex justify-between items-center">
          <span className="text-blue-700 font-medium">Total Daily Budget:</span>
          <span className="text-2xl font-bold text-blue-800">
            {formatCurrency(result.total)}
          </span>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-md space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Campaign Duration</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Start Date:</span>
            <span className="ml-2 font-medium">{formatDate(result.startDate)}</span>
          </div>
          <div>
            <span className="text-gray-600">End Date:</span>
            <span className="ml-2 font-medium">{formatDate(result.endDate)}</span>
          </div>
          <div className="col-span-2">
            <span className="text-gray-600">Days Remaining:</span>
            <span className="ml-2 font-medium">{result.daysRemaining} days</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Campaign Allocations</h4>
        <div className="divide-y divide-gray-200">
          {Object.entries(result.byCampaign).map(([campaign, amount]) => (
            <div key={campaign} className="py-2 flex justify-between items-center">
              <span className="text-gray-600">{campaign}</span>
              <span className="font-medium text-gray-800">{formatCurrency(amount)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-sm text-gray-500 pt-4 border-t">
        <p>Calculated on {date} at {time}</p>
      </div>
    </div>
  );
} 