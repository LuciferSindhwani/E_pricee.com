from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("users.urls")),
    path("api/trips/", include("trips.urls")),
    path("api/integrations/", include("integrations.urls")),
    path("api/posts/", include("posts.urls")),
    path("api/profile/", include("profile_api.urls")),
]

