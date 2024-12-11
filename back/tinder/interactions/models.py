from django.db import models
from django_resized import ResizedImageField

class Room(models.Model):
    room_id = models.CharField(max_length=255, unique=True)
    users = models.ManyToManyField('auth.User')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "chat_room"

class Message(models.Model):
    username = models.CharField(max_length=255)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    image = models.TextField(default="")
    room = models.ForeignKey(Room, related_name='messages', on_delete=models.CASCADE)

    class Meta:
        db_table = "chat_message"
        ordering = ('timestamp',)

class ImageUpload(models.Model):
    username = models.CharField(max_length=255)
    image = ResizedImageField(force_format='WEBP', size=None,scale=0.5, quality=75, upload_to='images', blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    room_id = models.CharField(max_length=255, unique=False, default=None)

    class Meta:
        db_table = "chat_images"
        ordering = ('timestamp',)
