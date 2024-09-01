from django.urls import path
from .views import getUserData, updateProfile

urlpatterns = [
    path("getUserData/", getUserData, name='getUserData'),
    path("updateProfile/", updateProfile, name='updateProfile'),
]