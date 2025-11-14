from __future__ import annotations

from datetime import datetime

from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .ai import (
    ai_chat,
    analyze_trip_budget,
    generate_ai_recommendations,
    generate_itinerary,
    generate_packing_list,
    generate_trip_suggestions,
)
from .models import Carpool, Trip
from .serializers import CarpoolSerializer, TripCreateSerializer, TripSerializer


class TripListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = TripCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        trip = serializer.save(owner=request.user)
        data = TripSerializer(trip, context={"request": request}).data
        return Response({"trip": data}, status=status.HTTP_201_CREATED)


class TripDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, trip_id: str):
        trip = get_object_or_404(Trip, id=trip_id)
        return Response({"trip": TripSerializer(trip, context={"request": request}).data})


class TripGenerateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, trip_id: str):
        trip = get_object_or_404(Trip, id=trip_id, owner=request.user)
        itinerary = generate_itinerary(trip, extra_context=request.data or {})
        trip.itinerary = itinerary
        trip.save(update_fields=["itinerary", "updated_at"])
        return Response({"trip": TripSerializer(trip, context={"request": request}).data})


class TripDiscoverView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        items = Trip.objects.order_by("-created_at")[:20]
        data = TripSerializer(items, many=True, context={"request": request}).data
        return Response({"items": data})


class TripRecommendationsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, trip_id: str):
        trip = get_object_or_404(Trip, id=trip_id)
        activity_type = request.query_params.get("type", "attractions")
        recommendations = generate_ai_recommendations(trip, activity_type)
        return Response({"recommendations": recommendations})


class TripPackingListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, trip_id: str):
        trip = get_object_or_404(Trip, id=trip_id)
        additional_context = request.query_params.get("context", "")
        packing_list = generate_packing_list(trip, additional_context)
        return Response({"packingList": packing_list})


class TripBudgetAnalysisView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, trip_id: str):
        trip = get_object_or_404(Trip, id=trip_id)
        analysis = analyze_trip_budget(trip)
        return Response({"analysis": analysis})


class TripSuggestionsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        location = request.query_params.get("location", "")
        budget = request.query_params.get("budget")
        duration = request.query_params.get("duration")
        interests_str = request.query_params.get("interests", "")

        if not location:
            return Response({"error": "location is required"}, status=status.HTTP_400_BAD_REQUEST)

        budget_int = int(budget) if budget else None
        duration_int = int(duration) if duration else None
        
        # Parse interests from comma-separated string
        interests = [i.strip() for i in interests_str.split(",") if i.strip()] if interests_str else None

        suggestions = generate_trip_suggestions(location, budget_int, duration_int, interests)
        return Response({"tripSuggestions": suggestions})


class AITravelChatView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        message = request.data.get("message", "")
        context = request.data.get("context")
        trip_id = request.data.get("trip_id")

        if not message:
            return Response({"error": "message is required"}, status=status.HTTP_400_BAD_REQUEST)

        chat_context = context or {}
        if trip_id:
            try:
                trip = Trip.objects.get(id=trip_id, owner=request.user)
                chat_context["trip"] = {
                    "title": trip.title,
                    "location": trip.location,
                    "dates": f"{trip.start_date} to {trip.end_date}",
                    "budget": trip.budget_cents,
                }
            except Trip.DoesNotExist:
                pass

        response_text = ai_chat(message, chat_context)
        return Response({"response": response_text})


class TripCarpoolListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, trip_id: str):
        trip = get_object_or_404(Trip, id=trip_id)
        carpools = trip.carpools.order_by("departure")
        serializer = CarpoolSerializer(carpools, many=True, context={"request": request})
        transformed = [
            {
                **item,
                "from": item.pop("start"),
                "to": item.pop("destination"),
            }
            for item in serializer.data
        ]
        return Response({"items": transformed})

    def post(self, request, trip_id: str):
        trip = get_object_or_404(Trip, id=trip_id)
        seats = int(request.data.get("seats", 1))
        from_location = request.data.get("from") or request.data.get("start")
        to_location = request.data.get("to") or request.data.get("destination")
        departure_str = request.data.get("departure")
        if not (from_location and to_location and departure_str):
            return Response({"error": "from, to, and departure are required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            parsed = datetime.fromisoformat(departure_str)
        except ValueError:
            return Response({"error": "Invalid departure datetime"}, status=status.HTTP_400_BAD_REQUEST)
        departure = parsed
        if parsed.tzinfo is None and len(departure_str) == 10:
            departure = datetime.combine(parsed.date(), datetime.min.time())
        carpool = Carpool.objects.create(
            trip=trip,
            host=request.user,
            seats=seats,
            from_location=from_location,
            to_location=to_location,
            departure=departure,
        )
        serializer = CarpoolSerializer(carpool, context={"request": request})
        data = serializer.data
        data["from"] = data.pop("start")
        data["to"] = data.pop("destination")
        return Response({"carpool": data}, status=status.HTTP_201_CREATED)

