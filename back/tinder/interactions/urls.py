from django.urls import path
from .views import handleUserReaction, handleMatch, getAvailableMatches, unmatchUser, imageHandler

urlpatterns = [
    path("userAction/<str:action>/", handleUserReaction, name="handleUserReaction"),
    path("handleMatch/", handleMatch, name="handleMatch"),
    path("getAvailableMatches/", getAvailableMatches, name="getAvailableMatches"),
    path("unmatchUser/", unmatchUser, name="unmatchUser"),
    path('imageHandler/<str:room_id>', imageHandler, name="imageHandler"),
]

# Tasks: => to monday
# load 10 messages max everytime
# real time matches

# Warnings:
# ignore redux warning (redux/toolkit cant find getdefaultmiddleware )
# warning with routes, change from / to /*