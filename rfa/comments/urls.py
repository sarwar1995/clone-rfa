from django.urls import path, include
from .views import CreateCommentView, CreateReplyView, VoteCommentView

urlpatterns = [
    path('create/', CreateCommentView.as_view(), name="create_comment"), 
    path('reply/create/', CreateReplyView.as_view(), name="create_reply"),
    path('vote/', VoteCommentView.as_view(), name="vote_comment")
]

