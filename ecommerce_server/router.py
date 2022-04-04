from rest_framework import routers
from home.views import UserViewset

router=routers.DefaultRouter()


router.register('',UserViewset,basename='products')
