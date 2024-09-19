from django.conf import settings
from rest_framework import response, decorators as rest_decorators, permissions as rest_permissions, status
from profiles.models import Profile
import jwt


@rest_decorators.api_view(["POST"])
@rest_decorators.permission_classes([rest_permissions.IsAuthenticated])
def handleUserReaction(request, action):
    auth_header = request.headers.get('Authorization', None)
    access_token = auth_header.split(' ')[1]
    decoded_payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=["HS256"])
    user_id = decoded_payload.get('user_id') # 4
    
    target_user_id = request.data.get('target_user_id')  # ID of user(if liked), 4 OR users(if disliked), [2,4,7]
    
    try:
        profile = Profile.objects.get(user_id=user_id)
    except Profile.DoesNotExist:
        return response.Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

    if action == 'like':    
        # Fetch the target_profile
        try:
            target_profile = Profile.objects.get(user_id=target_user_id)
        except Profile.DoesNotExist:
            return response.Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)  

        # Add target_user_id to user_id blacklist             
        if target_user_id not in profile.blacklist:
            profile.blacklist.append(target_user_id)

        likes = target_profile.likes
        if user_id not in likes:
            likes.append(user_id)
            target_profile.likes = likes

        target_profile.save()

    elif action == 'dislike':
        for id in target_user_id:
            # Add target_user_id to user_id blacklist             
            if id not in profile.blacklist:
                profile.blacklist.append(id)
            

    # Save changes to the profile
    profile.save()

    return response.Response({'status': 'success'}, status=status.HTTP_200_OK)


@rest_decorators.api_view(["POST"])
@rest_decorators.permission_classes([rest_permissions.IsAuthenticated])
def verifyMatch(request):
    auth_header = request.headers.get('Authorization', None)
    access_token = auth_header.split(' ')[1]
    decoded_payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=["HS256"])
    user_id = decoded_payload.get('user_id')

    target_user_id = request.data.get('target_user_id')  # The ID of the user being liked/disliked 14

    # Fetch the profile
    try:
        profile = Profile.objects.get(user_id=user_id)
    except Profile.DoesNotExist:
        return response.Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

    # Fetch the target_profile
    try:
        target_profile = Profile.objects.get(user_id=target_user_id)
    except Profile.DoesNotExist:
        return response.Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)


    matches = profile.matches
    if target_user_id not in matches:
        matches.append(target_user_id)
        profile.matches = matches

    matches_two = target_profile.matches
    if user_id not in matches_two:
        matches_two.append(user_id)
        target_profile.matches = matches_two

        # Remove for each user the his likes in db - 'likes'
        profile.likes.remove(target_user_id)
        target_profile.likes.remove(user_id)

    # Save changes to the profile
    profile.save()
    # Save changes to the target_profile
    target_profile.save()
    
    return response.Response({'status': 'success'}, status=status.HTTP_200_OK)


@rest_decorators.api_view(["GET"])
@rest_decorators.permission_classes([rest_permissions.IsAuthenticated])
def getAvailableMatches(request):
    auth_header = request.headers.get('Authorization', None)
    access_token = auth_header.split(' ')[1]
    decoded_payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=["HS256"])
    user_id = decoded_payload.get('user_id')

    # Fetch the profile
    try:
        profile = Profile.objects.get(user_id=user_id)
    except Profile.DoesNotExist:
        return response.Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)


    usersMatches = []

    matches = profile.matches

    for id in matches:
        # Fetch the target_profile
        try:
            target_Profile = Profile.objects.get(user_id=id)
        except Profile.DoesNotExist:
            return response.Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

        data = {
            "user_id": id,
            "first_name": target_Profile.first_name,
            "image": target_Profile.images[0] if target_Profile.images and len(target_Profile.images) > 0 else None
        }

        usersMatches.append(data)

    return response.Response({'usersMatchesData': usersMatches}, status=status.HTTP_200_OK)
