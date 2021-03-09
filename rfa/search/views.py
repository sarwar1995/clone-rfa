from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from django.template import loader

import arxiv

def index(request):
    print(request)
    return HttpResponse("Hello, world. You're at the search index.")

def search(request, search_term, max_results):
	arxiv_results = arxiv.query(query=search_term, max_results=max_results)

	#return HttpResponse("You're searching for %s." % search_term)

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

	template = loader.get_template('search/search.html')

	context = {
		'paper_list': paper_list,
		'search_term': search_term,
	}
	
	return HttpResponse(template.render(context, request))