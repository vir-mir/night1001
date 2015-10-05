# -*- coding: utf-8 -*-
import os
import sys
import django

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "night1001.settings")
django.setup()

port = 8898
