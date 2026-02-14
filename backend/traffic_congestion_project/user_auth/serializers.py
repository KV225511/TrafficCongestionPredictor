import re
from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"
        extra_kwargs = {"password": {"write_only": True}}
        
        
    def validate(self, data):
        username = data.get("username") or ""
        email = data.get("email") or ""
        password = data.get("password") or ""

        if not username or not str(username).isalnum():
            raise serializers.ValidationError("Please enter a username without special symbols")
        if not email or not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            raise serializers.ValidationError("Please enter a valid email address")
        if not password:
            raise serializers.ValidationError("Please enter a password")
        if len(password) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long")
        # confirm_password is validated on the frontend; not sent in API payload
        return data