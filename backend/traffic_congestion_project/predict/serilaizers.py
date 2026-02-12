from rest_framework import serializers

class PredictSerializer(serializers.Serializer):
    start = serializers.CharField(required=True, max_length=255)
    end = serializers.CharField(required=True, max_length=255)
    depart_at = serializers.DateTimeField(required=False, allow_null=True)