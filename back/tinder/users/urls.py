from django.urls import path
from .views import login, register, logout, CookieTokenRefreshView, verify, healthCheck, google_login, deleteAccount

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('google_login/', google_login, name='google_login'),

    path('refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path("verify/", verify, name='verify'),
    path("healthCheck/", healthCheck, name='healthCheck'),
    
    path('logout/', logout, name='logout'),
    path('deleteAccount/', deleteAccount, name='deleteAccount'),
]