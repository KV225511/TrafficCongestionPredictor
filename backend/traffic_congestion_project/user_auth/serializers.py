import re
from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields='__all__'
        
        
    def validate(self, data):
        username = data.get("username") or ""
        email=data.get("email") or ""
        password=data.get("password") or ""


        if not username or not str(username).isalnum():
            raise serializers.ValidationError("Please enter a username without special symbols")
        if not email or not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            raise serializers.ValidationError("Please enter a valid email address")
        if not password:
            raise serializers.ValidationError("Please enter a password")
        if len(password) < 8:
            raise serializers.ValidationError("Password must be at least 6 characters long")
        if password != data.get("confirm_password"):
            raise serializers.ValidationError("Passwords do not match")
        return data