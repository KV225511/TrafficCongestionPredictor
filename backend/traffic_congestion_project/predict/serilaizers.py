from rest_framework import serializers

                ##(sent values,values show in drop_down)
LOCATION_CHOICES=[]

class PredictSerializer(serializers.Serializer):
    start=serializers.ChoiceField(required=True,choices=LOCATION_CHOICES)
    end=serializers.ChoiceField(required=True,choices=LOCATION_CHOICES)
    depart_at=serializers.DateTimeField(required=False,allow_null=True)