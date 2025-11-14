from __future__ import annotations

import json
import os
import re
from typing import Any, Dict, List

try:
    import google.generativeai as genai
except ImportError:
    genai = None  # Gemini optional during development


DEFAULT_ITINERARY = {
    "summary": "AI itinerary generation placeholder",
    "days": [
        {"day": 1, "activities": ["Arrival", "Explore the local neighborhood", "Sample regional cuisine"]},
        {"day": 2, "activities": ["Guided tour of key attractions", "Sunset viewpoint", "Dinner with locals"]},
        {"day": 3, "activities": ["Outdoor adventure", "Relaxing spa break", "Cultural evening show"]},
    ],
    "alternatives": [
        {"title": "Rainy-day plan", "activities": ["Museum visit", "Cooking class", "Coffee tasting tour"]},
    ],
    "budget_tips": [
        "Book tickets in advance to secure discounts.",
        "Use public transit cards for unlimited travel.",
    ],
}


def _extract_json_blob(text: str) -> str:
    """Extract JSON object from text response."""
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        return match.group(0)
    return text


def _get_model():
    """Initialize and return Gemini model."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or genai is None:
        return None
    
    try:
        genai.configure(api_key=api_key)
        model_name = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
        return genai.GenerativeModel(model_name)
    except Exception:
        return None


def generate_itinerary(trip, extra_context: Dict[str, Any] | None = None) -> Dict[str, Any]:
    """
    Generate a detailed and accurate itinerary for the provided trip using Gemini if configured.
    Falls back to a deterministic placeholder when the API key is missing or errors occur.
    """
    model = _get_model()
    if not model:
        return DEFAULT_ITINERARY

    try:
        # Calculate trip duration
        days = 1
        if trip.start_date and trip.end_date:
            days = (trip.end_date - trip.start_date).days + 1
        
        # Extract preferences
        budget_usd = trip.budget_cents // 100 if trip.budget_cents else 0
        group_size = extra_context.get("group_size", "solo") if extra_context else "solo"
        travel_pace = extra_context.get("travel_pace", "moderate") if extra_context else "moderate"
        interests = extra_context.get("interests", []) if extra_context else []
        special_requirements = extra_context.get("special_requirements", []) if extra_context else []
        
        # Build detailed prompt
        itinerary_prompt = (
            "You are an expert travel planner specializing in creating accurate, detailed, and practical itineraries. "
            "Your goal is to create a comprehensive day-by-day itinerary that perfectly matches the traveler's preferences and constraints.\n\n"
            f"TRIP DETAILS:\n"
            f"- Destination: {trip.location}\n"
            f"- Duration: {days} days\n"
            f"- Group Size: {group_size}\n"
            f"- Total Budget: ${budget_usd}\n"
            f"- Daily Budget: ${budget_usd // days if days > 0 else budget_usd}\n"
            f"- Travel Pace: {travel_pace} (relaxed=2-3 activities/day, moderate=4-5 activities/day, fast-paced=6+ activities/day)\n"
            f"- Interests: {', '.join(interests) if interests else 'general tourism'}\n"
            f"- Special Requirements: {', '.join(special_requirements) if special_requirements else 'none'}\n\n"
            "REQUIREMENTS FOR JSON RESPONSE:\n"
            "1. Generate a DETAILED summary explaining the essence of the trip\n"
            "2. For EACH DAY, provide:\n"
            "   - Morning activity (specific time and location)\n"
            "   - Afternoon activity (specific time and location)\n"
            "   - Evening activity (specific time and location)\n"
            "   - Dining recommendation (specific restaurant or cuisine type)\n"
            "   - Estimated costs\n"
            "3. Include 2-3 alternative day plans for different preferences or weather\n"
            "4. Provide 10+ practical money-saving tips specific to the destination and budget tier\n"
            "5. Include emergency contacts and important local information\n"
            "6. Suggest the best neighborhoods/areas to stay in\n"
            "7. Include transportation recommendations between attractions\n\n"
            "RETURN ONLY a valid JSON object with this EXACT structure:\n"
            "{\n"
            '  "summary": "Detailed 2-3 sentence summary of the entire trip",\n'
            '  "highlights": ["Top 5 must-see attractions"],\n'
            '  "best_neighborhoods": ["neighborhood 1", "neighborhood 2"],\n'
            '  "days": [\n'
            '    {\n'
            '      "day": 1,\n'
            '      "theme": "Arrival & Exploration",\n'
            '      "activities": [\n'
            '        {"time": "09:00-12:00", "activity": "Specific activity", "location": "Specific location", "cost": "$X"},\n'
            '        {"time": "12:00-14:00", "activity": "Lunch at...", "location": "Restaurant name", "cost": "$X"},\n'
            '        {"time": "14:00-17:00", "activity": "Afternoon activity", "location": "Specific location", "cost": "$X"},\n'
            '        {"time": "18:00-20:00", "activity": "Dinner at...", "location": "Restaurant name", "cost": "$X"},\n'
            '        {"time": "20:00-22:00", "activity": "Evening activity", "location": "Specific location", "cost": "$0"}\n'
            '      ],\n'
            '      "daily_budget": "$X",\n'
            '      "notes": "Practical tips for this day"\n'
            '    }\n'
            '  ],\n'
            '  "alternatives": [\n'
            '    {\n'
            '      "title": "Rainy Day Plan",\n'
            '      "activities": ["Indoor activity 1", "Indoor activity 2", "Indoor activity 3"],\n'
            '      "reason": "Explanation of when to use this plan"\n'
            '    }\n'
            '  ],\n'
            '  "budget_breakdown": {\n'
            '    "accommodation": {"daily": "$X", "total": "$X", "recommendation": "Where to stay"},\n'
            '    "food": {"daily": "$X", "total": "$X", "tips": ["Budget eating tip 1", "Budget eating tip 2"]},\n'
            '    "activities": {"daily": "$X", "total": "$X", "tips": ["Activity cost-saving tip 1"]},\n'
            '    "transport": {"daily": "$X", "total": "$X", "recommendations": "Public transit card, shared rides, etc"}\n'
            '  },\n'
            '  "budget_tips": [\n'
            '    "Specific, actionable tip 1",\n'
            '    "Specific, actionable tip 2",\n'
            '    "...(at least 10 tips)"\n'
            '  ],\n'
            '  "local_info": {\n'
            '    "emergency": "Emergency number and what it covers",\n'
            '    "currency_exchange": "Best places to exchange money and exchange rates",\n'
            '    "transportation": "Best ways to get around the city",\n'
            '    "safety": "Safety tips and areas to avoid",\n'
            '    "cultural_tips": "Important customs and etiquette"\n'
            '  }\n'
            "}\n\n"
            "IMPORTANT:\n"
            "- Make activities SPECIFIC to the destination, not generic\n"
            "- Include REAL neighborhood names and restaurant types\n"
            "- Budget should be realistic for the destination and tier provided\n"
            "- Respect the travel pace preference (not too many or too few activities)\n"
            "- Include interests in activity recommendations\n"
            "- Consider special requirements in all suggestions\n"
            "- Be practical and helpful, not overly promotional\n"
        )

        response = model.generate_content(
            itinerary_prompt,
            generation_config={"response_mime_type": "application/json"},
        )

        if hasattr(response, "text") and response.text:
            raw = response.text
        elif response.candidates:
            raw = "".join(part.text for candidate in response.candidates for part in candidate.content.parts if getattr(part, "text", ""))
        else:
            return DEFAULT_ITINERARY

        cleaned = _extract_json_blob(raw)
        result = json.loads(cleaned)
        
        # Validate that we got the expected structure
        if "summary" in result or "days" in result:
            return result
        else:
            return DEFAULT_ITINERARY
            
    except Exception as e:
        print(f"Error generating itinerary: {e}")
        return DEFAULT_ITINERARY


def generate_trip_suggestions(location: str, budget: int | None = None, duration: int | None = None, interests: List[str] | None = None) -> Dict[str, Any]:
    """Generate detailed and accurate travel suggestions for a location using Gemini."""
    model = _get_model()
    if not model:
        return {"suggestions": [], "error": "AI model not configured"}

    try:
        budget_usd = budget // 100 if budget else None
        budget_str = f"${budget_usd} total" if budget_usd else "flexible budget"
        duration_str = f"{duration} days" if duration else "flexible duration"
        
        # Build interest-specific guidelines
        interests_list = interests if interests else []
        if interests_list:
            interests_str = f"PRIMARY INTERESTS: {', '.join(interests_list)}"
            # Create interest-specific guidance for each suggestion
            interest_guidance = "\n".join([
                f"- For travelers interested in {interests_list[i % len(interests_list)]}: emphasize activities that {interests_list[i % len(interests_list)].lower()} enthusiasts enjoy most"
                for i in range(5)
            ]) if interests_list else ""
        else:
            interests_str = "Provide diverse destination types"
            interest_guidance = ""
        
        prompt = (
            f"You are an expert travel planner specializing in personalized destination recommendations. "
            f"Create 5 COMPLETELY DIFFERENT and HIGHLY PERSONALIZED destination suggestions FROM {location}.\n\n"
            f"TRAVELER PROFILE:\n"
            f"- Originating from: {location}\n"
            f"- Total Budget: {budget_str}\n"
            f"- Trip Duration: {duration_str}\n"
            f"- {interests_str}\n\n"
            f"DESTINATION DIVERSITY REQUIREMENT (CRITICAL):\n"
            f"Each of the 5 destinations must be fundamentally DIFFERENT:\n"
            f"1. First destination: Beach/Coastal destination (relaxation focused)\n"
            f"2. Second destination: Cultural/Historical destination (museums, heritage sites)\n"
            f"3. Third destination: Adventure/Mountain destination (outdoor activities)\n"
            f"4. Fourth destination: Urban/Metropolitan destination (food, nightlife, shopping)\n"
            f"5. Fifth destination: Nature/Wildlife destination (eco-tourism, national parks)\n\n"
            f"INTEREST ALIGNMENT REQUIREMENT:\n"
            f"If interests are provided: Tailor EACH destination to showcase how it matches the specified interests.\n"
            f"Activities, highlights, and local experiences must align with the provided preferences.\n"
            f"{interest_guidance}\n\n"
            f"For EACH of the 5 destinations, provide COMPREHENSIVE and DISTINCT information:\n\n"
            f"RETURN A VALID JSON ARRAY containing 5 objects with these EXACT fields:\n"
            f"{{\n"
            f'  "destination": "Specific City/Region Name (not generic)",\n'
            f'  "country": "Country name",\n'
            f'  "title": "Creative, memorable title reflecting the destination character",\n'
            f'  "description": "One-line engaging description highlighting what makes it UNIQUE",\n'
            f'  "destinationType": "Beach/Cultural/Adventure/Urban/Nature - clearly categorized",\n'
            f'  "longDescription": "Detailed 3-4 sentence description explaining unique characteristics and why it stands out from other destinations",\n'
            f'  "reasonToVisit": "ONE compelling, specific reason why this destination matches the interests provided",\n'
            f'  "whySpecialForYou": "Detailed paragraph (4-5 sentences) explaining exactly how this destination aligns with the specified interests and budget tier",\n'
            f'  "highlights": [\n'
            f'    "Specific, named highlight 1 with brief explanation",\n'
            f'    "Specific, named highlight 2 with brief explanation",\n'
            f'    "Specific, named highlight 3 with brief explanation",\n'
            f'    "Specific, named highlight 4 with brief explanation",\n'
            f'    "Specific, named highlight 5 with brief explanation",\n'
            f'    "Specific, named highlight 6 with brief explanation",\n'
            f'    "Specific, named highlight 7 with brief explanation"\n'
            f'  ],\n'
            f'  "activities": [\n'
            f'    "Specific activity 1 aligned with interests - detailed description",\n'
            f'    "Specific activity 2 aligned with interests - detailed description",\n'
            f'    "...(minimum 12-15 activities, each uniquely tailored to the destination and interests)"\n'
            f'  ],\n'
            f'  "mustTryActivities": [\n'
            f'    "Essential experience 1 specific to this destination",\n'
            f'    "Essential experience 2 specific to this destination",\n'
            f'    "Essential experience 3 specific to this destination",\n'
            f'    "Essential experience 4 specific to this destination",\n'
            f'    "Essential experience 5 specific to this destination"\n'
            f'  ],\n'
            f'  "uniqueFeatures": [\n'
            f'    "Feature that makes this destination different from Destination 1",\n'
            f'    "Feature that makes this destination different from Destination 2",\n'
            f'    "Feature that makes this destination different from other suggestions",\n'
            f'    "Feature that makes this destination different from other suggestions"\n'
            f'  ],\n'
            f'  "cultureAndHeritage": [\n'
            f'    "Specific cultural element 1 (with real examples or locations)",\n'
            f'    "Specific cultural element 2 (with real examples or locations)",\n'
            f'    "Specific cultural element 3 (with real examples or locations)",\n'
            f'    "Specific cultural element 4 (with real examples or locations)",\n'
            f'    "Specific cultural element 5 (with real examples or locations)"\n'
            f'  ],\n'
            f'  "localCuisine": [\n'
            f'    "Signature dish 1 - detailed description and specific restaurant/area",\n'
            f'    "Signature dish 2 - detailed description and specific restaurant/area",\n'
            f'    "Signature dish 3 - detailed description and specific restaurant/area",\n'
            f'    "Signature dish 4 - detailed description and specific restaurant/area",\n'
            f'    "Signature dish 5 - detailed description and specific restaurant/area",\n'
            f'    "Signature dish 6 - detailed description and specific restaurant/area"\n'
            f'  ],\n'
            f'  "socialScene": "Detailed, destination-specific description of nightlife, bars, clubs, entertainment, social atmosphere",\n'
            f'  "climate": "Detailed climate info: typical temperature ranges, humidity levels, rainfall patterns, best/worst seasons",\n'
            f'  "bestTimeToVisit": "Specific months/season with detailed explanation of why (weather, events, crowds)",\n'
            f'  "recommendedDuration": "Suggested number of days (e.g., 5-7 days)",\n'
            f'  "rating": "4.2 to 4.8 (realistic rating)",\n'
            f'  "matchScore": "65-95 (how well it matches the interests and budget - MUST VARY per destination)",\n'
            f'  "accommodation": "Detailed, budget-appropriate recommendations with specific neighborhoods, hotel types, and price ranges",\n'
            f'  "transport": "Detailed transport options from origin to destination and local transit within the city",\n'
            f'  "estimatedBudget": "$X per day",\n'
            f'  "budgetBreakdown": {{\n'
            f'    "accommodation": "$X per night (with quality tier)",\n'
            f'    "food": "$X per day (mix of budget and mid-range)",\n'
            f'    "activities": "$X per day (with examples of what is included)",\n'
            f'    "transport": "$X per day (local and intercity)",\n'
            f'    "total": "$X per day"\n'
            f'  }},\n'
            f'  "proTips": [\n'
            f'    "Specific, actionable insider tip 1 unique to this destination",\n'
            f'    "Specific, actionable insider tip 2 unique to this destination",\n'
            f'    "...(minimum 10 insider tips specific to this location)"\n'
            f'  ],\n'
            f'  "visaRequirements": "Specific visa requirements for visitors from {location}",\n'
            f'  "safety": "Current safety information, areas to avoid, and practical precautions",\n'
            f'  "bestNeighborhoods": ["Neighborhood 1 - brief description", "Neighborhood 2 - brief description", "..."],\n'
            f'  "seasonalEvents": ["Specific event 1 with date", "Specific event 2 with date", "..."],\n'
            f'  "travelTips": [\n'
            f'    "Practical tip 1 specific to this destination",\n'
            f'    "Practical tip 2 specific to this destination",\n'
            f'    "...(minimum 8 practical tips)"\n'
            f'  ]\n'
            f"}}\n\n"
            f"CRITICAL REQUIREMENTS FOR UNIQUE SUGGESTIONS:\n"
            f"1. DIVERSITY: Each destination must be a DIFFERENT TYPE (beach, culture, adventure, urban, nature)\n"
            f"2. SPECIFICITY: Include REAL city names, neighborhoods, restaurants, attractions - NO generic content\n"
            f"3. INTEREST-ALIGNED: All activities and recommendations must align with provided interests\n"
            f"4. UNIQUE CONTENT: No repeated descriptions or generic templates - each destination must feel distinct\n"
            f"5. VARY MATCH SCORES: Scores must vary (e.g., 95, 85, 75, 70, 65) - not all the same\n"
            f"6. BUDGET APPROPRIATE: All recommendations realistic for the specified budget tier\n"
            f"7. ACTIONABLE: Provide specific, real places to visit and activities to do\n"
            f"8. HONEST: Be truthful about costs, difficulty, and accessibility\n"
            f"9. COMPREHENSIVE: Include all required fields with substantial content (not abbreviated)\n"
            f"10. VALID JSON: Ensure output is properly formatted, valid JSON array\n\n"
            f"Return ONLY the valid JSON array containing exactly 5 destination objects. No explanations or additional text."
        )

        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"},
        )

        raw = response.text if hasattr(response, "text") else ""
        cleaned = _extract_json_blob(raw)
        parsed = json.loads(cleaned)
        
        # Ensure it's in the expected format and map fields to what frontend expects
        def normalize_suggestion(item):
            """Convert AI response fields to frontend component fields"""
            if isinstance(item, dict):
                return {
                    "destination": item.get("destination", "Unknown"),
                    "country": item.get("country", ""),
                    "title": item.get("title", item.get("destination", "")),
                    "description": item.get("description", item.get("longDescription", "")),
                    "longDescription": item.get("longDescription", item.get("description", "")),
                    "reasonToVisit": item.get("reasonToVisit", ""),
                    "highlights": item.get("highlights", []),
                    "activities": item.get("activities", []),
                    "mustTryActivities": item.get("mustTryActivities", []),
                    "cultureAndHeritage": item.get("cultureAndHeritage", []),
                    "localCuisine": item.get("localCuisine", []),
                    "climate": item.get("climate", ""),
                    "bestTimeToVisit": item.get("bestTimeToVisit", ""),
                    "culture": " | ".join(item.get("cultureAndHeritage", [])[:3]) if item.get("cultureAndHeritage") else "",
                    "cuisine": " | ".join([c.split(" - ")[0] for c in item.get("localCuisine", [])[:3]]) if item.get("localCuisine") else "",
                    "accommodation": item.get("accommodation", ""),
                    "transport": item.get("transport", ""),
                    "estimatedBudget": item.get("estimatedBudget", ""),
                    "budgetBreakdown": item.get("budgetBreakdown", {}),
                    "proTips": item.get("proTips", []),
                    "travelTips": item.get("travelTips", []),
                    "visaRequirements": item.get("visaRequirements", ""),
                    "safety": item.get("safety", ""),
                    "destinationType": item.get("destinationType", ""),
                    "whySpecialForYou": item.get("whySpecialForYou", ""),
                    "uniqueFeatures": item.get("uniqueFeatures", []),
                    "matchScore": item.get("matchScore", 0),
                    "rating": item.get("rating", 0),
                }
            return item
        
        if isinstance(parsed, list):
            normalized = [normalize_suggestion(item) for item in parsed]
            return {"suggestions": normalized}
        elif isinstance(parsed, dict) and "suggestions" in parsed:
            normalized = [normalize_suggestion(item) for item in parsed.get("suggestions", [])]
            return {"suggestions": normalized}
        else:
            normalized = normalize_suggestion(parsed) if isinstance(parsed, dict) else {}
            return {"suggestions": [normalized] if normalized else []}
            
    except Exception as e:
        print(f"Error generating trip suggestions: {e}")
        return {"suggestions": [], "error": str(e)}


def generate_ai_recommendations(trip, activity_type: str = "attractions") -> Dict[str, List[str]]:
    """Generate AI-powered recommendations for activities, restaurants, etc."""
    model = _get_model()
    if not model:
        return {"recommendations": [], "activity_type": activity_type}

    try:
        prompt = (
            f"You are a travel guide expert. Recommend top {activity_type} for a trip to {trip.location}. "
            f"Trip dates: {trip.start_date} to {trip.end_date}. "
            f"Budget: ${trip.budget_cents // 100 if trip.budget_cents else 'flexible'}. "
            "Return as JSON with format: "
            '{"recommendations": ["place 1", "place 2", "place 3", ...], "tips": ["tip 1", "tip 2", ...]}'
        )

        response = model.generate_content(prompt)
        raw = response.text if hasattr(response, "text") else ""
        cleaned = _extract_json_blob(raw)
        return json.loads(cleaned)
    except Exception:
        return {"recommendations": [], "activity_type": activity_type}


def ai_chat(message: str, context: Dict[str, Any] | None = None) -> str:
    """Chat with AI travel assistant."""
    model = _get_model()
    if not model:
        return "AI assistant is not available at the moment."

    try:
        system_prompt = (
            "You are a helpful travel planning assistant. Answer questions about travel, destinations, "
            "budgeting, packing, visas, and trip logistics. Be concise and helpful."
        )
        
        full_message = message
        if context:
            context_str = json.dumps(context)
            full_message = f"Context: {context_str}\n\nUser message: {message}"

        response = model.generate_content(
            [system_prompt, full_message],
            generation_config={"temperature": 0.7, "max_output_tokens": 500},
        )

        return response.text if hasattr(response, "text") else "Unable to generate response"
    except Exception as e:
        return f"Error: {str(e)}"


def generate_packing_list(trip, additional_context: str = "") -> Dict[str, List[str]]:
    """Generate a smart packing list based on trip details."""
    model = _get_model()
    if not model:
        return {"categories": {}, "tips": []}

    try:
        prompt = (
            f"Create a detailed packing list for a trip to {trip.location} "
            f"from {trip.start_date} to {trip.end_date}. "
            f"{additional_context} "
            "Return as JSON with format: "
            '{"categories": {"clothing": [...], "toiletries": [...], "documents": [...], "electronics": [...]}, '
            '"tips": ["tip 1", "tip 2", ...]}'
        )

        response = model.generate_content(prompt)
        raw = response.text if hasattr(response, "text") else ""
        cleaned = _extract_json_blob(raw)
        return json.loads(cleaned)
    except Exception:
        return {"categories": {}, "tips": []}


def analyze_trip_budget(trip) -> Dict[str, Any]:
    """Analyze and optimize trip budget using AI."""
    model = _get_model()
    if not model:
        return {"analysis": "Budget analysis unavailable", "breakdown": {}}

    try:
        days = (trip.end_date - trip.start_date).days if trip.end_date and trip.start_date else 0
        budget = trip.budget_cents // 100 if trip.budget_cents else 0

        prompt = (
            f"Analyze and provide budget breakdown for a {days}-day trip to {trip.location} "
            f"with total budget of ${budget}. Suggest spending for accommodation, food, activities, transport, etc. "
            "Return as JSON with format: "
            '{"daily_budget": X, "categories": {"accommodation": X, "food": X, "activities": X, ...}, '
            '"money_saving_tips": [...]}'
        )

        response = model.generate_content(prompt)
        raw = response.text if hasattr(response, "text") else ""
        cleaned = _extract_json_blob(raw)
        return json.loads(cleaned)
    except Exception:
        return {"analysis": "Unable to analyze budget", "breakdown": {}}

