# Menü API Dokümantasyonu

Bu dokümantasyon, TarifAI API'sinin menü ile ilgili endpoint'lerini açıklar.

## Endpointler

### Menü Tipine Göre Menüleri Getir

**URL:** `GET /api/menu/getMenusByMenuType/{menuPromptType}/{languageCode}`

**Açıklama:** Belirtilen menü tipine ve dil koduna göre menüleri ve bağlı reçeteleri getirir.

**URL Parametreleri:**

| Parametre      | Tip    | Açıklama                                                   | Gerekli |
|----------------|--------|-------------------------------------------------------------|---------|
| menuPromptType | string | Menü prompt tipi (MenuPromptType enum değerlerinden biri)   | Evet    |
| languageCode   | string | Dil kodu (örn: "tr", "en")                                 | Evet    |

**Geçerli MenuPromptType Değerleri:**
- `chefMenu` = (chefMenu),           // Şef menü
- `guestMenu` (Akşama misafir menü)
- `dietMenu` (Diyet menü)
- `athleteMenu` (Sporcu menü)
- `healthyMenu` (Sağlıklı menü)
- `studentMenu` (Öğrenci menü)
- `meatLoverMenu` (Etçi menü)
- `affordableMenu` (Uygun fiyatlı menü)
- `veganMenu` (Vegan menü)

**Örnek İstek:**
```
GET /api/menu/getMenusByMenuType/guestMenu/tr
```

**Başarılı Yanıt:**
```json
{
  "success": true,
  "data": [
    {
      "id": "menu-123",
      "title": "Akşam Misafir Menüsü",
      "menuPromptType": "guestMenu",
      "menuType": "luxuryMenu",
      "recipeIds": ["recipe-1", "recipe-2", "recipe-3"],
      "languageCode": "tr",
      "createdAt": "2023-08-15T14:30:00.000Z",
      "recipes": [
        {
          "id": "recipe-1",
          "title": "Mercimek Çorbası",
          "type": "soup",
          "preparationTime": 15,
          "cookingTime": 30,
          "difficulty": "easy",
          "servings": 4,
          "ingredients": [
            {
              "name": "kırmızı mercimek",
              "quantity": "1",
              "unit": "su bardağı"
            },
            // ... diğer malzemeler
          ],
          "instructions": [
            "Mercimekleri yıkayın ve süzün.",
            // ... diğer talimatlar
          ],
          "languageCode": "tr",
          "createdAt": "2023-08-10T10:00:00.000Z"
        },
        // ... diğer reçeteler
      ]
    },
    // ... diğer menüler
  ],
  "errorMessage": "Menüler başarıyla getirildi"
}
```

**Başarısız Yanıt (Hatalı Menü Tipi):**
```json
{
  "success": false,
  "errorMessage": "Geçersiz menü tipi"
}
```

**Başarısız Yanıt (Hatalı Dil Kodu):**
```json
{
  "success": false,
  "errorMessage": "Geçersiz dil kodu"
}
```

**Menü Bulunamadı (Başarılı, ancak veri yok):**
```json
{
  "success": true,
  "data": [],
  "errorMessage": "Belirtilen tipte menü bulunamadı"
}
```

**Sunucu Hatası:**
```json
{
  "success": false,
  "errorMessage": "Menü listeleme sırasında bir hata oluştu"
}
``` 