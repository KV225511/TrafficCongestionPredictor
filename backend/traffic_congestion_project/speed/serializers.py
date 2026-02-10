from rest_framework import serializers


class SpeedRequestSerializer(serializers.Serializer):
    start = serializers.CharField(max_length=200)
    end = serializers.CharField(max_length=200)
    departAt = serializers.DateTimeField(required=False, allow_null=True)
