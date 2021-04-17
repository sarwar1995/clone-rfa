# research-for-all
A web app designed to provide open access to researcher summaries and feedback on academic papers.

## setup

First, install Django. It's recomended that this be done in a [virtualenv](https://docs.python.org/3/tutorial/venv.html). Once you've activated your virtualenv, run:

`python -m pip install django djangorestframework djangorestframework-simplejwt django-cors-headers`

`pip install mysqlclient`

`npm install`

Ensure that the version for djangorestframework-simplejwt is 4.6.0 and for pyjwt is 1.7.1 . There is a [bug](https://github.com/SimpleJWT/django-rest-framework-simplejwt/issues/346) when pyjwt 2.0.0 or higher is used. 

(On Mac, see this [stack overflow post](https://stackoverflow.com/questions/43612243/install-mysqlclient-for-django-python-on-mac-os-x-sierra/54521244) for help troubleshooting installing mysqlclient.)

All commands below are given assuming you are in the outer research-for-all directory.

## External Dependencies

For authentication and sending email
`boto3 --> version 1.17.36`
`django-ses --> version 1.0.3`
`six --> version 1.15.0`

For RichText comments:
`django-richtextfield --> version 1.6` ==> `pip install django-richtextfield`

Other npm packages:
`npm install resolve-url-loader --save-dev`

## Testing
Install pytest-django `pip install pytest-django` or `pipenv install pytest-django`
Install factory_boy `pip install factory_boy` version 3.2.0
Make sure to run `pytest` command from inside the rfa folder i.e. the folder that contains the pytest.ini configuration file. Otherwise it won't work and you might get ModuleNotFound errors for core, comments etc. modules.

## Compiling and Running
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
