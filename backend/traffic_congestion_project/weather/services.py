from .utils.geocode import get_lat_lon
from .utils.weather import get_weather


def get_weather_between_locations(start, end, depart_at=None):
    start_lat, start_lon = get_lat_lon(start)
    end_lat, end_lon = get_lat_lon(end)

    if start_lat is None or end_lat is None:
        return None

    try:
        start_weather = get_weather(start_lat, start_lon, depart_at=depart_at)
        end_weather = get_weather(end_lat, end_lon, depart_at=depart_at)
    except Exception:
        return None

    if not start_weather or not end_weather:
        return None

    try:
        return {
            "start": {
                "weather_code": start_weather.get("weathercode"),
                "temperature": start_weather.get("temperature")
            },
            "end": {
                "weather_code": end_weather.get("weathercode"),
                "temperature": end_weather.get("temperature")
            }
        }
    except (KeyError, TypeError):
        return None