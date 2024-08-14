from django.urls import path
from .views import register, MyTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('register/', register, name='register'),
    path('login/', MyTokenObtainPairView.as_view(), name='login'),
    path('jwt/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('jwt/create/', TokenObtainPairView.as_view(), name='jwt_create'),
    # path('jwt/verify/', TokenVerifyView.as_view(), name='token_verify'),
]
