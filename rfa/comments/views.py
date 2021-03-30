from django.shortcuts import render
from rest_framework.views import APIView


class TestView(APIView):
    def get(self, request):
        return Response(data={"test": "You are on the comments page"}, status=status.HTTP_200_OK)
