from __future__ import annotations

import os
from datetime import datetime
from typing import Any

import requests
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView


class WeatherView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        location = request.query_params.get("location", "Unknown")
        api_key = os.getenv("OPENWEATHER_API_KEY")
        if not api_key:
            sample = {
                "location": location,
                "summary": "Partly cloudy",
                "tempC": 24,
                "retrievedAt": datetime.utcnow().isoformat() + "Z",
            }
            return Response({"data": sample})

        params = {"q": location, "appid": api_key, "units": "metric"}
        try:
            res = requests.get("https://api.openweathermap.org/data/2.5/weather", params=params, timeout=8)
            res.raise_for_status()
            payload: Any = res.json()
            data = {
                "location": location,
                "summary": payload["weather"][0]["description"].title(),
                "tempC": payload["main"]["temp"],
                "retrievedAt": datetime.utcnow().isoformat() + "Z",
            }
            return Response({"data": data})
        except requests.RequestException:
            sample = {
                "location": location,
                "summary": "Weather unavailable",
                "tempC": None,
                "retrievedAt": datetime.utcnow().isoformat() + "Z",
            }
            return Response({"data": sample})

