import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Room, Game, Word, RoomPlayer, ChatMessage
from .serializers import GameSerializer, WordSerializer, RoomPlayerSerializer, ChatMessageSerializer

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'game_{self.room_id}'

        room = await self.get_room()
        if not room:
            await self.close(code=4004)
            return

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
        
        # Bağlantı mesajı gönder
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'room_id': self.room_id
        }))
        
        # Oyun durumunu gönder
        await self.send_game_state()

    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            action = data.get('action')
            
            if action == 'refresh':
                await self.send_game_state()
            elif action == 'send_message':
                await self.handle_chat_message(data)
            elif action == 'ping':
                await self.send(text_data=json.dumps({'type': 'pong'}))
            else:
                await self.send(text_data=json.dumps({
                    'type': 'error',
                    'message': 'Bilinmeyen aksiyon'
                }))
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Geçersiz JSON formatı'
            }))
        except Exception as e:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': f'Sunucu hatası: {str(e)}'
            }))

    async def handle_chat_message(self, data):
        message = data.get('message', '').strip()
        username = data.get('username')
        message_type = data.get('message_type', 'CHAT')
        
        if not message:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Mesaj boş olamaz'
            }))
            return
            
        if len(message) > 500:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Mesaj çok uzun (maksimum 500 karakter)'
            }))
            return
            
        chat_message = await self.save_chat_message(message, username, message_type)
        if chat_message:
            message_data = await self.serialize_chat_message(chat_message)
            
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message_data
                }
            )
        else:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Mesaj kaydedilemedi'
            }))

    async def send_game_state(self):
        try:
            game = await self.get_game()
            if not game:
                await self.send(text_data=json.dumps({
                    'type': 'error',
                    'message': 'Oyun bulunamadı.'
                }))
                return
                
            game_data = await self.serialize_game(game)
            words = await self.serialize_words(game)
            players = await self.serialize_players(game.room)
            messages = await self.get_chat_messages(game.room)
            
            await self.send(text_data=json.dumps({
                'type': 'game_state',
                'game': game_data,
                'words': words,
                'players': players,
                'messages': messages
            }))
        except Exception as e:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': f'Oyun durumu alınamadı: {str(e)}'
            }))

    @database_sync_to_async
    def get_room(self):
        try:
            return Room.objects.get(id=self.room_id)
        except Room.DoesNotExist:
            return None

    @database_sync_to_async
    def get_game(self):
        try:
            room = Room.objects.get(id=self.room_id)
            return room.game
        except (Room.DoesNotExist, Game.DoesNotExist):
            return None

    @database_sync_to_async
    def serialize_game(self, game):
        return GameSerializer(game).data

    @database_sync_to_async
    def serialize_words(self, game):
        return WordSerializer(game.words.all(), many=True).data

    @database_sync_to_async
    def serialize_players(self, room):
        return RoomPlayerSerializer(room.players.all(), many=True).data

    @database_sync_to_async
    def get_chat_messages(self, room):
        messages = ChatMessage.objects.filter(room=room).order_by('-created_at')[:50]
        return ChatMessageSerializer(messages, many=True).data

    @database_sync_to_async
    def save_chat_message(self, message, username, message_type):
        try:
            room = Room.objects.get(id=self.room_id)
            return ChatMessage.objects.create(
                room=room,
                user=None,
                username=username,
                message=message,
                message_type=message_type
            )
        except Exception as e:
            print(f"Chat mesajı kaydedilemedi: {e}")
            return None

    @database_sync_to_async
    def serialize_chat_message(self, chat_message):
        return ChatMessageSerializer(chat_message).data

    async def game_update(self, event):
        await self.send_game_state()

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': event['message']
        }))
