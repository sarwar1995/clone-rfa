from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from crossref.restful import Works
import requests
import urllib.parse

class SearchPaperView(APIView):

    def get(self, request):

        search_term = urllib.parse.quote(request.query_params['search_term'])
        max_results = int(request.query_params['max_results'])

        #get data from crossref API
        response = requests.get("https://api.crossref.org/types/journal-article/works?query=" + search_term + "&rows=15&select=DOI,title,short-container-title,published-print,author&mailto=elisagemart@gmail.com")
        print(response.json())
        crossref_results = response.json()['message']['items']

        paper_list = []

        for paper_data in crossref_results:
            #filter out unacceptable results
            def validate_key(key):
                return key in paper_data.keys() and paper_data[key] and len(paper_data[key][0])
            if validate_key('DOI') and validate_key('title'):
                paper = {
                    'DOI' : paper_data['DOI'],
                    'title' : (paper_data['title'][0] if 'title' in paper_data.keys() else ''),
                    'journal': (paper_data['short-container-title'][0] if 'short-container-title' in paper_data.keys() else ''),
                    'date_published' : (paper_data['published-print']['date-parts'][0][0] if 'published-print' in paper_data.keys() else ''),
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

                paper_list.append(paper)

        return Response(data=paper_list, status=status.HTTP_200_OK)