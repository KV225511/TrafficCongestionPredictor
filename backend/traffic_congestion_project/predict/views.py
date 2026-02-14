from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serilaizers import PredictSerializer
from weather.utils.resolve import get_resolved_weather
from speed.sevices import get_average_speed_between_locations
import pickle
import numpy as np
import os
from django.conf import settings
from datetime import datetime
from speed.utils.resolve import map_road_type
import asyncio
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from user_auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from datetime import datetime


MODEL=None
ENCODERS=None


def load_model_and_encoders(model_path, encoders_path):
    global MODEL, ENCODERS

    if MODEL is None or ENCODERS is None:
        with open(model_path, "rb") as f:
            MODEL = pickle.load(f)
        with open(encoders_path, "rb") as f:
            ENCODERS = pickle.load(f)

    return MODEL, ENCODERS

project_root = os.path.dirname(os.path.dirname(settings.BASE_DIR))
model_path = os.path.join(project_root, 'ml', 'model.pkl')
encoders_path = os.path.join(project_root, 'ml', 'encoders.pkl')
load_model_and_encoders(model_path,encoders_path)

class Predict(APIView):
    authentication_classes = [TokenAuthentication] 
    permission_classes=[IsAuthenticated]
    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        serializer = PredictSerializer(data=data)
        
        if not serializer.is_valid():
            return Response(
        {'error': 'Invalid Input fields', 'details': serializer.errors},
        status=status.HTTP_400_BAD_REQUEST
    )

        
        start = serializer.validated_data.get('start')
        end = serializer.validated_data.get('end')
        depart_at = serializer.validated_data.get('depart_at')
        
        try:
            model, encoders = MODEL,ENCODERS
        except Exception as e:
            return Response(
                {'error': f'Model loading failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # Get real predictions with actual data
        prediction_response = asyncio.run(self._get_real_prediction(request,
            model, encoders, start, end, depart_at
        ))
        
        return Response(prediction_response, status=status.HTTP_200_OK)
    
    async def _get_real_prediction(self, request, model, encoders, start, end, depart_at):
        try:
            # Get average speed and distance for the route
            speed_task =get_average_speed_between_locations(start, end, depart_at=depart_at)
            weather_task = get_resolved_weather(start, end, depart_at=depart_at)
            speed_result,weather_type=await asyncio.gather(speed_task,weather_task)
            if speed_result is None:
                return {'error': 'Could not fetch speed data'}

            avg_speed, distance_km_actual, functional_road_class = speed_result
            
            # Get weather type for the route
            if weather_type is None:
                return {'error': 'Could not fetch weather data'}
            
            # Prepare input data
            input_data = self._prepare_input_data(start, end, depart_at, avg_speed,weather_type, encoders,distance_km_actual,functional_road_class)

            if input_data is None:
                return {'error': 'Could not prepare input data', 'details': 'Check that all categorical values match training data'}
            
            # Make prediction
            prediction = model.predict([input_data])
            prediction_prob = model.predict_proba([input_data])[0]
            confidence = [round(float(i*100),2) for i in prediction_prob]
            print(prediction_prob)
            
            prediction = model.predict([input_data])[0]
            prediction_prob_max = model.predict_proba([input_data])[0]
            confidence_max = prediction_prob_max.max() * 100
            
            # Decode prediction
            decoded_prediction = encoders['traffic_density_level'].inverse_transform([prediction])[0]
            await asyncio.to_thread(update_history, request, decoded_prediction)
            return {
                'predicted_traffic_level': decoded_prediction,
                'confidence': round(float(confidence_max), 2),
                'input_data': {
                    'High':confidence[0],
                    'Low':confidence[1],
                    'Medium':confidence[2],
                    'Very High':confidence[3],
                    'start': start,
                    'end': end,
                    'depart_at': str(depart_at) if depart_at else 'current',
                    'avg_speed': avg_speed,
                    'weather_type': weather_type,
                    'distance_km': distance_km_actual,
                    'road_type': map_road_type(functional_road_class)
                }
            }
        except Exception as e:
            return {'error': f'Prediction failed: {str(e)}'}

    
    def _prepare_input_data(self, start, end, depart_at, avg_speed, weather_type, encoders, distance_km_actual,functional_road_class):
        try:
            
            # Extract time features
            if depart_at:
                hour = depart_at.hour
                day_num = depart_at.weekday()
            else:
                now = datetime.now()
                hour = now.hour
                day_num = now.weekday()
            
            # Convert hour to time_of_day category
            if 6 <= hour < 10:
                time_of_day = "Morning Peak"
            elif 10 <= hour < 17:
                time_of_day = "Afternoon"
            elif 17 <= hour < 20:
                time_of_day = "Evening Peak"
            else:
                time_of_day = "Night"
            
            # Convert day_num to day_of_week category
            day_of_week = "Weekend" if day_num >= 5 else "Weekday"
            
            # Normalize weather_type to match training data format
            weather_mapping = {
                "clear": "Clear",
                "fog": "Fog",
                "rain": "Rain",
                "heatwave": "Heatwave"
            }
            weather_condition = weather_mapping.get(weather_type, "Clear")
            
            road_type = map_road_type(functional_road_class)

            # Encode categorical features
            time_of_day_encoded = encoders['time_of_day'].transform([time_of_day])[0]
            day_of_week_encoded = encoders['day_of_week'].transform([day_of_week])[0]
            weather_encoded = encoders['weather_condition'].transform([weather_condition])[0]
            road_type_encoded = encoders['road_type'].transform([road_type])[0]
            distance_encoded = distance_km_actual  # Use actual distance as is

            return [
                time_of_day_encoded,
                day_of_week_encoded,
                weather_encoded,
                road_type_encoded,
                distance_encoded,
                avg_speed
            ]

        except Exception as e:
            return None
        
        



def update_history(request, prediction):
    username = request.user.username
    start = request.data.get("start")
    end = request.data.get("end")

    try:
        user_object = User.objects.get(username=username)
    except User.DoesNotExist:
        return {"error": "User not found"}

    history = user_object.history if isinstance(user_object.history, list) else []

    if len(history) >= 5:
        history.pop(0)
        

    history.append({prediction:[start,end]})
    user_object.history = history
    user_object.save()

     
