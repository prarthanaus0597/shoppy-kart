
from django.urls import path
from .views import *

urlpatterns = [
    path('cart/<slug:slug>',CartAdd.as_view()),
    path('cartdetails/<slug:slug>',CartAdd.as_view()),
    path('remove/<slug:slug>',CartDelete.as_view()),
    path('removeall/<slug:slug>',CartDeleteAll.as_view()),
]