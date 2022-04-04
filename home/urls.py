from django.contrib import admin
from django.urls import path
from .views import *

urlpatterns = [
    path('all',ProductAllView.as_view()),
    path('set/<slug:slug>',ProductView.as_view()),
   

    path('all/<slug:id>',ProductOneView.as_view()),
]