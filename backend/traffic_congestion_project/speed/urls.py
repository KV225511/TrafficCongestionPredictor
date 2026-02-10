from django.urls import path
from .views import AverageSpeedBetweenLocations

urlpatterns = [
    path("", AverageSpeedBetweenLocations.as_view(), name="average-speed-between-locations"),
]
