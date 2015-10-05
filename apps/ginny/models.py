from django.db import models
from django.utils import timezone
from apps.user.models import User


class Log(models.Model):
    date = models.DateTimeField(verbose_name='Дата события', default=timezone.now)
    text = models.TextField(verbose_name='Лог')
    user = models.ForeignKey(User, verbose_name=u'Пользователь', null=True)
