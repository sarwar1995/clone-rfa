from rest_framework import serializers
from .models import Paper

class PaperSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paper
        fields = ('DOI', 'title', 'authors', 'journal', 'year_published', 'abstract', 'id')

    def create(self, validated_data):
        """ Need the create method for saving the object instance from serializer data. """
        instance = self.Meta.model(**validated_data)
        instance.save()
        return instance

    # def validate_DOI(self, value):
    #     /^10.\d{4,9}/[-._;()/:A-Z0-9]+$/i