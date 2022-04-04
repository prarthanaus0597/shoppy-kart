
from rest_framework import serializers
from .models import *


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = products
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = users
        fields = '__all__'


class UserCartSerializer(serializers.ModelSerializer):
    class Meta:
        model = cart
        fields = '__all__'


class OrderPaymentSerializer(serializers.ModelSerializer):
    order_date = serializers.DateTimeField(format="%d %B %Y %I:%M %p")

    class Meta:
        model = OrderPayment
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    order_date = serializers.DateTimeField(format="%d %B %Y %I:%M %p")

    class Meta:
        model = OrderItems
        fields = '__all__'
