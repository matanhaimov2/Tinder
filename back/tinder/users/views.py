from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import UserSerializer, LoginSerializer

@api_view(['POST'])
def register(request):
    serializer = UserSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        return Response({'success': 'User registered successfully'}, status=status.HTTP_201_CREATED)
    
    # Collect and format error messages
    error_messages = [error for errors in serializer.errors.values() for error in errors]

    return Response({'error': error_messages}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    serializer = LoginSerializer(data=request.data)

    if serializer.is_valid():
        tokens = serializer.validated_data
        return Response(tokens, status=status.HTTP_200_OK)
    
    error_messages = [error for errors in serializer.errors.values() for error in errors]

    return Response({'error': error_messages}, status=status.HTTP_401_UNAUTHORIZED)


# without serializer:
# from django.contrib.auth.models import User
# from django.contrib.auth.hashers import make_password
# from rest_framework import status
# from rest_framework.decorators import api_view
# from rest_framework.response import Response

# @api_view(['POST'])
# def register(request):
#     firstname = request.data.get('firstname')
#     lastname = request.data.get('lastname')
#     email = request.data.get('email')
#     password = request.data.get('password')

#     if not firstname or not lastname or not email or not password:
#         return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

#     if User.objects.filter(email=email).exists():
#         return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

#     user = User.objects.create(
#         first_name=firstname,
#         last_name=lastname,
#         email=email,
#         password=make_password(password)
#     )
#     user.save()

#     return Response({'success': 'User registered successfully'}, status=status.HTTP_201_CREATED)
