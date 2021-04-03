from django.urls import path, include
from .views import CreateCommentView, CreateReplyView

urlpatterns = [
    path('create/', CreateCommentView.as_view(), name="create_comment"), 
    path('reply/create/', CreateReplyView.as_view(), name="create_reply"), ]
