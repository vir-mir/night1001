# -*- coding: utf-8 -*-
from apps.ginny.service_data import save_data


def workers(send_client):
    prev_command = None
    while True:
        instance_command = yield
        user = yield
        data = save_data(instance_command.get_data(), user, prev_command)
        prev_command = instance_command
        send_client(**data)
