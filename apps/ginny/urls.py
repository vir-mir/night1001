from django.conf.urls import url

urlpatterns = [
    url(r'^(?P<user_id>\d+)/$', 'apps.ginny.views.dialog'),
]
