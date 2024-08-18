from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import UserSerializer
from .models import Profile
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

@api_view(['POST'])
def register(request):
    serializer = UserSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        return Response({'success': 'User registered successfully'}, status=status.HTTP_201_CREATED)
    
    # Collect and format error messages
    error_messages = [error for errors in serializer.errors.values() for error in errors]

    return Response({'error': error_messages}, status=status.HTTP_400_BAD_REQUEST)

# Custom JWT serializer
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Fetch the user's profile
        try:
            profile = Profile.objects.get(user=user)
        except Profile.DoesNotExist:
            profile = None

       # Add custom claims
        token['email'] = user.email
        token['username'] = user.username
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['age'] = profile.age if profile else None
        token['gender'] = profile.gender if profile else None
        token['interested_in'] = profile.interested_in if profile else None
        token['location'] = profile.location if profile else None

        return token

# Custom JWT view
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        # Parse the JWT tokens from the response
        data = response.data
        access_token = data.get('access')
        refresh_token = data.get('refresh')
        
        # Set the cookies
        response.set_cookie('access_token', access_token, max_age=None, expires=None, secure=False, samesite='None', httponly=False, domain=None)
        response.set_cookie('refresh_token', refresh_token, max_age=None, expires=None, secure=False, samesite='None', httponly=False, domain=None)

        # problem - cookies gets deleted from f12 after refreshing
        return response


# class AuthStatusView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         return Response({"isAuthenticated": True, "username": request.user.username})
