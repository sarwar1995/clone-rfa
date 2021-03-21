from django.shortcuts import render
from .models import Paper
from .serializers import PaperSerializer
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from crossref.restful import Works

class GetByDOIView(APIView):
    def get(self, request):
        doi = request.query_params['DOI']

        works = Works()
        paper_data = works.doi(doi)

        paper = {
            'DOI' : (paper_data['DOI'] if 'DOI' in paper_data.keys() else ''),
            'title' : (paper_data['title'][0] if 'title' in paper_data.keys() else ''),
            'date_published' : (paper_data['published-print']['date-parts'][0] if 'published-print' in paper_data.keys() else ''),
        }

        paper['authors'] = []
        if 'author' in paper_data.keys():
            for author in paper_data['author']:
                auth_name = ""
                if 'given' in author.keys():
                    auth_name = author['given']
                if 'family' in author.keys():
                    auth_name += " " + author['family']
                    auth_name.strip()
                    paper['authors'].append(auth_name)

        return Response(data=paper, status=status.HTTP_200_OK)

class PaperListCreate(generics.ListCreateAPIView):
    queryset = Paper.objects.all()
    serializer_class = PaperSerializer