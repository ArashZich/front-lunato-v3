/**
 * ویجت پیشنهاد فریم عینک مناسب با شکل صورت
 * نقطه ورودی برای استفاده در وب‌سایت‌ها
 */

// وارد کردن استایل‌ها
import "./styles.css";

// وارد کردن کلاس اصلی
import EyeglassWidget from "./EyeglassWidget";

// صادر کردن کلاس به عنوان خروجی پیش‌فرض
export default EyeglassWidget;

// ایجاد یک نمونه کاربردی در صورت فراخوانی مستقیم از CDN
if (typeof window !== "undefined") {
  window.EyeglassWidget = EyeglassWidget;

  // جستجوی اسکریپت فعلی برای یافتن تنظیمات
  const initWidget = () => {
    // بررسی اسکریپت با ویژگی data-eyeglass-widget
    const currentScript = document.querySelector(
      "script[data-eyeglass-widget]"
    );

    if (currentScript) {
      try {
        // بررسی تنظیمات از طریق ویژگی data-config
        const configAttr = currentScript.getAttribute("data-config");

        if (configAttr) {
          // تبدیل JSON به آبجکت جاوااسکریپت
          const config = JSON.parse(configAttr);

          // ایجاد نمونه جدید از ویجت با تنظیمات
          new EyeglassWidget(config);
        } else {
          // جستجوی تنظیمات اصلی از ویژگی‌های data
          const apiEndpoint =
            currentScript.getAttribute("data-api-endpoint") ||
            "http://localhost:8000/api/v1/analyze";
          const floatingButton =
            currentScript.getAttribute("data-floating-button") !== "false";
          const position =
            currentScript.getAttribute("data-position") || "left";
          const buttonText =
            currentScript.getAttribute("data-button-text") ||
            "پیشنهاد فریم عینک";

          // ایجاد نمونه جدید از ویجت (همیشه اجرا می‌شود حتی بدون apiEndpoint)
          new EyeglassWidget({
            apiEndpoint,
            floatingButton,
            position,
            buttonText,
          });
        }
      } catch (error) {
        console.error("خطا در راه‌اندازی ویجت:", error);
      }
    } else {
      // اگر اسکریپت با ویژگی data-eyeglass-widget یافت نشد،
      // یک نمونه آزمایشی با آدرس API پیش‌فرض ایجاد می‌کنیم
      // این فقط برای محیط توسعه است
      if (document.querySelector("body.eyeglass-widget-demo")) {
        console.log("راه‌اندازی خودکار ویجت در حالت دمو...");
        new EyeglassWidget({
          apiEndpoint: "http://localhost:8000/api/v1/analyze", // باید با آدرس API واقعی جایگزین شود
          floatingButton: true,
          position: "left",
          buttonText: "پیشنهاد فریم عینک",
        });
      }
    }
  };

  // اگر DOM آماده است، اجرای فوری
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWidget);
  } else {
    // اگر DOM قبلاً بارگذاری شده، اجرای فوری
    initWidget();
  }
}
