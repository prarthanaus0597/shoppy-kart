
from django.shortcuts import redirect
from .serializer import *
from .models import *
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password, check_password
import jwt
import datetime
from home.middleware import auth_middleware
from home.middleware_user import auth_middleware_user
from django.utils.decorators import method_decorator
# import json
import environ
from django.shortcuts import render
# import razorpay
from . import Checksum
from rest_framework.decorators import api_view


env = environ.Env()

# you have to create .env file in same folder where you are using environ.Env()
# reading .env file which located in home folder
environ.Env.read_env()


class ProductView(APIView):
    def get(self, request, slug):
        slugs = self.kwargs['slug']
        query_set = products.objects.raw(
            "select * from home_products p join home_product_category pc on p.short_title=pc.prod_name and category='"+slugs+"'")
        serializers = ProductSerializer(query_set, many=True)
        return Response(serializers.data)


class ProductAllView(APIView):
    def get(self, request):
        query_set = products.objects.raw("select * from home_products p")
        serializers = ProductSerializer(query_set, many=True)
        return Response(serializers.data)


class ProductOneView(APIView):
    def get(self, request, id):
        slugs = self.kwargs['id']
        query = "select * from home_products p where pid='"+slugs+"'"
        query_set = products.objects.raw(query)
        serializers = ProductSerializer(query_set, many=True)
        return Response(serializers.data)

# register/get data


class UserView(APIView):
    @method_decorator(auth_middleware_user)
    def get(self, request):
        uid = request.uid
        token = request.token
        if uid != -1:
            query = "select * from home_users where uid='"+str(uid)+"'"
            query_set = users.objects.raw(query)
            serializers = UserSerializer(query_set, many=True)
            if serializers.data and serializers.data[0]["tokens"] == token:
                return Response(data=serializers.data[0], status=200)
        return Response('no_user', status=404)

    def post(self, request):
        # check if user already present
        name = request.data["fname"]
        email = request.data["email"]
        query = "select * from home_users where fname='"+name+"' or email='"+email+"'"
        query_set = users.objects.raw(query)
        serializers = UserSerializer(query_set, many=True)
        if serializers.data:
            return Response(data={'error': 'user already present'}, status=425)
        # storing the information of user
        serializableObj = UserSerializer(data=request.data)

        if serializableObj.is_valid():
            password = make_password(self.request.data['password'])
            serializableObj.save(password=password)
            return Response(data=serializableObj.data, status=200)
        return Response(data=serializableObj.data, status=422)


# for login
class UserLoginView(APIView):
    # def get(self,request):
    #     query_set = users.objects.all()
    #     serializers=UserSerializer(query_set,many=True)
    #     return Response(serializers.data)

    def post(self, request):
        # check if user already present
        email = request.data["email"]
        password = request.data["password"]

        query_set = users.objects.all().filter(email=email)
        serializers = UserSerializer(query_set, many=True)

        if serializers.data:
            if check_password(password, (serializers.data[0]["password"])):

                payload = {
                    'id': serializers.data[0]["uid"],
                    'exp': datetime.datetime.utcnow()+datetime.timedelta(minutes=60),
                    'iat': datetime.datetime.utcnow()
                }
                token = jwt.encode(payload, 'secretkey', algorithm='HS256')
                data = {
                    'uid': serializers.data[0]['uid'],
                    'fname': serializers.data[0]['fname'],
                    'email': serializers.data[0]['email'],
                    'phone': serializers.data[0]['phone'],
                    'password': serializers.data[0]['password'],
                    'cart_length':  serializers.data[0]['cart_length'],
                    'tokens': token
                }
                detailobj = users.objects.get(uid=serializers.data[0]['uid'])
                serializersobj = UserSerializer(detailobj, data=data)
                if serializersobj.is_valid():
                    serializersobj.save()
                    response = Response()
                    response.set_cookie(key='jwt', value=token, httponly=True)
                    response.data = serializers.data[0]
                    response.status_code = 200
                    return response
            return Response(data="invalid password", status=405)
        return Response(data="no such user", status=404)


class CartAdd(APIView):
    @method_decorator(auth_middleware)
    def get(self, request):
        if request.uid != -1:
            uid = request.uid
            query_set1 = products.objects.raw(
                "select p.* from home_cart c join home_products p on c.pid=p.pid where c.user_id='"+str(uid)+"'")
            serializers1 = ProductSerializer(query_set1, many=True)
            if serializers1.data:
                return Response(serializers1.data, status=200)
            return Response('no items', status=425)
        return Response('invalid user', status=404)

    @method_decorator(auth_middleware)
    def post(self, request):
        pid = self.kwargs['slug']
        if request.uid != -1:
            uid = request.uid
            # add to cart
            query_set1 = users.objects.all().filter(uid=uid)
            serializers1 = UserSerializer(query_set1, many=True)
            if serializers1.data:

                query_set = products.objects.all().filter(pid=pid)
                serializers = ProductSerializer(query_set, many=True)
                data = {
                    'prod': serializers.data[0]['pid'],
                    'uid': uid
                }
                serializer2 = UserCartSerializer(data=data)
                if serializer2.is_valid():
                    serializer2.save()

                    # save the length in user table
                    query_set3 = cart.objects.raw(
                        "select cart_id from home_cart where user_id='"+str(uid)+"'")
                    serializers3 = UserCartSerializer(query_set3, many=True)
                    length = len(serializers3.data)
                    detailobj = users.objects.get(uid=uid)

                    data = {
                        'uid': serializers1.data[0]['uid'],
                        'fname': serializers1.data[0]['fname'],
                        'email': serializers1.data[0]['email'],
                        'phone': serializers1.data[0]['phone'],
                        'password': serializers1.data[0]['password'],
                        'cart_length':  length,
                        'tokens': serializers1.data[0]['tokens']

                    }

                    serializersobj = UserSerializer(detailobj, data=data)

                    if serializersobj.is_valid():
                        serializersobj.save()

                return Response(serializersobj.data, status=200)
        return Response('invalid user', status=404)


# delete from cart

class CartDelete(APIView):

    @method_decorator(auth_middleware)
    def post(self, request):
        try:
            pid = self.kwargs['slug']
            if request.uid != -1:
                uid = request.uid
                detailObj = cart.objects.get(prod=pid, uid=uid)
                if detailObj:
                    detailObj.delete()
                    detailobj1 = users.objects.get(uid=uid)
                    query_set1 = users.objects.all().filter(uid=uid)
                    serializers1 = UserSerializer(query_set1, many=True)
                    if serializers1.data:
                        data = {
                            'uid': serializers1.data[0]['uid'],
                            'fname': serializers1.data[0]['fname'],
                            'email': serializers1.data[0]['email'],
                            'phone': serializers1.data[0]['phone'],
                            'password': serializers1.data[0]['password'],
                            'cart_length':  serializers1.data[0]['cart_length']-1,
                            'tokens': serializers1.data[0]['tokens']
                        }
                        serializersobj = UserSerializer(detailobj1, data=data)

                        if serializersobj.is_valid():
                            serializersobj.save()

                        return Response(serializersobj.data, status=200)
                    return Response(detailObj.data, status=404)

        except:
            return Response('error', status=404)


# cart delete all


class CartDeleteAll(APIView):

    @method_decorator(auth_middleware)
    def post(self, request):
        try:

            if request.uid != -1:
                uid = request.uid
                detailObj = cart.objects.get(uid=uid)
                print(detailObj)
                if detailObj:
                    detailObj.delete()
                    detailobj1 = users.objects.get(uid=uid)
                    query_set1 = users.objects.all().filter(uid=uid)
                    serializers1 = UserSerializer(query_set1, many=True)
                    if serializers1.data:
                        data = {
                            'uid': serializers1.data[0]['uid'],
                            'fname': serializers1.data[0]['fname'],
                            'email': serializers1.data[0]['email'],
                            'phone': serializers1.data[0]['phone'],
                            'password': serializers1.data[0]['password'],
                            'cart_length': '0',
                            'tokens': serializers1.data[0]['tokens']
                        }
                        serializersobj = UserSerializer(detailobj1, data=data)

                        if serializersobj.is_valid():
                            serializersobj.save()

                        return Response(serializersobj.data, status=200)
            return Response(detailObj.data, status=404)

        except:
            return Response('error', status=422)

# for logout


class UserLogoutView(APIView):
    @method_decorator(auth_middleware_user)
    def post(self, request):
        uid = request.uid
        if uid != -1:
            response = Response()
            response.delete_cookie(key="jwt")
            detailobj1 = users.objects.get(uid=uid)
            query_set1 = users.objects.all().filter(uid=uid)
            serializers1 = UserSerializer(query_set1, many=True)
            if serializers1.data:
                data = {
                    'uid': serializers1.data[0]['uid'],
                    'fname': serializers1.data[0]['fname'],
                    'email': serializers1.data[0]['email'],
                    'phone': serializers1.data[0]['phone'],
                    'password': serializers1.data[0]['password'],
                    'cart_length':  serializers1.data[0]['cart_length'],
                    'tokens': '0'
                }
                serializersobj = UserSerializer(detailobj1, data=data)
                if serializersobj.is_valid():
                    serializersobj.save()
                    return Response("user logged out", status=200)
        return Response("error", status=400)


class Payment(APIView):
    def post(self, request):
        json_arr = []
        resp = []
        for item in request.data["items"]:

            data = {'user_id': request.data["uid"], 'order_pid': item['pid'],
                    'cost': item['cost'], 'order_date': datetime.datetime.utcnow()}
            json_arr.append(data)
        success = 0
        for item in json_arr:
            serializableObj = OrderSerializer(data=item)
            if serializableObj.is_valid():
                serializableObj.save()
                resp.append(serializableObj.data)
                success = 1
        if success == 1:
            return Response(data=resp, status=200)
        return Response(data='error', status=422)


# ------------------------------------------------------------------------------------------------

@api_view(['POST'])
def start_payment(request):
    # request.data is coming from frontend
    print( request.data['amount'])
    amount = request.data['amount']
    uid = request.data['uid']
    pay_id = request.data['pay_id']
    address=request.data['address']
    # we are saving an order instance (keeping isPaid=False)
    order = OrderPayment.objects.create(
          order_payment_id=pay_id,
          order_amount= int(amount),
          uid_id=int(uid),
          address=address)

    serializer = OrderPaymentSerializer(order)
    # we have to send the param_dict to the frontend
    # these credentials will be passed to paytm order processor to verify the business account
    param_dict = {
        'MID': env('PAYTM_PUBLIC_KEY'),
        'ORDER_ID': str(order.order_payment_id),
        'TXN_AMOUNT': str(amount),
        'CUST_ID': uid,
        'INDUSTRY_TYPE_ID': 'Retail',
        'WEBSITE': 'ShoppyKart',
        'CHANNEL_ID': 'WEB',
        'CALLBACK_URL': env('WEBSITE')+'/paytm/payment/success/'+uid,
        # this is the url of handlepayment function, paytm will send a POST request to the fuction associated with this CALLBACK_URL
    }

    # create new checksum (unique hashed string) using our merchant key with every paytm payment
    param_dict['CHECKSUMHASH'] = Checksum.generate_checksum(param_dict, env('PAYTM_SECRET_KEY'))
    # send the dictionary with all the credentials to the frontend
    return Response({'param_dict': param_dict})


@api_view(['POST'])
def handlepayment(request,slug):
    checksum = ""
    uid=slug
    # the request.POST is coming from paytm
    form = request.POST
    
    response_dict = {}
    order = None  # initialize the order varible with None

    for i in form.keys():
        response_dict[i] = form[i]
        if i == 'CHECKSUMHASH':
            # 'CHECKSUMHASH' is coming from paytm and we will assign it to checksum variable to verify our paymant
            checksum = form[i]

        if i == 'ORDERID':
            # we will get an order with id==ORDERID to turn isPaid=True when payment is successful
            order = OrderPayment.objects.get(order_payment_id=form[i])

    # we will verify the payment using our merchant key and the checksum that we are getting from Paytm request.POST
    verify = Checksum.verify_checksum(response_dict, env('PAYTM_SECRET_KEY'), checksum)

    if verify:
        if response_dict['RESPCODE'] == '01':
            # if the response code is 01 that means our transaction is successfull
            print('order successful')
            # after successfull payment we will make isPaid=True and will save the order
            order.isPaid = True
            order.save()
            detailObj = cart.objects.get(uid=uid)
            print(detailObj)
            if detailObj:
                detailObj.delete()
                detailobj1 = users.objects.get(uid=uid)
                query_set1 = users.objects.all().filter(uid=uid)
                serializers1 = UserSerializer(query_set1, many=True)
                if serializers1.data:
                    data = {
                            'uid': serializers1.data[0]['uid'],
                            'fname': serializers1.data[0]['fname'],
                            'email': serializers1.data[0]['email'],
                            'phone': serializers1.data[0]['phone'],
                            'password': serializers1.data[0]['password'],
                            'cart_length': '0',
                            'tokens': serializers1.data[0]['tokens']
                        }
                    serializersobj = UserSerializer(detailobj1, data=data)

                    if serializersobj.is_valid():
                        serializersobj.save()
                        return render(request, 'payment/paymentstatus.html', {'response': response_dict})
                    else:
                        print('order was not successful because' + response_dict['RESPMSG'])
        return render(request, 'payment/paymentstatus.html', {'response': response_dict})