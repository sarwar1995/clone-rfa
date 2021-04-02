from django.urls import path
from .views import CreateCommentView, VoteCommentView

urlpatterns = [
    path('create/', CreateCommentView.as_view(), name="create_comment"),
    path('voteComment/', VoteCommentView.as_view(), name="vote_comment")
     ]
