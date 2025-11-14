import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createAIApiClient } from '@/lib/ai-api';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, DollarSign, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BudgetBreakdown {
  [key: string]: number;
}

interface BudgetAnalysis {
  daily_budget?: number;
  categories?: BudgetBreakdown;
  money_saving_tips?: string[];
}

interface TripBudgetAnalysisProps {
  tripId: string;
  totalBudget?: number;
}

export const TripBudgetAnalysis: React.FC<TripBudgetAnalysisProps> = ({ tripId, totalBudget }) => {
  const { token } = useAuth();
  const [analysis, setAnalysis] = useState<BudgetAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const client = createAIApiClient({ token: token || undefined });

  useEffect(() => {
    fetchBudgetAnalysis();
  }, [tripId]);

  const fetchBudgetAnalysis = async () => {
    setIsLoading(true);
    try {
      const response = await client.analyzeBudget<any>(tripId);
      setAnalysis(response.analysis);
    } catch (error) {
      console.error('Error fetching budget analysis:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          Unable to load budget analysis
        </CardContent>
      </Card>
    );
  }

  const chartData = Object.entries(analysis.categories || {}).map(([category, amount]) => ({
    name: category.replace(/_/g, ' ').charAt(0).toUpperCase() + category.slice(1),
    amount: typeof amount === 'number' ? amount : 0,
  }));

  const totalAnalyzed = chartData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
      {/* Daily Budget Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Daily Budget
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analysis.daily_budget && (
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600">
                ${(analysis.daily_budget / 100).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 mt-2">Recommended daily spending</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Budget Breakdown Chart */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Budget Breakdown</CardTitle>
            <CardDescription>Recommended spending by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                />
                <YAxis />
                <Tooltip
                  formatter={(value) => `$${(value as number).toFixed(2)}`}
                  contentStyle={{ backgroundColor: '#f0f9ff', border: '1px solid #0ea5e9' }}
                />
                <Bar dataKey="amount" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>

            {/* Budget Summary Table */}
            <div className="mt-6 space-y-2">
              {chartData.map((item) => (
                <div key={item.name} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-sm font-bold text-blue-600">
                    ${(item.amount / 100).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded font-bold border border-blue-200">
                <span>Total</span>
                <span className="text-blue-600">${(totalAnalyzed / 100).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Money Saving Tips */}
      {analysis.money_saving_tips && analysis.money_saving_tips.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5" />
              Money-Saving Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {analysis.money_saving_tips.map((tip, idx) => (
                <li key={idx} className="flex gap-3 p-3 bg-green-50 rounded border border-green-200">
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-sm text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TripBudgetAnalysis;
