from django.urls import path
from .views import handleUserReaction, verifyMatch, getAvailableMatches, room

urlpatterns = [
    path("userAction/<str:action>/", handleUserReaction, name="handleUserReaction"),
    path("verifyMatch/", verifyMatch, name="verifyMatch"),
    path("getAvailableMatches/", getAvailableMatches, name="getAvailableMatches"),

    path('room/<str:room_id>', room, name="room"),
]