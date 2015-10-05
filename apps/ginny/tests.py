# -*- coding: utf-8 -*-
from django.test import TestCase
from apps.ginny.handler_commands import HtmlTag
from apps.ginny.query_parser import Parser


class QueryParserTestCase(TestCase):

    WORDS_TEST = {
        'Бот, дай мне заголовок сайта http://ya.ru': {'site': 'http://ya.ru', 'name': 'Бот'},
        'Джинн, сохрани для меня информацию аннушка уже разлила масло': {
            'name': 'Джинн',
            'text': 'аннушка уже разлила масло'
        },
        'Джинн, дай мне заголовок сайта http://google.com': {'site': 'http://google.com', 'name': 'Джинн'},
        'Бот, дай мне H1 с сайта http://habrahabr.ru/': {'name': 'Бот', 'site': 'http://habrahabr.ru/'},
        'Джинн, сохрани для меня информацию': {'name': 'Джинн', 'text': ''},
        'Джинн, напомни мне нужно купить молоко через 301 секунду': {
            'name': 'Джинн',
            'time': 'секунду',
            'number': '301',
            'phrase': 'нужно купить молоко'
        },
        'Бот, напомни мне позвонить на работу через 10 минут': {
            'name': 'Бот',
            'time': 'минут',
            'number': '10',
            'phrase': 'позвонить на работу'
        },
        'Бот, дай мне все варианты заголовков с сайтов http://ya.ru,http://habr.ru': {
            'name': 'Бот',
            'sites': 'http://ya.ru,http://habr.ru'
        }
    }

    def test_parser(self):
        for word, dict_validate in self.WORDS_TEST.items():
            class_name, args = Parser(word).parse()
            self.assertDictEqual(args, dict_validate)


class HandlerCommandsTestCase(TestCase):

    def test_htmltag_title(self):
        html = (
            '<!DOCTYPE html><html lang="en"><head><title>Блог упоротого программиста</title></head>'
            '<body><h1>Сайт в разработке!</h1></body>'
        )
        s = HtmlTag(name='Джинн', tag='title')
        self.assertEqual(s.parse_tag(html)[0].text, 'Блог упоротого программиста')
        s = HtmlTag(name='Джинн', tag='h1')
        self.assertEqual(s.parse_tag(html)[0].text, 'Сайт в разработке!')
