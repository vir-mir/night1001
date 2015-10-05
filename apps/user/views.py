from django.http import JsonResponse
from django.shortcuts import Http404, redirect
from django.views.decorators.csrf import csrf_exempt
from apps.user.models import User


@csrf_exempt
def add(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        try:
            user = User.objects.get(id=int(request.session.get('my_user_id', 0)))
        except User.DoesNotExist:
            user = User()
        user.name = name
        user.save()
        request.session['my_user_id'] = user.id
        if request.is_ajax():
            return JsonResponse({'user': user.id})
        else:
            return redirect('/ginny/%s/' % user.id)
    raise Http404
