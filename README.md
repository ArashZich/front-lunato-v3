# ویجت پیشنهاد فریم عینک

این پروژه یک ویجت جاوااسکریپت برای تشخیص شکل صورت و پیشنهاد فریم عینک مناسب است. با افزودن یک اسکریپت ساده به هر وب‌سایتی، یک دکمه شناور ایجاد می‌شود که کاربران می‌توانند با کلیک روی آن، تصویر خود را آپلود کرده یا از دوربین استفاده کنند و فریم‌های عینک متناسب با شکل صورت خود را دریافت کنند.

## ویژگی‌ها

- دکمه شناور قابل تنظیم در سمت راست یا چپ صفحه
- قابلیت آپلود تصویر یا استفاده از دوربین
- ارسال تصویر به API تشخیص چهره
- نمایش شکل صورت تشخیص داده شده
- نمایش فریم‌های پیشنهادی مناسب با شکل صورت
- طراحی واکنش‌گرا و سازگار با موبایل
- پشتیبانی کامل از RTL و زبان فارسی

## نصب و راه‌اندازی

### پیش‌نیازها

- Node.js (نسخه 14 یا بالاتر)
- npm یا yarn

### مراحل راه‌اندازی

1. کلون کردن پروژه:
   ```bash
   git clone https://github.com/yourusername/eyeglass-widget.git
   cd eyeglass-widget
   ```

2. نصب وابستگی‌ها:
   ```bash
   npm install
   ```

3. شروع سرور توسعه:
   ```bash
   npm start
   ```
   این دستور یک سرور توسعه را در آدرس `http://localhost:3000` راه‌اندازی می‌کند.

4. برای ساخت نسخه تولید:
   ```bash
   npm run build
   ```
   فایل‌های خروجی در پوشه `dist` قرار می‌گیرند.

## نحوه استفاده در وب‌سایت شما

### روش 1: استفاده مستقیم از فایل جاوااسکریپت

1. فایل‌های خروجی را روی سرور خود آپلود کنید.

2. اسکریپت زیر را در صفحه HTML خود قرار دهید:

```html
<script src="http://your-server.com/eyeglass-widget.js"></script>
<script>
  new EyeglassWidget({
    apiEndpoint: 'https://your-api.com/api/v1/analyze',
    floatingButton: true,
    position: 'left', // یا 'right'
    buttonText: 'پیشنهاد فریم عینک'
  });
</script>
```

### روش 2: استفاده با ویژگی‌های data

```html
<script 
  src="http://your-server.com/eyeglass-widget.js"
  data-eyeglass-widget
  data-api-endpoint="https://your-api.com/api/v1/analyze"
  data-floating-button="true"
  data-position="left"
  data-button-text="پیشنهاد فریم عینک">
</script>
```

### روش 3: استفاده در حالت توسعه

برای تست سریع در محیط توسعه، می‌توانید از آدرس `http://localhost:3000/eyeglass-widget.js` استفاده کنید:

```html
<script src="http://localhost:3000/eyeglass-widget.js"></script>
<script>
  new EyeglassWidget({
    apiEndpoint: 'https://your-api.com/api/v1/analyze',
    floatingButton: true,
    position: 'left'
  });
</script>
```

## تنظیمات قابل استفاده

| گزینه | توضیحات | پیش‌فرض |
|-------|---------|---------|
| `apiEndpoint` | آدرس API تشخیص چهره (الزامی) | - |
| `floatingButton` | آیا دکمه به صورت شناور نمایش داده شود | `true` |
| `position` | موقعیت دکمه شناور ('right' یا 'left') | `'left'` |
| `buttonText` | متن دکمه باز کردن ویجت | 'پیشنهاد فریم عینک' |
| `headerText` | متن سرتیتر مدال | 'پیشنهاد فریم عینک مناسب' |
| `uploadButtonText` | متن دکمه آپلود تصویر | 'آپلود تصویر' |
| `cameraButtonText` | متن دکمه استفاده از دوربین | 'استفاده از دوربین' |
| `viewProductText` | متن دکمه مشاهده محصول | 'مشاهده محصول' |

## ساختار API مورد نیاز

API باید از فرمت زیر پشتیبانی کند:

### درخواست:
- متد: POST
- URL: {apiEndpoint}
- Content-Type: multipart/form-data
- پارامترها:
  - `file`: فایل تصویر
  - `include_frames`: true

### پاسخ:
```json
{
  "success": true,
  "message": "تحلیل چهره با موفقیت انجام شد",
  "face_shape": "HEART",
  "confidence": 80,
  "description": "صورت قلبی دارای پیشانی پهن و فک باریک است.",
  "recommendation": "فریم‌های گرد و بیضی که در قسمت پایین پهن‌تر هستند، مناسب هستند.",
  "recommended_frame_types": [
    "گرد",
    "بیضی",
    "هاوایی",
    "پایین‌بدون‌فریم"
  ],
  "recommended_frames": [
    {
      "id": 1,
      "name": "فریم گرد برند X مدل Y",
      "permalink": "https://example.com/product/frame-1",
      "price": "900000",
      "regular_price": "1500000",
      "frame_type": "گرد",
      "images": [
        "https://example.com/wp-content/uploads/frames/frame_1.jpg"
      ],
      "match_score": 90
    }
  ]
}
```

## عیب‌یابی

اگر با مشکلی مواجه شدید، موارد زیر را بررسی کنید:

1. آیا آدرس API صحیح است؟
2. آیا API به درستی پاسخ می‌دهد؟
3. آیا مرورگر شما اجازه دسترسی به دوربین را می‌دهد؟
4. آیا Cross-Origin Resource Sharing (CORS) در API شما فعال است؟
5. بررسی کنسول مرورگر برای پیدا کردن خطاهای احتمالی

## راهنمای انتشار

1. تنظیم آدرس API واقعی در کد نمونه
2. ساخت نسخه تولید با دستور `npm run build`
3. آپلود فایل‌های پوشه `dist` روی سرور CDN یا سرور وب شما
4. اضافه کردن اسکریپت به وب‌سایت‌ها طبق راهنمای استفاده

## مجوز

این پروژه تحت مجوز MIT منتشر شده است.