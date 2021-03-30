from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth import get_user_model

class CustomUser(AbstractUser):
    """ Adding the two extra attributes of a user, their affiliation (ex: Yale) and position (ex: Student, Prof.) here. 
    For now these fields are allowed to be blank (blank=True)."""
    affiliation = models.CharField(blank=True, max_length=120)
    position = models.CharField(blank=True, max_length=120)
    is_active = models.BooleanField(default=False)

    def AddComment(self, validated_data):
        self.comment_set.create(paper = validated_data["paper"], comment_text = validated_data["comment_text"], created_date = validated_data["created_date"], isAnonymous = validated_data["isAnonymous"], paper_section = validated_data["paper_section"], comment_type = validated_data["comment_type"], user_expertise = validated_data["user_expertise"])
