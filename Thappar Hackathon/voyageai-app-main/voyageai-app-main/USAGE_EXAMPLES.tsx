// Example: Complete Integration into Your App

// ============================================================================
// EXAMPLE 1: Minimal Integration (Just add AI Chat to Trip Details)
// ============================================================================

import { AITravelChat } from '@/components/AITravelChat';

export function TripDetailsPage({ tripId }: { tripId: string }) {
  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Your existing trip details */}
      <div className="col-span-2">
        <h1>Trip Details</h1>
        {/* existing content */}
      </div>

      {/* Add AI Chat in sidebar */}
      <div className="col-span-1">
        <AITravelChat tripId={tripId} />
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: Full AI Dashboard (All Features)
// ============================================================================

import { AITravelChat } from '@/components/AITravelChat';
import { TripRecommendations } from '@/components/TripRecommendations';
import { TripPackingList } from '@/components/TripPackingList';
import { TripBudgetAnalysis } from '@/components/TripBudgetAnalysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function AITripDashboard({ tripId }: { tripId: string }) {
  return (
    <Tabs defaultValue="chat" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="chat">💬 Chat</TabsTrigger>
        <TabsTrigger value="itinerary">📋 Itinerary</TabsTrigger>
        <TabsTrigger value="recommendations">🎯 Places</TabsTrigger>
        <TabsTrigger value="packing">✅ Packing</TabsTrigger>
        <TabsTrigger value="budget">💰 Budget</TabsTrigger>
      </TabsList>

      <TabsContent value="chat">
        <AITravelChat tripId={tripId} />
      </TabsContent>

      <TabsContent value="itinerary">
        {/* Add itinerary display here */}
        <div className="p-4">Your itinerary will appear here</div>
      </TabsContent>

      <TabsContent value="recommendations">
        <TripRecommendations tripId={tripId} />
      </TabsContent>

      <TabsContent value="packing">
        <TripPackingList tripId={tripId} />
      </TabsContent>

      <TabsContent value="budget">
        <TripBudgetAnalysis tripId={tripId} />
      </TabsContent>
    </Tabs>
  );
}

// ============================================================================
// EXAMPLE 3: Discovery Page (Find New Trips)
// ============================================================================

import { TripSuggestions } from '@/components/TripSuggestions';
import { useNavigate } from 'react-router-dom';
import { createApiClient } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';

export function DiscoverPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const api = createApiClient({ token });

  const handleSelectSuggestion = async (suggestion: any) => {
    try {
      // Create trip from suggestion
      const response = await api.post('/api/trips/', {
        title: suggestion.title,
        location: suggestion.title.split(',')[0], // Extract location
        // ... other fields
      });
      const tripId = response.trip.id;
      navigate(`/trips/${tripId}`);
    } catch (error) {
      console.error('Error creating trip:', error);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-2">Discover Your Next Adventure</h1>
      <p className="text-gray-600 mb-8">
        Let AI help you find the perfect destination
      </p>

      <TripSuggestions onSelectSuggestion={handleSelectSuggestion} />
    </div>
  );
}

// ============================================================================
// EXAMPLE 4: Direct API Usage (Without Components)
// ============================================================================

import { createAIApiClient } from '@/lib/ai-api';
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';

export function CustomAIIntegration({ tripId }: { tripId: string }) {
  const { token } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const client = createAIApiClient({ token });

  const generateEverything = async () => {
    setLoading(true);
    try {
      // Get all AI data for trip
      const [itinerary, recommendations, packing, budget] = await Promise.all([
        client.generateItinerary(tripId),
        client.getRecommendations(tripId, 'attractions'),
        client.generatePackingList(tripId),
        client.analyzeBudget(tripId),
      ]);

      setData({
        itinerary,
        recommendations,
        packing,
        budget,
      });
    } catch (error) {
      console.error('Error fetching AI data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={generateEverything} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Trip Plan'}
      </button>

      {data && (
        <div className="space-y-6">
          <div>
            <h2>Itinerary</h2>
            <pre>{JSON.stringify(data.itinerary, null, 2)}</pre>
          </div>
          <div>
            <h2>Recommendations</h2>
            <pre>{JSON.stringify(data.recommendations, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// EXAMPLE 5: Chat with Trip Context
// ============================================================================

import { createAIApiClient } from '@/lib/ai-api';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';

export function ContextualChat({ trip }: { trip: any }) {
  const { token } = useAuth();
  const client = createAIApiClient({ token });

  const handleQuickQuestion = async (question: string) => {
    const response = await client.chatWithAI(question, {
      trip_title: trip.title,
      trip_location: trip.location,
      trip_dates: `${trip.startDate} to ${trip.endDate}`,
      trip_budget: trip.budgetCents,
    });

    console.log('AI Response:', response);
  };

  return (
    <div className="space-y-4">
      <h2>Quick Questions About Your Trip</h2>
      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={() =>
            handleQuickQuestion(`What's the best time to visit ${trip.location}?`)
          }
        >
          Best Time to Visit
        </Button>
        <Button
          onClick={() =>
            handleQuickQuestion(
              `What budget should I plan for ${trip.location}? My total is $${trip.budgetCents / 100}.`
            )
          }
        >
          Budget Tips
        </Button>
        <Button
          onClick={() =>
            handleQuickQuestion(`What visa do I need for ${trip.location}?`)
          }
        >
          Visa Info
        </Button>
        <Button
          onClick={() =>
            handleQuickQuestion(`What should I pack for ${trip.location}?`)
          }
        >
          Packing Tips
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 6: Async Data Loading with Error Handling
// ============================================================================

import { createAIApiClient } from '@/lib/ai-api';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';

interface AIData {
  recommendations: any;
  packingList: any;
  budget: any;
  error?: string;
}

export function AIDataLoader({ tripId }: { tripId: string }) {
  const { token } = useAuth();
  const [data, setData] = useState<AIData | null>(null);
  const [loading, setLoading] = useState(true);
  const client = createAIApiClient({ token });

  useEffect(() => {
    loadAIData();
  }, [tripId]);

  const loadAIData = async () => {
    setLoading(true);
    try {
      const [rec, pack, bud] = await Promise.all([
        client.getRecommendations(tripId, 'attractions'),
        client.generatePackingList(tripId),
        client.analyzeBudget(tripId),
      ]);

      setData({
        recommendations: rec,
        packingList: pack,
        budget: bud,
      });
    } catch (error) {
      setData({
        recommendations: null,
        packingList: null,
        budget: null,
        error: 'Failed to load AI data',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (data?.error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="flex items-center gap-2 p-4">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span>{data.error}</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">Recommendations</h3>
          <pre>{JSON.stringify(data?.recommendations, null, 2)}</pre>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">Packing List</h3>
          <pre>{JSON.stringify(data?.packingList, null, 2)}</pre>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">Budget Analysis</h3>
          <pre>{JSON.stringify(data?.budget, null, 2)}</pre>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// EXAMPLE 7: Using in a Modal
// ============================================================================

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AITravelChat } from '@/components/AITravelChat';

export function AIAssistantModal({
  open,
  onOpenChange,
  tripId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripId: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>AI Travel Assistant</DialogTitle>
          <DialogDescription>
            Ask anything about your trip planning
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-auto">
          <AITravelChat tripId={tripId} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Usage:
// const [open, setOpen] = useState(false);
// <button onClick={() => setOpen(true)}>Open AI Assistant</button>
// <AIAssistantModal open={open} onOpenChange={setOpen} tripId={trip.id} />
