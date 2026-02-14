import re
from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields='__all__'
        
        
    def validate(self, data):
        username = data.get("username") or ""
        if not username or not str(username).isalnum():
            raise serializers.ValidationError("Please enter a username without special symbols")
        return data