
from operator import concat
from django.db import models
from django.utils.text import slugify
# from phonenumber_field.modelfields import PhoneNumberField
# from viewflow import CompositeKey
# Create your models here.


class products(models.Model):
    pid = models.AutoField(primary_key=True)
    image_url = models.TextField(default='https: // www.google.com/')
    # detailUrl = models.TextField()
    short_title = models.TextField(unique=True)
    slug = models.SlugField(max_length=200, blank=True)
    long_title = models.TextField()
    cost = models.FloatField(default=0)
    mrp = models.FloatField(default=0)
    discount = models.FloatField(default=0)
    desc = models.TextField()
    discounts = models.TextField()
    tagline = models.TextField()

    def save(self, *args, **kwargs):
        self.slug = slugify(self.short_title)
        super(products, self).save(*args, **kwargs)

    def __str__(self):
        return self.short_title


class category(models.Model):
    cid = models.AutoField(primary_key=True)
    category = models.CharField(
        max_length=200, default="discount", unique=True, null=False)

    def __str__(self):
        return self.category


class product_category(models.Model):
    # id = CompositeKey(columns=['prod', 'cat'])
    prod = models.ForeignKey(
        products, on_delete=models.CASCADE, db_column='prod_name', default="", to_field='short_title')
    cat = models.ForeignKey(category, on_delete=models.SET_DEFAULT,
                            default="discount", db_column='category', to_field='category')
    models.UniqueConstraint(fields=['prod', 'cat'], name='product_category')

    def __str__(self):
        return concat(concat(str(self.prod), '--->'), (str(self.cat)).capitalize())


class users(models.Model):
    uid = models.AutoField(primary_key=True)
    fname = models.TextField(null=False, unique=True)
    email = models.EmailField(null=False, unique=True)
    phone = models.BigIntegerField()
    password = models.TextField(null=False)
    cart_length = models.IntegerField(default=0)
    tokens = models.TextField(null=True)
    # cpassword=models.TextField(null=False)

    def __str__(self):
        return self.fname


class cart(models.Model):
    cart_id = models.AutoField(primary_key=True)
    prod = models.ForeignKey(
        products, on_delete=models.CASCADE, db_column='pid', default="", to_field='pid')
    uid = models.ForeignKey(
        users, on_delete=models.CASCADE, db_column='user_id', default="", to_field='uid')

    def __str__(self):
        return concat(concat(str(self.prod), '--->'), (str(self.uid)).capitalize())


class OrderPayment(models.Model):
    order_payment_id = models.CharField(primary_key=True, max_length=100)
    order_amount = models.CharField(max_length=25)
    isPaid = models.BooleanField(default=False)
    uid = models.ForeignKey(users, on_delete=models.CASCADE,
                            db_column='uid', default="", to_field='uid')
    order_date = models.DateTimeField(auto_now=True)
    address=models.TextField(null=False ,default='')

    def __str__(self):
        return str(self.order_payment_id)


class OrderItems(models.Model):
    order_item_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(
        users, on_delete=models.CASCADE, db_column='uid', default="", to_field='uid')
    order_pid = models.ForeignKey(
        products, on_delete=models.CASCADE, db_column='pid', default="", to_field='pid')
    cost = models.BigIntegerField()
    order_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.order_item_id)
