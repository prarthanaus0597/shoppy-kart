
from django.urls import path

from .views import *


urlpatterns = [
    path('', Payment.as_view()),

]
