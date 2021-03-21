from django.urls import path
from . import views

urlpatterns = [
    path('paper/', views.PaperListCreate.as_view() ),
]
