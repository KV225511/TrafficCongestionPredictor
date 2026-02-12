import os
import requests
from django.conf import settings
from weather.utils.geocode import get_lat_lon


def get_average_speed_between_locations(start, end, depart_at=None):
    start_lat, start_lon = get_lat_lon(start)
    end_lat, end_lon = get_lat_lon(end)

    if start_lat is None or start_lon is None or end_lat is None or end_lon is None:
        return None

    api_key = os.getenv("TOMTOM_API_KEY") or getattr(settings, "TOMTOM_API_KEY", None)
    if not api_key:
        return None

    coords = f"{start_lat},{start_lon}:{end_lat},{end_lon}"
    url = f"https://api.tomtom.com/routing/1/calculateRoute/{coords}/json"

    params = {
        "traffic": "true",
        "key": api_key,
        "routeRepresentation": "polyline",  # important for sections
    }

    if depart_at:
        params["departAt"] = depart_at.isoformat()

    try:
        resp = requests.get(url, params=params, timeout=10)
        resp.raise_for_status()
        data = resp.json()
    except requests.RequestException:
        return None

    try:
        route = data["routes"][0]
        summary = route["summary"]

        length_m = summary["lengthInMeters"]
        travel_time_s = summary["travelTimeInSeconds"]

        # 🔥 Extract functional road class from sections
        sections = route.get("sections", [])
        frc_values = []

        for section in sections:
            if "functionalRoadClass" in section:
                frc_values.append(section["functionalRoadClass"])

        # If multiple FRC values exist → take most frequent
        functional_road_class = None
        if frc_values:
            functional_road_class = max(set(frc_values), key=frc_values.count)

    except (KeyError, IndexError, TypeError):
        return None

    if not length_m or not travel_time_s:
        return None

    distance_km = length_m / 1000.0
    time_hr = travel_time_s / 3600.0

    if time_hr == 0:
        return None

    avg_speed_kmph = distance_km / time_hr

    return (
        round(avg_speed_kmph, 2),
        round(distance_km, 2),
        functional_road_class
    )
