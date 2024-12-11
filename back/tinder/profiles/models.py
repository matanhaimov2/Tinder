from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=150, blank=True, null=True)
    username = models.CharField(max_length=150, blank=True, null=True)
    isFirstLogin = models.BooleanField(default=True)
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')], null=True, blank=True)
    age = models.PositiveIntegerField(blank=True, null=True)
    interested_in = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=255, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    images = models.JSONField(default=list)  # Default to an empty list
    bio = models.CharField(max_length=300, blank=True, null=True)
    ageRange = models.JSONField(default=[18, 21])  # List of two numbers (age range)
    distance = models.PositiveIntegerField(default=25)  # Default distance value
    likes = models.JSONField(default=list)
    matches = models.JSONField(default=list)
    blacklist = models.JSONField(default=list)
    room_id = models.JSONField(default=list)

    class Meta:
        db_table = 'users_profile'  # Ensures the table is named 'profile'
