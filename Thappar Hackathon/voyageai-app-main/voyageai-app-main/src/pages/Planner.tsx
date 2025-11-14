import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, MapPin, Calendar, Users, DollarSign, Car, Accessibility, ChevronRight, ChevronLeft, Check, Compass, Heart, Zap, Loader2, Info, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { createApiClient } from "@/lib/api";
import { useNavigate } from "react-router-dom";

/**
 * Planner Page - AI Trip Planning Interface with Multi-Step Wizard
 * 
 * FEATURES:
 * - Multi-step form wizard (4 steps)
 * - Pre-designed trip templates
 * - Real-time budget preview
 * - Advanced customization options
 * - Integration with geolocation
 * - Trip suggestions integration
 */

const Planner = () => {
  const { toast } = useToast();
  const { token } = useAuth();
  const api = createApiClient({ token });
  const navigate = useNavigate();
  
  // State Management
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [tripTemplate, setTripTemplate] = useState<string | null>(null);
  
  // Form Data
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [groupSize, setGroupSize] = useState("");
  const [budget, setBudget] = useState("");
  const [travelPace, setTravelPace] = useState("moderate");
  const [interests, setInterests] = useState<string[]>([]);
  const [specialRequirements, setSpecialRequirements] = useState<string[]>([]);
  
  // Geolocation
  const [currentLocation, setCurrentLocation] = useState("");
  const [detectingLocation, setDetectingLocation] = useState(false);
  
  // Budget Preview
  const [budgetBreakdown, setBudgetBreakdown] = useState<any>(null);

  // Auto-detect location on mount
  useEffect(() => {
    detectCurrentLocation();
  }, []);

  const detectCurrentLocation = async () => {
    setDetectingLocation(true);
    try {
      const position = await new Promise<GeolocationCoordinates>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos.coords),
          (err) => reject(err)
        );
      });

      // Reverse geocode to get city name
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.latitude}&lon=${position.longitude}`
      );
      const data = await response.json();
      const city = data.address?.city || data.address?.town || data.address?.county || "Your Location";
      setCurrentLocation(city);
      setDestination(city);
    } catch (error) {
      console.log("Location detection skipped");
    } finally {
      setDetectingLocation(false);
    }
  };

  // Trip Templates
  const tripTemplates = [
    { id: "adventure", name: "Adventure", icon: "🏔️", color: "from-orange-400 to-red-600" },
    { id: "relaxation", name: "Relaxation", icon: "🏖️", color: "from-blue-400 to-cyan-600" },
    { id: "culture", name: "Culture", icon: "🏛️", color: "from-purple-400 to-pink-600" },
    { id: "food", name: "Food Tour", icon: "🍽️", color: "from-yellow-400 to-orange-600" },
    { id: "city", name: "City Explorer", icon: "🏙️", color: "from-slate-400 to-blue-600" },
  ];

  // Interest Categories
  const interestCategories = [
    "🏔️ Hiking",
    "🏖️ Beach",
    "🍽️ Food",
    "🎭 Culture",
    "🛍️ Shopping",
    "🌃 Nightlife",
    "🏛️ History",
    "🎨 Art",
    "🚴 Sports",
    "📸 Photography",
    "🌿 Nature",
    "🏨 Luxury",
  ];

  // Special Requirements
  const specialRequirementsList = [
    { id: "car", label: "Car Rental", icon: Car },
    { id: "accessibility", label: "Accessibility", icon: Accessibility },
    { id: "pet-friendly", label: "Pet Friendly" },
    { id: "family", label: "Family Friendly" },
    { id: "wifi", label: "WiFi Required" },
    { id: "vegan", label: "Vegan Options" },
  ];

  // Travel Pace Options
  const travelPaceOptions = [
    { id: "relaxed", label: "Relaxed", description: "2-3 activities per day" },
    { id: "moderate", label: "Moderate", description: "4-5 activities per day" },
    { id: "fast", label: "Fast-Paced", description: "6+ activities per day" },
  ];

  // Budget Options with Breakdown
  const budgetOptions = [
    {
      id: "budget",
      label: "Budget",
      range: "<$500",
      breakdown: { accommodation: 150, food: 150, activities: 100, transport: 50 },
    },
    {
      id: "moderate",
      label: "Moderate",
      range: "$500-1500",
      breakdown: { accommodation: 400, food: 300, activities: 200, transport: 150 },
    },
    {
      id: "luxury",
      label: "Luxury",
      range: "$1500-3000",
      breakdown: { accommodation: 1000, food: 600, activities: 400, transport: 300 },
    },
    {
      id: "premium",
      label: "Premium",
      range: "$3000+",
      breakdown: { accommodation: 1500, food: 800, activities: 600, transport: 400 },
    },
  ];

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const toggleRequirement = (requirement: string) => {
    setSpecialRequirements((prev) =>
      prev.includes(requirement)
        ? prev.filter((r) => r !== requirement)
        : [...prev, requirement]
    );
  };

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!destination || !startDate || !endDate || !groupSize || !budget) {
      toast({
        title: "Missing information",
        description: "Please complete all steps before generating",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const created = await api.post<{ trip: any }>(`/api/trips/`, {
        title: `${destination} Trip`,
        startDate,
        endDate,
        budgetCents: parseInt(budget) * 100,
        location: destination,
        vehicle: groupSize,
        accessibility: { notes: interests.join(", ") },
      });
      
      const gen = await api.post<{ trip: any }>(`/api/trips/${created.trip.id}/generate`, {});
      
      toast({
        title: "Itinerary Generated!",
        description: "Your personalized trip plan is ready",
      });
      
      navigate(`/trips/${gen.trip.id}`);
    } catch (err: any) {
      toast({
        title: "Generation failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    if (step === 1 && !destination) {
      toast({
        title: "Destination required",
        description: "Please select or enter a destination",
        variant: "destructive",
      });
      return;
    }
    if (step === 2 && (!startDate || !endDate)) {
      toast({
        title: "Dates required",
        description: "Please select travel dates",
        variant: "destructive",
      });
      return;
    }
    if (step === 3 && (!groupSize || !budget)) {
      toast({
        title: "Details required",
        description: "Please select group size and budget",
        variant: "destructive",
      });
      return;
    }
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(Math.max(1, step - 1));
  };

  const stepProgress = (step / 4) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 mb-4 font-medium">
              <Sparkles className="w-4 h-4" />
              Multi-Step AI Trip Planner
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Plan Your Perfect Trip
            </h1>
            <p className="text-lg text-slate-600">
              Let AI create a personalized itinerary in just 4 easy steps
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-3">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    s < step
                      ? "bg-green-500 text-white"
                      : s === step
                      ? "bg-blue-600 text-white ring-4 ring-blue-200"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {s < step ? <Check className="w-6 h-6" /> : s}
                </div>
              ))}
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                style={{ width: `${stepProgress}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <Card className="shadow-2xl animate-scale-in">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white pb-6">
              <CardTitle className="text-2xl">
                {step === 1 && "🌍 Where are you going?"}
                {step === 2 && "📅 When are you traveling?"}
                {step === 3 && "👥 Tell us about your trip"}
                {step === 4 && "🎯 Finalize your preferences"}
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-8 pb-8">
              <form onSubmit={step === 4 ? handleGenerate : (e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
                {/* STEP 1: DESTINATION & TEMPLATES */}
                {step === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    {/* Template Selection */}
                    <div>
                      <label className="text-lg font-semibold mb-4 block">Choose a Trip Template (Optional)</label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {tripTemplates.map((template) => (
                          <button
                            key={template.id}
                            type="button"
                            onClick={() => setTripTemplate(tripTemplate === template.id ? null : template.id)}
                            className={`p-4 rounded-lg text-center transition-all border-2 ${
                              tripTemplate === template.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-blue-300"
                            }`}
                          >
                            <div className="text-3xl mb-2">{template.icon}</div>
                            <div className="text-sm font-medium">{template.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Destination Input */}
                    <div className="space-y-3">
                      <Label className="text-lg font-semibold flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        Destination
                      </Label>
                      <div className="space-y-2">
                        <Input
                          placeholder="e.g., Tokyo, Paris, Bali..."
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          className="py-3 text-base"
                        />
                        {currentLocation && !destination && (
                          <button
                            type="button"
                            onClick={() => setDestination(currentLocation)}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                          >
                            <Compass className="w-4 h-4" />
                            Use current location: {currentLocation}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: DATES */}
                {step === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Start Date */}
                      <div className="space-y-3">
                        <Label className="text-lg font-semibold flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-green-600" />
                          Start Date
                        </Label>
                        <Input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="py-3 text-base"
                        />
                      </div>

                      {/* End Date */}
                      <div className="space-y-3">
                        <Label className="text-lg font-semibold flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-red-600" />
                          End Date
                        </Label>
                        <Input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="py-3 text-base"
                        />
                      </div>
                    </div>

                    {/* Duration Display */}
                    {startDate && endDate && (
                      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                        <p className="text-center text-lg font-semibold text-blue-900">
                          ✈️ {calculateDays()} days trip
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 3: GROUP SIZE & BUDGET */}
                {step === 3 && (
                  <div className="space-y-6 animate-fade-in">
                    {/* Group Size */}
                    <div className="space-y-3">
                      <Label className="text-lg font-semibold flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-600" />
                        Group Size
                      </Label>
                      <Select value={groupSize} onValueChange={setGroupSize}>
                        <SelectTrigger className="py-3 text-base">
                          <SelectValue placeholder="Select group size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solo">Solo Traveler</SelectItem>
                          <SelectItem value="couple">Couple (2 people)</SelectItem>
                          <SelectItem value="small">Small Group (3-5)</SelectItem>
                          <SelectItem value="large">Large Group (6+)</SelectItem>
                          <SelectItem value="family">Family with Kids</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Budget Selection */}
                    <div className="space-y-3">
                      <Label className="text-lg font-semibold flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        Budget
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        {budgetOptions.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => {
                              setBudget(option.id);
                              setBudgetBreakdown(option.breakdown);
                            }}
                            className={`p-4 rounded-lg text-left transition-all border-2 ${
                              budget === option.id
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200 hover:border-green-300"
                            }`}
                          >
                            <div className="font-semibold text-gray-900">{option.label}</div>
                            <div className="text-sm text-gray-600">{option.range}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Budget Breakdown Preview */}
                    {budgetBreakdown && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4">
                        <p className="font-semibold text-gray-900 mb-3">Budget Breakdown:</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>🏨 Accommodation</span>
                            <span className="font-semibold">${budgetBreakdown.accommodation}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>🍽️ Food & Dining</span>
                            <span className="font-semibold">${budgetBreakdown.food}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>🎭 Activities</span>
                            <span className="font-semibold">${budgetBreakdown.activities}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>🚗 Transport</span>
                            <span className="font-semibold">${budgetBreakdown.transport}</span>
                          </div>
                          <div className="border-t border-green-300 pt-2 mt-2 flex justify-between font-bold text-green-700">
                            <span>Total</span>
                            <span>${(budgetBreakdown.accommodation + budgetBreakdown.food + budgetBreakdown.activities + budgetBreakdown.transport)}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Travel Pace */}
                    <div className="space-y-3">
                      <Label className="text-lg font-semibold flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-600" />
                        Travel Pace
                      </Label>
                      <div className="grid grid-cols-3 gap-3">
                        {travelPaceOptions.map((pace) => (
                          <button
                            key={pace.id}
                            type="button"
                            onClick={() => setTravelPace(pace.id)}
                            className={`p-3 rounded-lg text-center transition-all border-2 ${
                              travelPace === pace.id
                                ? "border-yellow-500 bg-yellow-50"
                                : "border-gray-200 hover:border-yellow-300"
                            }`}
                          >
                            <div className="font-semibold text-sm">{pace.label}</div>
                            <div className="text-xs text-gray-600">{pace.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: INTERESTS & REQUIREMENTS */}
                {step === 4 && (
                  <div className="space-y-6 animate-fade-in">
                    {/* Trip Summary */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4">
                      <p className="text-sm font-semibold text-gray-700 mb-3">✨ Your Trip Summary:</p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div><span className="font-semibold">📍 Destination:</span> {destination}</div>
                        <div><span className="font-semibold">📅 Duration:</span> {calculateDays()} days</div>
                        <div><span className="font-semibold">👥 Group:</span> {groupSize}</div>
                        <div><span className="font-semibold">💰 Budget:</span> {budget}</div>
                      </div>
                    </div>

                    {/* Interests */}
                    <div className="space-y-3">
                      <Label className="text-lg font-semibold flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-600" />
                        Interests (Select all that apply)
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {interestCategories.map((interest) => (
                          <button
                            key={interest}
                            type="button"
                            onClick={() => toggleInterest(interest)}
                            className={`p-3 rounded-lg text-sm font-medium transition-all border-2 ${
                              interests.includes(interest)
                                ? "border-blue-500 bg-blue-100 text-blue-900"
                                : "border-gray-200 bg-white hover:border-blue-300"
                            }`}
                          >
                            {interest}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Special Requirements */}
                    <div className="space-y-3">
                      <Label className="text-lg font-semibold">Special Requirements</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {specialRequirementsList.map((req) => (
                          <button
                            key={req.id}
                            type="button"
                            onClick={() => toggleRequirement(req.id)}
                            className={`p-3 rounded-lg text-sm font-medium transition-all border-2 flex items-center gap-2 ${
                              specialRequirements.includes(req.id)
                                ? "border-purple-500 bg-purple-100 text-purple-900"
                                : "border-gray-200 bg-white hover:border-purple-300"
                            }`}
                          >
                            {req.icon && <req.icon className="w-4 h-4" />}
                            {req.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Additional Notes */}
                    <div className="space-y-3">
                      <Label className="text-lg font-semibold">Additional Notes (Optional)</Label>
                      <Textarea
                        placeholder="Any additional preferences, dream destinations within the region, must-visit places..."
                        rows={3}
                        className="text-base"
                      />
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 rounded p-4">
                      <div className="flex gap-3">
                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-900">
                          <p className="font-semibold mb-1">Ready to generate your itinerary?</p>
                          <p>Our AI will create a personalized day-by-day plan based on all your preferences!</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 justify-between pt-6 border-t">
                  <Button
                    type="button"
                    onClick={handlePrevious}
                    variant="outline"
                    disabled={step === 1}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  {step < 4 ? (
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold flex items-center justify-center gap-2"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isGenerating}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold flex items-center justify-center gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Generate Itinerary
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Features Info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-bold mb-2">Personalized</h3>
              <p className="text-sm text-slate-600">Tailored to your exact preferences</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-bold mb-2">Smart</h3>
              <p className="text-sm text-slate-600">AI considers weather, budget & activities</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">🗺️</div>
              <h3 className="font-bold mb-2">Complete</h3>
              <p className="text-sm text-slate-600">Day-by-day itinerary with tips</p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Planner;
