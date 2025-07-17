from django.contrib import admin
from .models import Room, RoomPlayer, Game, Word, WordPool, RoomWord

admin.site.register(Room)
admin.site.register(RoomPlayer)
admin.site.register(Game)
admin.site.register(Word)
admin.site.register(WordPool)
admin.site.register(RoomWord)
