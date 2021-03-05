# research-for-all
A web app designed to provide open access to researcher summaries and feedback on academic papers.

## setup

First, install Django. It's recomended that this be done in a [virtualenv](https://docs.python.org/3/tutorial/venv.html). Once you've activated your virtualenv, run:

`python -m pip install django djangorestframework djangorestframework-simplejwt`

`pip install mysqlclient`

`npm install`

Ensure that the version for djangorestframework-simplejwt is 4.6.0 and for pyjwt is 1.7.1 . There is a [bug] (https://github.com/SimpleJWT/django-rest-framework-simplejwt/issues/346) when pyjwt 2.0.0 or higher is used. 

(On Mac, see this [stack overflow post](https://stackoverflow.com/questions/43612243/install-mysqlclient-for-django-python-on-mac-os-x-sierra/54521244) for help troubleshooting installing mysqlclient.)

All commands below are given assuming you are in the outer research-for-all directory.

To compile changes to the React code, run:

`npm run build`

To generate migrations after model changes, run:

`python rfa/manage.py makemigrations`

`python rfa/manage.py migrate`

To start the app, run:

`python rfa/manage.py runserver`

To view the running app, go to: http://127.0.0.1:8000/

To view the app admin panel, got to http://127.0.0.1:8000/admin

Admin username = admin, password = pass
