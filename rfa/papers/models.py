from django.db import models

# Create your models here.
class Paper(models.Model):
    """
    The paper model that contains information about doi, title, authors, date_published, journal name and abstract.
    The authors field is made a JSONfield because we can have a list of authors.
    """
    DOI = models.CharField(max_length=200)
    title = models.CharField(max_length=200)
    authors = models.JSONField()
    date_published = models.DateTimeField(auto_now_add=True)
    journal = models.CharField(max_length=500)
    abstract = models.TextField()


    def GetComments(self):
        queryset = self.comment_set.all()

