from django.shortcuts import render
from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from .serializers import CommentSerializer
from rest_framework.response import Response
from .models import Comment
from django.core.exceptions import MultipleObjectsReturned, ObjectDoesNotExist
from urllib.parse import unquote
from django.apps import apps

Paper = apps.get_model('papers', 'Paper')
class CreateCommentView(generics.CreateAPIView):
    """
    This is the class that will create a new comment object through the inbuilt "post" method which calls the "create" method.
    """
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()

    def create(self, request):
        #Get the currently logged in user. This returns an instance of Django AUTH_USER_MODEL
        user = request.user
        #Getting the data from the post request by frontend    
        post_data = request.data['data']
        paper_DOI = post_data['paper_DOI']
        anonymity = False if (post_data['isAnonymous'] == "public") else True
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
