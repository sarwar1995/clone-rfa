from django.shortcuts import render
from .models import Paper
from .serializers import PaperSerializer
from rest_framework import generics
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from crossref.restful import Works
from django.core.exceptions import ObjectDoesNotExist
from .serializers import PaperSerializer
from rest_framework.renderers import JSONRenderer
import json
from django.apps import apps
from comments.serializers import CommentSerializer

Comment = apps.get_model('comments', 'Comment')
class GetByDOIView(APIView):
    """ This is the view that is called for the article page rendering and returns 
    The control flow is as follows:
    /article/:DOI gets called from App.js which renders <ArticlePage> component with DOI in its props.
    The <ArticlePage> component then makes an axiosInstance.get() request to /papers/getByDOI/ which 
    invokes this view to get the relevant info either by querying the databse or Cross References RESTful API via Works().
     """
    def get(self, request):
        doi = request.query_params['DOI']

        paper = queryDatabase(doi)
        if paper:
            serializer = PaperSerializer(paper)
            data = serializer.data
            return Response(data=data, status=status.HTTP_200_OK)
        else:
            works = Works()
            paper_data = works.doi(doi)
    
            paper_dict = {
                'DOI' : (paper_data['DOI'] if 'DOI' in paper_data.keys() else ''),
                'title' : (paper_data['title'][0] if 'title' in paper_data.keys() else ''),
                'journal': (paper_data['short-container-title'][0] if 'short-container-title' in paper_data.keys() else ''),            
                'date_published' : (paper_data['published-print']['date-parts'][0] if 'published-print' in paper_data.keys() else ''),
                'abstract' : (paper_data['abstract'] if 'abstract' in paper_data.keys() else ''),
                }

            paper_dict['authors'] = []
            if 'author' in paper_data.keys():
                for author in paper_data['author']:
                    auth_name = ""
                    if 'given' in author.keys():
                        auth_name = author['given']
                    if 'family' in author.keys():
                        auth_name += " " + author['family']
                        auth_name.strip()
                        paper_dict['authors'].append(auth_name)

            paper_dict['authors'] = json.dumps(paper_dict['authors'])
            serializer = PaperSerializer(data=paper_dict)
            if serializer.is_valid:
                paper = serializer.save()
                data = serializer.data
                return Response(data=data, status=status.HTTP_200_OK)
            else:
                Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            

    def queryDatabase (self, doi):
        try:
            paper = Paper.objects.get(DOI=doi)
            return paper
        except ObjectDoesNotExist:
            return None 


class GetAllComments(generics.ListAPIView):
    serializer_class = CommentSerializer
    permission_classes = (permissions.AllowAny,)
    
    def get_queryset(self):
        doi = self.request.query_params['DOI']
        queryset = Comment.objects.filter(paper__DOI=doi)
        if not queryset:
            return None
        else:
            return queryset

    def list(self, request):
        """
        This method is called as the get() method. When the queryset is empty then we return a dict with 'NoComment' as True
        which can be checked on frontend """
        # Note the use of `get_queryset()` instead of `self.queryset`
        queryset = self.get_queryset()
        serializer = CommentSerializer(queryset, many=True)
        if not queryset:
            return Response({'NoComment': True})
        else:
            if serializer.is_valid:
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PaperListCreate(generics.ListCreateAPIView):
    queryset = Paper.objects.all()
    serializer_class = PaperSerializer