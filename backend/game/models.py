from django.db import models
from django.contrib.auth.models import User

class Room(models.Model):
    name = models.CharField(max_length=32, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    admin = models.ForeignKey(User, on_delete=models.CASCADE, related_name='admin_rooms', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    started = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class RoomPlayer(models.Model):
    ROLE_CHOICES = (
        ('SPYMASTER', 'Kaptan'),
        ('OPERATIVE', 'Takım Üyesi'),
    )
    TEAM_CHOICES = (
        ('RED', 'Kırmızı'),
        ('BLUE', 'Mavi'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='players')
    team = models.CharField(max_length=4, choices=TEAM_CHOICES)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='OPERATIVE')
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'room')

    def __str__(self):
        return f"{self.user.username} ({self.get_team_display()} - {self.get_role_display()})"

class Game(models.Model):
    room = models.OneToOneField(Room, on_delete=models.CASCADE, related_name='game')
    current_turn = models.CharField(max_length=4, choices=RoomPlayer.TEAM_CHOICES, default='RED')
    is_active = models.BooleanField(default=True)
    winner = models.CharField(max_length=4, choices=RoomPlayer.TEAM_CHOICES, null=True, blank=True)
    started_at = models.DateTimeField(auto_now_add=True)
    finished_at = models.DateTimeField(null=True, blank=True)
    clue_word = models.CharField(max_length=30, null=True, blank=True)
    clue_count = models.IntegerField(null=True, blank=True)
    guesses_left = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"Oda: {self.room.name} | Aktif: {self.is_active}"

class Word(models.Model):
    ROLE_CHOICES = (
        ('RED', 'Kırmızı'),
        ('BLUE', 'Mavi'),
        ('NEUTRAL', 'Nötr'),
        ('ASSASSIN', 'Katil'),
    )
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='words')
    text = models.CharField(max_length=30)
    role = models.CharField(max_length=8, choices=ROLE_CHOICES)
    is_revealed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.text} ({self.get_role_display()})"

class ChatMessage(models.Model):
    MESSAGE_TYPES = (
        ('CHAT', 'Sohbet'),
        ('SYSTEM', 'Sistem'),
        ('GAME', 'Oyun'),
    )
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='messages')
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    username = models.CharField(max_length=100, null=True, blank=True)
    message = models.TextField(max_length=500)
    message_type = models.CharField(max_length=10, choices=MESSAGE_TYPES, default='CHAT')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.user.username if self.user else 'Sistem'}: {self.message[:50]}"

class WordPool(models.Model):
    text = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.text

class RoomWord(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='roomwords')
    text = models.CharField(max_length=30)
    class Meta:
        unique_together = ('room', 'text')
    def __str__(self):
        return f"{self.text} ({self.room.name})"