from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Profile

@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(
            user=instance,
            email=instance.email,
            username=instance.username,
            first_name=instance.first_name,
            last_name=instance.last_name
            # Leave other fields empty as they will be set to their default values
        )
