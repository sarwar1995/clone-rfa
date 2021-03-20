# Generated by Django 3.1.7 on 2021-03-12 20:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_auto_20210303_1359'),
    ]

    operations = [
        migrations.CreateModel(
            name='Paper',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('arxiv_id', models.CharField(max_length=100)),
                ('title', models.CharField(max_length=100)),
                ('authors', models.CharField(max_length=500)),
                ('date_published', models.DateTimeField(auto_now_add=True)),
                ('abstract', models.TextField()),
            ],
        ),
        migrations.AddField(
            model_name='customuser',
            name='position',
            field=models.CharField(blank=True, max_length=120),
        ),
    ]
