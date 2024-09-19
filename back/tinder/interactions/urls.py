from django.urls import path
from .views import handleUserReaction, verifyMatch, getAvailablebMatches

urlpatterns = [
    path("userAction/<str:action>/", handleUserReaction, name="handleUserReaction"),
    path("verifyMatch/", verifyMatch, name="verifyMatch"),
    path("getAvailablebMatches/", getAvailablebMatches, name="getAvailablebMatches"),
]