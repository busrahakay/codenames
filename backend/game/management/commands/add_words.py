from django.core.management.base import BaseCommand
from game.models import WordPool

class Command(BaseCommand):
    help = 'Kelime havuzuna örnek kelimeler ekler.'

    def handle(self, *args, **options):
        kelimeler = [
            "elma", "masa", "araba", "kitap", "kalem", "telefon", "bilgisayar", "deniz", "güneş", "yıldız",
            "çiçek", "banka", "kral", "kraliçe", "köpek", "kedi", "uçak", "tren", "balık", "orman",
            "şehir", "köy", "dağ", "nehir", "yol", "buz", "ateş", "kule", "sandalye", "bardak"
        ]
        for k in kelimeler:
            WordPool.objects.get_or_create(text=k)
        self.stdout.write(self.style.SUCCESS(f'{len(kelimeler)} kelime eklendi veya zaten vardı.')) 