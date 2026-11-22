/* =========================================================
   روان سيف صالح — السيرة الذاتية الرقمية
   script.js
   ========================================================= */

(function () {
  "use strict";

  const root = document.documentElement;
  const body = document.body;
  const header = document.getElementById("site-header");
  const menuToggle = document.getElementById("menu-toggle");
  const mainNav = document.getElementById("main-nav");
  const themeToggle = document.getElementById("theme-toggle");
  const progressBar = document.getElementById("scroll-progress-bar");
  const toast = document.getElementById("toast");
  const copyButton = document.getElementById("copy-phone");
  const yearElement = document.getElementById("current-year");
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

  const WHATSAPP_NUMBER = "966533919725";
  const WHATSAPP_MESSAGE = "مرحبًا روان، شاهدت سيرتك الذاتية وأود التواصل معك.";
  const THEME_KEY = "rawan-cv-theme";

  let toastTimer = null;
  let particleColor = "52, 211, 153";

  /* ---------- السنة الحالية ---------- */
  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }

  /* ---------- رسائل التنبيه ---------- */
  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("show");
    }, 2400);
  }

  /* ---------- المظهر الفاتح والداكن ---------- */
  function getSavedTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (error) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      /* المتصفح قد يمنع التخزين المحلي */
    }
  }

  function applyTheme(theme, announce) {
    const nextTheme = theme === "light" ? "light" : "dark";
    root.setAttribute("data-theme", nextTheme);

    if (themeToggle) {
      const isLight = nextTheme === "light";
      themeToggle.setAttribute("aria-pressed", String(isLight));
      themeToggle.setAttribute(
        "aria-label",
        isLight ? "تفعيل الوضع الداكن" : "تفعيل الوضع الفاتح"
      );
    }

    if (themeColorMeta) {
      themeColorMeta.setAttribute(
        "content",
        nextTheme === "light" ? "#f1faf5" : "#06120e"
      );
    }

    updateParticleColor();

    if (announce) {
      showToast(nextTheme === "light" ? "تم تفعيل الوضع الفاتح" : "تم تفعيل الوضع الداكن");
    }
  }

  const savedTheme = getSavedTheme();
  const systemPrefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  applyTheme(savedTheme || (systemPrefersLight ? "light" : "dark"), false);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const currentTheme = root.getAttribute("data-theme");
      const nextTheme = currentTheme === "light" ? "dark" : "light";
      applyTheme(nextTheme, true);
      saveTheme(nextTheme);
    });
  }

  /* ---------- قائمة الجوال ---------- */
  function closeMenu() {
    if (!mainNav || !menuToggle) return;

    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "فتح قائمة التنقل");
    body.classList.remove("menu-open");
  }

  function openMenu() {
    if (!mainNav || !menuToggle) return;

    mainNav.classList.add("open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "إغلاق قائمة التنقل");
    body.classList.add("menu-open");
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", function (event) {
      if (
        mainNav.classList.contains("open") &&
        !mainNav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 940) {
        closeMenu();
      }
    });
  }

  /* ---------- شريط التقدم والهيدر ---------- */
  let scrollTicking = false;

  function updateScrollUI() {
    const scrollTop = window.scrollY || window.pageYOffset;
    const documentHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress =
      documentHeight > 0 ? Math.min(100, (scrollTop / documentHeight) * 100) : 0;

    if (progressBar) {
      progressBar.style.width = progress + "%";
    }

    if (header) {
      header.classList.toggle("scrolled", scrollTop > 24);
    }

    scrollTicking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!scrollTicking) {
        window.requestAnimationFrame(updateScrollUI);
        scrollTicking = true;
      }
    },
    { passive: true }
  );

  updateScrollUI();

  /* ---------- تفعيل رابط القسم الحالي ---------- */
  const sections = Array.prototype.slice.call(
    document.querySelectorAll("main section[id]")
  );
  const navLinks = Array.prototype.slice.call(
    document.querySelectorAll(".main-nav .nav-link")
  );

  function updateActiveLink() {
    if (!sections.length || !navLinks.length) return;

    const marker = window.scrollY + window.innerHeight * 0.32;
    let currentId = sections[0].id;

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      if (marker >= sectionTop) {
        currentId = section.id;
      }
    });

    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 6
    ) {
      currentId = "contact";
    }

    navLinks.forEach(function (link) {
      const target = link.getAttribute("href");
      const isActive = target === "#" + currentId;
      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  window.addEventListener(
    "scroll",
    function () {
      window.requestAnimationFrame(updateActiveLink);
    },
    { passive: true }
  );

  updateActiveLink();

  /* ---------- الظهور عند التمرير ---------- */
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !reduceMotionQuery.matches) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -45px 0px"
      }
    );

    revealElements.forEach(function (element) {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach(function (element) {
      element.classList.add("is-visible");
    });
  }

  /* ---------- تأثير الميل ثلاثي الأبعاد ---------- */
  if (finePointerQuery.matches && !reduceMotionQuery.matches) {
    document.querySelectorAll(".tilt").forEach(function (card) {
      let frame = null;

      card.addEventListener("pointermove", function (event) {
        if (frame) {
          window.cancelAnimationFrame(frame);
        }

        frame = window.requestAnimationFrame(function () {
          const rect = card.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateY = ((x - centerX) / centerX) * 4.5;
          const rotateX = ((centerY - y) / centerY) * 4.5;

          card.style.transform =
            "perspective(1000px) rotateX(" +
            rotateX.toFixed(2) +
            "deg) rotateY(" +
            rotateY.toFixed(2) +
            "deg) translateY(-3px)";
        });
      });

      card.addEventListener("pointerleave", function () {
        if (frame) {
          window.cancelAnimationFrame(frame);
          frame = null;
        }
        card.style.transform = "";
      });
    });
  }

  /* ---------- إضاءة بطاقات المهارات ---------- */
  if (finePointerQuery.matches) {
    document.querySelectorAll(".skill-card").forEach(function (card) {
      card.addEventListener("pointermove", function (event) {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;

        card.style.setProperty("--mx", x + "%");
        card.style.setProperty("--my", y + "%");
      });
    });
  }

  /* ---------- توهج المؤشر ---------- */
  const cursorGlow = document.querySelector(".cursor-glow");

  if (cursorGlow && finePointerQuery.matches && !reduceMotionQuery.matches) {
    let glowFrame = null;
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;

    document.addEventListener("pointermove", function (event) {
      pointerX = event.clientX;
      pointerY = event.clientY;

      cursorGlow.style.opacity = "1";

      if (glowFrame) return;

      glowFrame = window.requestAnimationFrame(function () {
        cursorGlow.style.left = pointerX + "px";
        cursorGlow.style.top = pointerY + "px";
        glowFrame = null;
      });
    });

    document.addEventListener("pointerleave", function () {
      cursorGlow.style.opacity = "0";
    });
  }

  /* ---------- تحديث روابط واتساب ---------- */
  const whatsappUrl =
    "https://wa.me/" +
    WHATSAPP_NUMBER +
    "?text=" +
    encodeURIComponent(WHATSAPP_MESSAGE);

  document.querySelectorAll(".js-whatsapp").forEach(function (link) {
    link.setAttribute("href", whatsappUrl);
  });

  /* ---------- نسخ رقم التواصل ---------- */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise(function (resolve, reject) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.setAttribute("readonly", "");
      textArea.style.position = "fixed";
      textArea.style.top = "-9999px";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();

      try {
        const copied = document.execCommand("copy");
        document.body.removeChild(textArea);
        copied ? resolve() : reject(new Error("Copy failed"));
      } catch (error) {
        document.body.removeChild(textArea);
        reject(error);
      }
    });
  }

  if (copyButton) {
    copyButton.addEventListener("click", function () {
      const phone = copyButton.getAttribute("data-phone") || "0533919725";
      const label = copyButton.querySelector(".copy-label");
      const originalLabel = label ? label.textContent : "";

      copyText(phone)
        .then(function () {
          showToast("تم نسخ رقم التواصل: " + phone);

          if (label) {
            label.textContent = "تم النسخ";
          }

          copyButton.classList.add("copied");

          window.setTimeout(function () {
            if (label) {
              label.textContent = originalLabel || "نسخ";
            }
            copyButton.classList.remove("copied");
          }, 2000);
        })
        .catch(function () {
          showToast("تعذّر النسخ تلقائيًا — الرقم: " + phone);
        });
    });
  }

  /* ---------- شبكة الجسيمات ---------- */
  const canvas = document.getElementById("particle-canvas");
  let particleContext = null;
  let particles = [];
  let particleWidth = 0;
  let particleHeight = 0;
  let particleFrame = null;
  let particlesVisible = !document.hidden;

  function updateParticleColor() {
    particleColor =
      root.getAttribute("data-theme") === "light" ? "5, 150, 105" : "52, 211, 153";
  }

  function createParticle() {
    return {
      x: Math.random() * particleWidth,
      y: Math.random() * particleHeight,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      radius: Math.random() * 1.3 + 0.55
    };
  }

  function resizeParticles() {
    if (!canvas || !particleContext) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    particleWidth = window.innerWidth;
    particleHeight = window.innerHeight;

    canvas.width = Math.round(particleWidth * dpr);
    canvas.height = Math.round(particleHeight * dpr);
    canvas.style.width = particleWidth + "px";
    canvas.style.height = particleHeight + "px";

    particleContext.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(
      68,
      Math.max(16, Math.floor((particleWidth * particleHeight) / 23000))
    );

    particles = Array.from({ length: count }, createParticle);
  }

  function drawParticles() {
    if (!particleContext) return;

    particleContext.clearRect(0, 0, particleWidth, particleHeight);

    for (let i = 0; i < particles.length; i += 1) {
      const particle = particles[i];

      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < -10) particle.x = particleWidth + 10;
      if (particle.x > particleWidth + 10) particle.x = -10;
      if (particle.y < -10) particle.y = particleHeight + 10;
      if (particle.y > particleHeight + 10) particle.y = -10;

      particleContext.beginPath();
      particleContext.arc(
        particle.x,
        particle.y,
        particle.radius,
        0,
        Math.PI * 2
      );
      particleContext.fillStyle = "rgba(" + particleColor + ", 0.52)";
      particleContext.fill();

      for (let j = i + 1; j < particles.length; j += 1) {
        const other = particles[j];
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 118) {
          const opacity = (1 - distance / 118) * 0.16;
          particleContext.beginPath();
          particleContext.moveTo(particle.x, particle.y);
          particleContext.lineTo(other.x, other.y);
          particleContext.strokeStyle =
            "rgba(" + particleColor + ", " + opacity.toFixed(3) + ")";
          particleContext.lineWidth = 0.7;
          particleContext.stroke();
        }
      }
    }

    if (particlesVisible) {
      particleFrame = window.requestAnimationFrame(drawParticles);
    }
  }

  function startParticles() {
    if (!canvas || reduceMotionQuery.matches) return;

    particleContext = canvas.getContext("2d");
    if (!particleContext) return;

    updateParticleColor();
    resizeParticles();

    if (particleFrame) {
      window.cancelAnimationFrame(particleFrame);
    }

    particlesVisible = true;
    drawParticles();
  }

  function stopParticles() {
    particlesVisible = false;
    if (particleFrame) {
      window.cancelAnimationFrame(particleFrame);
      particleFrame = null;
    }
  }

  if (canvas) {
    startParticles();

    let resizeTimer = null;
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        if (!particleContext) return;
        resizeParticles();
      }, 180);
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        stopParticles();
      } else if (!reduceMotionQuery.matches) {
        particlesVisible = true;
        if (!particleFrame) {
          drawParticles();
        }
      }
    });
  }

  /* ---------- إعادة ضبط الحركة عند تغيير إعدادات النظام ---------- */
  if (typeof reduceMotionQuery.addEventListener === "function") {
    reduceMotionQuery.addEventListener("change", function (event) {
      if (event.matches) {
        stopParticles();
        revealElements.forEach(function (element) {
          element.classList.add("is-visible");
        });
      } else {
        startParticles();
      }
    });
  }
})();
