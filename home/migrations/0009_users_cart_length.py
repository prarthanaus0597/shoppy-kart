# Generated by Django 4.0.3 on 2022-03-13 19:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0008_cart'),
    ]

    operations = [
        migrations.AddField(
            model_name='users',
            name='cart_length',
            field=models.IntegerField(default=0),
        ),
    ]
