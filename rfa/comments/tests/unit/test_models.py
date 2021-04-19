import pytest
import json
from django.apps import apps
from comments.tests.factories import CommentFactory, ReplyFactory

Comment = apps.get_model('comments', 'Comment')
Reply = apps.get_model('comments', 'Reply')

class TestModelCreations:
    @pytest.mark.django_db
    def test_create_comment(self):
        comment = CommentFactory.create(comment_text = '<p> This is a comment! </p>')  
        assert comment.comment_text == '<p> This is a comment! </p>'
        assert comment.isAnonymous == False 

    @pytest.mark.django_db
    def test_create_reply(self):
        reply = ReplyFactory.create(reply_text = '<p> I disagree! </p>')  
        assert reply.reply_text == '<p> I disagree! </p>'
        assert reply.isAnonymous == False 