# Generated by Django 4.0.3 on 2022-04-02 07:02

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0012_orders'),
    ]

    operations = [
        migrations.CreateModel(
            name='OrderItems',
            fields=[
                ('order_item_id', models.AutoField(primary_key=True, serialize=False)),
                ('cost', models.BigIntegerField()),
                ('order_date', models.DateTimeField(auto_now=True)),
                ('order_pid', models.ForeignKey(db_column='pid', default='', on_delete=django.db.models.deletion.CASCADE, to='home.products')),
                ('user_id', models.ForeignKey(db_column='uid', default='', on_delete=django.db.models.deletion.CASCADE, to='home.users')),
            ],
        ),
        migrations.CreateModel(
            name='OrderPayment',
            fields=[
                ('order_payment_id', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('order_amount', models.CharField(max_length=25)),
                ('isPaid', models.BooleanField(default=False)),
                ('user_id', models.ForeignKey(db_column='uid', default='', on_delete=django.db.models.deletion.CASCADE, to='home.users')),
            ],
        ),
        migrations.DeleteModel(
            name='Orders',
        ),
    ]
