# -*- coding: utf-8 -*-
import json
from apps.ginny.queue_coroutine import workers
from tornado import websocket


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
        print(kwargs)

    def on_message(self, message):
        data = json.loads(message)
        if data['event'] == 'query':
            self.workers.send(data['query'])
            self.workers.send(data['session'])

    def on_close(self):
        for key, value in enumerate(self.application.webSocketsPool):
            if value == self:
                self.workers = None
                del self.application.webSocketsPool[key]
                break
