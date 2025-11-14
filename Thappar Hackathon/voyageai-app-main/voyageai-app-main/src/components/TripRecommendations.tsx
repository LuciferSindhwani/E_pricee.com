import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createAIApiClient } from '@/lib/ai-api';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, MapPin, Utensils, Camera, MapPinned } from 'lucide-react';

interface TripRecommendationsProps {
  tripId: string;
}

const activityTypes = [
  { id: 'attractions', label: 'Attractions', icon: Camera },
  { id: 'restaurants', label: 'Restaurants', icon: Utensils },
  { id: 'activities', label: 'Activities', icon: MapPin },
  { id: 'accommodation', label: 'Hotels', icon: MapPinned },
];

export const TripRecommendations: React.FC<TripRecommendationsProps> = ({ tripId }) => {
  const { token } = useAuth();
  const [recommendations, setRecommendations] = useState<{
    [key: string]: {
      recommendations: string[];
      tips?: string[];
    };
  }>({});
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
  const [selectedType, setSelectedType] = useState('attractions');
  const client = createAIApiClient({ token: token || undefined });

  const fetchRecommendations = async (type: string) => {
    if (recommendations[type]) {
      setSelectedType(type);
      return;
    }

    setIsLoading((prev) => ({ ...prev, [type]: true }));
    try {
      const response = await client.getRecommendations<any>(tripId, type);
      setRecommendations((prev) => ({
        ...prev,
        [type]: response.recommendations,
      }));
      setSelectedType(type);
    } catch (error) {
      console.error(`Error fetching ${type} recommendations:`, error);
    } finally {
      setIsLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const currentRecommendations = recommendations[selectedType];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI-Powered Recommendations</CardTitle>
        <CardDescription>Personalized suggestions for your trip</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Activity Type Selection */}
        <div className="flex flex-wrap gap-2">
          {activityTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Button
                key={type.id}
                variant={selectedType === type.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => fetchRecommendations(type.id)}
                disabled={isLoading[type.id]}
                className="flex items-center gap-2"
              >
                {isLoading[type.id] ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Icon className="w-3 h-3" />
                )}
                {type.label}
              </Button>
            );
          })}
        </div>

        {/* Recommendations Display */}
        {currentRecommendations ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentRecommendations.recommendations?.map((rec, idx) => (
                <Card key={idx} className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50">
                  <p className="text-sm font-medium text-gray-900">{rec}</p>
                </Card>
              ))}
            </div>

            {/* Tips */}
            {currentRecommendations.tips && currentRecommendations.tips.length > 0 && (
              <div className="border-t pt-4">
                <p className="text-sm font-semibold mb-2">💡 Tips:</p>
                <ul className="space-y-2">
                  {currentRecommendations.tips.map((tip, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex gap-2">
                      <span className="text-blue-500">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Select an activity type to get recommendations</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TripRecommendations;
