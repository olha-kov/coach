// Отримуємо елементи
const modal = document.getElementById("clientModal");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const closeBtn = document.querySelector(".modal-close");
const detailButtons = document.querySelectorAll(".client-btn");

// Клік на "Детальніше"
detailButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const title = btn.getAttribute("data-title");
    const desc = btn.getAttribute("data-desc");

    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modal.style.display = "flex";
    document.body.style.overflow = "hidden"; // блокує прокрутку сторінки
  });
});

// Закриття по хрестику
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
  document.body.style.overflow = "";
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
    document.body.style.overflow = "";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".rblock-track");
  const slides = Array.from(document.querySelectorAll(".rblock-slide"));
  const prev = document.querySelector(".rblock-prev");
  const next = document.querySelector(".rblock-next");
  const popup = document.querySelector(".popup-overlay");
  const popupBody = document.querySelector(".popup-body");
  const popupClose = document.querySelector(".popup-close");

  let index = 0;
  const visibleSlides = window.innerWidth < 768 ? 1 : 3;

  // ✅ Обрізаємо текст до 300 символів
  document.querySelectorAll(".rblock-text").forEach((p) => {
    const full = p.dataset.full?.trim() || "";

    if (full.length > 450) {
      p.textContent = full.slice(0, 450) + "...";
    } else {
      p.textContent = full;
    }
  });

  // ✅ Карусель
  const updateCarousel = () => {
    const slideWidth = 100 / visibleSlides;
    const offset = -index * slideWidth;
    track.style.transform = `translateX(${offset}%)`;
  };

  next.addEventListener("click", () => {
    index++;
    if (index > slides.length - visibleSlides) index = 0; // плавний цикл
    updateCarousel();
  });

  prev.addEventListener("click", () => {
    index--;
    if (index < 0) index = slides.length - visibleSlides;
    updateCarousel();
  });

  // ✅ Попап відкриття
  document.querySelectorAll(".rblock-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.type;

      // ✅ Пошук блоку на 100% без помилок
      const parentBlock =
        btn.closest(".rblock") || btn.closest(".rblock-slide");

      if (!parentBlock) {
        console.warn("❗ Button is not inside .rblock or .rblock-slide", btn);
        return;
      }

      const fullTextEl = parentBlock.querySelector(".rblock-text");
      const fullText = fullTextEl?.dataset.full || "";
      const screenshot = btn.dataset.screenshot;

      popup.style.display = "flex";

      if (type === "text") {
        let html = `<p>${fullText}</p>`;
        if (screenshot) {
          html = `<img src="${screenshot}" alt="review" style="width:100%;border-radius:12px;margin-bottom:12px;">${html}`;
        }
        popupBody.innerHTML = html;
      }

      if (type === "video") {
        const videoSrc = btn.dataset.video;
        popupBody.innerHTML = `
        <video controls autoplay style="width:100%; border-radius:12px;">
          <source src="${videoSrc}" type="video/mp4">
        </video>`;
      }
    });
  });

  // ✅ Закриття + стоп відео
  function closePopup() {
    popup.querySelectorAll("video").forEach((v) => {
      v.pause();
      v.currentTime = 0;
    });
    popup.style.display = "none";
  }

  popupClose.addEventListener("click", closePopup);
  popup.addEventListener("click", (e) => {
    if (e.target === popup) closePopup();
  });
  window.addEventListener("resize", () => {
    index = 0;
    updateCarousel();
  });
});

document.querySelectorAll(".faq-question").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.parentElement;
    item.classList.toggle("active");
    const icon = btn.querySelector(".faq-icon");
    icon.textContent = item.classList.contains("active") ? "−" : "+";
  });
});

const steps = document.querySelectorAll(".process-step");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

steps.forEach((step) => observer.observe(step));

const burger = document.getElementById("burger");
const nav = document.querySelector(".nav");
const h = document.querySelector(".header");
const navLinks = document.querySelectorAll(".nav-list a");

burger.addEventListener("click", () => {
  burger.classList.toggle("active");
  nav.classList.toggle("open");
  h.classList.toggle("open");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    h.classList.remove("open");
    burger.classList.remove("active");
  });
});

(() => {
  const total = 5; // Кількість сертифікатів
  const base = "images/certificates"; // Шлях до картинок

  const root = document.querySelector(".certs-carousel");
  const track = root.querySelector(".certs-track");
  const dotsWrap = root.querySelector(".certs-dots");
  const prevBtn = root.querySelector(".prev");
  const nextBtn = root.querySelector(".next");
  const viewport = root.querySelector(".certs-viewport");

  let index = 0;
  const slides = [];

  // === Створюємо слайди + крапки ===
  for (let i = 1; i <= total; i++) {
    const li = document.createElement("li");
    li.className = "certs-slide";
    li.setAttribute("role", "group");
    li.setAttribute("aria-label", `Слайд ${i} з ${total}`);

    const img = document.createElement("img");
    img.src = `${base}/${i}.jpeg`;
    img.alt = `Сертифікат ${i}`;
    li.appendChild(img);

    track.appendChild(li);
    slides.push(li);

    if (dotsWrap) {
      const dot = document.createElement("button");
      dot.className = "certs-dot";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Перейти до слайду ${i}`);
      dot.addEventListener("click", () => goTo(i - 1));
      dotsWrap.appendChild(dot);
    }
  }

  const render = () => {
    const n = slides.length;
    const vw = window.innerWidth;

    const stepX = vw < 768 ? 0 : 300; // відступ для десктопу
    slides.forEach((el, i) => {
      const d = i - index;
      let tx = d * stepX;
      let tz = -Math.abs(d) * 100;
      let sc = 1 - Math.min(Math.abs(d) * 0.1, 0.5);
      let op = Math.max(0, 1 - Math.abs(d) * 0.2);

      if (vw < 768) {
        tz = 0;
        sc = 1;
        op = 1;
        tx = 0;
      }

      el.style.transform = `translate3d(calc(-50% + ${tx}px),0,${tz}px) scale(${sc})`;
      el.style.zIndex = String(100 - Math.abs(d));
      el.style.opacity = op;
      el.classList.toggle("is-active", d === 0);
    });

    if (dotsWrap) {
      [...dotsWrap.children].forEach((d, i) =>
        d.setAttribute("aria-selected", String(i === index))
      );
    }
  };

  const goTo = (i) => {
    index = (i + slides.length) % slides.length;
    render();
  };
  const goNext = () => goTo(index + 1);
  const goPrev = () => goTo(index - 1);

  nextBtn.addEventListener("click", goNext);
  prevBtn.addEventListener("click", goPrev);

  window.addEventListener("resize", render);
  render();

  // === Модалка ===
  const modal = document.getElementById("certModal");
  const modalImg = document.getElementById("certModalImg");
  const modalClose = document.querySelector(".cert-modal-close");

  slides.forEach((slide) => {
    slide.addEventListener("click", () => {
      modalImg.src = slide.querySelector("img").src;
      modalImg.alt = slide.querySelector("img").alt;
      modal.classList.add("open");
    });
  });

  modalClose.addEventListener("click", () => modal.classList.remove("open"));
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("open");
  });
})();
