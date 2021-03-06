from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth import get_user_model
import json

class CustomUser(AbstractUser):
    """ Adding the two extra attributes of a user, their affiliation (ex: Yale) and position (ex: Student, Prof.) here. 
    For now these fields are allowed to be blank (blank=True)."""
    affiliation = models.CharField(blank=True, max_length=120)
    position = models.CharField(blank=True, max_length=120)
    is_active = models.BooleanField(default=False)
    votes = models.IntegerField(default = 10)
    vote_reset = models.DateTimeField(auto_now_add=True)

class ReadingList(models.Model):
    name = models.CharField(max_length=120, default='Reading List')
    is_public = models.BooleanField(default=True)
    DOIs = models.TextField(blank=True, default=json.dumps({'DOIs': []}))
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
