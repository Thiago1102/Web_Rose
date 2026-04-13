const menuBtn = document.getElementById("menuBtn");
const mainNav = document.getElementById("mainNav");
const bookingForm = document.getElementById("bookingForm");
const formNote = document.getElementById("formNote");
const year = document.getElementById("year");
const navLinks = Array.from(mainNav?.querySelectorAll("a") || []);

function setActiveNavLink(targetId) {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${targetId}`;
    link.classList.toggle("active", isActive);
  });
}

function closeMenu() {
  if (!mainNav || !menuBtn) {
    return;
  }

  mainNav.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
}

function scrollToSection(targetId) {
  const target = document.getElementById(targetId);

  if (!target) {
    return;
  }

  const header = document.querySelector(".header");
  const headerOffset = (header?.offsetHeight || 0) + 12;
  const rect = target.getBoundingClientRect();
  const targetTop = window.scrollY + rect.top - headerOffset;

  window.scrollTo({
    top: Math.max(targetTop, 0),
    behavior: "smooth",
  });

  history.replaceState(null, "", `#${targetId}`);
}

if (menuBtn && mainNav) {
  menuBtn.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const hash = link.getAttribute("href") || "";
    const targetId = hash.startsWith("#") ? hash.slice(1) : "";

    if (targetId && document.getElementById(targetId)) {
      event.preventDefault();
      scrollToSection(targetId);
    }

    if (targetId) {
      setActiveNavLink(targetId);
    }

    closeMenu();
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

const sectionIds = navLinks
  .map((link) => (link.getAttribute("href") || "").replace("#", ""))
  .filter(Boolean);
const sections = sectionIds
  .map((id) => document.getElementById(id))
  .filter(Boolean);

if (sections.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveNavLink(entry.target.id);
        }
      });
    },
    {
      root: null,
      rootMargin: "-30% 0px -55% 0px",
      threshold: 0.1,
    }
  );

  sections.forEach((section) => observer.observe(section));
}

bookingForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!formNote) {
    return;
  }

  if (!bookingForm.checkValidity()) {
    bookingForm.reportValidity();
    formNote.textContent = "Revisa los campos obligatorios antes de enviar.";
    return;
  }

  const endpoint = bookingForm.dataset.endpoint?.trim();

  if (!endpoint) {
    formNote.textContent =
      "Solicitud validada. Configura data-endpoint en el formulario para enviarla a un backend real.";
    return;
  }

  const submitButton = bookingForm.querySelector('button[type="submit"]');

  try {
    if (submitButton) {
      submitButton.disabled = true;
    }

    formNote.textContent = "Enviando solicitud...";

    const response = await fetch(endpoint, {
      method: "POST",
      body: new FormData(bookingForm),
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Request failed");
    }

    formNote.textContent = "Gracias. Tu solicitud fue enviada correctamente.";
    bookingForm.reset();
  } catch {
    formNote.textContent =
      "No se pudo enviar la solicitud. Intenta de nuevo en unos minutos.";
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
    }
  }
});

if (year) {
  year.textContent = String(new Date().getFullYear());
}
