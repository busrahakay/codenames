# CodeNames Canlı Chat Kurulum Rehberi

Bu rehber, CodeNames projesinde canlı mesajlaşma özelliğinin nasıl kurulacağını ve çalıştırılacağını açıklar.

## 🚀 Hızlı Başlangıç

### 1. Backend Kurulumu

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py add_words
python manage.py runserver
```

### 2. Frontend Kurulumu

```bash
cd frontend
npm install
npm start
```

### 3. Test Etme

- Backend: http://localhost:8000
- Frontend: http://localhost:3000
- Test Sayfası: `test_chat.html` dosyasını tarayıcıda açın

## 🔧 Yapılan İyileştirmeler

### Backend İyileştirmeleri

1. **WebSocket Consumer Geliştirmeleri:**
   - Bağlantı yönetimi iyileştirildi
   - Hata işleme eklendi
   - Ping-pong bağlantı kontrolü
   - Mesaj validasyonu

2. **Channels Yapılandırması:**
   - InMemory backend (Redis olmadan çalışır)
   - CORS ayarları güncellendi
   - ASGI yapılandırması iyileştirildi

3. **API İyileştirmeleri:**
   - ChatMessage modeli için serializer
   - Mesaj oluşturma ve listeleme endpoint'leri
   - Hata yönetimi

### Frontend İyileştirmeleri

1. **WebSocket Bağlantı Yönetimi:**
   - Otomatik yeniden bağlanma
   - Bağlantı durumu göstergesi
   - Ping-pong kontrolü
   - Hata yönetimi

2. **ChatPanel Bileşeni:**
   - Gerçek zamanlı mesajlaşma
   - Bağlantı durumu göstergesi
   - Mesaj sayacı
   - Responsive tasarım

3. **Kullanıcı Deneyimi:**
   - Enter tuşu ile mesaj gönderme
   - Otomatik kaydırma
   - Mesaj türlerine göre stil
   - Hata bildirimleri

## 📋 Özellikler

### ✅ Çalışan Özellikler

- ✅ Gerçek zamanlı mesajlaşma
- ✅ Odaya özel chat
- ✅ Mesaj geçmişi
- ✅ Sistem mesajları
- ✅ Bağlantı durumu göstergesi
- ✅ Otomatik yeniden bağlanma
- ✅ Ping-pong bağlantı kontrolü
- ✅ Hata yönetimi
- ✅ Responsive tasarım

### 🔄 Mesaj Türleri

- **CHAT**: Normal kullanıcı mesajları
- **SYSTEM**: Sistem bildirimleri
- **GAME**: Oyun ile ilgili mesajlar

## 🧪 Test Etme

### 1. Test Sayfası ile Test

`test_chat.html` dosyasını tarayıcıda açın:

1. "Bağlan" butonuna tıklayın
2. Mesaj yazın ve "Gönder" butonuna tıklayın
3. Ping butonunu test edin
4. API testlerini çalıştırın

### 2. Frontend ile Test

1. http://localhost:3000 adresine gidin
2. Bir oda oluşturun veya mevcut odaya katılın
3. Sağ alt köşedeki chat panelini kullanın
4. Bağlantı durumunu kontrol edin

### 3. Çoklu Kullanıcı Testi

1. Farklı tarayıcılarda veya gizli modda açın
2. Aynı odaya katılın
3. Mesajların gerçek zamanlı olarak görünmesini test edin

## 🔍 Sorun Giderme

### WebSocket Bağlantı Sorunları

1. **Backend çalışmıyor:**
   ```bash
   cd backend
   python manage.py runserver
   ```

2. **Port 8000 kullanımda:**
   ```bash
   python manage.py runserver 8001
   ```

3. **CORS hatası:**
   - `backend/backend/settings.py` dosyasında CORS ayarlarını kontrol edin

### Frontend Sorunları

1. **Frontend çalışmıyor:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

2. **WebSocket bağlantı hatası:**
   - Browser console'da hata mesajlarını kontrol edin
   - Backend'in çalıştığından emin olun

### Veritabanı Sorunları

1. **Migration hatası:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

2. **Kelime havuzu boş:**
   ```bash
   python manage.py add_words
   ```

## 🚀 Production'a Geçiş

### Redis Kurulumu (Önerilen)

Production ortamında Redis kullanmak için:

1. **Redis Kurulumu:**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install redis-server
   
   # Windows (WSL veya Docker)
   docker run -d -p 6379:6379 redis:alpine
   ```

2. **Settings Güncelleme:**
   ```python
   # backend/backend/settings.py
   CHANNEL_LAYERS = {
       'default': {
           'BACKEND': 'channels_redis.core.RedisChannelLayer',
           'CONFIG': {
               "hosts": [('127.0.0.1', 6379)],
           },
       },
   }
   ```

### Güvenlik Ayarları

1. **DEBUG = False**
2. **SECRET_KEY değiştirin**
3. **ALLOWED_HOSTS ayarlayın**
4. **CORS ayarlarını sınırlayın**

## 📝 API Dokümantasyonu

### WebSocket Endpoints

- `ws://localhost:8000/ws/game/{room_name}/`

### HTTP API Endpoints

- `GET /api/chat/?room={room_id}` - Odadaki mesajları getir
- `POST /api/chat/` - Yeni mesaj oluştur
- `GET /api/rooms/` - Odaları listele
- `POST /api/rooms/` - Yeni oda oluştur

### WebSocket Mesaj Formatları

**Mesaj Gönderme:**
```json
{
  "action": "send_message",
  "message": "Merhaba!",
  "user_id": 1,
  "message_type": "CHAT"
}
```

**Ping:**
```json
{
  "action": "ping"
}
```

## 🎯 Sonraki Adımlar

1. **Redis Kurulumu** - Production için
2. **Emoji Desteği** - Mesajlarda emoji
3. **Dosya Paylaşımı** - Resim ve dosya gönderme
4. **Sesli Mesajlar** - Ses kaydı gönderme
5. **Okundu Bilgisi** - Mesaj okundu göstergesi
6. **Çevrimiçi Durumu** - Kullanıcı çevrimiçi göstergesi

## 📞 Destek

Sorun yaşarsanız:

1. Console loglarını kontrol edin
2. Network sekmesinde WebSocket bağlantısını kontrol edin
3. Backend loglarını kontrol edin
4. Test sayfasını kullanarak izole edin

---

**Not:** Bu rehber, canlı chat özelliğinin temel kurulumunu kapsar. Production ortamı için ek güvenlik ve performans ayarları gerekebilir. 