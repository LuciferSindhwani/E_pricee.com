# VoyageAI - Gemini AI Integration Guide

## Overview

Your VoyageAI project now has comprehensive Gemini AI integration with the following features:

- 🤖 **AI Travel Chat** - Chat with an AI travel assistant
- 🗺️ **Smart Itineraries** - AI-generated trip plans
- ✅ **Packing Lists** - Intelligent packing suggestions
- 💰 **Budget Analysis** - Smart budget breakdown and saving tips
- 🎯 **Recommendations** - Personalized activity and restaurant suggestions
- 🌍 **Trip Suggestions** - AI-powered trip ideas for any location

## Backend Integration

### New AI Service Functions (`server/trips/ai.py`)

#### 1. **generate_itinerary(trip, extra_context)**
Generate a complete itinerary with daily activities, alternatives, and budget tips.

```python
from trips.ai import generate_itinerary

itinerary = generate_itinerary(trip, extra_context={"group_size": 4})
```

Response:
```json
{
  "summary": "7-day Paris adventure",
  "days": [
    {"day": 1, "activities": ["Arrive", "Check-in", "Dinner"]},
    {"day": 2, "activities": ["Eiffel Tower", "Museum", "Cruise"]}
  ],
  "alternatives": [...],
  "budget_tips": [...]
}
```

#### 2. **ai_chat(message, context)**
Chat with the AI travel assistant with optional trip context.

```python
from trips.ai import ai_chat

response = ai_chat(
  "What should I pack for tropical weather?",
  context={"trip_location": "Maldives"}
)
```

#### 3. **generate_ai_recommendations(trip, activity_type)**
Get recommendations for attractions, restaurants, activities, etc.

```python
from trips.ai import generate_ai_recommendations

recommendations = generate_ai_recommendations(trip, activity_type="restaurants")
```

Activity types: `attractions`, `restaurants`, `activities`, `accommodation`, `nightlife`

#### 4. **generate_packing_list(trip, additional_context)**
Create a detailed, categorized packing list.

```python
from trips.ai import generate_packing_list

packing = generate_packing_list(
  trip,
  additional_context="Traveling with a toddler"
)
```

Response:
```json
{
  "categories": {
    "clothing": ["t-shirts", "shorts", ...],
    "toiletries": ["sunscreen", "toothbrush", ...],
    "documents": ["passport", "visa", ...],
    "electronics": ["phone", "charger", ...]
  },
  "tips": ["Pack light for easy travel", ...]
}
```

#### 5. **analyze_trip_budget(trip)**
Get budget breakdown and money-saving tips.

```python
from trips.ai import analyze_trip_budget

analysis = analyze_trip_budget(trip)
```

Response:
```json
{
  "daily_budget": 15000,
  "categories": {
    "accommodation": 50000,
    "food": 30000,
    "activities": 40000,
    "transport": 20000
  },
  "money_saving_tips": [...]
}
```

#### 6. **generate_trip_suggestions(location, budget, duration)**
Get AI-powered trip ideas for a location.

```python
from trips.ai import generate_trip_suggestions

suggestions = generate_trip_suggestions(
  location="Bali",
  budget=500000,  # in cents
  duration=7
)
```

### New API Endpoints

#### Base URL: `http://localhost:8000/api/trips/`

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/generate` | POST | Generate itinerary | ✅ |
| `/{id}/recommendations` | GET | Get recommendations | ✅ |
| `/{id}/packing-list` | GET | Get packing list | ✅ |
| `/{id}/budget-analysis` | GET | Analyze budget | ✅ |
| `/suggestions` | GET | Get trip suggestions | ✅ |
| `/chat` | POST | Chat with AI | ✅ |

#### Example Requests

**Generate Itinerary:**
```bash
curl -X POST http://localhost:8000/api/trips/{trip_id}/generate/ \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"group_size": 4}'
```

**Get Recommendations:**
```bash
curl http://localhost:8000/api/trips/{trip_id}/recommendations?type=restaurants \
  -H "Authorization: Bearer {token}"
```

**AI Chat:**
```bash
curl -X POST http://localhost:8000/api/trips/chat \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What should I pack?",
    "trip_id": "{trip_id}"
  }'
```

**Get Trip Suggestions:**
```bash
curl http://localhost:8000/api/trips/suggestions?location=Paris&budget=500000&duration=7 \
  -H "Authorization: Bearer {token}"
```

## Frontend Integration

### API Client (`src/lib/ai-api.ts`)

The `createAIApiClient` function provides typed access to all AI endpoints:

```typescript
import { createAIApiClient } from '@/lib/ai-api';
import { useAuth } from '@/hooks/use-auth';

const { token } = useAuth();
const client = createAIApiClient({ token });

// Use endpoints
const itinerary = await client.generateItinerary(tripId);
const recommendations = await client.getRecommendations(tripId, 'restaurants');
const packingList = await client.generatePackingList(tripId);
const analysis = await client.analyzeBudget(tripId);
const suggestions = await client.getTripSuggestions('Paris', 500000, 7);
const chatResponse = await client.chatWithAI('What to pack?');
```

### Components

#### 1. **AITravelChat**
Interactive chat component for talking with the AI assistant.

```typescript
import { AITravelChat } from '@/components/AITravelChat';

<AITravelChat tripId={tripId} context={{ location: 'Paris' }} />
```

Features:
- Real-time messaging
- Suggested questions
- Auto-scrolling
- Loading states
- Context-aware responses

#### 2. **TripRecommendations**
Display AI-powered recommendations by category.

```typescript
import { TripRecommendations } from '@/components/TripRecommendations';

<TripRecommendations tripId={tripId} />
```

Features:
- Multiple activity types
- Loading indicators
- Tips section
- Responsive grid

#### 3. **TripPackingList**
Interactive packing checklist with download.

```typescript
import { TripPackingList } from '@/components/TripPackingList';

<TripPackingList tripId={tripId} />
```

Features:
- Categorized items
- Checkbox tracking
- Progress indicator
- Download as text
- Packing tips

#### 4. **TripBudgetAnalysis**
Visual budget breakdown and analysis.

```typescript
import { TripBudgetAnalysis } from '@/components/TripBudgetAnalysis';

<TripBudgetAnalysis tripId={tripId} totalBudget={500000} />
```

Features:
- Daily budget display
- Chart visualization (Recharts)
- Category breakdown
- Money-saving tips

#### 5. **TripSuggestions**
AI-powered trip discovery and suggestions.

```typescript
import { TripSuggestions } from '@/components/TripSuggestions';

<TripSuggestions 
  onSelectSuggestion={(suggestion) => {
    // Handle trip creation from suggestion
  }} 
/>
```

Features:
- Search by location, budget, duration
- Suggestion cards
- Highlights display
- Budget estimation

## Integration into Pages

### Example: Trip Details Page

```typescript
import { TripDetails } from '@/pages/TripDetails';
import { AITravelChat } from '@/components/AITravelChat';
import { TripRecommendations } from '@/components/TripRecommendations';
import { TripPackingList } from '@/components/TripPackingList';
import { TripBudgetAnalysis } from '@/components/TripBudgetAnalysis';

export const TripDetailsPage = ({ tripId }: { tripId: string }) => {
  return (
    <div className="space-y-8">
      {/* Existing trip details */}
      <TripDetails tripId={tripId} />

      {/* AI Features */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AITravelChat tripId={tripId} />
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <TripRecommendations tripId={tripId} />
          <TripBudgetAnalysis tripId={tripId} />
          <TripPackingList tripId={tripId} />
        </div>
      </div>
    </div>
  );
};
```

## Environment Configuration

### Backend (.env)
```
GEMINI_API_KEY=AIzaSyBikAlwSqWO6p-S3KWAQc1N-ybPPRQWdak
GEMINI_MODEL=gemini-1.5-flash
```

### Model Options
- `gemini-1.5-flash` (fast, cost-effective)
- `gemini-1.5-pro` (more capable)
- `gemini-2.0-flash` (latest)

## Error Handling

All AI functions have built-in error handling:

```typescript
try {
  const response = await client.generateItinerary(tripId);
} catch (error) {
  console.error('Error:', error);
  // Fallback UI or error message
}
```

## Rate Limiting & Best Practices

1. **Cache Results**: Store generated content to avoid repeated API calls
2. **Batch Requests**: Generate multiple items in one request when possible
3. **Error Fallbacks**: Provide default content when AI fails
4. **User Feedback**: Show loading states during generation
5. **Token Management**: Ensure valid authentication tokens

## Testing the Integration

### Backend Tests
```bash
# In Python shell
python manage.py shell
>>> from trips.ai import generate_trip_suggestions
>>> suggestions = generate_trip_suggestions("Paris", 500000, 7)
>>> print(suggestions)
```

### Frontend Tests
```typescript
// In browser console
import { createAIApiClient } from './lib/ai-api';
const client = createAIApiClient({ token: 'your-token' });
await client.getTripSuggestions('Paris');
```

## Troubleshooting

### Issue: AI endpoints returning errors

**Solution:**
- Check `GEMINI_API_KEY` in `.env`
- Verify API key has Gemini access
- Check quota on Google Cloud Console

### Issue: Long response times

**Solution:**
- Use `gemini-1.5-flash` for faster responses
- Reduce context/prompt complexity
- Implement caching for repeated requests

### Issue: JSON parsing errors

**Solution:**
- Check AI response format
- Verify `response_mime_type` is set
- Fallback to default responses

## Future Enhancements

1. **Multi-language Support**: Translate responses
2. **Image Generation**: AI-generated trip photos
3. **Real-time Prices**: Integration with booking APIs
4. **Collaborative Planning**: AI recommendations for group trips
5. **ML Personalization**: Learn user preferences over time

## Support

For issues or questions:
1. Check backend logs: `python manage.py` console
2. Check browser console for frontend errors
3. Verify API key and quota on Google Cloud
4. Review response types in `ai-api.ts`

---

**Last Updated**: November 14, 2025  
**Gemini API Version**: 1.5 Flash  
**Status**: ✅ Fully Integrated
