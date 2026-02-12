import requests
from datetime import datetime

def get_weather(lat: float, lon: float, depart_at=None):
    """
    Get weather at a specific location.
    
    Args:
        lat: Latitude
        lon: Longitude
        depart_at: Optional datetime object for forecast. If None, returns current weather.
    
    Returns:
        dict with temperature and weathercode, or empty dict if unavailable
    """
    url = "https://api.open-meteo.com/v1/forecast"
    
    if depart_at is None:
        # Current weather
        params = {
            "latitude": lat,
            "longitude": lon,
            "current_weather": True
        }
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        return data.get("current_weather", {})
    else:
        # Hourly forecast for specific time
        params = {
            "latitude": lat,
            "longitude": lon,
            "hourly": "temperature_2m,weathercode",
            "timezone": "auto"
        }
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        hourly_data = data.get("hourly", {})
        times = hourly_data.get("time", [])
        temperatures = hourly_data.get("temperature_2m", [])
        weathercodes = hourly_data.get("weathercode", [])
        
        if not times:
            return {}
        
        # Find closest time slot
        depart_str = depart_at.isoformat()[:13]  # Format: "2026-02-12T14"
        
        for i, time_str in enumerate(times):
            if time_str.startswith(depart_str):
                return {
                    "temperature": temperatures[i] if i < len(temperatures) else None,
                    "weathercode": weathercodes[i] if i < len(weathercodes) else None,
                    "time": time_str
                }
        
        # If exact hour not found, return empty
        return {}
