# models.py
from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    isFirstLogin = models.BooleanField(default=True)
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')], null=True, blank=True)
    age = models.PositiveIntegerField(blank=True, null=True)
    interested_in = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=255, blank=True)
    images = models.JSONField(default=list)  # Default to an empty list

    class Meta:
        db_table = 'users_profile'  # Ensures the table is named 'profile'
