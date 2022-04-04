
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
import json
import environ
import razorpay
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

    amount = request.data['amount']
    uid = request.data['uid']
    payment_id = request.data['pay_id']
#     # setup razorpay client this is the client to whome user is paying money that's you
#     client = razorpay.Client(auth=(env('PUBLIC_KEY'), env('SECRET_KEY')))

#     # create razorpay order
#     # the amount will come in 'paise' that means if we pass 50 amount will become
#     # 0.5 rupees that means 50 paise so we have to convert it in rupees. So, we will
#     # multiply it by 100 so it will be 50 rupees.
#     payment = client.order.create({"amount": int(amount) * 100,
#                                    "currency": "INR",
#                                    "payment_capture": "1"})

#     # we are saving an order with isPaid=False because we've just initialized the order
#     # we haven't received the money we will handle the payment succes in next
#     # function

    order = OrderPayment.objects.create(
        order_payment_id=payment_id,
        order_amount=amount,
        isPaid=True,
        uid_id=int(uid),
    )

    serializer = OrderPaymentSerializer(order)
    if serializer:
        return Response(serializer.data,status=200)
    return Response("Error",status=400)
#     """order response will be 
#     {'id': 17, 
#     'order_date': '23 January 2021 03:28 PM', 
#     'order_product': '**product name from frontend**', 
#     'order_amount': '**product amount from frontend**', 
#     'order_payment_id': 'order_G3NhfSWWh5UfjQ', # it will be unique everytime
#     'isPaid': False}"""

#     data = {
#         "payment": payment,
#         "order": serializer.data
#     }
#     return Response(data)


# @api_view(['POST'])
# def handle_payment_success(request):
#     # request.data is coming from frontend
#     res = json.loads(request.data["response"])

#     """res will be:
#     {'razorpay_payment_id': 'pay_G3NivgSZLx7I9e', 
#     'razorpay_order_id': 'order_G3NhfSWWh5UfjQ', 
#     'razorpay_signature': '76b2accbefde6cd2392b5fbf098ebcbd4cb4ef8b78d62aa5cce553b2014993c0'}
#     this will come from frontend which we will use to validate and confirm the payment
#     """

#     ord_id = ""
#     raz_pay_id = ""
#     raz_signature = ""

#     # res.keys() will give us list of keys in res
#     for key in res.keys():
#         if key == 'razorpay_order_id':
#             ord_id = res[key]
#         elif key == 'razorpay_payment_id':
#             raz_pay_id = res[key]
#         elif key == 'razorpay_signature':
#             raz_signature = res[key]

#     # get order by payment_id which we've created earlier with isPaid=False
#     order = OrderPayment.objects.get(order_payment_id=ord_id)
    
#     # we will pass this whole data in razorpay client to verify the payment
#     data = {
#         'razorpay_order_id': ord_id,
#         'razorpay_payment_id': raz_pay_id,
#         'razorpay_signature': raz_signature
#     }

#     client = razorpay.Client(auth=(env('PUBLIC_KEY'), env('SECRET_KEY')))

#     # checking if the transaction is valid or not by passing above data dictionary in
#     # razorpay client if it is "valid" then check will return None
#     # check = client.utility.verify_payment_signature(data)
#     # print(check)
#     # if check is not None:
#     #     print("Redirect to error url or error page")
#     #     return Response({'error': 'Something went wrong'})

#     # if payment is successful that means check is None then we will turn isPaid=True
#     order.isPaid = True
#     order.save()

#     res_data = {
#         'message': 'payment successfully received!'
#     }

#     return Response(res_data)
