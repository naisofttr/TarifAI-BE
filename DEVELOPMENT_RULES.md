# TarifAI-BE Geliştirme Kuralları

## SOLID Prensipleri

### 1. Single Responsibility (Tek Sorumluluk Prensibi)
- Her sınıf ve fonksiyon yalnızca bir işi yapmalıdır
- Bir sınıfın değişmesi için sadece bir nedeni olmalıdır
- Controller'lar sadece HTTP isteklerini yönetmeli, iş mantığı service katmanında olmalıdır
- Örnek: `authController.ts` sadece kimlik doğrulama isteklerini yönetmelidir

### 2. Open/Closed (Açık/Kapalı Prensibi)
- Sınıflar genişletmeye açık, değişikliğe kapalı olmalıdır
- Yeni özellikler eklerken mevcut kodu değiştirmek yerine genişletme yapılmalıdır
- Interface'ler kullanarak genişletilebilirlik sağlanmalıdır
- Örnek: Yeni bir auth provider eklerken mevcut auth servisleri değiştirilmemeli

### 3. Liskov Substitution (Liskov Yerine Geçme Prensibi)
- Alt sınıflar, üst sınıfların yerine geçebilmelidir
- Interface'leri implemente eden sınıflar, interface'in tüm davranışlarını doğru şekilde uygulamalıdır
- Örnek: Tüm auth servisleri `IAuthService` interface'ini tam olarak uygulamalıdır

### 4. Interface Segregation (Arayüz Ayrımı Prensibi)
- Büyük interface'ler yerine küçük ve özelleşmiş interface'ler kullanılmalıdır
- Sınıflar kullanmayacakları metotları içeren interface'leri implemente etmemelidir
- Örnek: `IAuthService`, `ITokenService` gibi ayrı interface'ler kullanılmalıdır

### 5. Dependency Inversion (Bağımlılıkların Ters Çevrilmesi Prensibi)
- Yüksek seviyeli modüller düşük seviyeli modüllere bağımlı olmamalıdır
- Her ikisi de soyutlamalara bağımlı olmalıdır
- Dependency Injection kullanılmalıdır
- Örnek: Service'ler repository interface'lerine bağımlı olmalı, concrete repository sınıflarına değil

## Kod Organizasyonu

### Klasör Yapısı
```
src/
├── controllers/     # HTTP istekleri yönetimi
├── services/       # İş mantığı
├── repositories/   # Veri erişimi
├── models/         # Veri modelleri
├── dtos/          # Veri transfer objeleri
├── interfaces/     # Interface tanımlamaları
├── enums/         # Enum tanımlamaları
├── utils/         # Yardımcı fonksiyonlar
└── config/        # Konfigürasyon dosyaları
```

### Dosya İsimlendirme
- Dosya isimleri küçük harfle başlamalı
- Controller'lar: `resourceController.ts`
- Service'ler: `resourceService.ts`
- Interface'ler: `IResourceService.ts`
- DTO'lar: `CreateResourceDto.ts`, `UpdateResourceDto.ts`

## Kod Yazım Kuralları

### Genel Kurallar
- TypeScript strict mode kullanılmalıdır
- Her dosya tek bir export içermelidir (default export)
- Magic number'lar kullanılmamalı, sabitler tanımlanmalıdır
- Fonksiyonlar tek bir iş yapmalı ve 20 satırı geçmemelidir
- Değişken ve fonksiyon isimleri açıklayıcı olmalıdır
- Yorum satırları kodu açıklamak için değil, neden yapıldığını açıklamak için kullanılmalıdır

### Asenkron İşlemler
- Promise'lar yerine async/await kullanılmalıdır
- Hata yönetimi try/catch blokları ile yapılmalıdır
- Service katmanında hata fırlatma, controller katmanında hata yakalama yapılmalıdır

### Error Handling
- Custom error sınıfları kullanılmalıdır
- Hatalar anlamlı mesajlar içermelidir
- HTTP response'ları tutarlı hata formatında olmalıdır
```typescript
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: any
  }
}
```

### Güvenlik
- Hassas bilgiler (API anahtarları, şifreler) environment variable'larda saklanmalıdır
- Input validation yapılmalıdır
- SQL injection ve XSS saldırılarına karşı koruma sağlanmalıdır
- Rate limiting uygulanmalıdır

### Testing
- Her service ve utility fonksiyonu için unit test yazılmalıdır
- Integration testleri API endpoint'leri için yazılmalıdır
- Test coverage %80'in üzerinde olmalıdır
- Test dosyaları `.spec.ts` veya `.test.ts` uzantılı olmalıdır

### Git Kullanımı
- Commit mesajları açıklayıcı olmalıdır
- Feature branch'leri kullanılmalıdır
- PR'lar küçük ve odaklı olmalıdır
- Main branch'e direct push yapılmamalıdır

### Performans
- N+1 sorgu problemi önlenmelidir
- Gereksiz database sorguları yapılmamalıdır
- Büyük objelerin memory kullanımına dikkat edilmelidir
- Uzun süren işlemler için caching mekanizması kullanılmalıdır

### Dokümantasyon
- API endpoint'leri Swagger/OpenAPI ile dokümante edilmelidir
- Karmaşık iş mantığı için JSDoc kullanılmalıdır
- README dosyası güncel tutulmalıdır
- Environment variable'lar .env.example dosyasında dokümante edilmelidir 