from django.urls import path
from .views import TestView

urlpatterns = [
    path('show/', TestView.as_view(), name="test_view"), ]
