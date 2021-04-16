import pytest
import json
from django.contrib.auth import get_user_model
from django.apps import apps
from core.tests.factories import UserFactory

User = get_user_model()
ReadingList = apps.get_model('core', 'ReadingList')

class TestModelCreations:
    @pytest.mark.django_db
    def test_create_full_user(self):
        User.objects.create(first_name = 'john', last_name = 'doe', affiliation='yale', position='student', username='johndoe', email='lennon@thebeatles.com', password='johnpassword')
        queryset = User.objects.filter(username='johndoe')  
        assert queryset.count() == 1
        user = queryset[0]
        assert user.first_name == 'john'
        assert user.last_name == 'doe'
        assert user.affiliation == 'yale'
        assert user.position == 'student'
        assert user.username == 'johndoe'
        assert user.email == 'lennon@thebeatles.com'
        assert user.is_active == False

    @pytest.mark.django_db
    def test_create_minimal_user(self):
        User.objects.create(username='johndoe', password='johnpassword')
        queryset = User.objects.filter(username='johndoe')  
        assert queryset.count() == 1
        user = queryset[0]
        assert user.first_name == ''
        assert user.is_active == False

    @pytest.fixture()
    def sampleDOIslist(self):
        DOIs = ['10.1063/1.5127780', '10.1063/5.0026355']
        return DOIs
    

    @pytest.mark.django_db
    def test_create_readinglist(self, sampleDOIslist):
        doi_dict = {'DOIs': sampleDOIslist} 
        doi_dump = json.dumps(doi_dict)
        user = UserFactory.create()
        ReadingList.objects.create(name='TestList', is_public='False', DOIs=doi_dump , user = user)
        assert ReadingList.objects.count() == 1
        queryset = ReadingList.objects.all()
        assert queryset[0].user.username == 'user_0'

    # def test_create_minimal_readinglist ():
        