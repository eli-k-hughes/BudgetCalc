import React, { useState } from 'react';
import { BudgetForm } from './components/BudgetForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { HistoryView } from './components/HistoryView';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useBudgetCalculator } from './hooks/useBudgetCalculator';
import { BudgetCalculation } from './types/budget';

function App() {
  const {
    calculateBudget,
    getStoredCalculations,
    clearStoredCalculations,
    error,
    loading,
  } = useBudgetCalculator();

  const [currentCalculation, setCurrentCalculation] = useState<BudgetCalculation | null>(null);
  const storedCalculations = getStoredCalculations();

  const handleCalculate = async (inputs: any) => {
    try {
      const calculation = calculateBudget(inputs);
      setCurrentCalculation(calculation);
    } catch (e) {
      // Error is handled by the hook
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Campaign Budget Calculator</h1>
            <p className="mt-2 text-gray-600">
              Calculate your daily campaign budgets based on current spend and targets
            </p>
          </header>

          <main className="space-y-8">
            <section>
              <BudgetForm
                onSubmit={handleCalculate}
                isLoading={loading}
                error={error}
              />
            </section>

            {currentCalculation && (
              <section className="mt-8">
                <ResultsDisplay calculation={currentCalculation} />
              </section>
            )}

            <section className="mt-12">
              <HistoryView
                storedCalculations={storedCalculations}
                onClearHistory={clearStoredCalculations}
              />
            </section>
          </main>

          <footer className="mt-16 text-center text-sm text-gray-500">
            <p>Campaign Budget Calculator &copy; {new Date().getFullYear()}</p>
          </footer>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
