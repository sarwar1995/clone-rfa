import factory
import json
from core.models import CustomUser, ReadingList


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


class ReadingListFactory (factory.django.DjangoModelFactory):
    class Meta:
        model = ReadingList
    
    sampleDOI = ['10.1063/1.5127780', '10.1063/5.0026355']
    DOIdict = {'DOIs': sampleDOI}

    name = 'Currently Reading'
    is_public = True
    DOIs = json.dumps(DOIdict)
    user = factory.SubFactory(UserFactory)