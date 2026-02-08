from rest_framework import serializers

class WeatherRequestSerializer(serializers.Serializer):
    start = serializers.CharField(max_length=100)
    end = serializers.CharField(max_length=100)
