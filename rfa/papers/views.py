from django.shortcuts import render
from .models import Paper
from .serializers import PaperSerializer
from rest_framework import generics

class PaperListCreate(generics.ListCreateAPIView):
    queryset = Paper.objects.all()
    serializer_class = PaperSerializer