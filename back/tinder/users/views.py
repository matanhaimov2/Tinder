from django.contrib.auth import authenticate
from django.conf import settings
from django.middleware import csrf
from rest_framework import exceptions as rest_exceptions, response, decorators as rest_decorators, permissions as rest_permissions
from rest_framework_simplejwt import tokens, views as jwt_views, serializers as jwt_serializers, exceptions as jwt_exceptions
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
import requests
import jwt
import json

# Serializers
from users import serializers
from .serializers import UserSerializer

# Models
from django.contrib.auth.models import User
from profiles.models import Profile
from interactions.models import Room, Message, ImageUpload
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken

def get_user_tokens(user):
    refresh = tokens.RefreshToken.for_user(user)
    return {
        "refresh_token": str(refresh),
        "access_token": str(refresh.access_token)
    }

# Google Auth Login
@rest_decorators.api_view(["POST"])
@rest_decorators.permission_classes([])
def google_login(request):
    google_token = request.data.get("google_token")

    if not google_token:
        raise AuthenticationFailed("Google token is required")

    # Verify the Google access token by sending it to Google's OAuth2 API
    url = f'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token={google_token}'
    response = requests.get(url)

    if response.status_code != 200:
        raise AuthenticationFailed("Invalid Google token")

    # Parse the response from Google
    user_info = response.json()

    # Extract user information
    email = user_info.get('email')

    # Extract username from email (before the '@')
    username = email.split('@')[0]

    # Extract first and last names
    first_name = user_info.get('given_name', '')  # Google provides this as 'given_name'
    last_name = user_info.get('family_name', '')  # Google provides this as 'family_name'

    # If first and last names are missing, use the username as a fallback
    if not first_name:
        first_name = username
    if not last_name:
        last_name = username

    # Check if user already exists
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        # User doesn't exist, create a new user
        user_data = {
            "email": email,
            "username": username,
            "first_name": first_name,
            "last_name": last_name,
            "password": '123456'  # No password needed for Google login
        }

        user_serializer = UserSerializer(data=user_data)

        if user_serializer.is_valid():
            user = user_serializer.save()
        else:
            print("User serializer errors:", user_serializer.errors)  # Log the errors
            raise AuthenticationFailed("User could not be created")

    # Get tokens for the user
    tokens = get_user_tokens(user)

    # Return tokens and user data
    res = Response()
    res.set_cookie(
        key=settings.SIMPLE_JWT['AUTH_COOKIE'],
        value=tokens["access_token"],
        expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
        secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
        httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
        samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
    )

    res.set_cookie(
        key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
        value=tokens["refresh_token"],
        expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
        secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
        httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
        samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
    )

    res.data = tokens
    res["X-CSRFToken"] = csrf.get_token(request)

    return res

# Register
@rest_decorators.api_view(["POST"])
@rest_decorators.permission_classes([])
def register(request):
    serializer = UserSerializer(data=request.data)

    # Check if serializer is valid and raise exceptions if not
    if serializer.is_valid():
        user = serializer.save()
        if user is not None:
            return response.Response({'success': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        return rest_exceptions.AuthenticationFailed({'fail': 'Invalid credentials!'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        # Log or print the errors for debugging
        error_messages = [error for errors in serializer.errors.values() for error in errors]
        return response.Response({'error': error_messages}, status=status.HTTP_400_BAD_REQUEST)
    
# Login
@rest_decorators.api_view(["POST"])
@rest_decorators.permission_classes([])
def login(request):
    serializer = serializers.LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    username = serializer.validated_data["username"]
    password = serializer.validated_data["password"]

    user = authenticate(username=username, password=password)

    if user is not None:
        tokens = get_user_tokens(user)
        res = response.Response()
        res.set_cookie(
            key=settings.SIMPLE_JWT['AUTH_COOKIE'],
            value=tokens["access_token"],
            expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
        )

        res.set_cookie(
            key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
            value=tokens["refresh_token"],
            expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
        )

        res.data = tokens

        res["X-CSRFToken"] = csrf.get_token(request)
        return res
    raise rest_exceptions.AuthenticationFailed(
        "Email or Password is incorrect!")

# Logout
@rest_decorators.api_view(['POST'])
@rest_decorators.permission_classes([rest_permissions.IsAuthenticated])
def logout(request):
    try:
        refreshToken = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
        token = tokens.RefreshToken(refreshToken)
        token.blacklist()

        res = response.Response()
   
        res.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'])
        res.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
        res.delete_cookie("X-CSRFToken")
        res.delete_cookie("csrftoken")
   
        res["X-CSRFToken"]=None
        
        return res
    except:
        raise rest_exceptions.ParseError("Invalid token")

# Delete Account
@rest_decorators.api_view(['POST'])
@rest_decorators.permission_classes([rest_permissions.IsAuthenticated])
def deleteAccount(request):
    auth_header = request.headers.get('Authorization', None) # get user's access_token
    access_token = auth_header.split(' ')[1]  # Extract the token part
    decoded_payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=["HS256"])
    user_id = decoded_payload.get('user_id') # extract user_id from payload
    print(user_id)

    data = OutstandingToken.objects.filter(user_id=user_id).values() # get from db data where user_id=user_id

    # Extracting the 'id' field from each entry in the queryset
    ids = [item['id'] for item in data]

    # print(ids)

    # Deleting all BlacklistedToken rows where room_id is in the 'ids' list
    # BlacklistedToken.objects.filter(token_id__in=ids).delete()

    # Deleting all OutstandingToken rows where user_id matches the given user_id
    # OutstandingToken.objects.filter(user_id=user_id).delete()

    profile = Profile.objects.filter(user_id=user_id).first() # get from db data where user_id=user_id
    room_ids_str = profile.room_id
    room_ids_int = []
    for match in room_ids_str:
        # Query the ChatRoom table to get the corresponding room id
        try:
            chat_room = Room.objects.get(room_id=match)
            room_ids_int.append(chat_room.id)  # Store the room's id
        except Room.DoesNotExist:
            print(f"ChatRoom with room_id {match} does not exist.")

    print(room_ids_str)
    print(room_ids_int)

    # Deleting all ChatRoom rows where the id is in the room_ids list
    Room.objects.filter(id__in=room_ids_int).delete()

    # Deleting all ChatMesages rows where the room_id is in the room_ids list
    Message.objects.filter(room_id__in=room_ids_int).delete()

    # Deleting all ChatImages rows where room_id is in the room_ids_str
    ImageUpload.objects.filter(room_id__in=room_ids_str).delete()

    # Step 9: Remove the user_id from other users' profiles
    # Remove the user_id from the "matches" and "room_id" fields of all other users' profiles
    profiles_to_update = Profile.objects.exclude(user_id=user_id)  # Get all profiles except for the deleted user's
    for profile in profiles_to_update:
        # Remove any "match_{user_id}_" from matches or room_id
        matches = json.loads(profile.matches) if profile.matches else []
        room_ids = json.loads(profile.room_id) if profile.room_id else []

        # Remove match IDs that contain the deleted user_id (like "match_32_18")
        matches = [match for match in matches if f"match_{user_id}_" not in match]
        room_ids = [room for room in room_ids if f"match_{user_id}_" not in room]

        # Update the profile's matches and room_ids after removal
        profile.matches = json.dumps(matches)
        profile.room_id = json.dumps(room_ids)
        profile.save()

    # Step 10: Delete the user's profile
    # profile.delete()

    # Step 11: Optionally, delete the user from the User model as well
    # user = User.objects.get(id=user_id)
    # user.delete()
    
    # try:
    #     refreshToken = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
    #     token = tokens.RefreshToken(refreshToken)
    #     token.blacklist()

    #     res = response.Response()
   
    #     res.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'])
    #     res.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
    #     res.delete_cookie("X-CSRFToken")
    #     res.delete_cookie("csrftoken")
   
    #     res["X-CSRFToken"]=None
        
    #     return res
    # except:
    #     raise rest_exceptions.ParseError("Invalid token")
    return response.Response(status=status.HTTP_201_CREATED)


# Refresh Token
class CookieTokenRefreshSerializer(jwt_serializers.TokenRefreshSerializer):
    refresh = None

    def validate(self, attrs):
        attrs['refresh'] = self.context['request'].COOKIES.get('refresh')
        if attrs['refresh']:
            return super().validate(attrs)
        else:
            raise jwt_exceptions.InvalidToken(
                'No valid token found in cookie \'refresh\'')

class CookieTokenRefreshView(jwt_views.TokenRefreshView):
    serializer_class = CookieTokenRefreshSerializer

    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get("refresh"):
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
                value=response.data['refresh'],
                expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
            )

            del response.data["refresh"]

        # Set the access token in the cookie if it exists in the response data
        if response.data.get("access"):
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE'],
                value=response.data['access'],
                expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
            )
        response["X-CSRFToken"] = request.COOKIES.get("csrftoken")
        return super().finalize_response(request, response, *args, **kwargs)

# Verify Token
@rest_decorators.api_view(["GET"])
@rest_decorators.permission_classes([rest_permissions.IsAuthenticated])
def verify(request):
    try:
        # Retrieve the refresh token from the request's cookies or headers
        refreshToken = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
        
        # Try to validate the refresh token
        token = tokens.RefreshToken(refreshToken)
        
        # If no exception is raised, the token is not blacklisted
        return response.Response({'Success': 'User authorized'}, status=status.HTTP_200_OK)
    
    except TokenError:
        # If the token is blacklisted or invalid, a TokenError is raised
        return response.Response({'Error': 'Token is invalid or blacklisted'}, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        # Handle any other errors that may occur
        return response.Response({'Error': f'Something went wrong: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)



# Health Check
@rest_decorators.api_view(["POST"])
@rest_decorators.permission_classes([])
def healthCheck(request):
    try:
        return response.Response({'status': True}, status=status.HTTP_201_CREATED)
    except:
        return response.Response({'status': False}, status=status.HTTP_400_BAD_REQUEST)
    