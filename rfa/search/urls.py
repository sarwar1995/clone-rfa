from django.urls import path
from .views import SearchPaperView

from . import views

urlpatterns = [
    path('', SearchPaperView.as_view(), name='search')
]