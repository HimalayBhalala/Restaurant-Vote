# Generated by Django 5.0.6 on 2024-08-28 08:41

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0004_alter_boss_options'),
        ('vote', '0002_restaurant_user'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='restaurant',
            name='user',
        ),
        migrations.AddField(
            model_name='restaurant',
            name='boss',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='authentication.boss'),
            preserve_default=False,
        ),
    ]
