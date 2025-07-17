# Codenames (Backend)

## Kurulum

1. Sanal ortamı başlat:

```powershell
cd backend
./venv/Scripts/activate
```

2. Gereksinimleri yükle:

```sh
pip install -r requirements.txt
```

3. Veritabanı ayarlarını yap (PostgreSQL'de codenames_db adında bir veritabanı oluştur):

```sql
CREATE DATABASE codenames_db;
```

4. Migrasyonları uygula:

```sh
python manage.py migrate
```

5. Admin kullanıcı oluştur:

```sh
python manage.py createsuperuser
```

6. Sunucuyu başlat:

```sh
python manage.py runserver
```

7. WebSocket ve Channels için Redis gereklidir. Redis'i başlatmayı unutma.

## API
- Tüm endpointler `/api/` altında.
- Admin paneli `/admin/` altında. 