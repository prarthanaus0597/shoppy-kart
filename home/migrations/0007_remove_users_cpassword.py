# Generated by Django 4.0.3 on 2022-03-10 09:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0006_alter_users_email'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='users',
            name='cpassword',
        ),
    ]