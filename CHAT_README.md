# CodeNames Chat Özelliği

Bu proje, CodeNames oyunu için gerçek zamanlı chat özelliği ekler. WebSocket teknolojisi kullanarak oyuncuların odada yazışabilmesini sağlar.

## Özellikler

- ✅ Gerçek zamanlı mesajlaşma
- ✅ Odaya özel chat
- ✅ Mesaj geçmişi
- ✅ Sistem mesajları
- ✅ Oyun mesajları
- ✅ Responsive tasarım
- ✅ Bağlantı durumu göstergesi
- ✅ Otomatik yeniden bağlanma

## Backend Yapısı

### Modeller

#### ChatMessage Model
```python
class ChatMessage(models.Model):
    MESSAGE_TYPES = (
        ('CHAT', 'Sohbet'),
        ('SYSTEM', 'Sistem'),
        ('GAME', 'Oyun'),
    )
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='messages')
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    message = models.TextField(max_length=500)
    message_type = models.CharField(max_length=10, choices=MESSAGE_TYPES, default='CHAT')
    created_at = models.DateTimeField(auto_now_add=True)
```

### WebSocket Consumer

#### GameConsumer
- WebSocket bağlantısı yönetimi
- Chat mesajlarını alma ve yayınlama
- Oyun durumu güncellemeleri
- Mesaj geçmişi gönderme

### API Endpoints

#### ChatMessageViewSet
- `GET /api/chat/?room=<room_id>` - Odadaki mesajları getir
- `POST /api/chat/` - Yeni mesaj oluştur

## Frontend Yapısı

### Komponentler

#### ChatPanel
- Mesaj listesi görüntüleme
- Yeni mesaj gönderme
- Mesaj türlerine göre stil
- Otomatik kaydırma

#### GameBoardPage
- WebSocket bağlantısı yönetimi
- Chat panelini entegrasyon
- Bağlantı durumu göstergesi

### Stil Dosyaları

#### ChatPanel.css
- Modern ve responsive tasarım
- Mesaj türlerine göre renkler
- Animasyonlar ve geçişler
- Mobil uyumlu

## Kurulum ve Çalıştırma

### Backend

1. Gerekli paketleri yükleyin:
```bash
cd backend
pip install -r requirements.txt
```

2. Veritabanı migration'larını çalıştırın:
```bash
python manage.py makemigrations
python manage.py migrate
```

3. Backend'i başlatın:
```bash
python manage.py runserver
```

### Frontend

1. Gerekli paketleri yükleyin:
```bash
cd frontend
npm install
```

2. Frontend'i başlatın:
```bash
npm start
```

## Kullanım

### WebSocket Bağlantısı

```javascript
const wsUrl = `ws://localhost:8000/ws/game/${roomId}/`;
const ws = new WebSocket(wsUrl);

// Mesaj gönderme
ws.send(JSON.stringify({
    action: 'send_message',
    message: 'Merhaba!',
    user_id: 1,
    message_type: 'CHAT'
}));

// Mesaj alma
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'chat_message') {
        console.log('Yeni mesaj:', data.message);
    }
};
```

### API Kullanımı

```javascript
// Mesaj oluşturma
fetch('/api/chat/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        room: 1,
        username: 'KullaniciAdi',
        message: 'Merhaba!',
        message_type: 'CHAT'
    })
});

// Mesajları getirme
fetch('/api/chat/?room=1')
    .then(response => response.json())
    .then(messages => console.log(messages));
```

## Test

Chat özelliğini test etmek için `test_chat.html` dosyasını kullanabilirsiniz:

1. Backend'i çalıştırın
2. `test_chat.html` dosyasını tarayıcıda açın
3. WebSocket bağlantısını test edin
4. API endpoint'lerini test edin

## Özellik Detayları

### Mesaj Türleri

- **CHAT**: Normal kullanıcı mesajları
- **SYSTEM**: Sistem bildirimleri
- **GAME**: Oyun ile ilgili mesajlar

### Bağlantı Yönetimi

- Otomatik yeniden bağlanma (3 saniye aralıklarla)
- Bağlantı durumu göstergesi
- Hata yönetimi

### Responsive Tasarım

- Masaüstü: Sağ alt köşede sabit panel
- Mobil: Tam ekran chat paneli
- Tablet: Uyarlanabilir boyutlar

## Güvenlik

- Mesaj uzunluğu sınırı (500 karakter)
- XSS koruması
- CSRF koruması
- Input validasyonu

## Gelecek Geliştirmeler

- [ ] Emoji desteği
- [ ] Dosya paylaşımı
- [ ] Sesli mesajlar
- [ ] Mesaj arama
- [ ] Okundu bilgisi
- [ ] Çevrimiçi durumu
- [ ] Özel mesajlar

## Sorun Giderme

### WebSocket Bağlantı Sorunları

1. Backend'in çalıştığından emin olun
2. Port 8000'in açık olduğunu kontrol edin
3. CORS ayarlarını kontrol edin
4. Browser console'da hata mesajlarını kontrol edin

### Mesaj Gönderme Sorunları

1. WebSocket bağlantısının açık olduğunu kontrol edin
2. Mesaj formatının doğru olduğunu kontrol edin
3. Kullanıcı ID'sinin geçerli olduğunu kontrol edin

## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun
3. Değişikliklerinizi commit edin
4. Pull request gönderin

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. 