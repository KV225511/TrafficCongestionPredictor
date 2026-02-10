import re
from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields='__all__'
        
        
    def validate(self,data):
        if not data['username'].isalnum():
            raise serializers.ValidationError('Please enter a username without special symbols')
        return data