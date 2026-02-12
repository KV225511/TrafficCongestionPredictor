from .utils.geocode import get_lat_lon
from .utils.weather import get_weather
import asyncio


async def get_weather_between_locations(start, end, depart_at=None):
    try:
        (start_lat, start_lon),(end_lat, end_lon) =await asyncio.gather(asyncio.to_thread(get_lat_lon,start),
        asyncio.to_thread(get_lat_lon,end))

    except Exception:
        return None

    if None in (start_lat,start_lon,end_lat,end_lon):
        return None
    try:
        start_weather,end_weather = await asyncio.gather(asyncio.to_thread(get_weather,start_lat, start_lon, depart_at=depart_at),
         asyncio.to_thread(get_weather,end_lat, end_lon, depart_at=depart_at))
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