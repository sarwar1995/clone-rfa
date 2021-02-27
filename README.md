# research-for-all
A web app designed to provide open access to researcher summaries and feedback on academic papers.

## setup

First, install Django. It's recomended that this be done in a [virtualenv](https://docs.python.org/3/tutorial/venv.html). Once you've activated your virtualenv, run:

`python -m pip install Django`

`pip install mysqlclient`

(On Mac, see this [stack overflow post](https://stackoverflow.com/questions/43612243/install-mysqlclient-for-django-python-on-mac-os-x-sierra/54521244) for help troubleshooting installing mysqlclient.)

To start the app, run:

`python manage.py runserver`.
