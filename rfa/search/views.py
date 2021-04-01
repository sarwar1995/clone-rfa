from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from crossref.restful import Works

class SearchPaperView(APIView):

    def get(self, request):

        search_term = request.query_params['search_term']
        max_results = int(request.query_params['max_results'])
        print(max_results)

        works = Works()
        crossref_results = works.query(bibliographic=search_term).sort('score').select('DOI', 'title', 'author', 'published-print', 'type', 'short-container-title')

        paper_list = []

        for paper_data in crossref_results:
            if len(paper_list) > max_results:
                break
            print(paper_data)
            #filter out unacceptable results
            if 'DOI' in paper_data.keys() and 'title' in paper_data.keys():
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