# Generated by Django 4.0.3 on 2022-04-01 12:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0010_alter_cart_prod'),
    ]

    operations = [
        migrations.AddField(
            model_name='users',
            name='tokens',
            field=models.TextField(null=True),
        ),
    ]
