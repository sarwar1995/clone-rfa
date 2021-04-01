from rest_framework import serializers
from django.core.exceptions import ObjectDoesNotExist
from .models import Comment

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('paper', 'user', 'comment_text', 'created_date', 'isAnonymous', 'votes',
        'paper_section', 'comment_type', 'user_expertise')
        
    def create(self, validated_data):
        instance = self.Meta.model(**validated_data)
        instance.save()
        return instance