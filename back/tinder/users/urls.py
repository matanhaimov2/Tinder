from django.urls import path
from .views import register, login
# from rest_framework_simplejwt.views import (
#     TokenObtainPairView,
#     TokenRefreshView,
#     TokenVerifyView
# )

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    # path('jwt/create/', TokenObtainPairView.as_view(), name='jwt_create'),
    # path('jwt/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('jwt/verify/', TokenVerifyView.as_view(), name='token_verify'),
]
