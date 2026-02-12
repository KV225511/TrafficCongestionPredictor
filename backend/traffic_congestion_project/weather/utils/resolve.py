from weather.services import get_weather_between_locations


def resolve_weather_type(start_data, end_data):
    start_code = start_data["weather_code"]
    end_code = end_data["weather_code"]

    start_temp = start_data["temperature"]
    end_temp = end_data["temperature"]

    if start_temp > 40 or end_temp > 40:
        return "heatwave"

    dominant_code = max(start_code, end_code)

    if 0 <= dominant_code <= 3:
        return "clear"

    elif 45 <= dominant_code <= 48:
        return "fog"

    elif 51 <= dominant_code <= 99:
        return "rain"

    return "clear"


def get_resolved_weather(start, end, depart_at=None):
    weather_data = get_weather_between_locations(start, end, depart_at=depart_at)
    
    if not weather_data:
        return None
    
    try:
        return resolve_weather_type(
            weather_data["start"],
            weather_data["end"]
        )
    except (KeyError, TypeError):
        return None
