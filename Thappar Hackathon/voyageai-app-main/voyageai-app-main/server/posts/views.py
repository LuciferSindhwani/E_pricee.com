from __future__ import annotations

from datetime import datetime, timedelta

from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView


class FeedView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            now = datetime.utcnow()
            items = [
                {
                    "id": "sample-post-1",
                    "author": {
                        "id": str(request.user.id),
                        "name": getattr(request.user, 'name', request.user.username),
                        "avatarUrl": getattr(request.user, 'avatar_url', None) or "https://api.dicebear.com/7.x/avataaars/svg?seed=VoyageAI",
                    },
                    "caption": "Share your favorite travel moments! 🌍",
                    "likes": 12,
                    "createdAt": (now - timedelta(hours=2)).isoformat() + "Z",
                }
            ]
            return Response({"items": items, "nextCursor": None})
        except Exception as e:
            print(f"Error in FeedView: {e}")
            return Response({"items": [], "nextCursor": None})


