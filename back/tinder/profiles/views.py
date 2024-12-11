from django.conf import settings
from rest_framework import response, decorators as rest_decorators, permissions as rest_permissions, status
import jwt
from math import radians, cos, sin, asin, sqrt
from .models import Profile

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

# Updates profile when user sets his profile for the first time
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
    latitude = request.data.get('latitude')
    longitude = request.data.get('longitude')

    # Update user's profile
    Profile.objects.filter(user_id=user_id).update(
        isFirstLogin=False,
        gender=gender,
        age=age,
        interested_in=interest,
        location=location,
        images=images,
        bio=bio,
        latitude=latitude,
        longitude=longitude
    )

    return response.Response(status=status.HTTP_201_CREATED)

# Modify profile when user edits his profile
@rest_decorators.api_view(["POST"])
@rest_decorators.permission_classes([rest_permissions.IsAuthenticated])
def modifyProfile(request):
    auth_header = request.headers.get('Authorization', None) # extract user's access_token
    access_token = auth_header.split(' ')[1]  # extract the token part
    decoded_payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=["HS256"])
    user_id = decoded_payload.get('user_id') # extract user_id from payload

    # Extract data
    age = request.data.get('age')
    ageRange = request.data.get('ageRange')
    bio = request.data.get('bio')
    distance = request.data.get('distance')
    gender = request.data.get('gender')
    images = request.data.get('images')
    interest = request.data.get('interested_in')
    location = request.data.get('location')
    latitude = request.data.get('latitude')
    longitude = request.data.get('longitude')

    # Update user's profile
    Profile.objects.filter(user_id=user_id).update(
            isFirstLogin=False,
            gender=gender, age=age,
            interested_in=interest,
            location=location,
            images=images,
            bio=bio,
            ageRange=ageRange,
            distance=distance,
            latitude=latitude,
            longitude=longitude
        )

    return response.Response(status=status.HTTP_201_CREATED)

# Fetch all profiles according to user preferences
@rest_decorators.api_view(["POST"])
@rest_decorators.permission_classes([rest_permissions.IsAuthenticated])
def fetchProfiles(request):
    auth_header = request.headers.get('Authorization', None) # extract user's access_token
    access_token = auth_header.split(' ')[1]  # extract the token part
    decoded_payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=["HS256"])
    user_id = decoded_payload.get('user_id') # extract user_id from payload

    # Extract data
    ageRange = request.data.get('ageRange') # match with age
    distance = request.data.get('distance') #
    interest = request.data.get('interest') # match with gender
    user_lat= request.data.get('latitude')
    user_lon = request.data.get('longitude')

    # Fetch the user's profile to get the blacklist
    profile = Profile.objects.get(user_id=user_id)
    user_blacklist = profile.blacklist
    
    # Add the current user ID to the blacklist to ensure they are excluded
    user_blacklist.append(user_id)

    # Filter profiles based on age range and interest
    min_age, max_age = ageRange

    profiles = Profile.objects.filter(age__gte=min_age, age__lte=max_age, gender=interest).exclude(user_id__in=user_blacklist)

    # Filter by distance
    matching_profiles = []
    for profile in profiles:
        profile_lat, profile_lon = profile.latitude, profile.longitude

        profile_distance = haversine(user_lon, user_lat, profile_lon, profile_lat)
        
        if profile_distance <= distance:  # only include profiles within the specified distance
            matching_profiles.append(profile)

    # Return the list of matching profiles
    profiles_data = [
        {
            'user_id': profile.user_id,
            'username': profile.user.username,
            'firstname': profile.first_name,
            'lastname': profile.user.last_name,
            'age': profile.age,
            'location': profile.location,
            'bio': profile.bio,
            'images': profile.images,
            'distance': haversine(user_lon, user_lat, profile.longitude, profile.latitude)
        }
        for profile in matching_profiles
    ]

    return response.Response({'usersProfilesData': profiles_data}, status=status.HTTP_200_OK)

# Fetch own profile when previewing
@rest_decorators.api_view(["GET"])
@rest_decorators.permission_classes([rest_permissions.IsAuthenticated])
def fetchOwnProfile(request):
    auth_header = request.headers.get('Authorization', None) # extract user's access_token
    access_token = auth_header.split(' ')[1]  # extract the token part
    decoded_payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=["HS256"])
    user_id = decoded_payload.get('user_id') # extract user_id from payload
    
    profile = Profile.objects.get(user_id=user_id)

    # Return the list of matching profiles
    profile_data = [
            {
            'user_id': profile.user_id,
            'username': profile.user.username,
            'firstname': profile.first_name,
            'lastname': profile.user.last_name,
            'age': profile.age,
            'location': profile.location,
            'bio': profile.bio,
            'images': profile.images,
        }
    ]

    return response.Response({'usersProfileData': profile_data}, status=status.HTTP_200_OK)


# --------- Functions ---------

# Haversine formula to calculate the distance between two points
def haversine(lon1, lat1, lon2, lat2):
    # Convert degrees to radians
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])

    # Haversine formula 
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    
    # Radius of Earth in kilometers. Use 3956 for miles. Determines return value units.
    km = 6371 * c
    return km
