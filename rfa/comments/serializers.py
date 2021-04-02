from rest_framework import serializers
from django.core.exceptions import ObjectDoesNotExist
from .models import Comment

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        #Not including created_date field in fields, because that has auto_now_add=True
        fields = ('paper','user', 'comment_text', 'isAnonymous', 'votes',
        'paper_section', 'comment_type', 'user_expertise')
        
    def create(self, validated_data):
        instance = self.Meta.model(**validated_data)
        instance.save()
        return instance