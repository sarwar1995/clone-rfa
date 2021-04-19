import pytest
from papers.models import Paper

@pytest.mark.django_db
def test_create_full_paper():
    Paper.objects.create(
        DOI='123',
        title='Title',
        authors='J. Doe',
        year_published='2000',
        journal='Nature',
        abstract='Abstract of paper'
    )
    paper = Paper.objects.get(DOI='123')
    assert paper
    assert paper.DOI == '123'
    assert paper.title == 'Title'
    assert paper.authors == 'J. Doe'
    assert paper.year_published == '2000'
    assert paper.journal == 'Nature'
    assert paper.abstract == 'Abstract of paper'
