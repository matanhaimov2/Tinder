from django.urls import path
from .views import handleUserReaction, verifyMatch, getAvailableMatches, unmatchUser

urlpatterns = [
    path("userAction/<str:action>/", handleUserReaction, name="handleUserReaction"),
    path("verifyMatch/", verifyMatch, name="verifyMatch"),
    path("getAvailableMatches/", getAvailableMatches, name="getAvailableMatches"),
    path("unmatchUser/", unmatchUser, name="unmatchUser"),
]

# Tasks:
# Conversation:
# send image (bonus: icon)- ?
# real time matches doesnt work - dont remember if fixed?
# load 10 messages max everytime
# text size - another - width!

# not important:
# try to understand db import (backup)
# fix error where needed (google api) -
# bio cardProfile overflow