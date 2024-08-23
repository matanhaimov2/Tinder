from django.urls import path
from .views import login, register, logout, CookieTokenRefreshView, verify
# from .views import login, register, MyTokenObtainPairView
# from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login, name='login'),

    path('refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path("verify/", verify, name='verify'),
    
    path('logout/', logout, name='logout'),
]


# go through everything and understand it
# organize everthing
# get data from profile table when login
# store userData, tokens in global state using redux
