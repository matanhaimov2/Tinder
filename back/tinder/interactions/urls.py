from django.urls import path
from .views import handleUserReaction, verifyMatch, getAvailableMatches, unmatchUser

urlpatterns = [
    path("userAction/<str:action>/", handleUserReaction, name="handleUserReaction"),
    path("verifyMatch/", verifyMatch, name="verifyMatch"),
    path("getAvailableMatches/", getAvailableMatches, name="getAvailableMatches"),
    path("unmatchUser/", unmatchUser, name="unmatchUser"),
]

# Tasks:
# send image (bonus: icon)- ?
# real time matches doesnt work - dont remember if fixed?
# load 10 messages max everytime
# text size - another profile - width!
# in PhoneMatches fix overflow x so user will be able to scroll.
# bio cardProfile overflow

# not important:
# try to understand db import (backup)
# fix error where needed (google api) -
