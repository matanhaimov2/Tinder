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

# Problems:
# ignore redux warning (redux/toolkit cant find getdefaultmiddleware )
# warning with routes, change from / to /*
# fix messages with marks (?, !)

# not important:
# try to understand db import (backup)
