from django.urls import path, include
from .views import CreateCommentView, CreateReplyView, VoteCommentView, VoteReplyView, EditCommentView, EditReplyView

urlpatterns = [
    path('create/', CreateCommentView.as_view(), name="create_comment"), 
    path('edit/<int:pk>', EditCommentView.as_view(), name="edit_comment"),
    path('reply/create/', CreateReplyView.as_view(), name="create_reply"),
    path('reply/edit/<int:pk>', EditReplyView.as_view(), name="edit_reply"),
    path('vote/', VoteCommentView.as_view(), name="vote_comment"),
    path('reply/vote/', VoteReplyView.as_view(), name="vote_reply")
]

