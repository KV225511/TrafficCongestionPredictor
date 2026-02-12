import pandas as pd;
from sklearn.preprocessing import LabelEncoder



def drop_data(df):
    df.drop(columns=["Trip_ID","start_area","end_area"],inplace=True)


def label_data(df,encoders):
    columns=["time_of_day","day_of_week","weather_condition","road_type"]
    target_col="traffic_density_level"
    for col in columns:
        le=LabelEncoder()
        df[col]=le.fit_transform(df[col])
        encoders[col]=le
        
    target_le=LabelEncoder()
    df[target_col]=target_le.fit_transform(df[target_col])
    encoders[target_col]=target_le
    x=df.drop(columns=["traffic_density_level"])
    y=df["traffic_density_level"]
    return x,y,encoders
    
def preprocess_data(df):
    encoders={}
    drop_data(df)
    x,y,encoders=label_data(df,encoders)
    return x,y,encoders



