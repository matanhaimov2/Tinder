from django.db import models

# Create your models here.

class Register(models.Model):
    host = models.CharField(max_length=50, unique=True)
    email = models.CharField(max_length=30, unique=True)
    fname = models.CharField(max_length=20)
    lname = models.CharField(max_length=20)
    password = models.CharField(max_length=20)

class Login(models.Model):
    host = models.CharField(max_length=50, unique=True)
    email = models.CharField(max_length=30, unique=True)
    # fname = models.CharField(max_length=20)
    # lname = models.CharField(max_length=20)
    password = models.CharField(max_length=20)