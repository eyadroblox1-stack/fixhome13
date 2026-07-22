// 1. قاعدة بيانات شاملة لكل الماركات المعتمدة
const brandsData = {
  'washing-machine': [
    'إل جي (LG)', 'سامسونج (Samsung)', 'زانوسي (Zanussi)', 'توشيبا (Toshiba)', 
    'وايت ويل (White Whale)', 'تورنيدو (Tornado)', 'بوش (Bosch)', 'فريش (Fresh)', 
    'إنديست (Indesit)', 'أريستون (Ariston)', 'هوفر (Hoover)', 'وايت بوينت (White Point)', 
    'إلكترولوكس (Electrolux)', 'هاير (Haier)', 'ويرلبول (Whirlpool)', 'أخرى'
  ],
  'ac': [
    'شارب (Sharp)', 'كاريير (Carrier)', 'يونيون اير (Unionaire)', 'ميديا (Midea)', 
    'فريش (Fresh)', 'تورنيدو (Tornado)', 'إل جي (LG)', 'سامسونج (Samsung)', 
    'جري (Gree)', 'يورك (York)', 'هايسنس (Hisense)', 'باناسونيك (Panasonic)', 
    'كرافت (Kraft)', 'أخرى'
  ],
  'fridge': [
    'كريازي (Kiriazi)', 'توشيبا (Toshiba)', 'إل جي (LG)', 'سامسونج (Samsung)', 
    'بيكو (Beko)', 'شارب (Sharp)', 'تورنيدو (Tornado)', 'إلكتروستار (Electrostar)', 
    'وايت ويل (White Whale)', 'دايو (Daewoo)', 'هيتاشي (Hitachi)', 'هايير (Haier)', 
    'أخرى'
  ]
};

// 2. تحديث قائمة الماركات بناءً على الجهاز
function updateBrands() {
    const deviceSelect = document.getElementById('device-type');
    const brandSelect = document.getElementById('brand-type');
    const brandGroup = document.getElementById('brand-group');
    const selectedDevice = deviceSelect.value;
    
    brandSelect.innerHTML = '<option value="" disabled selected>اختار الماركة...</option>';
    
    if (selectedDevice && brandsData[selectedDevice]) {
        brandsData[selectedDevice].forEach(brand => {
            const option = document.createElement('option');
            option.value = brand.toLowerCase();
            option.textContent = brand;
            brandSelect.appendChild(option);
        });
        brandGroup.style.display = 'block';
        brandGroup.classList.remove('fade-in-down');
        void brandGroup.offsetWidth;
        brandGroup.classList.add('fade-in-down');
    } else {
        brandGroup.style.display = 'none';
    }
}

// 3. مراقبة الفورم لظهور زر الحجز
function checkForm() {
    const device = document.getElementById('device-type').value;
    const brand = document.getElementById('brand-type').value;
    const location = document.getElementById('location').value;
    const submitArea = document.getElementById('submit-area');
    
    if (device && brand && location) {
        submitArea.style.maxHeight = "200px"; 
        submitArea.style.opacity = "1";
        submitArea.style.marginTop = "25px";
    } else {
        submitArea.style.maxHeight = "0";
        submitArea.style.opacity = "0";
        submitArea.style.marginTop = "0";
    }
}

// 4. إرسال الطلب (Webhook) بدون رسائل خطأ
function sendOrder() {
    const googleScriptURL = 'https://script.google.com/macros/s/AKfycbxNXPMpCBYCLq-o2wBjgMnyr9XwxW3X9tdaMoTQXujXJPTOO5B4ethTLnh04aGCrbPvFg/exec';
    
    const deviceText = document.getElementById('device-type').options[document.getElementById('device-type').selectedIndex].text;
    const brandText = document.getElementById('brand-type').options[document.getElementById('brand-type').selectedIndex].text;
    const locationText = document.getElementById('location').options[document.getElementById('location').selectedIndex].text;
    const btn = document.querySelector('.call-btn');
    const submitArea = document.getElementById('submit-area');
    
    // تغيير النص لـ "انتظر قليلاً"
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> انتظر قليلاً...';
    btn.disabled = true;

    const formData = new FormData();
    formData.append('device', deviceText);
    formData.append('brand', brandText);
    formData.append('location', locationText);

    // إرسال البيانات (Fire and Forget)
    fetch(googleScriptURL, { 
        method: 'POST', 
        mode: 'no-cors', 
        body: formData 
    });

    // إظهار رسالة النجاح والزرار بعد 1.5 ثانية تلقائياً
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check-circle"></i> تم الإرسال بنجاح!';
        btn.style.background = "#10B981";
        
        if (!document.getElementById('call-now-btn')) {
            const callBtn = document.createElement('a');
            callBtn.id = 'call-now-btn';
            callBtn.href = 'tel:01155664606';
            callBtn.innerHTML = '<i class="fas fa-phone-alt"></i> اتصل الآن: 01155664606';
            callBtn.style.cssText = 'display:block; margin-top:15px; padding:16px; background:#1f2937; color:#ffffff; text-align:center; border-radius:10px; text-decoration:none; font-weight:bold; transition:all 0.3s ease;';
            
            submitArea.appendChild(callBtn);
        }
    }, 1500);
}

// 5. محرك الأنيميشن + حل مشكلة التمرير التلقائي عند الريفرش
document.addEventListener("DOMContentLoaded", function() {
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    
    const elementsToAnimate = document.querySelectorAll('.service-card, .stat-box, .feature-card, .faq-item, .review-card, .section-title, .brand-item');
    elementsToAnimate.forEach((el, index) => {
        el.classList.add('hidden-element');
        if(index % 3 === 1) el.classList.add('delay-1');
        if(index % 3 === 2) el.classList.add('delay-2');
    });

    const observerOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-element');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    elementsToAnimate.forEach(el => scrollObserver.observe(el));
    
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '10px 50px';
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.padding = '15px 50px';
            navbar.style.background = '#ffffff';
            navbar.style.backdropFilter = 'none';
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        }
    });
});