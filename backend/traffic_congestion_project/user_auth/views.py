from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer
from django.contrib.auth.hashers import make_password 
from  rest_framework.authtoken.models import Token
from .models import User
from datetime import datetime
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

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
        },status=status.HTTP_200_OK)
        
    
class Login(APIView):
    def post(self,request,*args,**kwargs):
        data=request.data.copy()
        user=authenticate(
            username=data['username'],
            password=data['password']
        )
        if not user:
            return Response({'error':"Invalid credentials" },status=401)
        
        token,_=Token.objects.get_or_create(user=user)
        return Response({"token":token.key,"user":UserSerializer(user).data},status=status.HTTP_200_OK)
    
class Logout(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request,*args,**kwargs):
        request.auth.delete()
        return Response({"message":"Logged out successfully!"},status=status.HTTP_200_OK)
        
        
    
class Delete_Account(APIView):
    permission_classes=[IsAuthenticated]
    def delete(self,request,*args,**kwargs):
        user=request.user
        request.auth.delete()
        user.delete()
        return Response({'message':"User successfully deleted"},status=status.HTTP_200_OK)