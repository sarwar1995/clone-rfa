from django.urls import path
from . import views

urlpatterns = [
    path('getByDOI/', views.GetByDOIView.as_view()),
    path('getComments/', views.GetAllComments.as_view()),
    path('paper/', views.PaperListCreate.as_view() ),
]
