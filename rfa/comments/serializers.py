from rest_framework import serializers
from .models import CustomUser
from django.core.exceptions import ObjectDoesNotExist
from .models import Comment

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('paper', 'user', 'comment_text', 'created_date', 'isAnonymous', 
        'paper_section', 'comment_type', 'user_expertise')
        