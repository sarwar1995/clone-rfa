import factory
import json
from core.models import CustomUser
from papers.models import Paper
from comments.models import Comment, Reply


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = CustomUser

    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    username = factory.Sequence(lambda n: 'user_%d' % n)
    password = 'pass'
    affiliation = 'yale'
    position = 'student'
    email = factory.LazyAttribute(lambda obj: '%s@example.com' % obj.username)

class PaperFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Paper

    DOI = factory.Sequence(lambda n: '123/%d' % n)
    title = 'title'
    authors = 'Eli Sage-Martinson'
    year_published = '2021'
    journal = 'Nature'
    abstract = ''

class CommentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Comment
    paper = factory.SubFactory(PaperFactory)
    user = factory.SubFactory(UserFactory)
    comment_text = '<p> comment text </p>'
    isAnonymous = False
    votes = 0

class ReplyFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Reply
    comment = factory.SubFactory(CommentFactory)
    user = factory.SubFactory(UserFactory)
    reply_text = '<p> comment text </p>'
    isAnonymous = False
    votes = 0