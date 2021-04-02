from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView
from .serializers import CommentSerializer
from .models import Comment
class CreateCommentView(generics.CreateAPIView):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()

    def create(self, request):
        username = request.query_params['username']
        paper_DOI = request.query_params['paper_DOI']
        user = User.objects.filter(username=username)
        # user = str(request.user) #This ret
        paper = Paper.objects.filter(DOI=paper_DOI)
        comment_data = {'paper' : paper,
        'user' : user,
        'comment_text' : request.query_params['comment_text'],
        'isAnonymous' : request.query_params['isAnonymous'],
        'paper_section' : request.query_params['paper_section'],
        'comment_type' : request.query_params['comment_type'],
        'user_expertise' : request.query_params['user_expertise'],
        'votes' : 0
        }

        serializer = CommentSerializer(data=comment_data)
        if serializer.is_valid:
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
