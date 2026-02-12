def map_road_type(functional_road_class):
    """
    Map TomTom Functional Road Class (FRC)
    to your ML column categories.
    
    FRC Values:
    0 → Motorway
    1 → Major road
    2 → Important road
    3 → Secondary road
    4 → Local road
    5 → Very local road
    """

    if functional_road_class is None:
        return "Main Road"  

    if functional_road_class in [0, 1]:
        return "Highway"

    elif functional_road_class in [2, 3]:
        return "Main Road"

    else:
        return "Inner Road"
