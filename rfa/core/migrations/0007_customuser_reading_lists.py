# Generated by Django 3.1.7 on 2021-04-01 00:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0006_delete_paper'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='reading_lists',
            field=models.TextField(blank=True, default='{"listnames": [], "DOIs": []}'),
        ),
    ]