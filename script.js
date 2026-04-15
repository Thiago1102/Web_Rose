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

bookingForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!formNote || !bookingForm) {
    return;
  }

  const nombreInput = bookingForm.elements.namedItem("nombre");
  const telefonoInput = bookingForm.elements.namedItem("telefono");
  const servicioInput = bookingForm.elements.namedItem("servicio");
  const mensajeInput = bookingForm.elements.namedItem("mensaje");

  const missingFields = [];

  if (nombreInput instanceof HTMLInputElement && !nombreInput.value.trim()) {
    missingFields.push("nombre");
  }

  if (telefonoInput instanceof HTMLInputElement && !telefonoInput.value.trim()) {
    missingFields.push("telefono");
  }

  if (servicioInput instanceof HTMLSelectElement && !servicioInput.value) {
    missingFields.push("servicio");
  }

  if (missingFields.length > 0) {
    formNote.textContent = `Completa los campos obligatorios: ${missingFields.join(", ")}.`;
    return;
  }

  const namePattern = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]{2,60}$/;
  if (
    nombreInput instanceof HTMLInputElement &&
    (typeof nombreInput.value !== "string" || !namePattern.test(nombreInput.value.trim()))
  ) {
    formNote.textContent = "El nombre debe contener solo letras y espacios (2 a 60 caracteres).";
    nombreInput.focus();
    return;
  }

  if (!bookingForm.checkValidity()) {
    bookingForm.reportValidity();
    formNote.textContent = "Revisa el formulario. Verifica especialmente el teléfono.";
    return;
  }

  const whatsappNumber = (bookingForm.dataset.whatsapp || "").replace(/\D/g, "");

  if (!whatsappNumber) {
    formNote.textContent = "Falta configurar tu número de WhatsApp en el formulario.";
    return;
  }

  const submitButton = bookingForm.querySelector('button[type="submit"]');
  const servicioTexto =
    servicioInput instanceof HTMLSelectElement
      ? servicioInput.options[servicioInput.selectedIndex]?.text || servicioInput.value
      : "No indicado";
  const mensajeTexto =
    mensajeInput instanceof HTMLTextAreaElement && mensajeInput.value.trim()
      ? mensajeInput.value.trim()
      : "Sin mensaje adicional.";

  const whatsappMessage = [
    "Hola, quiero reservar una cita.",
    "",
    `Nombre: ${nombreInput instanceof HTMLInputElement ? nombreInput.value.trim() : ""}`,
    `Teléfono: ${telefonoInput instanceof HTMLInputElement ? telefonoInput.value.trim() : ""}`,
    `Servicio: ${servicioTexto}`,
    `Mensaje: ${mensajeTexto}`,
  ].join("\n");

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  if (submitButton instanceof HTMLButtonElement) {
    submitButton.disabled = true;
  }

  formNote.textContent = "Abriendo WhatsApp..."; 

  const newWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");

  if (!newWindow) {
    window.location.href = whatsappUrl;
  }

  formNote.textContent = "WhatsApp abierto. Revisa el mensaje y pulsa enviar.";
  bookingForm.reset();

  if (submitButton instanceof HTMLButtonElement) {
    submitButton.disabled = false;
  }
});

if (year) {
  year.textContent = String(new Date().getFullYear());
}
