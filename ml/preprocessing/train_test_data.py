import pandas as pd
from sklearn.model_selection import train_test_split
from preprocess import preprocess_data

df=pd.read_csv("ml/data/delhi_traffic_features.csv")
x,y,encoders=preprocess_data(df)
x_train,x_test,y_train,y_test=train_test_split(x,y,test_size=0.2,random_state=42,stratify=y)
df.drop(columns=["traffic_density_level"],inplace=True)
print(x_train.shape)
print(x_test.shape)
print(y_test.shape)
print(y_train.shape)

