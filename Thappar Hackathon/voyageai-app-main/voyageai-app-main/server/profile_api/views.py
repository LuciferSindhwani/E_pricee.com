from __future__ import annotations

from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from users.serializers import UserSerializer


class ProfileMeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        has_trips = user.owned_trips.exists()
        achievements = [
            {
                "id": "first-trip",
                "achievement": {
                    "title": "First Trip Planned",
                    "description": "You generated your first AI-powered itinerary!",
                    "icon": "🗺️",
                }
            }
        ] if has_trips else []
        user_data = UserSerializer(user).data
        user_data["stats"] = {
            "trips": user.owned_trips.count(),
            "followers": 0,  # TODO: implement followers
            "following": 0,  # TODO: implement following
        }
        user_data["username"] = f"@{user.email.split('@')[0]}"
        user_data["location"] = ""  # TODO: add location field to user model
        return Response({"user": user_data, "achievements": achievements})

