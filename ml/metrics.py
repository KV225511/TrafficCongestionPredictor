import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from preprocessing.train_test_data import train_test_split_data


x_train,x_test,y_train,y_test,encoders=train_test_split_data()

rf_model = RandomForestClassifier(
    n_estimators=150,
    random_state=42
)

rf_model.fit(x_train, y_train)
y_predict = rf_model.predict(x_test)

target_encoder = encoders["traffic_density_level"]
y_predict_decoded = target_encoder.inverse_transform(y_predict)
y_test_decoded = target_encoder.inverse_transform(y_test)

correct_predictions = []
for actual_value, predicted_value in zip(y_test_decoded, y_predict_decoded):
    if predicted_value == actual_value:
        correct_predictions.append(True)
    else:
        correct_predictions.append(False)

correct_count = 0
for is_correct in correct_predictions:
    if is_correct:
        correct_count += 1
total_count = len(y_test_decoded)

accuracy_percentage = (correct_count / total_count) * 100

print(f"Accuracy: {accuracy_percentage:.2f}%")
print(f"Correct predictions: {correct_count} out of {total_count}")


report = classification_report(y_test, y_predict, output_dict=True)

classes = ['0', '1', '2', '3']
f1_scores = [report[c]['f1-score'] for c in classes]

plt.figure()
plt.bar(classes, f1_scores)
plt.xlabel("Traffic Density Class")
plt.ylabel("F1-score")
plt.title("Class-wise F1-score")
plt.ylim(0, 1)
plt.show()
