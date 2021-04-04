from django.shortcuts import render
from django.conf import settings
from rest_framework.response import Response
from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from .serializers import CommentSerializer, ReplySerializer
from rest_framework.response import Response
from .models import Comment, Reply
from django.core.exceptions import MultipleObjectsReturned, ObjectDoesNotExist
from urllib.parse import unquote
from django.apps import apps
Paper = apps.get_model('papers', 'Paper')
CustomUser = apps.get_model('core', 'CustomUser')
#used to upvote or downvote a comment
class VoteCommentView(APIView):
    def post(self, request):
        polarity = request.data['polarity']
        comment_id = request.data['comment_id']
        comment = None

        try:
            comment = Comment.objects.get(id=comment_id)
        except:
            return Response(data="Comment does not exist", status=status.HTTP_400_BAD_REQUEST)

        if not comment:
            return Response(data="Comment does not exist", status=status.HTTP_400_BAD_REQUEST)

        #UNVOTE -- remove my vote, whatever it is, if I've voted -- not implemented for MVP
        if polarity == None:
            return Response(data="", status=status.HTTP_200_OK)
        #UPVOTE
        elif polarity == True:
            comment.votes = comment.votes + 1
        #DOWNVOTE
        else:
            comment.votes = comment.votes - 1
        comment.save()
        return Response(data="Voted!", status=status.HTTP_200_OK)

#used to upvote or downvote a reply
class VoteReplyView(APIView):
    
    def post(self, request):
        polarity = request.data['polarity']
        reply_id = request.data['reply_id']
        reply = None

        try:
            reply = Reply.objects.get(id=reply_id)
        except:
            return Response(data="Reply does not exist", status=status.HTTP_400_BAD_REQUEST)

        if not reply:
            return Response(data="Reply does not exist", status=status.HTTP_400_BAD_REQUEST)

        #UNVOTE -- remove my vote, whatever it is, if I've voted -- not implemented for MVP
        if polarity == None:
            return Response(data="", status=status.HTTP_200_OK)
        #UPVOTE
        elif polarity == True:
            reply.votes = reply.votes + 1
        #DOWNVOTE
        else:
            reply.votes = reply.votes - 1
        reply.save()
        return Response(data="Voted!", status=status.HTTP_200_OK)

class CreateCommentView(generics.CreateAPIView):
    """
    This is the class that will create a new comment object through the inbuilt "post" method which calls the "create" method.
    """
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()

    def create(self, request):
        #Getting the data from the post request by frontend    
        post_data = request.data['data']
        anonymity = False if (post_data['isAnonymous'] == "public") else True
        #Get the currently logged in user. This returns an instance of Django AUTH_USER_MODEL
        request_user = request.user
        if anonymity:
            user, created = CustomUser.objects.get_or_create(username='Anonymous')
        else:
            user = request_user

        paper_DOI = post_data['paper_DOI']
        
        try:
            #Get the paper on which comment is being made.
            paper = Paper.objects.get(DOI=unquote(paper_DOI))
        except ObjectDoesNotExist:
            paper = None
            return Response({'Message: Paper object does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        except MultipleObjectsReturned:
            paper = None
            return Response({'Message: Multiple paper objects found'}, status=status.HTTP_400_BAD_REQUEST)
        comment_data = {
        'paper' : paper.pk,
        'user' : user.pk,
        'comment_text' : post_data['comment_text'],
        'isAnonymous' : anonymity,
        'paper_section' : post_data['paper_section'],
        'comment_type' : post_data['comment_type'],
        'user_expertise' : post_data['user_expertise'],
        'votes' : 0
        }
        serializer = CommentSerializer(data=comment_data)
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreateReplyView(generics.CreateAPIView):
    """
    This is the view class that will create a new Reply object through the inbuilt "post" method 
    which calls the "create" method.
    """
    serializer_class = ReplySerializer

    def create(self, request):
        #Get the currently logged in user. This returns an instance of Django AUTH_USER_MODEL
        request_user = request.user
        #Getting the data from the post request by frontend    
        post_data = request.data['data']
        comment_id = post_data['comment_id']
        anonymity = False if (post_data['isAnonymous'] == "public") else True
        
        if anonymity:
            user, created = CustomUser.objects.get_or_create(username='Anonymous')
        else:
            user = request_user
            
        try:
            comment = Comment.objects.get(id=comment_id)
        except ObjectDoesNotExist:
            comment = None
            return Response({'Message: Comment object for this reply does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        except MultipleObjectsReturned:
            comment = None
            return Response({'Message: Multiple comment objects found for this reply'}, status=status.HTTP_400_BAD_REQUEST)

        reply_data = {
        'comment' : comment.pk,
        'user' : user.pk,
        'reply_text' : post_data['reply_text'],
        'isAnonymous' : anonymity,
        'votes' : 0
        }
        serializer = ReplySerializer(data=reply_data)
        if serializer.is_valid():
            serializer.save()
            print(serializer.validated_data)
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
