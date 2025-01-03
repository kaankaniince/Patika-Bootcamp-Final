# Kaan Book-Shop

Kaan Book-Shop, modern bir kitap e-ticaret platformudur. Kullanıcılar, kitapları inceleyebilir, sepete ekleyebilir ve satın alma işlemlerini gerçekleştirebilir.

## Özellikler

- **Kitap Listeleme:** Kategorilere veya filtrelere göre kitapları listeleme.
- **Sepete Ekleme ve Yönetim:** Kullanıcılar kitapları sepete ekleyebilir ve sepetlerini yönetebilir.
- **Satın Alma İşlemi:** Sepet üzerinden ödeme işlemlerini tamamlama.
- **Ödeme ve Fatura:** Mikroservislerle ödeme ve faturalama entegrasyonu.

## Teknolojiler

### Backend
- **Node.js**: Sunucu tarafı geliştirme.
- **MongoDB**: Veritabanı.
- **Microservices**: 
  - **Ödeme Hizmeti**
  - **Faturalama Hizmeti**

### Frontend
- **React**: Kullanıcı arayüzü.
- **Mantine UI**: Şık ve modern tasarım bileşenleri.
- **Vite**: React projeleri için hızlı geliştirme ortamı.

### Diğer Teknolojiler
- **Axios**: API çağrıları.

## Kurulum

### Backend Kurulumu
1. Depoyu klonlayın:
   ```bash
   git clone https://github.com/kaankaniince/Patika-Bootcamp-Final
   cd kaan-book-shop/backend
   ```
2. Gerekli bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
3. Sunucuyu başlatın:
   ```bash
   npm start
   ```

### Frontend Kurulumu
1. Frontend klasörüne gidin:
   ```bash
   cd ../frontend
   ```
2. Gerekli bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
3. Uygulamayı başlatın:
   ```bash
   npm run dev
   ```

### Mikroservisler

#### Payment-Service
1. Payment-service klasörüne gidin:
   ```bash
   cd microservice
   cd payment-service
   ```
2. Servisi Node.js ile başlatın:
   ```bash
   npm start
   ```

#### Billing-Service
1. Billing-service klasörüne gidin:
   ```bash
   cd microservice
   cd billing-service
   ```
2. Servisi Node.js ile başlatın:
   ```bash
   npm start
   ```

#### Docker ile Mikroservisleri, Redis ve Kafka'yı Başlatma
Backend, mikroservisler, Redis ve Kafka'yı Docker ile ayağa kaldırmak için:
```bash
docker-compose up -d --build
```

## Kullanım

1. Kullanıcılar giriş yaparak kitapları inceleyebilir.
2. Kitaplar sepete eklenebilir.
3. Sepete gidilerek satın alma işlemleri gerçekleştirilebilir.

