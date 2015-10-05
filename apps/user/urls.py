from django.conf.urls import url

urlpatterns = [
    url(r'^add/$', 'apps.user.views.add'),
]
