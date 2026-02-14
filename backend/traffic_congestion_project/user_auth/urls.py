from django.urls import path
from .views import Signup,Login,Logout,Delete_Account

urlpatterns = [
    path("signup/", Signup.as_view(), name="signup"),
    path("login/", Login.as_view(), name="login"),
    path("logout/", Logout.as_view(), name="logout"),
    path("delete_account/", Delete_Account.as_view(), name="delete_account"),
]

