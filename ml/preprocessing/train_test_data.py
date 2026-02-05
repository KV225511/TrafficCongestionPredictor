import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from .preprocess import preprocess_data

def train_test_split_data():
    df=pd.read_csv("ml/data/delhi_traffic_features.csv")
    x,y,encoders=preprocess_data(df)
    with open("ml/encoders.pkl","wb") as f:
        pickle.dump(encoders,f)
    x_train,x_test,y_train,y_test=train_test_split(x,y,test_size=0.2,random_state=42,stratify=y)
    return x_train,x_test,y_train,y_test,encoders


