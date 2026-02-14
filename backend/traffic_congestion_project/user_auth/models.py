from datetime import datetime
from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class User(AbstractUser):
    
    history = models.JSONField(default=dict)
    last_login_time = models.DateTimeField(default=datetime.now)
    def __str__(self):
        return self.username
    
