from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Room, RoomPlayer, Game, Word, WordPool, RoomWord, ChatMessage
from .serializers import RoomSerializer, RoomPlayerSerializer, GameSerializer, WordSerializer, WordPoolSerializer, RoomWordSerializer, ChatMessageSerializer
from django.contrib.auth.models import User
from django.db import transaction
import random
from django.utils import timezone

# Create your views here.

class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all().order_by('-created_at')
    serializer_class = RoomSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        room = serializer.save(admin=None)
        # Oda oluşturulunca otomatik olarak iki oyuncu ekle
        user1, _ = User.objects.get_or_create(username="oyuncu1")
        user2, _ = User.objects.get_or_create(username="oyuncu2")
        RoomPlayer.objects.create(user=user1, room=room, team='RED', role='OPERATIVE')
        RoomPlayer.objects.create(user=user2, room=room, team='BLUE', role='OPERATIVE')

    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def join(self, request, pk=None):
        room = self.get_object()
        username = request.data.get('username')
        if not username:
            return Response({'detail': 'Kullanıcı adı gerekli.'}, status=400)
        user, _ = User.objects.get_or_create(username=username)
        if RoomPlayer.objects.filter(user=user, room=room).exists():
            return Response({'detail': 'Zaten odadasınız.'}, status=400)
        red_count = RoomPlayer.objects.filter(room=room, team='RED').count()
        blue_count = RoomPlayer.objects.filter(room=room, team='BLUE').count()
        team = 'RED' if red_count <= blue_count else 'BLUE'
        role = 'SPYMASTER' if not RoomPlayer.objects.filter(room=room, team=team, role='SPYMASTER').exists() else 'OPERATIVE'
        RoomPlayer.objects.create(user=user, room=room, team=team, role=role)
        return Response({'detail': 'Odaya katıldınız.'})

    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def start(self, request, pk=None):
        room = self.get_object()
        if room.started:
            return Response({'detail': 'Oyun zaten başladı.'}, status=400)
        with transaction.atomic():
            room.started = True
            room.save()
            game = Game.objects.create(room=room)
            pool = list(WordPool.objects.all())
            if len(pool) < 25:
                return Response({'detail': 'Kelime havuzunda yeterli kelime yok.'}, status=400)
            selected = random.sample(pool, 25)
            roles = ['RED']*9 + ['BLUE']*8 + ['NEUTRAL']*7 + ['ASSASSIN']
            random.shuffle(roles)
            for word, role in zip(selected, roles):
                Word.objects.create(game=game, text=word.text, role=role)
        return Response({'detail': 'Oyun başlatıldı.'})

class RoomPlayerViewSet(viewsets.ModelViewSet):
    queryset = RoomPlayer.objects.all()
    serializer_class = RoomPlayerSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        room_id = self.request.query_params.get('room')
        qs = RoomPlayer.objects.all()
        if room_id:
            qs = qs.filter(room_id=room_id)
        return qs

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        user_data = data.get('user')
        if isinstance(user_data, dict):
            username = user_data.get('username')
            user, _ = User.objects.get_or_create(username=username)
            data['user_id'] = user.id
            data.pop('user', None)
        room_id = data.get('room')
        if isinstance(room_id, dict):
            data['room'] = room_id.get('id')
        elif isinstance(room_id, str):
            try:
                data['room'] = int(room_id)
            except Exception:
                return Response({'detail': 'Geçersiz oda id'}, status=400)
        if not data.get('room'):
            return Response({'detail': 'Oda id zorunlu.'}, status=400)
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=201)

class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def clue(self, request, pk=None):
        game = self.get_object()
        username = request.data.get('username')
        user = User.objects.filter(username=username).first()
        room_player = RoomPlayer.objects.filter(user=user, room=game.room).first()
        if not room_player or room_player.role != 'SPYMASTER' or room_player.team != game.current_turn:
            return Response({'detail': 'Sadece kendi takımının kaptanı ipucu verebilir.'}, status=403)
        word = request.data.get('word')
        count = int(request.data.get('count', 0))
        if not word or count < 1:
            return Response({'detail': 'Geçerli ipucu ve sayı girin.'}, status=400)
        game.clue_word = word
        game.clue_count = count
        game.guesses_left = count + 1
        game.save()
        return Response({'detail': 'İpucu verildi.'})

    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def guess(self, request, pk=None):
        game = self.get_object()
        username = request.data.get('username')
        user = User.objects.filter(username=username).first()
        room_player = RoomPlayer.objects.filter(user=user, room=game.room).first()
        if not room_player or room_player.team != game.current_turn or room_player.role != 'OPERATIVE':
            return Response({'detail': 'Sadece kendi takımının üyesi tahmin yapabilir.'}, status=403)
        word_id = request.data.get('word_id')
        try:
            word = Word.objects.get(id=word_id, game=game)
        except Word.DoesNotExist:
            return Response({'detail': 'Kelime bulunamadı.'}, status=404)
        if word.is_revealed:
            return Response({'detail': 'Bu kelime zaten açıldı.'}, status=400)
        word.is_revealed = True
        word.save()
        if word.role == 'ASSASSIN':
            game.is_active = False
            game.winner = 'BLUE' if game.current_turn == 'RED' else 'RED'
            game.finished_at = timezone.now()
            game.save()
            return Response({'detail': 'Katil kelime seçildi. Oyun bitti.'})
        elif word.role == game.current_turn:
            game.guesses_left -= 1
            game.save()
            if not Word.objects.filter(game=game, role=game.current_turn, is_revealed=False).exists():
                game.is_active = False
                game.winner = game.current_turn
                game.finished_at = timezone.now()
                game.save()
                return Response({'detail': 'Tüm takım kelimeleri bulundu. Oyun bitti.'})
            if game.guesses_left > 0:
                return Response({'detail': 'Doğru tahmin. Devam edebilirsiniz.'})
            else:
                game.current_turn = 'BLUE' if game.current_turn == 'RED' else 'RED'
                game.clue_word = None
                game.clue_count = None
                game.guesses_left = None
                game.save()
                return Response({'detail': 'Sıra karşı takıma geçti.'})
        else:
            game.current_turn = 'BLUE' if game.current_turn == 'RED' else 'RED'
            game.clue_word = None
            game.clue_count = None
            game.guesses_left = None
            game.save()
            return Response({'detail': 'Sıra karşı takıma geçti.'})

class WordViewSet(viewsets.ModelViewSet):
    queryset = Word.objects.all()
    serializer_class = WordSerializer
    permission_classes = [permissions.AllowAny]

class ChatMessageViewSet(viewsets.ModelViewSet):
    queryset = ChatMessage.objects.all()
    serializer_class = ChatMessageSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        room_id = self.request.query_params.get('room')
        qs = ChatMessage.objects.all()
        if room_id:
            qs = qs.filter(room_id=room_id)
        return qs.order_by('-created_at')[:50]

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        username = data.get('username')
        data['user'] = None  # user alanını boş bırak
        if not username:
            return Response({'detail': 'Kullanıcı adı gerekli.'}, status=400)
        # username'i doğrudan kaydet
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=201)

class WordPoolViewSet(viewsets.ModelViewSet):
    queryset = WordPool.objects.all()
    serializer_class = WordPoolSerializer
    permission_classes = [permissions.AllowAny]

class RoomWordViewSet(viewsets.ModelViewSet):
    queryset = RoomWord.objects.all()
    serializer_class = RoomWordSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        room_id = self.request.query_params.get('room')
        qs = RoomWord.objects.all()
        if room_id:
            qs = qs.filter(room_id=room_id)
        return qs
