import os
import requests

from django.conf import settings
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status

from .serializers import SpeedRequestSerializer
from weather.utils.geocode import get_lat_lon


class AverageSpeedBetweenLocations(APIView):

	def get(self, request: Request):
		serializer = SpeedRequestSerializer(data=request.query_params)

		if not serializer.is_valid():
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

		start = serializer.validated_data["start"]
		end = serializer.validated_data["end"]

		start_lat, start_lon = get_lat_lon(start)
		end_lat, end_lon = get_lat_lon(end)

		if start_lat is None or end_lat is None:
			return Response({"error": "Invalid location provided"}, status=status.HTTP_400_BAD_REQUEST)

		api_key = os.getenv("TOMTOM_API_KEY") or getattr(settings, "TOMTOM_API_KEY", None)
		if not api_key:
			return Response({"error": "TomTom API key not configured. Set TOMTOM_API_KEY."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

		coords = f"{start_lat},{start_lon}:{end_lat},{end_lon}"
		url = f"https://api.tomtom.com/routing/1/calculateRoute/{coords}/json"
		params = {"traffic": "true", "key": api_key}

		try:
			resp = requests.get(url, params=params, timeout=10)
			resp.raise_for_status()
			data = resp.json()
		except requests.RequestException as e:
			return Response({"error": "Failed to call TomTom API", "details": str(e)}, status=status.HTTP_502_BAD_GATEWAY)

		try:
			summary = data["routes"][0]["summary"]
			length_m = summary.get("lengthInMeters")
			travel_time_s = summary.get("travelTimeInSeconds")
			traffic_delay_s = summary.get("trafficDelayInSeconds", 0)
		except (KeyError, IndexError, TypeError):
			return Response({"error": "Unexpected TomTom response format", "raw": data}, status=status.HTTP_502_BAD_GATEWAY)

		if not length_m or not travel_time_s:
			return Response({"error": "TomTom response missing distance or travel time", "raw": data}, status=status.HTTP_502_BAD_GATEWAY)

		distance_km = length_m / 1000.0
		time_hr = travel_time_s / 3600.0
		avg_speed_kmph = distance_km / time_hr if time_hr > 0 else None

		result = {
			"start": {"name": start, "lat": start_lat, "lon": start_lon},
			"end": {"name": end, "lat": end_lat, "lon": end_lon},
			"distance_m": length_m,
			"travel_time_s": travel_time_s,
			"traffic_delay_s": traffic_delay_s,
			"avg_speed_kmph": round(avg_speed_kmph, 2) if avg_speed_kmph is not None else None,
			"tomtom_raw": data.get("routes", [{}])[0].get("summary", {}),
		}

		return Response(result, status=status.HTTP_200_OK)
