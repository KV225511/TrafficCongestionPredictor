import re
from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields='__all__'
        
        
    def validate(self,data):
        if not re.match(r'[^a-zA-Z0-9]+',data['username']):
            raise serializers.ValidationError('Please Enter a Username without special symbols')
        return data