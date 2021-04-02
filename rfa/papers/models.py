from django.db import models

# Create your models here.
class Paper(models.Model):
    """
    The paper model that contains information about doi, title, authors, date_published, journal name and abstract.
    The authors field is made a JSONfield because we can have a list of authors.
    """
    DOI = models.CharField(max_length=200, default="")
    title = models.CharField(max_length=200, blank=True)
    authors = models.TextField(blank=True)
    year_published = models.CharField(max_length=200, default="", blank=True)
    journal = models.CharField(max_length=500, blank=True)
    abstract = models.TextField(blank=True)


    def GetAllCommentsList(self):
        """
        This returns a list of comment objects associated with the paper instance. Calling list() forces the evaluation
        of the queryset and actually makes a call to the database
        """
        query = list(self.comment_set.all())
        return query

    def GetTopCommentsList(self, count):
        """This will return comments ordered by votes in a descending order """
        query = list(self.comment_set.all().order_by('-votes')[:count])
        return query
