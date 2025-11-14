import { createApiClient } from './api';

const BASE = ''; // use vite proxy to backend

export type ApiOptions = {
  token?: string | null;
};

export function createAIApiClient(options: ApiOptions = {}) {
  const client = createApiClient(options);

  return {
    // Trip Itinerary Generation
    generateItinerary: <T>(tripId: string, context?: Record<string, any>) =>
      client.post<T>(`/api/trips/${tripId}/generate/`, context),

    // AI Recommendations
    getRecommendations: <T>(tripId: string, type: string = 'attractions') =>
      client.get<T>(`/api/trips/${tripId}/recommendations?type=${type}`),

    // Packing List
    generatePackingList: <T>(tripId: string, context?: string) =>
      client.get<T>(`/api/trips/${tripId}/packing-list?context=${context || ''}`),

    // Budget Analysis
    analyzeBudget: <T>(tripId: string) =>
      client.get<T>(`/api/trips/${tripId}/budget-analysis`),

    // Trip Suggestions
    getTripSuggestions: <T>(location: string, budget?: number, duration?: number, interests?: string[]) => {
      const params = new URLSearchParams({ location });
      if (budget) params.append('budget', budget.toString());
      if (duration) params.append('duration', duration.toString());
      if (interests && interests.length > 0) {
        params.append('interests', interests.join(','));
      }
      return client.get<T>(`/api/trips/suggestions?${params.toString()}`);
    },

    // AI Travel Chat
    chatWithAI: <T>(message: string, context?: Record<string, any>, tripId?: string) =>
      client.post<T>('/api/trips/chat', {
        message,
        context: context || {},
        trip_id: tripId,
      }),
  };
}

// Response types
export interface ItineraryResponse {
  trip: {
    id: string;
    title: string;
    itinerary: {
      summary: string;
      days: Array<{
        day: number;
        activities: string[];
      }>;
      alternatives: Array<{
        title: string;
        activities: string[];
      }>;
      budget_tips: string[];
    };
  };
}

export interface RecommendationsResponse {
  recommendations: {
    recommendations: string[];
    activity_type: string;
    tips?: string[];
  };
}

export interface PackingListResponse {
  packingList: {
    categories: {
      clothing?: string[];
      toiletries?: string[];
      documents?: string[];
      electronics?: string[];
      [key: string]: string[] | undefined;
    };
    tips: string[];
  };
}

export interface BudgetAnalysisResponse {
  analysis: {
    daily_budget: number;
    categories: {
      accommodation: number;
      food: number;
      activities: number;
      transport: number;
      [key: string]: number;
    };
    money_saving_tips: string[];
  };
}

export interface TripSuggestionsResponse {
  tripSuggestions: {
    suggestions: Array<{
      title: string;
      destination: string;
      description: string;
      longDescription: string;
      reasonToVisit: string;
      bestTimeToVisit: string;
      climate: string;
      culture: string;
      cuisine: string;
      highlights: string[];
      activities: string[];
      accommodation: string;
      transport: string;
      estimatedBudget: string;
      budgetBreakdown: {
        accommodation: string;
        food: string;
        activities: string;
        transport: string;
      };
      travelTips: string[];
      visaRequirements: string;
    }>;
  };
}

export interface ChatResponse {
  response: string;
}
