import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Room, Game, Word, RoomPlayer
from .serializers import GameSerializer, WordSerializer, RoomPlayerSerializer

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'game_{self.room_name}'
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
        await self.send_game_state()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')
        if action == 'refresh':
            await self.send_game_state()
        # Diğer aksiyonlar (örn. tahmin, ipucu) API üzerinden yapılacak

    async def send_game_state(self):
        game = await self.get_game()
        if not game:
            await self.send(text_data=json.dumps({'error': 'Oyun bulunamadı.'}))
            return
        game_data = await self.serialize_game(game)
        words = await self.serialize_words(game)
        players = await self.serialize_players(game.room)
        await self.send(text_data=json.dumps({
            'game': game_data,
            'words': words,
            'players': players
        }))

    @database_sync_to_async
    def get_game(self):
        try:
            room = Room.objects.get(name=self.room_name)
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

    async def game_update(self, event):
        await self.send_game_state() 