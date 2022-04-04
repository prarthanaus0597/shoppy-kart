from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(products)
admin.site.register(category)
admin.site.register(product_category)
admin.site.register(users)
admin.site.register(OrderPayment)
admin.site.register(OrderItems)