from django.shortcuts import render
from rest_framework import APIView
from weather.views import WeatherBetweenLocations
from speed.views import AverageSpeedBetweenLocations
from rest_framework.response import Response
from rest_framework import status
# Create your views here.

class Predict(APIView):
    def post(self,request,*args,**kwargs):
        data=request.data.copy()
        weather_input=WeatherBetweenLocations.get_weather(data['start_area'],data['end_area'],data['date'])
        speed_input=AverageSpeedBetweenLocations.get_speed(data['start_area'],data['end_area'])
        if weather_input.status!=200 or speed_input.status!=200:
            return Response({"error":"Invalid Input fields"},status=status.HTTP_400_BAD_REQUEST)
        
