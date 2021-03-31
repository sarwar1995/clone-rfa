from django.urls import path
from .views import CreateCommentView

urlpatterns = [
    path('/create/', CreateCommentView.as_view(), name="create_comment"), ]
