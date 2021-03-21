from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
import arxiv

class SearchPaperView(APIView):

    def get(self, request):

        search_term = request.query_params['search_term']
        max_results = int(request.query_params['max_results'])

        arxiv_results = arxiv.query(query=search_term, max_results=max_results)

        paper_list = []

        for paper_data in arxiv_results:
            paper = {
                'arxiv_id' : paper_data['id'],
                'title' : paper_data['title'],
                'authors' : ', '.join(author for author in paper_data['authors']),
                'date_published' : paper_data['published'],
                'abstract' : paper_data['summary']
            }
            paper_list.append(paper)

        return Response(data=paper_list, status=status.HTTP_200_OK)