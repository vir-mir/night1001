from django.shortcuts import Http404, render
from apps.ginny.models import Log
from apps.user.models import User
import json


def dialog(request, user_id):
    try:
        user = User.objects.get(id=int(user_id))
    except (User.DoesNotExist, ValueError):
        raise Http404()
    logs = list(map(lambda x: json.loads(x.text), Log.objects.filter(user_id=user.id)))
    return render(request, 'site/base.html', {'logs': logs})
