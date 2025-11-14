from django.urls import path

from .views import (
    AITravelChatView,
    TripBudgetAnalysisView,
    TripCarpoolListCreateView,
    TripDetailView,
    TripDiscoverView,
    TripGenerateView,
    TripListCreateView,
    TripPackingListView,
    TripRecommendationsView,
    TripSuggestionsView,
)

urlpatterns = [
    path("", TripListCreateView.as_view(), name="trip-create"),
    path("discover", TripDiscoverView.as_view(), name="trip-discover"),
    path("suggestions", TripSuggestionsView.as_view(), name="trip-suggestions"),
    path("chat", AITravelChatView.as_view(), name="ai-chat"),
    path("<uuid:trip_id>", TripDetailView.as_view(), name="trip-detail"),
    path("<uuid:trip_id>/generate", TripGenerateView.as_view(), name="trip-generate"),
    path("<uuid:trip_id>/recommendations", TripRecommendationsView.as_view(), name="trip-recommendations"),
    path("<uuid:trip_id>/packing-list", TripPackingListView.as_view(), name="trip-packing-list"),
    path("<uuid:trip_id>/budget-analysis", TripBudgetAnalysisView.as_view(), name="trip-budget-analysis"),
    path("<uuid:trip_id>/carpools", TripCarpoolListCreateView.as_view(), name="trip-carpools"),
]
