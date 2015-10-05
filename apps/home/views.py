# -*- coding: utf-8 -*-
from django.shortcuts import render, redirect


def home(request):
    user_id = int(request.session.get('my_user_id', 0))
    if user_id > 0:
        return redirect('/ginny/%s/' % user_id)
    return render(request, 'site/base.html')
