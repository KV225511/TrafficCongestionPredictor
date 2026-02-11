from django.shortcuts import render
from rest_framework import APIView
from weather.services import WeatherBetweenLocations
from speed.sevices import AverageSpeedBetweenLocations
from rest_framework.response import Response
from rest_framework import status
from .serilaizers import PredictSerializer
import pandas as pd
import pickle
from ml.model import model as ml_model

class Predict(APIView):
    def post(self,request,*args,**kwargs):
        data=request.data.copy()
        serializer=PredictSerializer(data=data)
        if not serializer.is_valid():
            return Response({'error':'Invalid Input fields'},status=status.HTTP_400_BAD_REQUEST)
        weather_input=WeatherBetweenLocations.get_weather(serializer.validated_data)
        speed_input=AverageSpeedBetweenLocations.get_speed(serializer.validated_data)
        with open("ml/","rb") as f:
            ml_model=pickle.load(f)
        ml_model.predict()
        
        
        
        
        
