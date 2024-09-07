from django.conf import settings
from rest_framework import exceptions as rest_exceptions, response, decorators as rest_decorators, permissions as rest_permissions
from rest_framework_simplejwt import tokens, views as jwt_views, serializers as jwt_serializers, exceptions as jwt_exceptions
from rest_framework import status
from .models import Profile
import jwt

# Get User Data From DB
@rest_decorators.api_view(["GET"])
@rest_decorators.permission_classes([rest_permissions.IsAuthenticated])
def getUserData(request):
    auth_header = request.headers.get('Authorization', None) # get user's access_token
    access_token = auth_header.split(' ')[1]  # Extract the token part
    decoded_payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=["HS256"])
    user_id = decoded_payload.get('user_id') # extract user_id from payload

    data = Profile.objects.filter(user_id=user_id).values() # get from db data where user_id=user_id

    return response.Response({'userData': data[0]}, status=status.HTTP_201_CREATED)

@rest_decorators.api_view(["POST"])
@rest_decorators.permission_classes([rest_permissions.IsAuthenticated])
def updateProfile(request):
    auth_header = request.headers.get('Authorization', None) # extract user's access_token
    access_token = auth_header.split(' ')[1]  # extract the token part
    decoded_payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=["HS256"])
    user_id = decoded_payload.get('user_id') # extract user_id from payload

    # Extract data
    age = request.data.get('age')
    gender = request.data.get('gender')
    location = request.data.get('location')
    images = request.data.get('images')
    interest = request.data.get('interest')
    bio = request.data.get('bio')

    # Update user's profile
    Profile.objects.filter(user_id=user_id).update(isFirstLogin=False, gender=gender, age=age, interested_in=interest, location=location, images=images, bio=bio)

    return response.Response(status=status.HTTP_201_CREATED)
