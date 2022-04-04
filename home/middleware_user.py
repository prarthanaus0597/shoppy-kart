
from copy import error
from datetime import datetime
from django.shortcuts import redirect
import jwt
from .serializer import *


def auth_middleware_user(get_response):
    # One-time configuration and initialization.

    def middleware(request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.
        request.uid = -1
        try:
            token = request.COOKIES.get('jwt')
            if token:
                ver = jwt.decode(token, 'secretkey', algorithms='HS256')
                uid = ver['id']
                query_set = users.objects.all().filter(uid=uid)
                serializers = UserSerializer(query_set, many=True)
                if serializers.data:
                    request.token = token
                    request.user = serializers.data
                    request.uid = uid

            pass
        except:
            pass

        response = get_response(request)

        # Code to be executed for each request/response after
        # the view is called.

        return response

    return middleware
