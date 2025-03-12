/**
 * EyeglassWidget - ویجت پیشنهاد فریم عینک مناسب با شکل صورت
 */
class EyeglassWidget {
  /**
   * @param {Object} options - تنظیمات ویجت
   * @param {string} [options.apiEndpoint] - آدرس API تشخیص چهره (اختیاری)
   * @param {string} [options.buttonText] - متن دکمه باز کردن ویجت
   * @param {string} [options.floatingButton] - آیا دکمه به صورت شناور نمایش داده شود
   * @param {string} [options.position] - موقعیت دکمه شناور ('right' یا 'left')
   * @param {boolean} [options.autoInitialize] - خودکار فراخوانی تابع initialize
   */
  constructor(options) {
    // تنظیمات پیش‌فرض
    this.config = {
      apiEndpoint: "https://api.example.com/api/v1/analyze", // مقدار پیش‌فرض
      buttonText: "پیشنهاد فریم عینک",
      floatingButton: true, // به صورت پیش‌فرض، دکمه شناور است
      position: "left", // به صورت پیش‌فرض، دکمه سمت چپ قرار می‌گیرد
      modalId: "eyeglass-widget-modal",
      buttonClass: "eyeglass-widget-button",
      closeButtonText: "✕",
      processingText: "در حال تحلیل تصویر...",
      uploadButtonText: "آپلود تصویر",
      cameraButtonText: "استفاده از دوربین",
      tryAgainText: "تلاش مجدد",
      viewProductText: "مشاهده محصول",
      noFaceDetectedText:
        "چهره‌ای در تصویر یافت نشد. لطفا تصویر دیگری را امتحان کنید.",
      errorText: "خطا در پردازش تصویر. لطفا دوباره تلاش کنید.",
      headerText: "پیشنهاد فریم عینک مناسب",
      uploadInstructionText:
        "تصویری از صورت خود آپلود کنید یا از دوربین استفاده کنید",
      autoInitialize: true,
      ...options,
    };

    // دسترسی‌های دوربین
    this.stream = null;
    this.videoElement = null;

    if (this.config.autoInitialize) {
      this.initialize();
    }
  }

  /**
   * راه‌اندازی ویجت
   */
  initialize() {
    // ایجاد دکمه باز کردن ویجت
    this.createButton();

    // ایجاد مدال
    this.createModal();

    // ثبت رویدادها
    this.registerEvents();
  }

  /**
   * ایجاد دکمه باز کردن ویجت (شناور یا معمولی)
   */
  createButton() {
    // ایجاد دکمه
    const button = document.createElement("button");

    if (this.config.floatingButton) {
      // ایجاد دکمه شناور
      button.className = `${this.config.buttonClass} eyeglass-widget-floating-button`;

      // تنظیم استایل موقعیت
      if (this.config.position === "right") {
        button.classList.add("eyeglass-widget-position-right");
      } else {
        button.classList.add("eyeglass-widget-position-left");
      }

      // اضافه کردن آیکون
      button.innerHTML = `
          <span class="eyeglass-widget-button-icon">👓</span>
          <span class="eyeglass-widget-button-text">${this.config.buttonText}</span>
        `;

      // افزودن دکمه به body
      document.body.appendChild(button);
    } else {
      // اگر شناسه container مشخص شده باشد، استفاده کن
      const container = document.getElementById(this.config.containerId);

      if (!container) {
        console.error(`عنصر با شناسه ${this.config.containerId} یافت نشد`);
        return;
      }

      // ایجاد دکمه معمولی
      button.className = this.config.buttonClass;
      button.textContent = this.config.buttonText;

      // افزودن دکمه به container
      container.appendChild(button);
    }

    this.button = button;
  }

  /**
   * ایجاد مدال و تمام بخش‌های آن
   */
  createModal() {
    // ایجاد عنصر مدال
    const modal = document.createElement("div");
    modal.id = this.config.modalId;
    modal.className = "eyeglass-widget-modal eyeglass-widget-rtl";

    // محتوای مدال
    modal.innerHTML = `
        <div class="eyeglass-widget-modal-content">
          <div class="eyeglass-widget-modal-header">
            <h2>${this.config.headerText}</h2>
            <span class="eyeglass-widget-close-button">${this.config.closeButtonText}</span>
          </div>
          <div class="eyeglass-widget-modal-body">
            <!-- بخش آپلود -->
            <div class="eyeglass-widget-upload-section">
              <p>${this.config.uploadInstructionText}</p>
              <div class="eyeglass-widget-upload-options">
                <button class="eyeglass-widget-upload-button">
                  <span class="eyeglass-widget-button-icon">📂</span>
                  ${this.config.uploadButtonText}
                </button>
                <input type="file" class="eyeglass-widget-file-input" accept="image/*">
                <button class="eyeglass-widget-camera-button">
                  <span class="eyeglass-widget-button-icon">📷</span>
                  ${this.config.cameraButtonText}
                </button>
              </div>
            </div>
            
            <!-- بخش دوربین -->
            <div class="eyeglass-widget-camera-section">
              <video class="eyeglass-widget-camera-preview" autoplay playsinline></video>
              <div class="eyeglass-widget-camera-controls">
                <button class="eyeglass-widget-capture-button">📷</button>
              </div>
            </div>
            
            <!-- بخش پردازش -->
            <div class="eyeglass-widget-processing-section">
              <div class="eyeglass-widget-spinner"></div>
              <p>${this.config.processingText}</p>
            </div>
            
            <!-- بخش نتایج -->
            <div class="eyeglass-widget-results-section">
              <div class="eyeglass-widget-face-shape-info">
                <div class="eyeglass-widget-face-shape-title">شکل صورت: <span class="eyeglass-widget-face-shape-name"></span></div>
                <div class="eyeglass-widget-face-shape-description"></div>
                <div class="eyeglass-widget-face-shape-recommendation"></div>
              </div>
              
              <h3>فریم‌های پیشنهادی</h3>
              <div class="eyeglass-widget-recommended-frames"></div>
              
              <div style="text-align: center; margin-top: 20px;">
                <button class="eyeglass-widget-try-again-button">${this.config.tryAgainText}</button>
              </div>
            </div>
            
            <!-- بخش خطا -->
            <div class="eyeglass-widget-error-section">
              <div class="eyeglass-widget-error-icon">❌</div>
              <div class="eyeglass-widget-error-message"></div>
              <button class="eyeglass-widget-try-again-button">${this.config.tryAgainText}</button>
            </div>
          </div>
        </div>
      `;

    // افزودن مدال به body
    document.body.appendChild(modal);

    this.modal = modal;

    // ذخیره ارجاع به عناصر مهم
    this.uploadSection = modal.querySelector(".eyeglass-widget-upload-section");
    this.cameraSection = modal.querySelector(".eyeglass-widget-camera-section");
    this.processingSection = modal.querySelector(
      ".eyeglass-widget-processing-section"
    );
    this.resultsSection = modal.querySelector(
      ".eyeglass-widget-results-section"
    );
    this.errorSection = modal.querySelector(".eyeglass-widget-error-section");

    this.fileInput = modal.querySelector(".eyeglass-widget-file-input");
    this.videoElement = modal.querySelector(".eyeglass-widget-camera-preview");
  }

  /**
   * ثبت رویدادها
   */
  registerEvents() {
    // رویداد کلیک روی دکمه باز کردن
    this.button.addEventListener("click", () => this.openModal());

    // رویداد کلیک روی دکمه بستن مدال
    const closeButton = this.modal.querySelector(
      ".eyeglass-widget-close-button"
    );
    closeButton.addEventListener("click", () => this.closeModal());

    // بستن مدال با کلیک خارج از محتوا
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });

    // رویداد کلیک روی دکمه آپلود
    const uploadButton = this.modal.querySelector(
      ".eyeglass-widget-upload-button"
    );
    uploadButton.addEventListener("click", () => this.fileInput.click());

    // رویداد انتخاب فایل
    this.fileInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        this.handleImageUpload(e.target.files[0]);
      }
    });

    // رویداد کلیک روی دکمه دوربین
    const cameraButton = this.modal.querySelector(
      ".eyeglass-widget-camera-button"
    );
    cameraButton.addEventListener("click", () => this.openCamera());

    // رویداد کلیک روی دکمه گرفتن عکس
    const captureButton = this.modal.querySelector(
      ".eyeglass-widget-capture-button"
    );
    captureButton.addEventListener("click", () => this.captureImage());

    // رویداد کلیک روی دکمه‌های تلاش مجدد
    const tryAgainButtons = this.modal.querySelectorAll(
      ".eyeglass-widget-try-again-button"
    );
    tryAgainButtons.forEach((button) => {
      button.addEventListener("click", () => this.resetWidget());
    });
  }

  /**
   * باز کردن مدال
   */
  openModal() {
    this.modal.style.display = "flex";
    // نمایش بخش آپلود
    this.showSection("upload");
  }

  /**
   * بستن مدال
   */
  closeModal() {
    // توقف دوربین اگر باز است
    this.stopCamera();

    this.modal.style.display = "none";
    // بازنشانی وضعیت ویجت
    setTimeout(() => this.resetWidget(), 300);
  }

  /**
   * بازنشانی ویجت به حالت اولیه
   */
  resetWidget() {
    // توقف دوربین
    this.stopCamera();

    // پاک کردن فایل انتخاب شده
    this.fileInput.value = "";

    // پاک کردن محتوای نتایج
    const framesContainer = this.modal.querySelector(
      ".eyeglass-widget-recommended-frames"
    );
    framesContainer.innerHTML = "";

    // نمایش بخش آپلود
    this.showSection("upload");
  }

  /**
   * نمایش بخش مشخص شده و مخفی کردن بقیه
   * @param {string} section - نام بخش برای نمایش: 'upload', 'camera', 'processing', 'results', 'error'
   */
  showSection(section) {
    // مخفی کردن همه بخش‌ها
    this.uploadSection.style.display = "none";
    this.cameraSection.style.display = "none";
    this.processingSection.style.display = "none";
    this.resultsSection.style.display = "none";
    this.errorSection.style.display = "none";

    // نمایش بخش مورد نظر
    switch (section) {
      case "upload":
        this.uploadSection.style.display = "block";
        break;
      case "camera":
        this.cameraSection.style.display = "block";
        break;
      case "processing":
        this.processingSection.style.display = "block";
        break;
      case "results":
        this.resultsSection.style.display = "block";
        break;
      case "error":
        this.errorSection.style.display = "block";
        break;
    }
  }

  /**
   * باز کردن دوربین
   */
  async openCamera() {
    try {
      // نمایش بخش دوربین
      this.showSection("camera");

      // درخواست دسترسی به دوربین
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      // نمایش تصویر دوربین
      this.videoElement.srcObject = this.stream;
    } catch (error) {
      console.error("خطا در دسترسی به دوربین:", error);
      // نمایش خطا
      this.showError(
        "دسترسی به دوربین امکان‌پذیر نیست. لطفا از آپلود تصویر استفاده کنید."
      );
    }
  }

  /**
   * گرفتن عکس از دوربین
   */
  captureImage() {
    if (!this.videoElement || !this.stream) {
      this.showError("دوربین در دسترس نیست");
      return;
    }

    try {
      // ایجاد canvas برای گرفتن عکس
      const canvas = document.createElement("canvas");
      canvas.width = this.videoElement.videoWidth;
      canvas.height = this.videoElement.videoHeight;

      // رسم تصویر از ویدئو روی canvas
      const ctx = canvas.getContext("2d");
      ctx.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);

      // تبدیل canvas به فایل تصویر
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // توقف دوربین
            this.stopCamera();

            // ارسال تصویر به API
            this.analyzeImage(blob);
          } else {
            this.showError("خطا در گرفتن عکس. لطفا دوباره تلاش کنید.");
          }
        },
        "image/jpeg",
        0.95
      );
    } catch (error) {
      console.error("خطا در گرفتن عکس:", error);
      this.showError("خطا در گرفتن عکس. لطفا دوباره تلاش کنید.");
    }
  }

  /**
   * توقف دوربین
   */
  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
  }

  /**
   * نمایش خطا
   * @param {string} message - پیام خطا
   */
  showError(message) {
    const errorMessage = this.modal.querySelector(
      ".eyeglass-widget-error-message"
    );
    errorMessage.textContent = message || this.config.errorText;
    this.showSection("error");
  }

  /**
   * مدیریت آپلود تصویر
   * @param {File} file - فایل تصویر آپلود شده
   */
  handleImageUpload(file) {
    // بررسی نوع فایل
    if (!file.type.startsWith("image/")) {
      this.showError("لطفا یک فایل تصویر معتبر انتخاب کنید");
      return;
    }

    // بررسی حجم فایل (حداکثر 5 مگابایت)
    if (file.size > 5 * 1024 * 1024) {
      this.showError("حجم فایل نباید بیشتر از 5 مگابایت باشد");
      return;
    }

    // ارسال تصویر به API
    this.analyzeImage(file);
  }

  /**
   * ارسال تصویر به API و دریافت نتایج
   * @param {Blob|File} imageFile - فایل تصویر
   */
  async analyzeImage(imageFile) {
    // نمایش بخش پردازش
    this.showSection("processing");

    try {
      // ایجاد فرم‌دیتا
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("include_frames", "true");

      // تنظیمات درخواست
      const requestOptions = {
        method: "POST",
        body: formData,
      };

      // ارسال درخواست به API
      const response = await fetch(this.config.apiEndpoint, requestOptions);

      // بررسی پاسخ
      if (!response.ok) {
        // بررسی کد خطا
        if (response.status === 400) {
          this.showError("تصویر معتبر نیست یا چهره‌ای در آن تشخیص داده نشد");
        } else {
          this.showError(`خطا در پردازش تصویر (${response.status})`);
        }
        return;
      }

      // دریافت داده‌های JSON
      const data = await response.json();

      // بررسی موفقیت عملیات
      if (!data.success) {
        this.showError(data.message || "خطا در پردازش تصویر");
        return;
      }

      // نمایش نتایج
      this.showResults(data);
    } catch (error) {
      console.error("خطا در ارسال تصویر به API:", error);
      this.showError("خطا در ارتباط با سرور. لطفا دوباره تلاش کنید.");
    }
  }

  /**
   * نمایش نتایج تحلیل و پیشنهادات
   * @param {Object} data - داده‌های دریافتی از API
   */
  showResults(data) {
    // پر کردن اطلاعات شکل صورت
    const faceShapeName = this.modal.querySelector(
      ".eyeglass-widget-face-shape-name"
    );
    const faceShapeDescription = this.modal.querySelector(
      ".eyeglass-widget-face-shape-description"
    );
    const faceShapeRecommendation = this.modal.querySelector(
      ".eyeglass-widget-face-shape-recommendation"
    );

    // تبدیل نام انگلیسی شکل صورت به فارسی
    const faceShapeTranslations = {
      OVAL: "بیضی",
      ROUND: "گرد",
      SQUARE: "مربعی",
      HEART: "قلبی",
      OBLONG: "کشیده",
      DIAMOND: "لوزی",
      TRIANGLE: "مثلثی",
    };

    // نمایش نام شکل صورت
    faceShapeName.textContent =
      faceShapeTranslations[data.face_shape] || data.face_shape;

    // نمایش توضیحات شکل صورت
    faceShapeDescription.textContent = data.description || "";

    // نمایش توصیه‌های مربوط به فریم مناسب
    faceShapeRecommendation.textContent = data.recommendation || "";

    // پر کردن لیست فریم‌های پیشنهادی
    const framesContainer = this.modal.querySelector(
      ".eyeglass-widget-recommended-frames"
    );
    framesContainer.innerHTML = "";

    // اگر فریم‌های پیشنهادی وجود داشت
    if (data.recommended_frames && data.recommended_frames.length > 0) {
      // ایجاد کارت برای هر فریم
      data.recommended_frames.forEach((frame) => {
        // تنظیم قیمت
        const price = parseInt(frame.price).toLocaleString("fa-IR");
        let regularPrice = "";

        // اگر قیمت اصلی وجود داشت و با قیمت فعلی متفاوت بود، نمایش تخفیف
        if (frame.regular_price && frame.regular_price !== frame.price) {
          regularPrice = parseInt(frame.regular_price).toLocaleString("fa-IR");
        }

        // محاسبه امتیاز تطابق به صورت درصد (اگر موجود باشد)
        const matchScoreText = frame.match_score
          ? `<div class="eyeglass-widget-frame-match-score">
              <span class="eyeglass-widget-match-percentage">${frame.match_score}%</span> تطابق
             </div>`
          : "";

        // ایجاد عنصر کارت
        const frameCard = document.createElement("div");
        frameCard.className = "eyeglass-widget-frame-card";

        // تصویر فریم (اگر موجود باشد)
        const frameImage =
          frame.images && frame.images.length > 0
            ? frame.images[0]
            : "https://via.placeholder.com/300x200?text=بدون+تصویر";

        // پر کردن محتوای کارت
        frameCard.innerHTML = `
            <div class="eyeglass-widget-frame-image-container">
              <img class="eyeglass-widget-frame-image" src="${frameImage}" alt="${
          frame.name
        }">
              ${matchScoreText}
            </div>
            <div class="eyeglass-widget-frame-details">
              <div class="eyeglass-widget-frame-name">${frame.name}</div>
              <div class="eyeglass-widget-frame-type">${frame.frame_type}</div>
              <div class="eyeglass-widget-frame-price-container">
                ${
                  regularPrice
                    ? `<span class="eyeglass-widget-frame-regular-price">${regularPrice} تومان</span>`
                    : ""
                }
                <span class="eyeglass-widget-frame-price">${price} تومان</span>
              </div>
              <div class="eyeglass-widget-frame-action">
                <a href="${
                  frame.permalink
                }" target="_blank" class="eyeglass-widget-view-product">
                  ${this.config.viewProductText}
                </a>
              </div>
            </div>
          `;

        // افزودن کارت به لیست
        framesContainer.appendChild(frameCard);
      });
    } else {
      // اگر فریمی پیشنهاد نشده بود
      framesContainer.innerHTML = "<p>متأسفانه فریم پیشنهادی یافت نشد</p>";
    }

    // نمایش بخش نتایج
    this.showSection("results");
  }
}

export default EyeglassWidget;
