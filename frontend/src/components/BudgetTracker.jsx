import React from 'react';
import { 
  IoWalletOutline as WalletIcon,
  IoWarningOutline as WarningIcon,
  IoCheckmarkCircleOutline as CheckCircleIcon
} from 'react-icons/io5';

const BudgetTracker = ({ 
  totalBudget, 
  totalExpenses, 
  className = '',
  showDetails = true 
}) => {
  const remaining = totalBudget - totalExpenses;
  const percentageUsed = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;
  const isOverBudget = totalExpenses > totalBudget;
  const isNearBudget = percentageUsed >= 80 && !isOverBudget;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${className}`}>
      {/* Clean Header */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <WalletIcon className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Trip Budget</h3>
          </div>
          
          {/* Status Badge */}
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
            isOverBudget 
              ? 'bg-red-100 text-red-700 border border-red-200' 
              : isNearBudget 
                ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                : 'bg-green-100 text-green-700 border border-green-200'
          }`}>
            {isOverBudget ? (
              <><WarningIcon className="h-4 w-4" /><span>Over Budget</span></>
            ) : isNearBudget ? (
              <><WarningIcon className="h-4 w-4" /><span>Near Limit</span></>
            ) : (
              <><CheckCircleIcon className="h-4 w-4" /><span>On Track</span></>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Budget Overview Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Total Budget */}
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm font-medium text-blue-600 mb-1">Total Budget</div>
            <div className="text-xl font-bold text-blue-700">
              {formatCurrency(totalBudget)}
            </div>
          </div>
          
          {/* Spent */}
          <div className={`text-center p-4 rounded-lg border ${
            isOverBudget 
              ? 'bg-red-50 border-red-200' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className={`text-sm font-medium mb-1 ${
              isOverBudget ? 'text-red-600' : 'text-gray-600'
            }`}>Spent</div>
            <div className={`text-xl font-bold ${
              isOverBudget ? 'text-red-700' : 'text-gray-900'
            }`}>
              {formatCurrency(totalExpenses)}
            </div>
          </div>
          
          {/* Remaining/Over */}
          <div className={`text-center p-4 rounded-lg border ${
            isOverBudget 
              ? 'bg-red-50 border-red-200' 
              : remaining < totalBudget * 0.2 
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-green-50 border-green-200'
          }`}>
            <div className={`text-sm font-medium mb-1 ${
              isOverBudget 
                ? 'text-red-600' 
                : remaining < totalBudget * 0.2 
                  ? 'text-yellow-600'
                  : 'text-green-600'
            }`}>
              {isOverBudget ? 'Over Budget' : 'Remaining'}
            </div>
            <div className={`text-xl font-bold ${
              isOverBudget 
                ? 'text-red-700' 
                : remaining < totalBudget * 0.2 
                  ? 'text-yellow-700'
                  : 'text-green-700'
            }`}>
              {isOverBudget ? '+' : ''}{formatCurrency(remaining)}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Budget Usage</span>
            <span className={`text-sm font-bold ${
              isOverBudget ? 'text-red-600' : isNearBudget ? 'text-yellow-600' : 'text-gray-600'
            }`}>
              {Math.round(percentageUsed)}%
            </span>
          </div>
          
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  isOverBudget 
                    ? 'bg-red-500' 
                    : isNearBudget 
                      ? 'bg-yellow-500' 
                      : 'bg-green-500'
                }`}
                style={{ 
                  width: `${Math.min(percentageUsed, 100)}%` 
                }}
              />
            </div>
          </div>
        </div>

        {/* Details Section */}
        {showDetails && (
          <div className="space-y-3">
            {/* Extra Expense (if over budget) */}
            {isOverBudget && (
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <span className="text-sm font-medium text-red-700">Extra Expense:</span>
                <span className="text-sm font-bold text-red-700">
                  +{formatCurrency(totalExpenses - totalBudget)}
                </span>
              </div>
            )}
            
            {/* Daily Average */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-sm font-medium text-gray-700">Daily Average:</span>
              <span className="text-sm font-bold text-gray-900">
                {formatCurrency(totalExpenses / 7)} {/* Assuming 7-day trip */}
              </span>
            </div>

            {/* Budget Message */}
            {isOverBudget ? (
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-start space-x-2">
                  <WarningIcon className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-red-800">Budget Exceeded</p>
                    <p className="text-red-700">
                      You've exceeded your budget by {formatCurrency(totalExpenses - totalBudget)}. 
                      Consider adjusting future expenses or increasing your budget.
                    </p>
                  </div>
                </div>
              </div>
            ) : isNearBudget ? (
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start space-x-2">
                  <WarningIcon className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800">Approaching Budget Limit</p>
                    <p className="text-yellow-700">
                      You've used {Math.round(percentageUsed)}% of your budget. 
                      Plan remaining expenses carefully.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start space-x-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-green-800">Great Job!</p>
                    <p className="text-green-700">
                      You're staying within budget. You have {formatCurrency(remaining)} remaining 
                      for the rest of your trip.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetTracker;