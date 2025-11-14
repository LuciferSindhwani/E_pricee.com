from __future__ import annotations

import uuid

from django.db import models
from django.utils import timezone


class Trip(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="owned_trips")
    title = models.CharField(max_length=255)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    budget_cents = models.IntegerField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True)
    vehicle = models.CharField(max_length=64, blank=True)
    accessibility = models.JSONField(blank=True, null=True)
    itinerary = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.title} ({self.location})"


class Team(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    trip = models.OneToOneField(Trip, on_delete=models.CASCADE, related_name="team", blank=True, null=True)

    def __str__(self) -> str:
        return self.name


class TeamMember(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="team_memberships")
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name="members")
    role = models.CharField(max_length=32, default="member")

    class Meta:
        unique_together = ("user", "team")

    def __str__(self) -> str:
        return f"{self.user.email} -> {self.team.name}"


class TripRequest(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("rejected", "Rejected"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="requests")
    requester = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="trip_requests")
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default="pending")
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self) -> str:
        return f"{self.trip.title} request by {self.requester.email}"


class Carpool(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="carpools")
    host = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="carpools")
    seats = models.PositiveIntegerField()
    from_location = models.CharField(max_length=255)
    to_location = models.CharField(max_length=255)
    departure = models.DateTimeField()

    def __str__(self) -> str:
        return f"{self.trip.title} carpool ({self.host.email})"


class Expense(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="expenses")
    title = models.CharField(max_length=255)
    amount_cents = models.IntegerField()
    paid_by = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="expenses")
    split = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self) -> str:
        return f"{self.trip.title} expense {self.title}"


class Booking(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("cancelled", "Cancelled"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="bookings")
    trip = models.ForeignKey(Trip, on_delete=models.SET_NULL, related_name="bookings", blank=True, null=True)
    provider = models.CharField(max_length=64)
    external_ref = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default="pending")
    details = models.JSONField(blank=True, null=True)
    total_cents = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self) -> str:
        return f"{self.provider} booking for {self.user.email}"

