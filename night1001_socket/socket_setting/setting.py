# -*- coding: utf-8 -*-
import os
import sys
import django
from django.conf import settings

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "night1001.settings")
django.setup()

port = 8898

DEBUG = settings.DEBUG
