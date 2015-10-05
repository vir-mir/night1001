# -*- coding: utf-8 -*-
import json
from apps.ginny.handler_commands import SaveText
from apps.user.models import User
from apps.ginny.models import Log


def get_user(session):
    try:
        return User.objects.get(id=int(session))
    except (User.DoesNotExist, ValueError):
        return None


def save_data(data, user, prev_command):
    if type(prev_command) is SaveText and 'urls' in data:
        prev_data = prev_command.get_data()
        if 'text' in prev_data and not prev_data['text']:
            prev_data['text'] = data
            data['save'] = True
            Log(text=json.dumps(prev_data), user_id=user.id).save()

    if 'text' in data and not data['text']:
        return {'save_next': True}
    Log(text=json.dumps(data), user_id=user.id).save()
    return data
