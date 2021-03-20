from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('<str:search_term>/<int:max_results>/', views.search, name='search')
]