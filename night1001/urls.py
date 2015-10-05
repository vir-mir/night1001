from django.conf.urls import include, url
from django.contrib import admin
from apps.user import urls as user_urls
from apps.ginny import urls as ginny_urls

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', 'apps.home.views.home'),
    url(r'^user/', include(user_urls)),
    url(r'^ginny/', include(ginny_urls)),
    url(r'^ginny/', include(ginny_urls)),
]
