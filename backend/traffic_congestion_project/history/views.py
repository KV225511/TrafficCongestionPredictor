from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework import status
from user_auth.models import User
from rest_framework.response import Response

# Create your views here.
class Get_History(APIView):
    authentication_classes=[TokenAuthentication]
    permission_classes=[IsAuthenticated]
    def get(self,request,*args,**kwargs):
        history=request.user.history
        return Response(history,status=status.HTTP_200_OK)