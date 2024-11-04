# Generated by Django 5.1.2 on 2024-10-23 00:16

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_alter_videomedia_status_alter_videomedia_video'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='video',
            name='author',
            field=models.ForeignKey(editable=False, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='videos', to=settings.AUTH_USER_MODEL, verbose_name='Autor'),
        ),
    ]