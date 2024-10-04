from django.urls import path
from .views import handleUserReaction, verifyMatch, getAvailableMatches, unmatchUser

urlpatterns = [
    path("userAction/<str:action>/", handleUserReaction, name="handleUserReaction"),
    path("verifyMatch/", verifyMatch, name="verifyMatch"),
    path("getAvailableMatches/", getAvailableMatches, name="getAvailableMatches"),
    path("unmatchUser/", unmatchUser, name="unmatchUser"),
]

# Tasks:
# dark mode light mode logic - 
# responsivnes (in the end)- 
# fix error where needed (google api) -
# on match pop
# fix images inserted in setProfile & editCard
# try to understand db import (backup)

# Conversation:
# WebSockets secured authenticate - ?
# send image (bonus: icon)- ?
# real time matches doesnt work - dont remember if fixed?
# on load start conversation from bottom