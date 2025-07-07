# 🧠 CennetCode (Codenames) – Sözcük Tahmin Oyunu

Kelime oyunlarına farklı bir boyut!  
Codenames, iki takım arasında geçen, ipuçları ve tahminlerle ilerleyen çok oyunculu bir sözcük tahmin oyunudur.  
Kaptan ipucu verir, takım arkadaşları kelimeleri bulmaya çalışır. Eğlenceli, stratejik ve rekabet dolu!

---

## ✨ Özellikler
 
🧩 5x5 Oyun Tahtası ve Gizli Kelime Rolleri  
👥 Kırmızı ve Mavi Takımlar, Kaptan ve Oyuncu Rolleri  
🗃️ Oda Sistemi  
🔐 Django Admin Paneli Üzerinden Kullanıcı Kontrolü  
🌐 REST API Entegrasyonu ile React Arayüzü

---

## 📦 Kullanılan Teknolojiler

🧠 **Django** – Python tabanlı backend framework  
🔌 **Django REST Framework** – API geliştirme  
⚛️ **React** – Modern frontend kütüphanesi  
🗃️ **PostgreSQL** – Güçlü ilişkisel veritabanı yönetimi  
🖥️ **Django Admin Paneli** – Kullanıcı kontrolü

---

## 📁 API Endpointleri (Örnek)

🧾 Oda İşlemleri  
- `GET /api/rooms/` – Tüm odaları getir  
- `POST /api/rooms/` – Yeni oda oluştur  
- `GET /api/rooms/{id}/` – Belirli odayı getir  
- `DELETE /api/rooms/{id}/` – Odayı sil

👥 Oyuncu İşlemleri  
- `GET /api/roomplayers/?room={oda_id}` – Odadaki oyuncuları getir  
- `POST /api/roomplayers/` – Oyuncu ekle  
- `DELETE /api/roomplayers/{id}/` – Oyuncuyu sil

🎲 Oyun İşlemleri  
- `POST /api/games/` – Oyun başlat  
- `POST /api/games/{id}/clue/` – İpucu ver  
- `POST /api/games/{id}/guess/` – Tahmin yap

---

## 🚀 Kurulum (Local Geliştirme)

Projeyi kendi bilgisayarınızda çalıştırmak için:

```bash
git clone https://github.com/busrahakay/codenames.git
cd codenames
cd backend
python -m venv env
env\Scripts\activate  # (Mac/Linux için: source env/bin/activate)
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
cd ..
cd frontend
npm start
```
🔧 Uygulama arayüz görselleri için interface_images dosyasını inceleyin!
