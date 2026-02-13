import os
import requests


def get_lat_lon(place: str):
    if not place or not place.strip():
        return None, None

    place_clean = place.strip()
    api_key = os.getenv("TOMTOM_API_KEY")

    if not api_key:
        return None, None

    try:
        response = requests.get(
            f"https://api.tomtom.com/search/2/search/{place_clean}.json",
            params={
                "key": api_key,
                "limit": 5,                # Get top 5 candidates
                "countrySet": "IN",
                "view": "IN",
                "idxSet": "POI,Addr",
            },
            timeout=10,
        )

        response.raise_for_status()
        data = response.json()

        results = data.get("results", [])
        if not results:
            return None, None

        delhi_candidates = []

        for r in results:
            address = r.get("address", {})
            municipality = address.get("municipality", "")

            # Ensure inside Delhi
            if "Delhi" not in municipality:
                continue

            # Prefer POI results over generic address
            is_poi = "poi" in r

            delhi_candidates.append({
                "score": r.get("score", 0),
                "is_poi": is_poi,
                "position": r.get("position", {})
            })

        if not delhi_candidates:
            return None, None

        # Sort logic:
        # 1. Prefer POI
        # 2. Higher TomTom score
        delhi_candidates.sort(
            key=lambda x: (x["is_poi"], x["score"]),
            reverse=True
        )

        best = delhi_candidates[0]
        pos = best["position"]

        lat = pos.get("lat")
        lon = pos.get("lon")

        if lat is None or lon is None:
            return None, None

        return float(lat), float(lon)

    except requests.RequestException:
        return None, None
