from rest_framework import serializers
from .models import Room, RoomPlayer, Game, Word, WordPool, RoomWord, ChatMessage
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class RoomPlayerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), write_only=True, source='user')
    room = serializers.PrimaryKeyRelatedField(queryset=Room.objects.all())
    class Meta:
        model = RoomPlayer
        fields = ['id', 'user', 'user_id', 'room', 'team', 'role', 'joined_at']

class RoomSerializer(serializers.ModelSerializer):
    admin = UserSerializer(read_only=True)
    players = RoomPlayerSerializer(many=True, read_only=True)
    class Meta:
        model = Room
        fields = ['id', 'name', 'created_at', 'admin', 'is_active', 'started', 'players']

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['id', 'room', 'current_turn', 'is_active', 'winner', 'started_at', 'finished_at', 'clue_word', 'clue_count', 'guesses_left']

class WordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Word
        fields = ['id', 'game', 'text', 'role', 'is_revealed']

class ChatMessageSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), write_only=True, source='user', required=False, allow_null=True)
    username = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    
    class Meta:
        model = ChatMessage
        fields = ['id', 'room', 'user', 'user_id', 'username', 'message', 'message_type', 'created_at']
        read_only_fields = ['created_at']

class WordPoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = WordPool
        fields = ['id', 'text']

class RoomWordSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomWord
        fields = ['id', 'room', 'text'] 