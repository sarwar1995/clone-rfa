import pytest
import json
from django.apps import apps

from django.http import HttpRequest
from django.test import Client

from search.views import SearchPaperView

S = SearchPaperView()
request = HttpRequest()

@pytest.mark.django_db
def test_general_search():
	request.query_params = {'search_term' : 'compilers'}

	response = S.get(request)
	assert response.status_code == 200
	assert len(response.data) > 1

	assert 'DOI' in response.data[0].keys()
	assert 'title' in response.data[0].keys()
	assert 'authors' in response.data[0].keys()

@pytest.mark.django_db
def test_specific_paper_search():
	request.query_params = {'search_term' : 'The motivic zeta functions of a matroid Jensen Kutler Usatine'}

	response = S.get(request)
	assert response.status_code == 200
	assert len(response.data) > 1

	paper = response.data[0]

	assert paper['DOI'] == '10.1112/jlms.12386'
	assert paper['title'] == 'The motivic zeta functions of a matroid'
	assert paper['authors'] == ['David Jensen', 'Max Kutler', 'Jeremy Usatine']

@pytest.mark.django_db
def test_doi_search():
	request.query_params = {'search_term' : 'jlms.12386'}

	response = S.get(request)
	assert response.status_code == 200
	assert len(response.data) > 1

	papers = response.data

	DOIs = []
	titles = []
	authors = []

	for paper in papers:
		DOIs.append(paper['DOI'])
		titles.append(paper['title'])
		authors.append(paper['authors'])

	assert '10.1112/jlms.12386' in DOIs
	assert 'The motivic zeta functions of a matroid' in titles
	assert ['David Jensen', 'Max Kutler', 'Jeremy Usatine'] in authors

@pytest.mark.django_db
def test_empty_search():
	request.query_params = {}

	with pytest.raises(KeyError):
		response = S.get(request)

@pytest.mark.django_db
def test_depricated_search():
	request.query_params = {'search_term' : 'compilers', 'max_results' : 3}

	response = S.get(request)
	assert response.status_code == 200
	assert len(response.data) > 1

	assert 'DOI' in response.data[0].keys()
	assert 'title' in response.data[0].keys()
	assert 'authors' in response.data[0].keys()

