import pandas as pd;
from sklearn.preprocessing import LabelEncoder



def drop_data(df):
    df.drop(columns=["Trip_ID"],inplace=True)


def label_data(df,encoders):
    columns=["start_area","end_area","time_of_day","day_of_week","weather_condition","road_type","traffic_density_level","distance_km"]
    for col in columns:
        le=LabelEncoder()
        df[col]=le.fit_transform(df[col])
        encoders[col]=le
        
    x=df.drop(columns=["average_speed_kmph"])
    y=df["average_speed_kmph"]
    return x,y,encoders
    
def preprocess_data(df):
    encoders={}
    drop_data(df)
    x,y,encoders=label_data(df,encoders)
    return x,y,encoders



