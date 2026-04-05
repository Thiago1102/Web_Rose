const menuBtn = document.getElementById("menuBtn");
const mainNav = document.getElementById("mainNav");
const bookingForm = document.getElementById("bookingForm");
const formNote = document.getElementById("formNote");
const year = document.getElementById("year");

menuBtn?.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(isOpen));
});

mainNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuBtn?.setAttribute("aria-expanded", "false");
  });
});

bookingForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  formNote.textContent = "Gracias. Tu solicitud fue enviada correctamente.";
  bookingForm.reset();
});

if (year) {
  year.textContent = String(new Date().getFullYear());
}
