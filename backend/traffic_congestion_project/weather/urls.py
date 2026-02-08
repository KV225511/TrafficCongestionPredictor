from django.urls import path
from .views import WeatherBetweenLocations

urlpatterns = [
    path("", WeatherBetweenLocations.as_view(), name="weather-between"),
]
