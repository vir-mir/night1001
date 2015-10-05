# -*- coding: utf-8 -*-
from tornado import web, ioloop
from socket_setting import setting
from handler.ginny import GinnyHandler


class Application(web.Application):
    def __init__(self):
        self.webSocketsPool = []

        handlers = (
            (r'/ginny_io', GinnyHandler),
        )
        web.Application.__init__(self, handlers, debug=setting.DEBUG)


def main():
    application = Application()
    application.listen(setting.port)
    ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()
