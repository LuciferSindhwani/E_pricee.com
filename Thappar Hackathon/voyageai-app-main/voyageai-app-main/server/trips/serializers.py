from __future__ import annotations

from rest_framework import serializers

from users.serializers import UserSerializer

from .models import Carpool, Trip, TripRequest


class TripSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    startDate = serializers.DateField(source="start_date", allow_null=True)
    endDate = serializers.DateField(source="end_date", allow_null=True)
    budgetCents = serializers.IntegerField(source="budget_cents", allow_null=True)
    createdAt = serializers.DateTimeField(source="created_at")
    updatedAt = serializers.DateTimeField(source="updated_at")

    class Meta:
        model = Trip
        fields = (
            "id",
            "title",
            "startDate",
            "endDate",
            "budgetCents",
            "location",
            "vehicle",
            "accessibility",
            "itinerary",
            "createdAt",
            "updatedAt",
            "owner",
        )


class TripCreateSerializer(serializers.ModelSerializer):
    startDate = serializers.DateField(source="start_date", allow_null=True, required=False)
    endDate = serializers.DateField(source="end_date", allow_null=True, required=False)
    budgetCents = serializers.IntegerField(source="budget_cents", allow_null=True, required=False)

    class Meta:
        model = Trip
        fields = ("title", "startDate", "endDate", "budgetCents", "location", "vehicle", "accessibility")


class TripRequestSerializer(serializers.ModelSerializer):
    requester = UserSerializer(read_only=True)

    class Meta:
        model = TripRequest
        fields = ("id", "trip", "requester", "status", "message", "created_at")
        read_only_fields = ("status", "created_at")


class CarpoolSerializer(serializers.ModelSerializer):
    host = UserSerializer(read_only=True)
    start = serializers.CharField(source="from_location", read_only=True)
    destination = serializers.CharField(source="to_location", read_only=True)

    class Meta:
        model = Carpool
        fields = ("id", "trip", "host", "seats", "start", "destination", "departure")
        read_only_fields = ("trip", "host", "start", "destination")

