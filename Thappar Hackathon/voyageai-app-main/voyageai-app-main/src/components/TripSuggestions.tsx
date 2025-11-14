import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createAIApiClient } from '@/lib/ai-api';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, Sparkles, MapPin, Compass, DollarSign, Calendar, Map, Plane, Cloud, Utensils, Users, Info, Heart } from 'lucide-react';

interface TripSuggestion {
  title: string;
  destination: string;
  description: string;
  longDescription: string;
  highlights: string[];
  bestTimeToVisit: string;
  climate: string;
  culture: string;
  cuisine: string;
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
  reasonToVisit: string;
}

interface TripSuggestionsProps {
  onSelectSuggestion?: (suggestion: TripSuggestion) => void;
}

export const TripSuggestions: React.FC<TripSuggestionsProps> = ({ onSelectSuggestion }) => {
  const { token } = useAuth();
  const [currentLocation, setCurrentLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [duration, setDuration] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<TripSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<TripSuggestion | null>(null);
  const client = createAIApiClient({ token: token || undefined });

  // Get user's current location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            // Reverse geocode to get location name
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const city = data.address?.city || data.address?.town || data.address?.county || 'Your Location';
            setCurrentLocation(city);
            setIsLoadingLocation(false);
          },
          (error) => {
            console.error('Geolocation error:', error);
            setCurrentLocation('Current Location');
            setIsLoadingLocation(false);
          }
        );
      } else {
        setCurrentLocation('Current Location');
        setIsLoadingLocation(false);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setCurrentLocation('Current Location');
      setIsLoadingLocation(false);
    }
  };

  const handleGetSuggestions = async () => {
    if (!currentLocation) {
      alert('Please enable location or wait for location detection');
      return;
    }

    if (!budget || !duration) {
      alert('Please enter budget and duration');
      return;
    }

    setIsLoading(true);
    setSelectedSuggestion(null);
    try {
      const budgetNum = budget ? parseInt(budget) * 100 : undefined;
      const durationNum = duration ? parseInt(duration) : undefined;

      const response = await client.getTripSuggestions<any>(
        currentLocation,
        budgetNum,
        durationNum,
        interests.length > 0 ? interests : undefined
      );
      setSuggestions(response.tripSuggestions?.suggestions || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      alert('Failed to get suggestions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            AI-Powered Trip Recommendations
          </CardTitle>
          <CardDescription>Get personalized trip suggestions based on your location, budget, and preferences</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current Location - Enhanced */}
            <div className="space-y-3">
              <label className="text-sm font-semibold block mb-2 flex items-center gap-2 text-gray-800">
                <MapPin className="w-5 h-5 text-red-500" />
                Starting From
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">AUTO</span>
              </label>
              <div className="relative">
                <Input
                  placeholder="Detecting your location..."
                  value={currentLocation}
                  disabled={true}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 text-gray-700 font-semibold placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:opacity-100"
                />
                {isLoadingLocation && (
                  <div className="absolute right-3 top-3 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    <span className="text-xs text-blue-600 font-medium">Detecting...</span>
                  </div>
                )}
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                <p className="text-xs text-blue-700 font-medium">
                  📍 Your current city is auto-detected based on your device location.
                </p>
              </div>
            </div>

            {/* Budget - Enhanced */}
            <div className="space-y-3">
              <label className="text-sm font-semibold block mb-2 flex items-center gap-2 text-gray-800">
                <DollarSign className="w-5 h-5 text-green-500" />
                Total Budget ($)
                {budget && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                    ${parseInt(budget).toLocaleString()}
                  </span>
                )}
              </label>
              <div className="relative">
                <Input
                  placeholder="e.g., 5000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  type="number"
                  min="500"
                  max="100000"
                  step="100"
                  className="pl-8 bg-white border-2 border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 font-semibold text-gray-700 placeholder-gray-400"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleGetSuggestions();
                  }}
                />
                <span className="absolute left-3 top-3 text-gray-400">$</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Budget Range Suggestions:</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {['1000', '3000', '5000', '10000'].map((val) => (
                    <button
                      key={val}
                      onClick={() => setBudget(val)}
                      className={`text-xs px-3 py-1 rounded-full font-medium transition-all ${
                        budget === val
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-green-100'
                      }`}
                    >
                      ${val}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Duration - Enhanced */}
            <div className="space-y-3">
              <label className="text-sm font-semibold block mb-2 flex items-center gap-2 text-gray-800">
                <Calendar className="w-5 h-5 text-purple-500" />
                Duration (days)
                {duration && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                    {duration} days
                  </span>
                )}
              </label>
              <div className="relative">
                <Input
                  placeholder="e.g., 7"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  type="number"
                  min="1"
                  max="90"
                  step="1"
                  className="pl-8 bg-white border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 font-semibold text-gray-700 placeholder-gray-400"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleGetSuggestions();
                  }}
                />
                <span className="absolute left-3 top-3 text-gray-400">📅</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Popular Durations:</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {['3', '5', '7', '10', '14'].map((val) => (
                    <button
                      key={val}
                      onClick={() => setDuration(val)}
                      className={`text-xs px-3 py-1 rounded-full font-medium transition-all ${
                        duration === val
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-purple-100'
                      }`}
                    >
                      {val}d
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Interests - Enhanced */}
          <div className="space-y-3 bg-gradient-to-br from-orange-50 to-pink-50 p-4 rounded-lg border-2 border-orange-200">
            <label className="text-sm font-semibold block mb-2 flex items-center gap-2 text-gray-800">
              <Heart className="w-5 h-5 text-red-500" />
              Trip Interests (Optional)
              {interests.length > 0 && (
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                  {interests.length} selected
                </span>
              )}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: '🏔️', label: 'Hiking' },
                { icon: '🏖️', label: 'Beach' },
                { icon: '🍽️', label: 'Food' },
                { icon: '🏛️', label: 'Culture' },
                { icon: '🎨', label: 'Art' },
                { icon: '🛍️', label: 'Shopping' },
                { icon: '🌙', label: 'Nightlife' },
                { icon: '🧘', label: 'Wellness' },
                { icon: '📸', label: 'Photography' },
                { icon: '🎭', label: 'Entertainment' },
                { icon: '⛰️', label: 'Adventure' },
                { icon: '🌺', label: 'Nature' }
              ].map((interest) => (
                <button
                  key={interest.label}
                  onClick={() => {
                    if (interests.includes(interest.label)) {
                      setInterests(interests.filter((i) => i !== interest.label));
                    } else {
                      setInterests([...interests, interest.label]);
                    }
                  }}
                  className={`text-sm px-3 py-2 rounded-lg font-medium transition-all border-2 flex items-center justify-center gap-2 ${
                    interests.includes(interest.label)
                      ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                      : 'bg-white text-gray-700 border-orange-200 hover:border-orange-400 hover:bg-orange-50'
                  }`}
                >
                  <span>{interest.icon}</span>
                  {interest.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-600 italic">Select your interests to get more personalized recommendations</p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleGetSuggestions}
              disabled={isLoading || !currentLocation || !budget || !duration}
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold py-6 shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  <span>Finding Best Destinations...</span>
                </>
              ) : (
                <>
                  <Compass className="w-5 h-5 mr-2" />
                  <span>Get AI Recommendations</span>
                </>
              )}
            </Button>

            {/* Helper Text */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                How it works:
              </p>
              <ul className="space-y-1 text-xs text-gray-700">
                <li>✓ We auto-detect your current city using your device location</li>
                <li>✓ Our AI analyzes your budget and trip duration</li>
                <li>✓ We recommend 5 perfect destinations tailored to you</li>
                <li>✓ Each suggestion includes climate, culture, activities, and budget details</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Suggestions Grid */}
      {suggestions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Plane className="w-6 h-6" />
            Recommended Destinations
          </h2>

          {/* Summary Stats */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{suggestions.length}</p>
                  <p className="text-sm text-gray-600">Destinations</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-indigo-600">From {currentLocation}</p>
                  <p className="text-sm text-gray-600">Starting Point</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">${budget}/trip</p>
                  <p className="text-sm text-gray-600">Your Budget</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">{duration} days</p>
                  <p className="text-sm text-gray-600">Duration</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Suggestions List - Detailed View */}
          <div className="space-y-4">
            {suggestions.map((suggestion, idx) => (
              <Card
                key={idx}
                className={`overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer ${
                  selectedSuggestion?.destination === suggestion.destination
                    ? 'ring-2 ring-blue-500 shadow-lg'
                    : ''
                }`}
                onClick={() => setSelectedSuggestion(suggestion)}
              >
                <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">{suggestion.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-medium">{suggestion.destination}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold">{suggestion.estimatedBudget}</p>
                      <p className="text-xs opacity-90">Estimated Total</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-6 space-y-6">
                  {/* Main Description */}
                  <div>
                    <h4 className="font-semibold text-lg mb-2 text-gray-800">Why Visit?</h4>
                    <p className="text-gray-700 text-base leading-relaxed">{suggestion.longDescription}</p>
                    <p className="text-sm italic text-blue-600 mt-2 font-medium">{suggestion.reasonToVisit}</p>
                  </div>

                  {/* Key Highlights */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                      Top Experiences
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {suggestion.highlights.map((highlight, hidx) => (
                        <div
                          key={hidx}
                          className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-sm text-gray-700 flex gap-2"
                        >
                          <span className="text-blue-600 font-bold">•</span>
                          {highlight}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Activities */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Things to Do</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {suggestion.activities.map((activity, aidx) => (
                        <div key={aidx} className="flex gap-2 text-sm text-gray-700">
                          <span className="text-indigo-500">✓</span>
                          {activity}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Climate & Culture */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-sky-50 to-blue-50 p-4 rounded-lg border border-sky-200">
                      <h5 className="font-semibold text-sm text-gray-800 mb-2 flex items-center gap-2">
                        <Cloud className="w-4 h-4" />
                        Climate
                      </h5>
                      <p className="text-sm text-gray-700">{suggestion.climate}</p>
                      <p className="text-xs text-blue-600 mt-2 font-medium">Best: {suggestion.bestTimeToVisit}</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                      <h5 className="font-semibold text-sm text-gray-800 mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Culture
                      </h5>
                      <p className="text-sm text-gray-700">{suggestion.culture}</p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-4 rounded-lg border border-orange-200">
                      <h5 className="font-semibold text-sm text-gray-800 mb-2 flex items-center gap-2">
                        <Utensils className="w-4 h-4" />
                        Cuisine
                      </h5>
                      <p className="text-sm text-gray-700">{suggestion.cuisine}</p>
                    </div>
                  </div>

                  {/* Budget Breakdown */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                    <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      Budget Breakdown
                    </h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <p className="text-xs text-gray-600">Accommodation</p>
                        <p className="text-lg font-bold text-green-600">{suggestion.budgetBreakdown.accommodation}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Food & Dining</p>
                        <p className="text-lg font-bold text-green-600">{suggestion.budgetBreakdown.food}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Activities</p>
                        <p className="text-lg font-bold text-green-600">{suggestion.budgetBreakdown.activities}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Transport</p>
                        <p className="text-lg font-bold text-green-600">{suggestion.budgetBreakdown.transport}</p>
                      </div>
                    </div>
                  </div>

                  {/* Accommodation & Transport */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h5 className="font-semibold text-gray-800 mb-2">🏨 Where to Stay</h5>
                      <p className="text-sm text-gray-700">{suggestion.accommodation}</p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h5 className="font-semibold text-gray-800 mb-2">🚗 Getting Around</h5>
                      <p className="text-sm text-gray-700">{suggestion.transport}</p>
                    </div>
                  </div>

                  {/* Travel Tips */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Info className="w-4 h-4 text-blue-600" />
                      Travel Tips & Information
                    </h5>
                    <ul className="space-y-2">
                      {suggestion.travelTips.map((tip, tidx) => (
                        <li key={tidx} className="text-sm text-gray-700 flex gap-2">
                          <span className="text-blue-600">→</span>
                          {tip}
                        </li>
                      ))}
                      <li className="text-sm text-gray-700 flex gap-2 border-t border-blue-200 pt-2 mt-2">
                        <span className="text-blue-600">📋</span>
                        <span><strong>Visa:</strong> {suggestion.visaRequirements}</span>
                      </li>
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => onSelectSuggestion?.(suggestion)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      size="lg"
                    >
                      <Plane className="w-4 h-4 mr-2" />
                      Plan This Trip
                    </Button>
                    <Button
                      onClick={() => setSelectedSuggestion(null)}
                      variant="outline"
                      size="lg"
                    >
                      View Less
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && suggestions.length === 0 && (currentLocation || budget || duration) && (
        <Card className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100">
          <Compass className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600 text-lg">Click "Get AI Recommendations" to discover perfect destinations</p>
          <p className="text-gray-500 text-sm mt-2">Our AI will analyze your preferences and find the best trips for you</p>
        </Card>
      )}
    </div>
  );
};

export default TripSuggestions;
