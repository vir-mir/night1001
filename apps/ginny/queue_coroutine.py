# -*- coding: utf-8 -*-
from apps.ginny.service_data import save_data, get_user
from apps.ginny.query_parser import Parser, ParserExceptionNotCommand


def workers(send_client):
    prev_command = None
    while True:
        query = yield
        session = yield
        try:
            command, data = Parser(query).parse()
            instance_command = command(**data)
            if instance_command.prepare():
                user = get_user(session)
                data = save_data(instance_command.get_data(), user, prev_command)
                prev_command = command
                send_client(**data)
            else:
                send_client(errors='instance_command.errors')
        except ParserExceptionNotCommand:
            send_client(error='error command')
