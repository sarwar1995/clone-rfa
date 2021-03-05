from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    """ Adding the two extra attributes of a user, their affiliation (ex: Yale) and position (ex: Student, Prof.) here. 
    For now these fields are allowed to be blank (blank=True)."""
    affiliation = models.CharField(blank=True, max_length=120)
    position = models.CharField(blank=True, max_length=120)
