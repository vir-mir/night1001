# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
        ('ginny', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='log',
            name='user',
            field=models.ForeignKey(verbose_name='Пользователь', null=True, to='user.User'),
        ),
    ]
