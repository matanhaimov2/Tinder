import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from channels.db import database_sync_to_async
from .models import Message, Room


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Step 1: Retrieve the room_id from the URL parameters
        self.room_name = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_name}'
        
        print(f'Connecting to room group: {self.room_group_name}')
        
        # Step 2: Check if the room exists in the database; if not, create it
        self.room = await self.check_or_create_room()

        # Step 3: Add the current WebSocket connection to the room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        # Step 4: Accept the WebSocket connection
        await self.accept()
        print(f'WebSocket connected: {self.channel_name}')
        
        # Step 5: Fetch existing messages from the database for this room
        messages = await self.get_messages()

        # Step 6: Send the existing messages to the connected user
        await self.send_existing_messages(messages)

    async def disconnect(self, close_code):
        # Step 7: Handle WebSocket disconnection
        print(f'WebSocket disconnecting: {self.channel_name}, close_code: {close_code}')
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        print(f'WebSocket disconnected: {self.channel_name}')

    @database_sync_to_async
    def check_or_create_room(self):
        # Step 2 Explanation: This method checks if the room exists in the database
        # and creates it if it does not. This ensures that the room is available for 
        # the users to send and receive messages.
        room, created = Room.objects.get_or_create(room_id=self.room_name)
        return room

    @database_sync_to_async
    def get_messages(self):
        # Step 5 Explanation: This method retrieves all messages associated with 
        # the room_id from the database. It returns a list of dictionaries containing
        # the username, content, and timestamp of each message.
        print('nurds')
        return list(Message.objects.filter(room__room_id=self.room_name).values('id', 'username', 'content', 'timestamp', 'image'))

    async def send_existing_messages(self, messages):
        # Step 6 Explanation: This method sends all existing messages retrieved 
        # from the database to the connected user via the WebSocket. Each message
        # is serialized into JSON format before sending.
        for message in messages:
            await self.send(text_data=json.dumps({
                'id': message['id'],
                'message': message['content'],
                'username': message['username'],
                'timestamp': str(message['timestamp']),
                'image': message['image']  # Send the image URL if available
            }))

    @database_sync_to_async
    def create_message(self, message, username, image=None):
        # This method creates a new message in the database and associates it
        # with the current room. It uses database_sync_to_async to ensure it 
        # runs in the async context properly.
        message_obj = Message.objects.create(
            content=message,
            username=username,
            room=self.room, # Ensure the room is associated
            image=image
        )
        return message_obj

    async def receive(self, text_data):
        # This method handles incoming messages from the WebSocket.
        data = json.loads(text_data)
        print("received", data)
        message = data['message']
        username = data['username']
        image = data.get('image', None)  # Get the image if it exists
        print(image)
        
        # Create a new message object and save it to the database
        message_obj = await self.create_message(message, username)

        # Step 8: Send the new message to the group, so all users in the room receive it
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'id': message_obj.id,
                'message': message_obj.content,
                'username': message_obj.username,
                'timestamp': str(message_obj.timestamp),
                'image': message_obj.image.url if message_obj.image else None  # Send the image URL if it exists
            }
        )

    async def chat_message(self, event):
        # This method handles the messages being sent to the WebSocket group
        message = event['message']
        username = event['username']
        timestamp = event['timestamp']
        image = event['image']
        message_id = event['id']

        # Send the message to the websocket
        await self.send(text_data=json.dumps({
            'id': message_id,
            'message': message,
            'username': username,
            'timestamp': timestamp,
            'image': image
        }))