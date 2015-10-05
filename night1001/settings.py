# -*- coding: utf-8 -*-
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

SECRET_KEY = 't4k8zyzwy8ymhb8qss%md^^s78a5m)-w)j1o=_6-1cw95j^)3)'

DEBUG = False

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': '',
        'USER': '',
        'PASSWORD': '',
        'HOST': 'localhost'
    }
}

ALLOWED_HOSTS = []

ROOT_URLCONF = 'night1001.urls'

LANGUAGE_CODE = 'ru-RU'

TIME_ZONE = 'Europe/Moscow'

USE_I18N = True

USE_L10N = True

USE_TZ = False

STATIC_URL = '/static/'

STATIC_ROOT = os.path.join(PROJECT_ROOT, "static")

STATICFILES_DIRS = (
    os.path.join(PROJECT_ROOT, 'templates', "static"),
)

# MEDIA_ROOT = os.path.join(PROJECT_ROOT, "media")

MEDIA_URL = '/media/'

WSGI_APPLICATION = 'night1001.wsgi.application'

MIDDLEWARE_CLASSES_DEBUG = ()
INSTALLED_APPS_DEBUG = ()

try:
    from night1001.local_settings import *
except ImportError:
    pass


INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'socket_server',
)

PROJECT_APPS = (
    'apps.ginny',
)

INSTALLED_APPS += PROJECT_APPS

INSTALLED_APPS += INSTALLED_APPS_DEBUG

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
)

MIDDLEWARE_CLASSES += MIDDLEWARE_CLASSES_DEBUG

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': (
            os.path.join(os.path.dirname(__file__), '..', 'templates'),
        ),
        'APP_DIRS': True,
        'OPTIONS': {
            'debug': DEBUG,
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
