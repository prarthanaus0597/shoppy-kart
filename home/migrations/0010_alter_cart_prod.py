# Generated by Django 4.0.3 on 2022-03-14 11:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0009_users_cart_length'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cart',
            name='prod',
            field=models.ForeignKey(db_column='pid', default='', on_delete=django.db.models.deletion.CASCADE, to='home.products'),
        ),
    ]
