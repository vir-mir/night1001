# -*- coding: utf-8 -*-
import json
import traceback
from apps.ginny.queue_coroutine import workers
from apps.ginny.query_parser import Parser, ParserExceptionNotCommand
from tornado import websocket
from apps.ginny.service_data import get_user


class GinnyHandler(websocket.WebSocketHandler):

    def check_origin(self, origin):
        return True

    def __init__(self, *args, **kwargs):
        self.workers = None
        super(GinnyHandler, self).__init__(*args, **kwargs)

    def open(self):
        self.application.webSocketsPool.append(self)
        self.workers = workers(self.send_client)
        self.workers.send(None)

    def send_client(self, **kwargs):
        for ws in self.application.webSocketsPool:
            if ws is self:
                ws.ws_connection.write_message(json.dumps(kwargs))
                break

    def event_query(self, query, session):
        try:
            command, data = Parser(query).parse()
            instance_command = command(**data)
            if instance_command.prepare():
                self.send_client(queue=True)
                user = get_user(session)
                self.workers.send(instance_command)
                self.workers.send(user)
            else:
                self.send_client(errors='instance_command.errors')
        except ParserExceptionNotCommand:
            self.send_client(error='error command')

    def on_message(self, message):
        data = json.loads(message)
        if data['event'] == 'query':
            self.event_query(data['query'], data['session'])

    def on_close(self):
        for key, value in enumerate(self.application.webSocketsPool):
            if value == self:
                self.workers = None
                del self.application.webSocketsPool[key]
                break
