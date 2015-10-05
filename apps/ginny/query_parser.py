# -*- coding: utf-8 -*-
import re
from apps.ginny import handler_commands as hc


class Lexer(object):
    NAME = ['бот', 'джинн']

    STRUCTURE = {
        hc.Prompt: r'напомни\s+мне\s+(?P<phrase>.*)?\s+через\s+(?P<number>\d+)\s+(?P<time>секунд[уы]?|минут[уы]?)',
        hc.HtmlTagH1: r'дай\s+мне\s+H1\s+с\s+сайта\s+(?P<site>http[s]?://.*)',
        hc.HtmlTagTitle: r'дай\s+мне\s+заголовок\s+сайта\s+(?P<site>http[s]?://.*)',
        hc.SaveText: r'сохрани\s+для\s+меня\s+информацию\s{0,}(?P<text>.*)',
        hc.SiteHead: r'дай\s+мне\s+все\s+варианты заголовков\s+с\s+сайтов\s+(?P<sites>.*)',
    }


class ParserException(Exception):
    pass


class ParserExceptionNotCommand(ParserException):
    pass


class Parser(Lexer):
    def __init__(self, query):
        self.query = query

    def parse(self):
        for class_name, reg in self.STRUCTURE.items():
            reg = r'(?P<name>%s),\s+%s' % ('|'.join(self.NAME), reg)
            preg = re.compile(reg, re.UNICODE | re.DOTALL | re.IGNORECASE)
            match = re.match(preg, self.query)
            if match:
                return class_name, match.groupdict()

        raise ParserExceptionNotCommand('not command!')
