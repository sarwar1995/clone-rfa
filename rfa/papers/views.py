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
from comments.serializers import CommentSerializer, CommentWithRepliesSerializer
from urllib.parse import unquote
from django.db.models import Prefetch

Comment = apps.get_model('comments', 'Comment')
class GetByDOIView(APIView):
    """ This is the view that is called for the article page rendering and returns 
    The control flow is as follows:
    /article/:DOI gets called from App.js which renders <ArticlePage> component with DOI in its props.
    The <ArticlePage> component then makes an axiosInstance.get() request to /papers/getByDOI/ which 
    invokes this view to get the relevant info either by querying the databse or Cross References RESTful API via Works().
     """
    def queryDatabase(self, doi):
        try:
            paper = Paper.objects.get(DOI=doi)
            return paper
        except ObjectDoesNotExist:
            return None
    
    def get(self, request):
        doi = request.query_params['DOI']
        paper = self.queryDatabase(unquote(doi))
        if paper:
            serializer = PaperSerializer(paper)
            data = serializer.data
            return Response(data=data, status=status.HTTP_200_OK)
        else:
            works = Works()
            paper_data = works.doi(doi)
            if 'title' in paper_data.keys():
                if paper_data['title']:
                    paper_title = paper_data['title'][0]
                else:
                    paper_title =''
            paper_dict = {
                'DOI' : (paper_data['DOI'] if 'DOI' in paper_data.keys() else ''),
                'title' : '' if (not('title' in paper_data.keys())) else (paper_data['title'][0] if paper_data['title'] else ''),
                # 'title' : (paper_data['title'][0] if 'title' in paper_data.keys() else ''),
                'journal': '' if (not('short-container-title' in paper_data.keys())) else (paper_data['short-container-title'][0] if paper_data['short-container-title'] else ''),
                #'journal': (paper_data['short-container-title'][0] if 'short-container-title' in paper_data.keys() else ''),            
                'year_published' : '' if (not('published-print' in paper_data.keys())) else (paper_data['published-print']['date-parts'][0][0] if (paper_data['published-print']['date-parts'] and paper_data['published-print']['date-parts'][0]) else ''),
                #'year_published' : (paper_data['published-print']['date-parts'][0][0] if 'published-print' in paper_data.keys() else ''),
                'abstract' : (paper_data['abstract'] if 'abstract' in paper_data.keys() else ''),
                }

            paper_dict['authors'] = ''
            if 'author' in paper_data.keys():
                first_author = True
                for author in paper_data['author']:
                    auth_name = ''
                    if not first_author:
                        auth_name += ', '
                    if 'given' in author.keys():
                        auth_name += author['given']
                    if 'family' in author.keys():
                        auth_name += ' ' + author['family']
                        auth_name.strip()
                        paper_dict['authors'] += auth_name
                    first_author = False
            paper_dict['authors'] = json.dumps(paper_dict['authors'])
            serializer = PaperSerializer(data=paper_dict)
            print(serializer)
            if serializer.is_valid():
                paper = serializer.save()
                data = serializer.data
                return Response(data=data, status=status.HTTP_200_OK)
            else:
                print(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetAllComments(generics.ListAPIView):
    serializer_class = CommentSerializer
    permission_classes = (permissions.AllowAny,)
    
    def get_queryset(self):
        doi = self.request.query_params['DOI']
        queryset = Comment.objects.filter(paper__DOI=unquote(doi))
        
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

        if not queryset:
            return Response([], status=status.HTTP_200_OK)
        
        serializer = CommentWithRepliesSerializer(queryset, many=True)
        print(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)

class PaperListCreate(generics.ListCreateAPIView):
    queryset = Paper.objects.all()
    serializer_class = PaperSerializer