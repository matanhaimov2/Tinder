from django.urls import path
from .views import handleUserReaction, verifyMatch, getAvailableMatches, unmatchUser, imageHandler

urlpatterns = [
    path("userAction/<str:action>/", handleUserReaction, name="handleUserReaction"),
    path("verifyMatch/", verifyMatch, name="verifyMatch"),
    path("getAvailableMatches/", getAvailableMatches, name="getAvailableMatches"),
    path("unmatchUser/", unmatchUser, name="unmatchUser"),
    path('imageHandler/<str:room_id>', imageHandler, name="imageHandler"),
]

# Tasks: => to monday
# conversation images - fix css
# load 10 messages max everytime
# real time matches doesnt work - dont remember if fixed?

# Problems:
# ignore redux warning (redux/toolkit cant find getdefaultmiddleware )
# warning with routes, change from / to /*
# phone responsive - overflow y - edit profile

# not important:
# try to understand db import (backup)
