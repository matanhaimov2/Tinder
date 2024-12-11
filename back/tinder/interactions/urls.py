from django.urls import path
from .views import handleUserReaction, handleMatch, getAvailableMatches, unmatchUser, imageHandler

urlpatterns = [
    path("userAction/<str:action>/", handleUserReaction, name="handleUserReaction"),
    path("handleMatch/", handleMatch, name="handleMatch"),
    path("getAvailableMatches/", getAvailableMatches, name="getAvailableMatches"),
    path("unmatchUser/", unmatchUser, name="unmatchUser"),
    path('imageHandler/<str:room_id>', imageHandler, name="imageHandler"),
]