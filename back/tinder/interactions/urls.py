from django.urls import path
from .views import handleUserReaction, verifyMatch, getAvailableMatches

urlpatterns = [
    path("userAction/<str:action>/", handleUserReaction, name="handleUserReaction"),
    path("verifyMatch/", verifyMatch, name="verifyMatch"),
    path("getAvailableMatches/", getAvailableMatches, name="getAvailableMatches"),
]

# Tasks:
# dark mode light mode - 
# responsivnes - 
# fix error where needed -

# Conversation:
# WebSockets secured authenticate - ?
# add scroller styling
# handle different matches/rooms
# unmatch option
# send image (bonus: icon)- ?
# real time matches doesnt work