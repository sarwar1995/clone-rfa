from django.db import models
from django.apps import apps
from djrichtextfield.models import RichTextField

Paper = apps.get_model('papers', 'Paper')
User = apps.get_model('core', 'CustomUser')


class Comment(models.Model):
    """ 
    Attributes: [paper, user, comment_text, created_date, isAnonymous, paper_section, comment_type, user_expertise]
    The comment model has the following fields:
    paper => The paper that the comment is being made about. Many-to-one relationship from comment-to-paper,
    implemented with the 'ForiegnKey' method i.e. many comments can exist for a single paper.
    Note here that on_delete=models.CASCADE for paper, because if a paper object gets deleted than all comments on that paper
    must also be deleted.
    user => The user that is making the comment. Many-to-one relationship from comment-to-user implemented with the 
    'ForiegnKey' method. 
    Note here that on_delete=models.PROTECT for user, because we don't want to delete a user and their comments if the paper still exists.
    comment_text => Text of the comment which is a RichTextField()
    created_date
    isAnonymous ==> Whether the comment has been made anonymously in which case hide user's name and affiliation in the CommentView.
    paper_section => section of the paper that the comment is primarily about
    comment_type => question, review, or summary
    user_expertise => whether the user is 'novice', 'familiar' , 'expert' or 'leader' in the field of the paper
    """
    paper = models.ForeignKey(
        Paper, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(
        User, on_delete=models.PROTECT, related_name='comments')
    comment_text = models.RichTextField()
    created_date = models.DateField(auto_now_add=True)
    isAnonymous = models.BooleanField(default = False)
    votes = models.IntegerField(default = 0)
    class PaperSection (models.TextChoices):
        WHOLEPAPER = 'whole', __('Whole Paper')
        ABSTRACT = 'abstract', __('Abstract')
        INTRODUCTION = 'intro', __('Introduction')
        METHODOLOGY = 'method', __('Methodology')
        RESULTS = 'results', __('Results')
        DISCUSSION = 'discussion', __('Discussion')
        CONCLUSION = 'conclusion', __('Conclusion')

    paper_section = models.CharField(
        max_length=120,
        choices=PaperSection.choices,
        default=PaperSection.WHOLEPAPER,
    )

    class CommentType (models.TextChoices):
        QUESTION = 'question', __('Question')
        REVIEW = 'review', __('Review')
        SUMMARY = 'summary', __('Summary')

    comment_type = models.CharField(
        max_length=120,
        choices=CommentType.choices,
        default=CommentType.REVIEW,
    )

    class UserExpertise (models.TextChoices):
        NOVICE = 'novice', __('Novice')
        FAMILIAR = 'familiar', __('Familiar')
        EXPERT = 'expert', __('Expert')
        LEADER = 'leader', __('Leader')

    user_expertise = models.CharField(
        max_length=120,
        choices=UserExpertise.choices,
        default=UserExpertise.FAMILIAR,
    )

    def __str__(self):
        return self.comment_text

class Reply (models.Model):
    """
    The reply model has a many-to-one relationship with the comment and a many-to-one relationship with a user.
    If a comment is deleted all replies on it will also be deleted (on_delete=models.CASCADE), 
    but a user cannot be deleted if a reply exists by them on a comment (on_delete=models.PROTECT), since we don't want 
    all replies by a user to get deleted if a user is deleted.
    """
    comment = models.ForeignKey(
        Comment, on_delete=models.CASCADE, related_name='replies')
    user = models.ForeignKey(
        User, on_delete=models.PROTECT, related_name='replies')
    reply_text = models.RichTextField()
    votes = models.IntegerField(default = 0)
    created_date = models.DateField(auto_now_add=True)
