import numpy as np
import pickle
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from preprocessing.speed_train_test_data import train_test_split_speed_data

X_train, X_test, y_train, y_test, encoders = train_test_split_speed_data()

speed_model = RandomForestRegressor(
    n_estimators=200,
    random_state=42
)

speed_model.fit(X_train, y_train)
y_pred = speed_model.predict(X_test)

mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, y_pred)

print("Mean Absolute Error (MAE):", mae)
print("Root Mean Squared Error (RMSE):", rmse)
print("R-squared (R2):", r2)

with open("ml/speed_model.pkl", "wb") as f:
    pickle.dump(speed_model, f)

