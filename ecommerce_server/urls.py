
from django.contrib import admin
from django.urls import path, include
from .views import index
# from .router import router
urlpatterns = [

    path('', index),
    path('getproducts/', include('home.urls')),
    path('register', include('home.reg_urls')),
    path('login', include('home.login_urls')),
    path('addcart/', include('home.cart_urls')),
    path('verifyuser/', include('home.user_urls')),
    path('logout/', include('home.logout_urls')),
    path('paytm/', include('home.pay_urls')),
    path('payment', include('home.order_urls')),
    path('admin', admin.site.urls),

]
