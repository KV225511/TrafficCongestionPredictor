import pandas as pd;
import pickle
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from preprocessing.train_test_data import train_test_split_data

x_train,x_test,y_train,y_test,encoders=train_test_split_data()

rf_model = RandomForestClassifier(
    n_estimators=150,
    random_state=42
)

rf_model.fit(x_train,y_train)
y_predict=rf_model.predict(x_test)
y_predict_prob=rf_model.predict_proba(x_test)
decoded_output=encoders["traffic_density_level"].inverse_transform(y_predict)

with open("ml/model.pkl","wb") as f:
    pickle.dump(rf_model,f)

confidences=y_predict_prob.max(axis=1)*100
output_df=pd.DataFrame({
    "predicted_value":decoded_output,
    "confidence":confidences.round(2)
})


print(output_df)