from django.urls import path
from .views import handleUserReaction, verifyMatch, getAvailableMatches

urlpatterns = [
    path("userAction/<str:action>/", handleUserReaction, name="handleUserReaction"),
    path("verifyMatch/", verifyMatch, name="verifyMatch"),
    path("getAvailableMatches/", getAvailableMatches, name="getAvailableMatches"),
]

# WebSockets secured authenticate - ?
# send image (bonus: icon)- ?
# handle different matches/rooms
# dark mode light mode
# responsivnes
# fix error where needed