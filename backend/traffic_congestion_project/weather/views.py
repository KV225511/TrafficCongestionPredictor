from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status

from .serializers import WeatherRequestSerializer
from .utils.geocode import get_lat_lon
from .utils.weather import get_weather


class WeatherBetweenLocations(APIView):

    def get(self, request: Request):
        serializer = WeatherRequestSerializer(data=request.query_params)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        start = serializer.validated_data["start"]
        end = serializer.validated_data["end"]

        start_lat, start_lon = get_lat_lon(start)
        end_lat, end_lon = get_lat_lon(end)

        if start_lat is None or end_lat is None:
            return Response(
                {"error": "Invalid location provided"},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {
                "start": {
                    "name": start,
                    "lat": start_lat,
                    "lon": start_lon,
                    "weather": get_weather(start_lat, start_lon),
                },
                "end": {
                    "name": end,
                    "lat": end_lat,
                    "lon": end_lon,
                    "weather": get_weather(end_lat, end_lon),
                }
            },
            status=status.HTTP_200_OK
        )
