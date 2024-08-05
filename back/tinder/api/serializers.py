# translator - python to json
from rest_framework import serializers
from .models import Register, Login

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Register
        fields = ('id', 'host', 'email', 'fname', 'lname', 'password')

class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = Login
        fields = ('id', 'host', 'email', 'password')