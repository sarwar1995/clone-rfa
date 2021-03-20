from django.urls import path
from . import views

urlpatterns = [
    path('api/paper/', views.PaperListCreate.as_view() ),
]
