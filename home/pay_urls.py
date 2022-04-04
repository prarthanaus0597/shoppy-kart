from django.contrib import admin
from django.urls import path

from .views import *



urlpatterns = [
    path('pay/', start_payment, name="payment"),
    path('payment/success/<slug:slug>', handlepayment, name="payment_success")
]