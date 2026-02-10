from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer
from django.contrib.auth.hashers import make_password 
from  rest_framework.authtoken.models import Token
from .models import User
from datetime import datetime
# Create your views here.

class Signup(APIView):
    def post(self,request,*args,**kwargs):
        data=request.data.copy()
        data['password']=make_password(data['password'])
        serializer=UserSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        user=serializer.save()
        token,created=Token.objects.get_or_create(user=user)
        return Response({
            'token':token.key,
            'user':UserSerializer(user).data
        })