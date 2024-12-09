from django.conf import settings
from rest_framework import response, decorators as rest_decorators, permissions as rest_permissions, status
from rest_framework.decorators import parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
import jwt

# Models
from profiles.models import Profile
from .models import Message, Room, ImageUpload

@rest_decorators.api_view(["POST"])
@rest_decorators.permission_classes([rest_permissions.IsAuthenticated])
def handleUserReaction(request, action):
    auth_header = request.headers.get('Authorization', None)
    access_token = auth_header.split(' ')[1]
    decoded_payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=["HS256"])
    user_id = decoded_payload.get('user_id') # 4
    
    target_user_id = request.data.get('target_user_id')  # The ID of the user being liked/disliked
    
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
def handleMatch(request):
    auth_header = request.headers.get('Authorization', None)
    access_token = auth_header.split(' ')[1]
    decoded_payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=["HS256"])
    user_id = decoded_payload.get('user_id')

    target_user_id = request.data.get('target_user_id')  # The ID of the user being liked/disliked

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

    if target_user_id in profile.likes:
        matches = profile.matches
        room_id = profile.room_id
        if target_user_id not in matches:
            matches.append(target_user_id)
            room_id.append(f"match_{user_id}_{target_user_id}")
            profile.matches = matches

        matches_two = target_profile.matches
        room_id_two = target_profile.room_id

        if user_id not in matches_two:
            matches_two.append(user_id)
            target_profile.matches = matches_two
            room_id_two.append(f"match_{user_id}_{target_user_id}")

            # Remove for each user the his likes in db - 'likes'
            profile.likes.remove(target_user_id)
            target_profile.likes.remove(user_id)

        # Save changes to the profile
        profile.save()
        # Save changes to the target_profile
        target_profile.save()
    else:
        # No match occuered
        return response.Response({'match_status': False}, status=status.HTTP_200_OK)

    return response.Response({'match_status': True}, status=status.HTTP_200_OK)


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

        # Check if any room_id contains the current user_id
        valid_room_ids = [room_id for room_id in target_Profile.room_id if str(user_id) in room_id.split('_')]
        # print('valid:', valid_room_ids)

        room_id = valid_room_ids[0]

        latest_message = Message.objects.filter(room__room_id=room_id).order_by('-timestamp').first()

        # Prepare the latest message data
        latest_message_content = latest_message.content if latest_message else None
        latest_message_timestamp = latest_message.timestamp.isoformat() if latest_message else None
        
        data = {
            "user_id": id,
            "first_name": target_Profile.first_name,
            "image": target_Profile.images[0] if target_Profile.images and len(target_Profile.images) > 0 else None,
            "room_id": room_id,
            "latest_message": latest_message_content,
            "latest_message_timestamp": latest_message_timestamp  
        }

        usersMatches.append(data)

    return response.Response({'usersMatchesData': usersMatches}, status=status.HTTP_200_OK)


@rest_decorators.api_view(["POST"])
@rest_decorators.permission_classes([rest_permissions.IsAuthenticated])
def unmatchUser(request):
    auth_header = request.headers.get('Authorization', None)
    access_token = auth_header.split(' ')[1]
    decoded_payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=["HS256"])
    user_id = decoded_payload.get('user_id')

    # Extract data
    room_id = request.data.get('room_id')

    # Split the room_id and extract the two user IDs
    _, id1, id2 = room_id.split('_')

    # Find the second user ID (the one that is not user_id)
    target_user_id = int(id2) if int(id1) == user_id else int(id1)

    # Fetch the profile
    try:
        profile = Profile.objects.get(user_id=user_id)
    except Profile.DoesNotExist:
        return response.Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

    # Fetch the target_profile
    try:
        target_Profile = Profile.objects.get(user_id=target_user_id)
    except Profile.DoesNotExist:
        return response.Response({'error': 'target_Profile not found'}, status=status.HTTP_404_NOT_FOUND)

    try:
        # Remove target_user_id from user_id matches
        profile.matches.remove(target_user_id)
        profile.room_id.remove(room_id)

        # Remove user_id from target_user_id matches
        target_Profile.matches.remove(user_id)
        target_Profile.room_id.remove(room_id)

        # Save changes to the profiles
        profile.save()
        target_Profile.save() 

        # Fetch the Room
        try:
            room = Room.objects.get(room_id=room_id)

            # Fetch and delete all messages related to the room
            messages = Message.objects.filter(room_id=room.pk)
            
            ## Check if there are any messages to delete
            if messages.exists():
                messages.delete()  # Delete all messages related to the room

            # Fetch and delete all images related to the room
            images = ImageUpload.objects.filter(room_id=room_id)
            
            ## Check if there are any images to delete
            if images.exists():
                images.delete()  # Delete all images related to the room

            # Now delete the room
            room.delete()

            return response.Response({'success': 'Room and messages deleted'}, status=status.HTTP_200_OK)

        except Room.DoesNotExist:
            return response.Response({'error': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        # Log the error message for debugging
        print(f"An error occurred: {e}")
        return response.Response({'error': 'An error occurred while processing the unmatch request'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@rest_decorators.api_view(["POST"])
@rest_decorators.permission_classes([rest_permissions.IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def imageHandler(request, room_id):
    username = request.data.get('username')

    try:
        image = request.data.get('image')

        if image == "undefined":
            return response.Response({'error': 'Upload img failed'}, status=status.HTTP_404_NOT_FOUND)

        image = ImageUpload.objects.create(username=username, room_id=room_id, image=image)

        return response.Response({'imageUrl': str(image.image)}, status=status.HTTP_200_OK)

    except Exception as e:
        return response.Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)  # Log the exception