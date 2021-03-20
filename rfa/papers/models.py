from django.db import models

# Create your models here.
class Paper(models.Model):
    arxiv_id = models.CharField(max_length=100)
    title = models.CharField(max_length=100)
    authors = models.CharField(max_length=500)
    date_published = models.DateTimeField(auto_now_add=True)
    abstract = models.TextField()
