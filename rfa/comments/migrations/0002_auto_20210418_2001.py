# Generated by Django 3.2 on 2021-04-18 20:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('comments', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='edited_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='reply',
            name='edited_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]