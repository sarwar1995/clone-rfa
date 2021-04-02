from rest_framework import serializers
from django.core.exceptions import ObjectDoesNotExist
from .models import Comment
from papers.serializers import PaperSerializer
from core.serializers import CustomUserSerializer

class CommentSerializer(serializers.ModelSerializer):
    paper = PaperSerializer()
    user = CustomUserSerializer()
    class Meta:
        model = Comment
        fields = ('paper', 'user', 'comment_text', 'created_at', 'isAnonymous', 'votes',
        'paper_section', 'comment_type', 'user_expertise', 'id')
        
    def create(self, validated_data):
        instance = self.Meta.model(**validated_data)
        instance.save()
        return instance