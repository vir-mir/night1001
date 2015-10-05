# -*- coding: utf-8 -*-
from io import StringIO
from django.core.exceptions import ValidationError
from django.core.validators import URLValidator
from requests.exceptions import ConnectionError
from lxml import html
import requests


class ExceptionHandler(Exception):
    pass


class Handler(object):
    def __init__(self, name):
        self.name = name
        self.return_data = {'name': name}
        self.errors = []

    def prepare(self):
        return True

    def get_data(self):
        return self.return_data


class Prompt(Handler):

    def __init__(self, name, time=None, number=None, phrase=None):
        self.time = time
        self.number = number
        self.phrase = phrase
        super(Prompt, self).__init__(name)

    def prepare(self):
        try:
            self.number = int(self.number)

            if self.time in ['минут', 'минуты', 'минуту']:
                self.number *= 60
            return True
        except ValueError:
            self.errors.append('not number time')
        return False

    def get_data(self):
        self.return_data['notify_aladdin_time'] = self.number
        self.return_data['phrase'] = self.phrase
        return super(Prompt, self).get_data()


class SaveText(Handler):

    def __init__(self, name, text=None):
        self.text = text
        super(SaveText, self).__init__(name)

    def prepare(self):
        if self.text:
            return True
        return False

    def get_data(self):
        self.return_data['text'] = self.text
        return super(SaveText, self).get_data()


class SitesHandler(Handler):

    method = None

    html_pars = True

    def __init__(self, name):
        self.urls = []
        super(SitesHandler, self).__init__(name)

    def post_url(self, url, obj):
        pass

    def set_url(self, url):
        try:
            URLValidator()(url)
            self.post_url(url, requests.request(self.method, url, allow_redirects=True))
        except ValidationError:
            return 'invalid url %s' % url
        except ConnectionError:
            return 'connection invalid url %s' % url
        return None

    def prepare(self):

        if self.method is None:
            raise ExceptionHandler('not method curl url')

        self.errors = list(map(self.set_url, self.urls))
        return not any(self.errors)


class HtmlTag(SitesHandler):

    method = 'get'

    def __init__(self, name, tag=None):
        self.tag = tag
        super(HtmlTag, self).__init__(name=name)
        self.return_data['tag'] = tag
        self.return_data['urls'] = {}

    def post_url(self, url, obj):
        tags = list(map(lambda x: x.text, self.parse_tag(obj.text)))
        self.return_data['urls'][url] = tags

    def parse_tag(self, text):
        if self.tag is None:
            raise ExceptionHandler('not tag parse')
        html_text = html.parse(StringIO(text))
        return html_text.xpath('//%s' % self.tag)

    def get_data(self):
        return super(HtmlTag, self).get_data()


class SiteHead(SitesHandler):

    method = 'head'

    def __init__(self, name, sites):
        super(SiteHead, self).__init__(name=name)
        self.urls = list(sites.split(','))
        self.return_data['urls'] = {}

    def post_url(self, url, obj):
        self.return_data['urls'][url] = obj.headers

    def get_data(self):
        return super(SiteHead, self).get_data()


class HtmlTagTitle(HtmlTag):
    def __init__(self, name, site):
        super(HtmlTagTitle, self).__init__(name, 'title')
        self.urls.append(site)


class HtmlTagH1(HtmlTag):
    def __init__(self, name, site):
        super(HtmlTagH1, self).__init__(name, 'h1')
        self.urls.append(site)
