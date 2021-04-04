# Generated by Django 3.1.7 on 2021-04-04 00:06

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0007_customuser_reading_lists'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='reading_lists',
        ),
        migrations.CreateModel(
            name='ReadingList',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='Reading List', max_length=120)),
                ('is_public', models.BooleanField(default=True)),
                ('DOIs', models.TextField(blank=True, default='{"DOIs": []}')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
