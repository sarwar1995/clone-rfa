from rest_framework import serializers
from django.core.exceptions import ObjectDoesNotExist
from .models import Comment, Reply
from core.serializers import UserCheckSerializer
from papers.serializers import PaperSerializer
class CommentSerializer(serializers.ModelSerializer):
    # reply = ReplySerializer()
    class Meta:
        model = Comment
        fields = ('paper', 'user', 'comment_text', 'created_at', 'edited_at', 'isAnonymous', 'votes',
        'paper_section', 'comment_type', 'user_expertise', 'id') #'reply'

        
    def create(self, validated_data):
        instance = self.Meta.model(**validated_data)
        instance.save()
        return instance

class ReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Reply
        fields = ('comment', 'user', 'reply_text', 'votes', 'created_at', 'edited_at', 'isAnonymous', 'id')

        
    def create(self, validated_data):
        instance = self.Meta.model(**validated_data)
        instance.save()
        return instance

class ReplyWithCommentsSerializer(serializers.ModelSerializer):
    """ This serializer uses the UserCheckSerializer which allows to get all the user data without the validation
    of username and password that comes with the default CustomUserSerializer since we will be using this serializer
    on already existing user models. """
    user = UserCheckSerializer(read_only=True)
    class Meta:
        model = Reply
        fields = ('comment', 'user', 'reply_text', 'votes', 'created_at', 'edited_at', 'isAnonymous', 'id')

        
    def create(self, validated_data):
        instance = self.Meta.model(**validated_data)
        instance.save()
        return instance

class CommentWithRepliesSerializer (serializers.ModelSerializer):
    """ Adding these custom serializers allows us to control the output of the serializer. When the field serializers
    are not defined in this custom fashion then the pk (i.e. by default pk = id) is used. For this particular serializer
    the input needs to be a queryset of comments and the replies on it will automatically be retrieved based on the 
    foreign key reverse relationship.   """
    replies = ReplyWithCommentsSerializer(many=True, read_only=True)
    paper = PaperSerializer(read_only=True)
    user = UserCheckSerializer(read_only=True)
    class Meta:
        model = Comment
        fields = ('paper', 'user', 'comment_text', 'created_at', 'edited_at', 'isAnonymous', 'votes',
        'paper_section', 'comment_type', 'user_expertise', 'id', 'replies')