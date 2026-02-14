from django.urls import path
from .views import Get_History

urlpatterns = [
    path("get_history/", Get_History.as_view(), name="get_history"),
]
