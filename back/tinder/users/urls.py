from django.urls import path
from .views import register, MyTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('register/', register, name='register'),
    path('login/', MyTokenObtainPairView.as_view(), name='login'),
    path('jwt/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('auth/status/', AuthStatusView.as_view(), name='auth_status'),

    # path('jwt/create/', TokenObtainPairView.as_view(), name='jwt_create'),
    # path('jwt/verify/', TokenVerifyView.as_view(), name='token_verify'),
]

# handle access and refresh storing token in cookies
# handle new access token from refresh token when expired
# component that verifies jwt token (cookies can be reached in backend)
# when login => decode token => store userData in global state using redux